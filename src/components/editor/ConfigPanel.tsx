import { ReactNode, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Image, Palette, Volume2, CheckSquare, Loader2, Video, AlertCircle, RotateCcw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConfigPanelProps {
  children: {
    conteudo: ReactNode;
    midia: ReactNode;
    estilo: ReactNode;
    audio: ReactNode;
    revisao: ReactNode;
  };
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  disabledReason?: string;
  monthlyUsage: number;
  monthlyLimit: number;
}

const TAB_CONFIG = [
  { id: "conteudo", label: "Conteúdo", icon: FileText },
  { id: "midia", label: "Mídia", icon: Image },
  { id: "estilo", label: "Estilo", icon: Palette },
  { id: "audio", label: "Áudio", icon: Volume2 },
  { id: "revisao", label: "Revisão", icon: CheckSquare },
];

export function ConfigPanel({
  children,
  onSubmit,
  onClear,
  isLoading,
  isDisabled,
  disabledReason,
  monthlyUsage,
  monthlyLimit,
}: ConfigPanelProps) {
  const [activeTab, setActiveTab] = useState("conteudo");

  const limitReached = monthlyUsage >= monthlyLimit;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg flex flex-col h-full lg:max-h-[calc(100vh-3rem)]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Configurar Vídeo</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {monthlyUsage}/{monthlyLimit} vídeos este mês
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {TAB_CONFIG.map((tab, index) => (
              <div
                key={tab.id}
                className={`w-2 h-2 rounded-full transition-colors ${
                  activeTab === tab.id ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
          {/* Tab List */}
          <div className="px-3 pt-3 flex-shrink-0">
            <TabsList className="w-full h-auto p-1 bg-muted/50 rounded-xl grid grid-cols-5 gap-1">
              {TAB_CONFIG.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex flex-col items-center gap-1 py-2 px-1 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg text-xs"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:block">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Tab Content with Scroll */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4">
              <TabsContent value="conteudo" className="mt-0 space-y-4">
                {children.conteudo}
              </TabsContent>

              <TabsContent value="midia" className="mt-0 space-y-4">
                {children.midia}
              </TabsContent>

              <TabsContent value="estilo" className="mt-0 space-y-4">
                {children.estilo}
              </TabsContent>

              <TabsContent value="audio" className="mt-0 space-y-4">
                {children.audio}
              </TabsContent>

              <TabsContent value="revisao" className="mt-0 space-y-4">
                {children.revisao}
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>

        {/* Footer Actions */}
        <div className="px-4 py-4 border-t border-border/50 bg-muted/20 space-y-3 flex-shrink-0">
          {/* Validation Warning */}
          {isDisabled && disabledReason && !limitReached && (
            <div className="flex items-start gap-2 p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-400">{disabledReason}</p>
            </div>
          )}

          {/* Limit Warning */}
          {limitReached && (
            <div className="flex items-start gap-2 p-2.5 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-xs text-destructive">Limite mensal de {monthlyLimit} vídeos atingido.</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-shrink-0"
              onClick={onClear}
              disabled={isLoading}
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Limpar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25"
              disabled={isLoading || isDisabled || limitReached}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Iniciando...
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 mr-2" />
                  Renderizar Vídeo
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
