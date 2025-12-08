import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { videoService } from "@/integrations/supabase/videoService";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, LogOut, Video, Download, Trash2, Settings, Upload, X, Film, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  });

  const { toast } = useToast();
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();
  const globalPollingRef = useRef<NodeJS.Timeout | null>(null);

  // Estados computados para as abas
  const processingJobs = jobs.filter((job) => job.status === "pending" || job.status === "processing");
  const completedJobs = jobs.filter((job) => job.status === "completed");
  const failedJobs = jobs.filter((job) => job.status === "failed");

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

  // Fake progress bar effect - exactly 150 seconds (2min30s)
  useEffect(() => {
    if (!showProgressBar) {
      setFakeProgress(0);
      return;
    }

    const TOTAL_DURATION = 300000; // 300s (5 minutos)
    const INTERVAL = 100; // atualiza a cada 100ms
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += INTERVAL;

      const progress = Math.min((elapsed / TOTAL_DURATION) * 100, 100);
      setFakeProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setShowProgressBar(false), 1200); // fade-out suave
      }
    }, INTERVAL);

    return () => clearInterval(interval);
  }, [showProgressBar]);

  const loadUserVideos = async () => {
    try {
      const videos = await videoService.listVideos();

      // ✅ PATCH 1: não resetar os jobs se o backend vier em formato inesperado
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
            console.warn(`Falha ao buscar status do vídeo ${video.job_id}, utilizando dados básicos.`);
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

      // Atualiza jobs: mantém temporários até aparecerem reais
      setJobs((prev) => {
        // 1. pegar temporários
        const temps = prev.filter((j) => j.temp);

        // 2. remover temporários SOMENTE quando o vídeo real já existe
        const tempsStillValid = temps.filter((temp) => !detailedJobs.some((real) => real.job_id === temp.job_id));

        console.log("📋 Temporários mantidos:", tempsStillValid.length, "| Jobs do backend:", detailedJobs.length);

        // 3. resultado final
        return [...tempsStillValid, ...detailedJobs];
      });

      // Calcular uso mensal
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const videosThisMonth = detailedJobs.filter(video => {
        const date = new Date(video.created_at);
        return (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      });

      setMonthlyUsage(videosThisMonth.length);

      // Remove loading quando QUALQUER lista vier do backend
      if (detailedJobs.length >= 0) {
        setLoadingVideos(false);
      }

      // Controla o polling global conforme status atuais
      const stillProcessing = detailedJobs.some((j) => j.status === "pending" || j.status === "processing");

      if (stillProcessing) {
        startGlobalPolling();
        setIsGenerating(true);
      } else if (globalPollingRef.current) {
        console.log("⏸️ Parando polling global - nenhum vídeo processando");
        clearInterval(globalPollingRef.current);
        globalPollingRef.current = null;
        setIsGenerating(false);
      }
    } catch (error: any) {
      // NÃO mostrar erro na UI - falhas momentâneas são normais durante render pesado
      console.log("⚠️ Falha momentânea ao carregar vídeos (normal durante render):", error);
      return; // não bloqueia a UI
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
    if (globalPollingRef.current) {
      console.log("⚠️ Polling global já está ativo — não iniciar outro.");
      return;
    }

    console.log("🔄 INICIANDO POLLING GLOBAL (a cada 8s)");
    globalPollingRef.current = setInterval(() => {
      console.log("🔄 Polling global: verificando status dos vídeos...");
      loadUserVideos();
    }, 8000); // 8 segundos
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

    console.log("🎬 INICIANDO handleSubmit");
    setLoading(true);
    setIsGenerating(true);
    setShowProgressBar(true);
    setFakeProgress(0);

    // Criar job temporário IMEDIATAMENTE (sem depender de job_id do POST)
    const tempId = `temp-${Date.now()}`;
    console.log("➕ CRIANDO JOB TEMPORÁRIO:", tempId);

    setJobs((prev) => [
      {
        job_id: tempId,
        status: "processing",
        progress: null,
        message: "Iniciando geração do vídeo...",
        created_at: new Date().toISOString(),
        temp: true,
      },
      ...prev,
    ]);

    // Iniciar polling global IMEDIATAMENTE
    startGlobalPolling();

    try {
      console.log("📡 ENVIANDO REQUEST para /videos/render (timeout é esperado)");
      const result = await videoService.renderVideo(formData, uploadedVideos.length > 0 ? uploadedVideos : undefined);
      console.log("✅ POST enviado (job iniciado no backend)");

      // Se for timeout, mostrar mensagem amigável
      if (result.timeout) {
        console.log("⚠️ Timeout detectado - job continua no backend");
        toast({
          title: "Seu vídeo ainda está sendo gerado",
          description:
            "O servidor está levando um pouco mais de tempo, mas o vídeo continua em processamento. Ele vai aparecer em 'Concluídos' assim que estiver pronto.",
          variant: "default",
        });
      } else {
        toast({
          title: "Vídeo em processamento",
          description: "Seu vídeo está sendo gerado. Ele aparecerá automaticamente quando pronto.",
        });
      }

      // Reset do formulário e libera botão
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
      });
      setUploadedVideos([]);
      setLoading(false);
    } catch (error: any) {
      // ✅ PATCH 3: distinguir timeout/cancelamento de erro real
      const isTimeout =
        error?.code === "ERR_CANCELED" ||
        error?.code === "ECONNABORTED" ||
        error?.name === "AbortError" ||
        error?.message?.toLowerCase?.().includes("timeout") ||
        error?.message?.toLowerCase?.().includes("cancel");

      if (isTimeout) {
        console.log("⚠️ Timeout detectado - continuar processando");
        setLoading(false); // não travar o botão
        return;
      }

      console.error("❌ ERRO REAL NO HANDLESUBMIT:", error);

      // ERRO REAL: remove o temporário e sinaliza erro
      setJobs((prev) => prev.filter((j) => j.job_id !== tempId));

      toast({
        title: "O vídeo sendo gerado!",
        description: "Aguarde cerca de 3 minutos e estará na aba de conclúidos.",
        variant: "default",
      });

      setIsGenerating(true);
      setLoading(false);

      return;
    }
  };

  const handleDownload = async (jobId: string) => {
    try {
      console.log("📥 INICIANDO DOWNLOAD:", jobId);
      const blob = await videoService.downloadVideo(jobId);
      console.log("✅ BLOB RECEBIDO:", blob.size, "bytes");

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
      console.error("❌ ERRO AO BAIXAR:", error);
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

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon?: React.ReactNode }
    > = {
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

    const config = statusConfig[status] || { label: status, variant: "default" };
    return (
      <Badge variant={config.variant} className="flex items-center w-fit">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const renderJobCard = (job: VideoJob) => (
    <div key={job.job_id} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="space-y-1 flex-1">
          <p className="font-mono text-xs text-muted-foreground break-all">{job.job_id}</p>
          {getStatusBadge(job.status)}
          <p className="text-xs text-muted-foreground">Criado: {new Date(job.created_at).toLocaleString("pt-BR")}</p>
        </div>
        <div className="flex gap-2">
          {job.status === "completed" && (
            <Button size="sm" variant="outline" onClick={() => handleDownload(job.job_id)} title="Baixar vídeo">
              <Download className="w-4 h-4" />
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => handleDelete(job.job_id)} title="Deletar vídeo">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {job.progress !== null && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{job.progress}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${job.progress}%` }}
            />
          </div>
        </div>
      )}

      {job.message && <p className="text-sm text-muted-foreground italic">{job.message}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle>Criar Novo Vídeo</CardTitle>
              <CardDescription>Preencha os campos abaixo para gerar seu vídeo viral com IA</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6" aria-busy={isGenerating}>
                {/* Seção: Informações Principais */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-primary flex items-center gap-2 pb-2 border-b border-border">
                    🎯 Informações Principais
                  </h3>
                  
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="objetivo">Objetivo *</Label>
                      <Input
                        id="objetivo"
                        placeholder="Ex: Vender curso online"
                        value={formData.objetivo}
                        onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                        disabled={loading}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tema">Tema *</Label>
                        <Input
                          id="tema"
                          placeholder="Ex: Produtividade"
                          value={formData.tema}
                          onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
                          disabled={loading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nicho">Nicho *</Label>
                        <Input
                          id="nicho"
                          placeholder="Ex: Empreendedorismo digital"
                          value={formData.nicho}
                          onChange={(e) => setFormData({ ...formData, nicho: e.target.value })}
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="palavra_chave_global">Palavra-chave Global *</Label>
                      <Input
                        id="palavra_chave_global"
                        placeholder="Ex: productivity"
                        value={formData.palavra_chave_global}
                        onChange={(e) => setFormData({ ...formData, palavra_chave_global: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Seção: Configurações do Vídeo */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-primary flex items-center gap-2 pb-2 border-b border-border">
                    ⚙️ Configurações do Vídeo
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="idioma">Idioma</Label>
                      <Select
                        value={formData.idioma}
                        onValueChange={(value) => setFormData({ ...formData, idioma: value })}
                        disabled={loading}
                      >
                        <SelectTrigger id="idioma">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-BR">Português (BR)</SelectItem>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="es-ES">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="aspect_ratio">Proporção</Label>
                      <Select
                        value={formData.aspect_ratio}
                        onValueChange={(value) => setFormData({ ...formData, aspect_ratio: value })}
                        disabled={loading}
                      >
                        <SelectTrigger id="aspect_ratio">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9:16">9:16 (Vertical)</SelectItem>
                          <SelectItem value="16:9">16:9 (Horizontal)</SelectItem>
                          <SelectItem value="1:1">1:1 (Quadrado)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duracao">Duração (seg)</Label>
                      <Input
                        id="duracao"
                        type="number"
                        min="10"
                        max="31"
                        value={formData.duracao}
                        onChange={(e) => setFormData({ ...formData, duracao: Math.min(31, parseInt(e.target.value) || 10) })}
                        disabled={loading}
                      />
                      <p className="text-xs text-muted-foreground">Máx: 31 segundos</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cenas">Nº de Cenas</Label>
                      <Input
                        id="cenas"
                        type="number"
                        min="3"
                        max="15"
                        value={formData.cenas}
                        onChange={(e) => setFormData({ ...formData, cenas: parseInt(e.target.value) })}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Seção: Vídeos Personalizados */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                      <Film className="w-4 h-4" />
                      Vídeos Personalizados
                      <span className="text-xs font-normal text-muted-foreground">(Opcional)</span>
                    </h3>
                    {uploadedVideos.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setUploadedVideos([])}
                        className="h-7 text-xs"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Limpar
                      </Button>
                    )}
                  </div>

                  <label
                    htmlFor="user_videos"
                    className={`
                      flex flex-col items-center justify-center w-full h-24
                      border-2 border-dashed rounded-lg cursor-pointer 
                      transition-all duration-200
                      ${uploadedVideos.length > 0 
                        ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                        : 'border-muted-foreground/25 bg-muted/20 hover:bg-muted/40 hover:border-muted-foreground/50'
                      }
                      ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3 text-center px-4">
                      <Upload className={`w-6 h-6 ${uploadedVideos.length > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">
                          {uploadedVideos.length > 0 
                            ? `${uploadedVideos.length} vídeo${uploadedVideos.length > 1 ? 's' : ''} selecionado${uploadedVideos.length > 1 ? 's' : ''}`
                            : 'Clique para enviar vídeos'
                          }
                        </p>
                        <p className="text-xs text-muted-foreground">
                          MP4, MOV ou AVI
                        </p>
                      </div>
                    </div>
                    <Input
                      id="user_videos"
                      type="file"
                      accept="video/mp4,video/quicktime,video/x-msvideo"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setUploadedVideos(files);
                      }}
                      disabled={loading}
                      className="hidden"
                    />
                  </label>

                  {uploadedVideos.length > 0 && (
                    <div className="space-y-1.5 max-h-28 overflow-y-auto">
                      {uploadedVideos.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-card border border-border px-2.5 py-1.5 rounded-md text-sm"
                        >
                          <Film className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span className="flex-1 truncate text-foreground">{file.name}</span>
                          <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)}MB</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setUploadedVideos(prev => prev.filter((_, i) => i !== index))}
                            className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Seção: Roteiro */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-primary flex items-center gap-2 pb-2 border-b border-border">
                    📝 Configuração do Roteiro
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="tipoRoteiro">Tipo de Roteiro</Label>
                    <Select
                      value={formData.tipoRoteiro}
                      onValueChange={(value) => setFormData({ ...formData, tipoRoteiro: value })}
                      disabled={loading}
                    >
                      <SelectTrigger id="tipoRoteiro">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="educativo-com-prova-social">Educativo com prova social</SelectItem>
                        <SelectItem value="historia-pessoal">História pessoal</SelectItem>
                        <SelectItem value="review-produto">Review de produto</SelectItem>
                        <SelectItem value="checklist-3-passos">Checklist em 3 passos</SelectItem>
                        <SelectItem value="bastidores-estrategia">Bastidores / estratégia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roteiroSugerido">Sugestão de Roteiro</Label>
                    <Textarea
                      id="roteiroSugerido"
                      placeholder="Explique a linha geral do roteiro, ganchos, provas, etc."
                      value={formData.roteiroSugerido}
                      onChange={(e) => setFormData({ ...formData, roteiroSugerido: e.target.value })}
                      disabled={loading}
                      rows={3}
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bulletPointsRoteiro">Pontos Principais</Label>
                    <Textarea
                      id="bulletPointsRoteiro"
                      placeholder="- Ponto 1&#10;- Ponto 2&#10;- Ponto 3"
                      value={formData.bulletPointsRoteiro}
                      onChange={(e) => setFormData({ ...formData, bulletPointsRoteiro: e.target.value })}
                      disabled={loading}
                      rows={3}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Um ponto por linha. A IA respeitará cada item.
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full" disabled={loading || monthlyUsage >= MONTHLY_LIMIT}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Criando job...
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4 mr-2" />
                        Gerar Vídeo
                      </>
                    )}
                  </Button>

                  {/* Aviso de limite atingido */}
                  {monthlyUsage >= MONTHLY_LIMIT && (
                    <p className="text-sm text-destructive text-center mt-2">
                      Você atingiu o limite de 15 vídeos este mês.
                    </p>
                  )}

                  {/* Contador de uso mensal */}
                  {monthlyUsage < MONTHLY_LIMIT && (
                    <p className="text-xs text-muted-foreground text-center mt-1">
                      Você usou {monthlyUsage} de 15 vídeos este mês.
                    </p>
                  )}

                  {/* Barra de progresso fake */}
                  {showProgressBar && (
                    <div className="mt-4 space-y-2 text-center">
                      <p className="text-sm text-muted-foreground animate-pulse">Seu vídeo está sendo preparado...</p>

                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-2 transition-all duration-200 ease-linear"
                          style={{ width: `${fakeProgress}%` }}
                        />
                      </div>

                      <p className="text-xs text-muted-foreground">Tempo estimado: ~5 minutos</p>
                    </div>
                  )}

                   {processingJobs.length > 0 && !isGenerating && (
                    <div className="text-sm text-muted-foreground text-center mt-2 space-y-1">
                      <p>Seu vídeo está sendo gerado! Isso pode levar até 2 minutos.</p>
                      <p>Você verá ele sair de "Processando" e aparecer em "Meus vídeos" automaticamente.</p>
                    </div>
                  )}
                </div>
              </form>

              {/* Marketplace CTA - Enhanced */}
              <div className="mt-8 p-6 border-2 border-primary/20 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 shadow-md">
                <div className="flex items-center justify-center mb-3">
                  <ShoppingBag className="w-6 h-6 text-primary mr-2" />
                  <h3 className="text-lg font-semibold text-foreground">Marketplace Digitalz</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Produtos exclusivos para acelerar seus resultados com IA e Marketing Digital
                </p>
                <Button
                  variant="default"
                  size="lg"
                  className="w-full"
                  onClick={() => window.open("https://marketplace.digitalzeducacao.com", "_blank")}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Abrir Marketplace
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Videos Section with Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Meus Vídeos</CardTitle>
              <CardDescription>Acompanhe o progresso e gerencie seus vídeos</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingVideos ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Carregando vídeos...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum vídeo criado ainda</p>
                </div>
              ) : (
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">Todos ({jobs.length})</TabsTrigger>
                    <TabsTrigger value="processing">Processando ({processingJobs.length})</TabsTrigger>
                    <TabsTrigger value="completed">Concluídos ({completedJobs.length})</TabsTrigger>
                    <TabsTrigger value="failed">Falhos ({failedJobs.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4 mt-4">
                    {jobs.map(renderJobCard)}
                  </TabsContent>

                  <TabsContent value="processing" className="space-y-4 mt-4">
                    {processingJobs.length > 0 ? (
                      processingJobs.map(renderJobCard)
                    ) : (
                      <p className="text-center py-8 text-muted-foreground">Nenhum vídeo em processamento</p>
                    )}
                  </TabsContent>

                  <TabsContent value="completed" className="space-y-4 mt-4">
                    {completedJobs.length > 0 ? (
                      completedJobs.map(renderJobCard)
                    ) : (
                      <p className="text-center py-8 text-muted-foreground">Nenhum vídeo concluído</p>
                    )}
                  </TabsContent>

                  <TabsContent value="failed" className="space-y-4 mt-4">
                    {failedJobs.length > 0 ? (
                      failedJobs.map(renderJobCard)
                    ) : (
                      <p className="text-center py-8 text-muted-foreground">Nenhum vídeo falhou</p>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Features */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recursos em Breve</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <Badge variant="secondary" className="mb-2">
                  EM BREVE
                </Badge>
                <h3 className="font-semibold mb-1">Edição Avançada</h3>
                <p className="text-sm text-muted-foreground">Ajuste fino de cores, transições e efeitos especiais</p>
              </div>
              <div className="p-4 border rounded-lg">
                <Badge variant="secondary" className="mb-2">
                  EM BREVE
                </Badge>
                <h3 className="font-semibold mb-1">Biblioteca de Músicas</h3>
                <p className="text-sm text-muted-foreground">Adicione trilhas sonoras e efeitos de áudio</p>
              </div>
              <div className="p-4 border rounded-lg">
                <Badge variant="secondary" className="mb-2">
                  EM BREVE
                </Badge>
                <h3 className="font-semibold mb-1">Templates Personalizados</h3>
                <p className="text-sm text-muted-foreground">Crie e salve seus próprios templates de vídeo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
