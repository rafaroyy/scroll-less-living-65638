import { useState } from "react";
import { Video, Download, Trash2, Loader2, Settings, ChevronDown, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VideoJob {
  job_id: string;
  status: string;
  progress: number | null;
  message: string | null;
  created_at: string;
  updated_at?: string;
}

interface JobsListCardProps {
  jobs: VideoJob[];
  loadingVideos: boolean;
  onDownload: (jobId: string) => void;
  onDelete: (jobId: string) => void;
}

type FilterTab = "all" | "processing" | "completed" | "failed";

export function JobsListCard({ jobs, loadingVideos, onDownload, onDelete }: JobsListCardProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const processingJobs = jobs.filter((job) => job.status === "pending" || job.status === "processing");
  const completedJobs = jobs.filter((job) => job.status === "completed");
  const failedJobs = jobs.filter((job) => job.status === "failed");

  const filteredJobs = () => {
    switch (activeTab) {
      case "processing": return processingJobs;
      case "completed": return completedJobs;
      case "failed": return failedJobs;
      default: return jobs;
    }
  };

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: "all", label: "Todos", count: jobs.length },
    { id: "processing", label: "Processando", count: processingJobs.length },
    { id: "completed", label: "Concluídos", count: completedJobs.length },
    { id: "failed", label: "Falhos", count: failedJobs.length },
  ];

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
      pending: { 
        icon: <Clock className="w-3.5 h-3.5" />, 
        color: "text-amber-600", 
        bg: "bg-amber-100 dark:bg-amber-900/30" 
      },
      processing: { 
        icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />, 
        color: "text-blue-600", 
        bg: "bg-blue-100 dark:bg-blue-900/30" 
      },
      completed: { 
        icon: <CheckCircle2 className="w-3.5 h-3.5" />, 
        color: "text-emerald-600", 
        bg: "bg-emerald-100 dark:bg-emerald-900/30" 
      },
      failed: { 
        icon: <XCircle className="w-3.5 h-3.5" />, 
        color: "text-red-600", 
        bg: "bg-red-100 dark:bg-red-900/30" 
      },
    };
    return configs[status] || configs.pending;
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Video className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Meus Vídeos</h3>
            <p className="text-xs text-muted-foreground">{jobs.length} vídeo{jobs.length !== 1 ? "s" : ""} no total</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {loadingVideos ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-3" />
            <p className="text-sm text-muted-foreground">Carregando vídeos...</p>
          </div>
        ) : filteredJobs().length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
              <Video className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground">
              {activeTab === "all" ? "Nenhum vídeo criado ainda" : `Nenhum vídeo ${activeTab === "processing" ? "em processamento" : activeTab === "completed" ? "concluído" : "com falha"}`}
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {filteredJobs().map((job) => {
              const statusConfig = getStatusConfig(job.status);
              const isExpanded = expandedJob === job.job_id;

              return (
                <div
                  key={job.job_id}
                  className="border border-border/50 rounded-xl overflow-hidden bg-background hover:border-border transition-colors"
                >
                  {/* Main Row */}
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${statusConfig.bg} flex items-center justify-center ${statusConfig.color}`}>
                      {statusConfig.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-muted-foreground truncate">{job.job_id}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(job.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {job.status === "completed" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                          onClick={() => onDownload(job.job_id)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onDelete(job.job_id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => setExpandedJob(isExpanded ? null : job.job_id)}
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </Button>
                    </div>
                  </div>

                  {/* Progress (if processing) */}
                  {(job.status === "processing" || job.status === "pending") && job.progress !== null && (
                    <div className="px-4 pb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-medium">{job.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-3 pt-1 border-t border-border/50 bg-muted/20">
                      <div className="text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status</span>
                          <span className="font-medium capitalize">{job.status}</span>
                        </div>
                        {job.message && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Mensagem</span>
                            <span className="text-right max-w-[200px] truncate">{job.message}</span>
                          </div>
                        )}
                        {job.updated_at && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Atualizado</span>
                            <span>{new Date(job.updated_at).toLocaleString("pt-BR")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
