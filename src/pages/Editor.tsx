import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { videoService } from "@/integrations/supabase/videoService";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Video, Upload, X, Film, ShoppingBag, Mic, VolumeX, Target, Lightbulb, Tag, Globe, Monitor, Clock, Layers, FileText, Sparkles, Check, Info, Volume2, CheckSquare } from "lucide-react";
import {
  EditorLayout,
  PreviewCard,
  RenderStatusCard,
  JobsListCard,
  ConfigPanel,
  FieldSection,
  FieldRow,
} from "@/components/editor";

interface VideoJob {
  job_id: string;
  status: string;
  progress: number | null;
  message: string | null;
  created_at: string;
  updated_at?: string;
  temp?: boolean;
}

export default function Editor() {
  const [loading, setLoading] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [jobs, setJobs] = useState<VideoJob[]>([]);
  const [username, setUsername] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [fakeProgress, setFakeProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [monthlyUsage, setMonthlyUsage] = useState(0);
  const MONTHLY_LIMIT = 15;
  const [uploadedVideos, setUploadedVideos] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    objetivo: "",
    tema: "",
    nicho: "",
    palavra_chave_global: "",
    idioma: "pt-BR",
    duracao: 30,
    cenas: 5,
    aspect_ratio: "9:16",
    tipoRoteiro: "educativo-com-prova-social",
    roteiroSugerido: "",
    bulletPointsRoteiro: "",
    usarLegendaEFala: true,
  });

  const { toast } = useToast();
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();
  const globalPollingRef = useRef<NodeJS.Timeout | null>(null);

  // Carrega o username do usuário
  useEffect(() => {
    setUsername(userInfo?.username || userInfo?.email || "Usuário");
  }, [userInfo]);

  // Carrega vídeos existentes ao montar
  useEffect(() => {
    setTimeout(() => {
      loadUserVideos();
    }, 150);
  }, []);

  // Cleanup do polling global ao desmontar
  useEffect(() => {
    return () => {
      if (globalPollingRef.current) {
        clearInterval(globalPollingRef.current);
      }
    };
  }, []);

  // Fake progress bar effect - exactly 120 seconds (2 minutes)
  useEffect(() => {
    if (!showProgressBar) {
      setFakeProgress(0);
      return;
    }

    const TOTAL_DURATION = 120000;
    const INTERVAL = 100;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += INTERVAL;
      const progress = Math.min((elapsed / TOTAL_DURATION) * 100, 100);
      setFakeProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setShowProgressBar(false), 1200);
      }
    }, INTERVAL);

    return () => clearInterval(interval);
  }, [showProgressBar]);

  const loadUserVideos = async () => {
    try {
      const videos = await videoService.listVideos();

      if (!Array.isArray(videos)) {
        console.warn("Formato inesperado dos vídeos. Mantendo lista anterior.");
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
          } catch (error) {
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

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const videosThisMonth = detailedJobs.filter((video) => {
        const date = new Date(video.created_at);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      setMonthlyUsage(videosThisMonth.length);

      if (detailedJobs.length >= 0) {
        setLoadingVideos(false);
      }

      const stillProcessing = detailedJobs.some((j) => j.status === "pending" || j.status === "processing");

      if (stillProcessing) {
        startGlobalPolling();
        setIsGenerating(true);
      } else if (globalPollingRef.current) {
        clearInterval(globalPollingRef.current);
        globalPollingRef.current = null;
        setIsGenerating(false);
      }
    } catch (error: any) {
      console.log("⚠️ Falha momentânea ao carregar vídeos:", error);
      return;
    }
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
    navigate("/auth");
  };

  const startGlobalPolling = () => {
    if (globalPollingRef.current) return;

    globalPollingRef.current = setInterval(() => {
      loadUserVideos();
    }, 8000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.objetivo || !formData.tema || !formData.nicho || !formData.palavra_chave_global) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (monthlyUsage >= MONTHLY_LIMIT) {
      toast({
        title: "Limite mensal atingido",
        description: "Você já gerou 15 vídeos este mês.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setIsGenerating(true);
    setShowProgressBar(true);
    setFakeProgress(0);

    startGlobalPolling();

    try {
      const result = await videoService.renderVideo(formData, uploadedVideos.length > 0 ? uploadedVideos : undefined);

      if (result.timeout) {
        toast({
          title: "Seu vídeo ainda está sendo gerado",
          description: "O servidor está processando. Ele aparecerá em 'Concluídos' quando pronto.",
          variant: "default",
        });
      } else {
        toast({
          title: "Render iniciado com sucesso",
          description: "Seu vídeo está sendo gerado. Tempo estimado: ~2 minutos.",
        });
      }

      setFormData({
        objetivo: "",
        tema: "",
        nicho: "",
        palavra_chave_global: "",
        idioma: "pt-BR",
        duracao: 30,
        cenas: 5,
        aspect_ratio: "9:16",
        tipoRoteiro: "educativo-com-prova-social",
        roteiroSugerido: "",
        bulletPointsRoteiro: "",
        usarLegendaEFala: true,
      });
      setUploadedVideos([]);
      setLoading(false);
    } catch (error: any) {
      const isTimeout =
        error?.code === "ERR_CANCELED" ||
        error?.code === "ECONNABORTED" ||
        error?.name === "AbortError" ||
        error?.message?.toLowerCase?.().includes("timeout") ||
        error?.message?.toLowerCase?.().includes("cancel");

      if (isTimeout) {
        setLoading(false);
        return;
      }

      toast({
        title: "Render em andamento",
        description: "Aguarde cerca de 2 minutos e verifique os concluídos.",
        variant: "default",
      });

      setIsGenerating(true);
      setLoading(false);
    }
  };

  const handleDownload = async (jobId: string) => {
    try {
      const blob = await videoService.downloadVideo(jobId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${jobId}.mp4`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Download iniciado",
        description: "O vídeo está sendo baixado.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao baixar vídeo",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (jobId: string) => {
    try {
      await videoService.deleteVideo(jobId);
      setJobs((prev) => prev.filter((job) => job.job_id !== jobId));
      toast({
        title: "Vídeo deletado",
        description: "O vídeo foi removido com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao deletar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setFormData({
      objetivo: "",
      tema: "",
      nicho: "",
      palavra_chave_global: "",
      idioma: "pt-BR",
      duracao: 30,
      cenas: 5,
      aspect_ratio: "9:16",
      tipoRoteiro: "educativo-com-prova-social",
      roteiroSugerido: "",
      bulletPointsRoteiro: "",
      usarLegendaEFala: true,
    });
    setUploadedVideos([]);
  };

  // Validation
  const getMissingFields = () => {
    const missing: string[] = [];
    if (!formData.objetivo) missing.push("Objetivo");
    if (!formData.tema) missing.push("Tema");
    if (!formData.nicho) missing.push("Nicho");
    if (!formData.palavra_chave_global) missing.push("Palavra-chave");
    return missing;
  };

  const missingFields = getMissingFields();
  const isFormValid = missingFields.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
              <Video className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">ViralizeAI</h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">Editor de Vídeos</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-muted-foreground">Logado como</p>
              <p className="text-sm font-medium text-foreground">{username}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="h-9">
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <EditorLayout
        leftPanel={
          <>
            {/* Preview Card */}
            <PreviewCard
              aspectRatio={formData.aspect_ratio}
              duration={formData.duracao}
              scenes={formData.cenas}
              isGenerating={isGenerating}
            />

            {/* Render Status */}
            <RenderStatusCard
              isGenerating={isGenerating}
              fakeProgress={fakeProgress}
              showProgressBar={showProgressBar}
            />

            {/* Jobs List */}
            <JobsListCard
              jobs={jobs}
              loadingVideos={loadingVideos}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />

            {/* Marketplace CTA */}
            <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Marketplace Digitalz</h3>
                  <p className="text-xs text-muted-foreground">Acelere seus resultados</p>
                </div>
              </div>
              <Button
                variant="default"
                className="w-full"
                onClick={() => window.open("https://marketplace.digitalzeducacao.com", "_blank")}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Explorar Produtos
              </Button>
            </div>
          </>
        }
        rightPanel={
          <ConfigPanel
            onSubmit={handleSubmit}
            onClear={handleClear}
            isLoading={loading}
            isDisabled={!isFormValid}
            disabledReason={missingFields.length > 0 ? `Preencha: ${missingFields.join(", ")}` : undefined}
            monthlyUsage={monthlyUsage}
            monthlyLimit={MONTHLY_LIMIT}
          >
            {{
              /* TAB: CONTEÚDO */
              conteudo: (
                <>
                  <FieldSection
                    title="Informações Principais"
                    icon={<Target className="w-4 h-4" />}
                    tooltip="Defina o objetivo e contexto do seu vídeo viral"
                  >
                    <FieldRow label="Objetivo do vídeo" htmlFor="objetivo" required hint="Ex: vender, engajar">
                      <Input
                        id="objetivo"
                        placeholder="Ex: Vender curso de produtividade"
                        value={formData.objetivo}
                        onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                        disabled={loading}
                        className="h-10"
                      />
                    </FieldRow>

                    <FieldRow label="Tema principal" htmlFor="tema" required>
                      <Input
                        id="tema"
                        placeholder="Ex: Produtividade, Finanças"
                        value={formData.tema}
                        onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
                        disabled={loading}
                        className="h-10"
                      />
                    </FieldRow>

                    <FieldRow label="Nicho de mercado" htmlFor="nicho" required>
                      <Input
                        id="nicho"
                        placeholder="Ex: Empreendedorismo digital"
                        value={formData.nicho}
                        onChange={(e) => setFormData({ ...formData, nicho: e.target.value })}
                        disabled={loading}
                        className="h-10"
                      />
                    </FieldRow>

                    <FieldRow label="Palavra-chave global" htmlFor="palavra_chave" required hint="Para busca de mídia">
                      <Input
                        id="palavra_chave"
                        placeholder="Ex: productivity, business"
                        value={formData.palavra_chave_global}
                        onChange={(e) => setFormData({ ...formData, palavra_chave_global: e.target.value })}
                        disabled={loading}
                        className="h-10"
                      />
                    </FieldRow>
                  </FieldSection>

                  <FieldSection
                    title="Idioma"
                    icon={<Globe className="w-4 h-4" />}
                  >
                    <Select
                      value={formData.idioma}
                      onValueChange={(value) => setFormData({ ...formData, idioma: value })}
                      disabled={loading}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">🇧🇷 Português (BR)</SelectItem>
                        <SelectItem value="en-US">🇺🇸 English (US)</SelectItem>
                        <SelectItem value="es-ES">🇪🇸 Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldSection>

                  <FieldSection
                    title="Tipo de Roteiro"
                    icon={<FileText className="w-4 h-4" />}
                    tooltip="Escolha o estilo que melhor viraliza no seu nicho"
                  >
                    <Select
                      value={formData.tipoRoteiro}
                      onValueChange={(value) => setFormData({ ...formData, tipoRoteiro: value })}
                      disabled={loading}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="educativo-com-prova-social">📚 Educativo com prova social</SelectItem>
                        <SelectItem value="historia-pessoal">📖 História pessoal</SelectItem>
                        <SelectItem value="review-produto">⭐ Review de produto</SelectItem>
                        <SelectItem value="checklist-3-passos">✅ Checklist em 3 passos</SelectItem>
                        <SelectItem value="bastidores-estrategia">🎬 Bastidores / estratégia</SelectItem>
                        <SelectItem value="controversia-opiniao">🔥 Controvérsia / opinião forte</SelectItem>
                        <SelectItem value="antes-depois">🔄 Antes e depois</SelectItem>
                        <SelectItem value="mito-vs-verdade">❌ Mito vs Verdade</SelectItem>
                        <SelectItem value="erro-comum">⚠️ Erro comum que você comete</SelectItem>
                        <SelectItem value="segredo-revelado">🤫 Segredo revelado</SelectItem>
                        <SelectItem value="tutorial-rapido">⚡ Tutorial rápido</SelectItem>
                        <SelectItem value="storytelling-emocional">💔 Storytelling emocional</SelectItem>
                        <SelectItem value="lista-top">🏆 Lista / Top X</SelectItem>
                        <SelectItem value="desafio-trend">🎯 Desafio / Trend</SelectItem>
                        <SelectItem value="curiosidade-chocante">😱 Curiosidade chocante</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldSection>

                  <FieldSection
                    title="Direcionamento do Roteiro"
                    icon={<Lightbulb className="w-4 h-4" />}
                    description="Opcional: guie a IA com suas ideias"
                  >
                    <FieldRow label="Sugestão de roteiro" htmlFor="roteiro">
                      <Textarea
                        id="roteiro"
                        placeholder="Descreva a linha geral, ganchos, provas..."
                        value={formData.roteiroSugerido}
                        onChange={(e) => setFormData({ ...formData, roteiroSugerido: e.target.value })}
                        disabled={loading}
                        rows={3}
                        className="resize-none"
                      />
                    </FieldRow>

                    <FieldRow label="Pontos obrigatórios" htmlFor="bullets" hint="Um por linha">
                      <Textarea
                        id="bullets"
                        placeholder="- Mencionar garantia&#10;- Mostrar resultado&#10;- CTA no final"
                        value={formData.bulletPointsRoteiro}
                        onChange={(e) => setFormData({ ...formData, bulletPointsRoteiro: e.target.value })}
                        disabled={loading}
                        rows={3}
                        className="resize-none font-mono text-xs"
                      />
                    </FieldRow>
                  </FieldSection>
                </>
              ),

              /* TAB: MÍDIA */
              midia: (
                <>
                  <FieldSection
                    title="Vídeos Personalizados"
                    icon={<Film className="w-4 h-4" />}
                    description="Envie seus próprios vídeos ao invés de usar b-roll automático"
                  >
                    <div
                      className={`
                        relative border-2 border-dashed rounded-xl transition-all cursor-pointer
                        ${uploadedVideos.length > 0
                          ? "border-primary bg-primary/5 hover:bg-primary/10"
                          : "border-muted-foreground/25 bg-muted/20 hover:bg-muted/40 hover:border-muted-foreground/50"
                        }
                        ${loading ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                    >
                      <label htmlFor="user_videos" className="block p-6 cursor-pointer">
                        <div className="flex flex-col items-center gap-3 text-center">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            uploadedVideos.length > 0 ? "bg-primary/20" : "bg-muted"
                          }`}>
                            <Upload className={`w-6 h-6 ${uploadedVideos.length > 0 ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {uploadedVideos.length > 0
                                ? `${uploadedVideos.length} vídeo${uploadedVideos.length > 1 ? "s" : ""} selecionado${uploadedVideos.length > 1 ? "s" : ""}`
                                : "Arraste ou clique para enviar"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">MP4, MOV ou AVI • Máx 100MB cada</p>
                          </div>
                        </div>
                        <Input
                          id="user_videos"
                          type="file"
                          accept="video/mp4,video/quicktime,video/x-msvideo"
                          multiple
                          onChange={(e) => setUploadedVideos(Array.from(e.target.files || []))}
                          disabled={loading}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {uploadedVideos.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Arquivos selecionados</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setUploadedVideos([])}
                            className="h-6 text-xs"
                          >
                            Limpar todos
                          </Button>
                        </div>
                        <div className="space-y-1.5 max-h-32 overflow-y-auto">
                          {uploadedVideos.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 bg-muted/30 border border-border/50 px-3 py-2 rounded-lg"
                            >
                              <Film className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="flex-1 text-sm truncate">{file.name}</span>
                              <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)}MB</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setUploadedVideos((prev) => prev.filter((_, i) => i !== index))}
                                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                              >
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                      <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        Se nenhum vídeo for enviado, a IA buscará automaticamente b-roll relevante baseado na palavra-chave.
                      </p>
                    </div>
                  </FieldSection>
                </>
              ),

              /* TAB: ESTILO */
              estilo: (
                <>
                  <FieldSection
                    title="Modo do Vídeo"
                    icon={<Sparkles className="w-4 h-4" />}
                    description="Define se haverá narração ou apenas texto na tela"
                  >
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, usarLegendaEFala: true })}
                        disabled={loading}
                        className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                          formData.usarLegendaEFala
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border hover:border-muted-foreground/50"
                        } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        {formData.usarLegendaEFala && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            formData.usarLegendaEFala ? "bg-primary/20" : "bg-muted"
                          }`}>
                            <Mic className={`w-5 h-5 ${formData.usarLegendaEFala ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Com narração + legenda</p>
                            <p className="text-xs text-muted-foreground">IA narra o texto e exibe legendas sincronizadas</p>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, usarLegendaEFala: false })}
                        disabled={loading}
                        className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                          !formData.usarLegendaEFala
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border hover:border-muted-foreground/50"
                        } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        {!formData.usarLegendaEFala && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            !formData.usarLegendaEFala ? "bg-primary/20" : "bg-muted"
                          }`}>
                            <VolumeX className={`w-5 h-5 ${!formData.usarLegendaEFala ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Mudo com texto central</p>
                            <p className="text-xs text-muted-foreground">Frases fortes no centro, sem áudio de voz</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </FieldSection>

                  <FieldSection
                    title="Formato e Duração"
                    icon={<Monitor className="w-4 h-4" />}
                  >
                    <FieldRow label="Proporção" htmlFor="aspect">
                      <Select
                        value={formData.aspect_ratio}
                        onValueChange={(value) => setFormData({ ...formData, aspect_ratio: value })}
                        disabled={loading}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9:16">📱 9:16 (Reels/TikTok/Shorts)</SelectItem>
                          <SelectItem value="16:9">🖥️ 16:9 (YouTube/Horizontal)</SelectItem>
                          <SelectItem value="1:1">⬜ 1:1 (Feed quadrado)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FieldRow>

                    <div className="grid grid-cols-2 gap-3">
                      <FieldRow label="Duração" htmlFor="duracao" hint="10-31 seg">
                        <Input
                          id="duracao"
                          type="number"
                          min="10"
                          max="31"
                          value={formData.duracao === 0 ? "" : formData.duracao}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "") {
                              setFormData({ ...formData, duracao: 0 });
                            } else {
                              const num = parseInt(val, 10);
                              if (!isNaN(num)) {
                                setFormData({ ...formData, duracao: Math.min(31, Math.max(0, num)) });
                              }
                            }
                          }}
                          onBlur={() => {
                            if (formData.duracao < 10) {
                              setFormData({ ...formData, duracao: 10 });
                            }
                          }}
                          disabled={loading}
                          className="h-10"
                        />
                      </FieldRow>

                      <FieldRow label="Nº de cenas" htmlFor="cenas" hint="3-15">
                        <Input
                          id="cenas"
                          type="number"
                          min="3"
                          max="15"
                          value={formData.cenas}
                          onChange={(e) => setFormData({ ...formData, cenas: parseInt(e.target.value) || 5 })}
                          disabled={loading}
                          className="h-10"
                        />
                      </FieldRow>
                    </div>
                  </FieldSection>
                </>
              ),

              /* TAB: ÁUDIO */
              audio: (
                <>
                  <FieldSection
                    title="Configurações de Áudio"
                    icon={<Volume2 className="w-4 h-4" />}
                    description="O áudio é gerado automaticamente baseado no modo selecionado"
                  >
                    <div className="p-4 bg-muted/30 rounded-xl space-y-3">
                      <div className="flex items-center gap-3">
                        {formData.usarLegendaEFala ? (
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Mic className="w-5 h-5 text-primary" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <VolumeX className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">
                            {formData.usarLegendaEFala ? "Narração ativada" : "Vídeo sem narração"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formData.usarLegendaEFala
                              ? "A IA irá narrar o roteiro com voz natural"
                              : "O vídeo terá apenas música de fundo"}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border/50">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Check className="w-3.5 h-3.5 text-primary" />
                          <span>Música de fundo automática</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Check className="w-3.5 h-3.5 text-primary" />
                          <span>Áudio balanceado e limpo</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700 dark:text-blue-400">
                        Em breve: seleção de voz, volume personalizado e biblioteca de músicas.
                      </p>
                    </div>
                  </FieldSection>
                </>
              ),

              /* TAB: REVISÃO */
              revisao: (
                <>
                  <FieldSection
                    title="Resumo da Configuração"
                    icon={<CheckSquare className="w-4 h-4" />}
                    description="Revise antes de iniciar o render"
                  >
                    <div className="space-y-2">
                      {[
                        { label: "Objetivo", value: formData.objetivo || "—", required: true },
                        { label: "Tema", value: formData.tema || "—", required: true },
                        { label: "Nicho", value: formData.nicho || "—", required: true },
                        { label: "Palavra-chave", value: formData.palavra_chave_global || "—", required: true },
                        { label: "Idioma", value: formData.idioma === "pt-BR" ? "Português" : formData.idioma === "en-US" ? "English" : "Español" },
                        { label: "Modo", value: formData.usarLegendaEFala ? "Com narração" : "Mudo com texto" },
                        { label: "Formato", value: formData.aspect_ratio },
                        { label: "Duração", value: `${formData.duracao} segundos` },
                        { label: "Cenas", value: formData.cenas.toString() },
                        { label: "Vídeos enviados", value: uploadedVideos.length > 0 ? `${uploadedVideos.length} arquivo(s)` : "Nenhum (b-roll auto)" },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                          <span className="text-xs text-muted-foreground">
                            {item.label}
                            {item.required && <span className="text-destructive ml-0.5">*</span>}
                          </span>
                          <span className={`text-sm font-medium ${
                            item.required && item.value === "—" ? "text-destructive" : "text-foreground"
                          }`}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {formData.tipoRoteiro && (
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Tipo de roteiro</p>
                        <p className="text-sm font-medium">{formData.tipoRoteiro.replace(/-/g, " ")}</p>
                      </div>
                    )}

                    {formData.roteiroSugerido && (
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Sugestão de roteiro</p>
                        <p className="text-sm text-foreground line-clamp-3">{formData.roteiroSugerido}</p>
                      </div>
                    )}

                    {formData.bulletPointsRoteiro && (
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Pontos obrigatórios</p>
                        <p className="text-xs font-mono text-foreground whitespace-pre-line line-clamp-4">
                          {formData.bulletPointsRoteiro}
                        </p>
                      </div>
                    )}
                  </FieldSection>

                  {!isFormValid && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl">
                      <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-2">
                        Campos obrigatórios faltando:
                      </p>
                      <ul className="space-y-1">
                        {missingFields.map((field) => (
                          <li key={field} className="text-xs text-amber-600 dark:text-amber-500 flex items-center gap-1.5">
                            <X className="w-3 h-3" />
                            {field}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ),
            }}
          </ConfigPanel>
        }
      />
    </div>
  );
}

