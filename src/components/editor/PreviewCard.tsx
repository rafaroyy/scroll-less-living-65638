import { Video, Clock, Monitor, Layers } from "lucide-react";

interface PreviewCardProps {
  aspectRatio: string;
  duration: number;
  scenes: number;
  isGenerating: boolean;
}

export function PreviewCard({ aspectRatio, duration, scenes, isGenerating }: PreviewCardProps) {
  const getAspectClass = () => {
    switch (aspectRatio) {
      case "9:16": return "aspect-[9/16] max-w-[200px]";
      case "1:1": return "aspect-square max-w-[280px]";
      default: return "aspect-video max-w-full";
    }
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
            <h3 className="font-semibold text-foreground">Preview do Vídeo</h3>
            <p className="text-xs text-muted-foreground">Visualização do resultado</p>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="p-6 flex justify-center">
        <div className={`${getAspectClass()} w-full bg-gradient-to-br from-muted to-muted/50 rounded-xl border-2 border-dashed border-border/50 flex items-center justify-center relative overflow-hidden`}>
          {isGenerating ? (
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Renderizando...</p>
                <p className="text-xs text-muted-foreground">Aguarde até ~2 min</p>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-2 p-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-muted-foreground/10 flex items-center justify-center">
                <Video className="w-7 h-7 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground">Prévia disponível após render</p>
            </div>
          )}
        </div>
      </div>

      {/* Info Grid */}
      <div className="px-5 pb-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted/40 rounded-xl p-3 text-center">
            <Clock className="w-4 h-4 mx-auto text-muted-foreground mb-1.5" />
            <p className="text-sm font-semibold text-foreground">{duration}s</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Duração</p>
          </div>
          <div className="bg-muted/40 rounded-xl p-3 text-center">
            <Monitor className="w-4 h-4 mx-auto text-muted-foreground mb-1.5" />
            <p className="text-sm font-semibold text-foreground">{aspectRatio}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Formato</p>
          </div>
          <div className="bg-muted/40 rounded-xl p-3 text-center">
            <Layers className="w-4 h-4 mx-auto text-muted-foreground mb-1.5" />
            <p className="text-sm font-semibold text-foreground">{scenes}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Cenas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
