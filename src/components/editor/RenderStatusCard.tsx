import { useState } from "react";
import { Check, Clock, FileText, Image, Video, Upload, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RenderStatusCardProps {
  isGenerating: boolean;
  fakeProgress: number;
  showProgressBar: boolean;
}

const RENDER_STEPS = [
  { id: "queued", label: "Na fila", icon: Clock },
  { id: "script", label: "Gerando roteiro", icon: FileText },
  { id: "media", label: "Buscando mídia", icon: Image },
  { id: "rendering", label: "Renderizando", icon: Video },
  { id: "upload", label: "Finalizando", icon: Upload },
  { id: "done", label: "Concluído", icon: Check },
];

function getActiveStep(progress: number): number {
  if (progress < 10) return 0;
  if (progress < 25) return 1;
  if (progress < 50) return 2;
  if (progress < 80) return 3;
  if (progress < 100) return 4;
  return 5;
}

export function RenderStatusCard({ isGenerating, fakeProgress, showProgressBar }: RenderStatusCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const activeStep = getActiveStep(fakeProgress);

  if (!isGenerating && !showProgressBar) return null;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Renderização em Progresso</h3>
              <p className="text-xs text-muted-foreground">Tempo estimado: ~2 minutos</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-primary">{Math.round(fakeProgress)}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-5 pt-4">
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${fakeProgress}%` }}
          />
        </div>
      </div>

      {/* Steps Timeline */}
      <div className="px-5 py-4">
        <div className="flex justify-between relative">
          {/* Connecting Line */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-border -z-0" />
          <div 
            className="absolute top-4 left-4 h-0.5 bg-primary -z-0 transition-all duration-500"
            style={{ width: `${Math.min(100, (activeStep / (RENDER_STEPS.length - 1)) * 100)}%` }}
          />

          {RENDER_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < activeStep;
            const isCurrent = index === activeStep;

            return (
              <div key={step.id} className="flex flex-col items-center z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-primary/20 text-primary ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Icon className={`w-4 h-4 ${isCurrent ? "animate-pulse" : ""}`} />
                  )}
                </div>
                <span className={`text-[10px] mt-2 font-medium text-center max-w-[60px] ${
                  isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expandable Details */}
      <div className="px-5 pb-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <>
              <ChevronUp className="w-3 h-3 mr-1" />
              Ocultar detalhes
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3 mr-1" />
              Ver detalhes técnicos
            </>
          )}
        </Button>

        {showDetails && (
          <div className="mt-3 p-3 bg-muted/30 rounded-lg text-xs font-mono text-muted-foreground space-y-1">
            <p>→ Progresso: {Math.round(fakeProgress)}%</p>
            <p>→ Etapa atual: {RENDER_STEPS[activeStep]?.label}</p>
            <p>→ Status: Processando no servidor</p>
          </div>
        )}
      </div>
    </div>
  );
}
