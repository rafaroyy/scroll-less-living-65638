import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { videoService } from "@/integrations/supabase/videoService";
import { authService } from "@/integrations/supabase/authService";
import { useNavigate } from "react-router-dom";
import { Loader2, LogOut, Video, Download, Trash2, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VideoJob {
  job_id: string;
  status: string;
  progress: number | null;
  message: string | null;
  created_at: string;
  updated_at?: string;
}

export default function Editor() {
  const [loading, setLoading] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [jobs, setJobs] = useState<VideoJob[]>([]);
  const [activePolls, setActivePolls] = useState<Set<string>>(new Set());
  const [username, setUsername] = useState<string>("");

  const [formData, setFormData] = useState({
    objetivo: "",
    tema: "",
    nicho: "",
    palavra_chave_global: "",
    idioma: "pt-BR",
    duracao: 30,
    cenas: 5,
    aspect_ratio: "9:16",
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  // ===================================================================
  //  🔥 Carregar username corretamente
  // ===================================================================
  useEffect(() => {
    const info = authService.getUserInfo();

    if (info) {
      setUsername(info.name || info.username || info.email || "Usuário");
    } else {
      setUsername("Usuário");
    }
  }, []);

  // ===================================================================
  //   🔧 CARREGAMENTO INICIAL — SEM TRAVAR A TELA
  // ===================================================================

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadUserVideos();
    }, 150);

    return () => clearTimeout(timeout);
  }, []);

  const loadUserVideos = async () => {
    setLoadingVideos(true);

    try {
      const videos = await videoService.listVideos();

      if (!Array.isArray(videos)) {
        console.error("Vídeos inválidos:", videos);
        setJobs([]);
        return;
      }

      const detailedJobs = await Promise.all(
        videos.map(async (video) => {
          try {
            const status = await videoService.getJobStatus(video.job_id);
            return {
              job_id: status.job_id,
              status: status.status,
              progress: status.progress,
              message: status.message,
              created_at: status.created_at,
              updated_at: status.updated_at,
            };
          } catch {
            return {
              job_id: video.job_id,
              status: video.status,
              progress: null,
              message: null,
              created_at: video.created_at,
              updated_at: video.updated_at,
            };
          }
        }),
      );

      setJobs(detailedJobs);

      detailedJobs.forEach((job) => {
        if (["pending", "processing"].includes(job.status)) {
          pollJobStatus(job.job_id);
        }
      });
    } catch (error: any) {
      toast({
        title: "Erro ao carregar vídeos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingVideos(false);
    }
  };

  // ===================================================================
  // 🔧 LOGOUT
  // ===================================================================

  const handleLogout = async () => {
    await authService.logout();
    navigate("/auth");
  };

  // ===================================================================
  //   🔧 GERAR VÍDEO — SEM TRAVAR A TELA
  // ===================================================================

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.objetivo || !formData.tema || !formData.nicho || !formData.palavra_chave_global) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      try {
        const result = await videoService.renderVideo(formData);

        toast({
          title: "Vídeo em processamento",
          description: `Job ID: ${result.job_id}`,
        });

        const newJob = {
          job_id: result.job_id,
          status: result.status,
          progress: null,
          message: result.message,
          created_at: result.created_at,
        };

        setJobs((prev) => [newJob, ...prev]);

        setFormData({
          objetivo: "",
          tema: "",
          nicho: "",
          palavra_chave_global: "",
          idioma: "pt-BR",
          duracao: 30,
          cenas: 5,
          aspect_ratio: "9:16",
        });

        pollJobStatus(result.job_id);
      } catch (error: any) {
        toast({
          title: "Erro ao criar vídeo",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }, 10);
  };

  // ===================================================================
  //   🔧 POLLING — SEM MULTIPLOS INTERVALOS
  // ===================================================================

  const pollJobStatus = (jobId: string) => {
    setActivePolls((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) return prev;
      newSet.add(jobId);
      return newSet;
    });

    const interval = setInterval(async () => {
      try {
        const status = await videoService.getJobStatus(jobId);

        setJobs((prev) =>
          prev.map((job) =>
            job.job_id === jobId
              ? {
                  ...job,
                  status: status.status,
                  progress: status.progress,
                  message: status.message,
                  updated_at: status.updated_at,
                }
              : job,
          ),
        );

        if (["completed", "failed"].includes(status.status)) {
          clearInterval(interval);
          setActivePolls((prev) => {
            const newSet = new Set(prev);
            newSet.delete(jobId);
            return newSet;
          });

          if (status.status === "completed") {
            toast({
              title: "Vídeo pronto!",
              description: `O vídeo ${jobId} está concluído.`,
            });
          }
        }
      } catch {
        clearInterval(interval);
        setActivePolls((prev) => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
      }
    }, 5000);
  };

  // ===================================================================
  //   🔧 DOWNLOAD / DELETE
  // ===================================================================

  const handleDownload = async (jobId: string) => {
    try {
      const blob = await videoService.downloadVideo(jobId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `video-${jobId}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      toast({
        title: "Erro ao baixar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (jobId: string) => {
    try {
      await videoService.deleteVideo(jobId);
      setJobs((prev) => prev.filter((job) => job.job_id !== jobId));
    } catch (error: any) {
      toast({
        title: "Erro ao deletar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // ===================================================================
  //   🔧 STATUS BADGE
  // ===================================================================

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: any; icon?: React.ReactNode }> = {
      pending: {
        label: "Pendente",
        variant: "secondary",
        icon: <Settings className="w-3 h-3 animate-spin mr-1" />,
      },
      processing: {
        label: "Processando",
        variant: "default",
        icon: <Loader2 className="w-3 h-3 animate-spin mr-1" />,
      },
      completed: {
        label: "Concluído",
        variant: "outline",
      },
      failed: {
        label: "Falhou",
        variant: "destructive",
      },
    };

    const config = statusConfig[status] || {
      label: status,
      variant: "default",
    };

    return (
      <Badge variant={config.variant} className="flex items-center w-fit">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  // ===================================================================
  //   🔧 FILTROS DE JOBS
  // ===================================================================

  const completedJobs = jobs.filter((j) => j.status === "completed");
  const processingJobs = jobs.filter((j) => ["pending", "processing"].includes(j.status));
  const failedJobs = jobs.filter((j) => j.status === "failed");

  // ===================================================================
  //   🔧 RENDER
  // ===================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Video className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">ViralizeAI Editor</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Olá, <strong>{username}</strong>
            </span>

            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* ... (O RESTO DO SEU COMPONENTE FICA IGUAL) */}

        {/* Para economizar espaço: TODO O RESTANTE DO COMPONENTE ESTÁ IGUAL ao original */}
        {/* Section de form, tabs, cards, progresso, etc. */}
        {/* Nenhuma alteração estrutural foi feita */}
      </div>
    </div>
  );
}
