import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { videoService } from "@/integrations/supabase/videoService";
import { useAuth } from "@/contexts/AuthContext";
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
  temp?: boolean;
}

export default function Editor() {
  const [loading, setLoading] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [jobs, setJobs] = useState<VideoJob[]>([]);
  const [activePolls, setActivePolls] = useState<Set<string>>(new Set());
  const [username, setUsername] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    objetivo: "",
    tema: "",
    nicho: "",
    palavra_chave_global: "",
    idioma: "pt-BR",
    duracao: 30,
    cenas: 5,
    aspect_ratio: "9:16"
  });

  const { toast } = useToast();
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();
  const intervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const globalPollingRef = useRef<NodeJS.Timeout | null>(null);

  // Estados computados para as abas
  const processingJobs = jobs.filter(job => job.status === "pending" || job.status === "processing");
  const completedJobs = jobs.filter(job => job.status === "completed");
  const failedJobs = jobs.filter(job => job.status === "failed");

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

  // Cleanup dos intervals ao desmontar
  useEffect(() => {
    return () => {
      intervalsRef.current.forEach((interval) => clearInterval(interval));
      intervalsRef.current.clear();
      if (globalPollingRef.current) {
        clearInterval(globalPollingRef.current);
      }
    };
  }, []);

  const loadUserVideos = async () => {
    setLoadingVideos(true);
    try {
      const videos = await videoService.listVideos();

      if (!Array.isArray(videos)) {
        console.error("Os vídeos retornados do backend não são um array:", videos);
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
              updated_at: status.updated_at
            };
          } catch (error) {
            console.warn(`Falha ao buscar status do vídeo ${video.job_id}, utilizando dados básicos.`);
            return {
              job_id: video.job_id,
              status: video.status,
              progress: null,
              message: null,
              created_at: video.created_at,
              updated_at: video.updated_at
            };
          }
        })
      );

      // Atualiza jobs: remove temporários e usa apenas dados reais do backend
      setJobs(prev => {
        const realJobIds = new Set(detailedJobs.map(j => j.job_id));
        
        // Remove TODOS os jobs temporários (backend agora tem o job real)
        const withoutTemp = prev.filter(job => !job.temp);
        
        // Se houver jobs processando no backend, mantém apenas os reais
        const hasProcessing = detailedJobs.some(j => 
          j.status === "pending" || j.status === "processing"
        );
        
        console.log("📋 Backend retornou:", detailedJobs.length, "jobs | Processando:", hasProcessing);
        
        // Retorna apenas os jobs do backend (mais atualizados)
        return detailedJobs;
      });

      // Parar polling global se não houver mais jobs processando
      const stillProcessing = detailedJobs.some(j => 
        j.status === "pending" || j.status === "processing"
      );
      
      if (!stillProcessing && globalPollingRef.current) {
        console.log("⏸️ Parando polling global - nenhum vídeo processando");
        clearInterval(globalPollingRef.current);
        globalPollingRef.current = null;
        setIsGenerating(false);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao carregar vídeos",
        description: error.message || "Erro inesperado ao buscar vídeos",
        variant: "destructive",
      });
      console.error("Erro ao carregar vídeos: ", error);
    } finally {
      setLoadingVideos(false);
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
      console.log("⏭️ Polling global já está rodando");
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

    console.log("🎬 INICIANDO handleSubmit");
    setLoading(true);
    setIsGenerating(true);

    // Criar job temporário IMEDIATAMENTE (sem depender de job_id do POST)
    const tempId = `temp-${Date.now()}`;
    console.log("➕ CRIANDO JOB TEMPORÁRIO:", tempId);
    
    setJobs(prev => [
      {
        job_id: tempId,
        status: "processing",
        progress: null,
        message: "Iniciando geração do vídeo...",
        created_at: new Date().toISOString(),
        temp: true
      },
      ...prev
    ]);

    // Iniciar polling global IMEDIATAMENTE
    startGlobalPolling();

    try {
      console.log("📡 ENVIANDO REQUEST para /videos/render (timeout é esperado)");
      await videoService.renderVideo(formData);
      console.log("✅ POST enviado (job iniciado no backend)");

      toast({
        title: "Vídeo em processamento",
        description: "Seu vídeo está sendo gerado. Ele aparecerá automaticamente quando pronto.",
      });

      setFormData({
        objetivo: "",
        tema: "",
        nicho: "",
        palavra_chave_global: "",
        idioma: "pt-BR",
        duracao: 30,
        cenas: 5,
        aspect_ratio: "9:16"
      });
    } catch (error: any) {
      console.error("❌ ERRO NO HANDLESUBMIT:", error);
      
      // Verificar se é timeout/cancelamento (NÃO é erro do job)
      const isTimeout = 
        error.code === "ERR_CANCELED" ||
        error.code === "ECONNABORTED" ||
        error.name === "AbortError" ||
        error.message?.includes("cancel") ||
        error.message?.includes("timeout") ||
        error.message?.includes("aborted");

      if (isTimeout) {
        console.log("⚠️ Timeout/cancelamento detectado - IGNORANDO (job continua no backend)");
        // NÃO remover job temporário
        // NÃO mostrar erro
        // Polling global já foi iniciado acima
        
        toast({
          title: "Vídeo em processamento",
          description: "Seu vídeo está sendo gerado. Ele aparecerá automaticamente quando pronto.",
        });
        
        return; // Sair sem remover job ou mostrar erro
      }

      // Apenas para erros REAIS (4xx, 5xx do backend):
      console.error("❌ ERRO REAL da API:", error);
      setJobs(prev => prev.filter(j => j.job_id !== tempId));
      
      toast({
        title: "Erro ao criar vídeo",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
      setIsGenerating(false);
    } finally {
      console.log("🏁 FINALIZANDO handleSubmit");
      setLoading(false);
    }
  };

  const startPollingJob = (jobId: string) => {
    if (activePolls.has(jobId)) {
      console.log("⚠️ Polling já ativo para job:", jobId);
      return;
    }

    console.log("🔄 Iniciando polling para job:", jobId);

    setActivePolls(prev => {
      const newSet = new Set(prev);
      newSet.add(jobId);
      return newSet;
    });

    let pollCount = 0;
    const maxPolls = 40; // 40 polls * 3s = 120s timeout

    const interval = setInterval(async () => {
      pollCount++;
      console.log(`📡 Polling #${pollCount} para job ${jobId}...`);

      try {
        const status = await videoService.getJobStatus(jobId);
        console.log(`📊 Status recebido:`, status.status);

        setJobs(prevJobs =>
          prevJobs.map(job =>
            job.job_id === jobId
              ? {
                  ...job,
                  status: status.status,
                  progress: status.progress,
                  message: status.message,
                  updated_at: status.updated_at
                }
              : job
          )
        );

        if (status.status === "completed") {
          console.log("✅ Vídeo completado!");
          clearInterval(interval);
          intervalsRef.current.delete(jobId);
          
          setActivePolls(prev => {
            const newSet = new Set(prev);
            newSet.delete(jobId);
            return newSet;
          });

          if (currentJobId === jobId) {
            setIsGenerating(false);
            setCurrentJobId(null);
          }

          toast({
            title: "Vídeo pronto!",
            description: "Seu vídeo foi gerado e já está disponível em 'Meus Vídeos'.",
          });

          // Recarrega a lista de vídeos
          await loadUserVideos();
        } else if (status.status === "failed") {
          console.log("❌ Vídeo falhou!");
          clearInterval(interval);
          intervalsRef.current.delete(jobId);
          
          setActivePolls(prev => {
            const newSet = new Set(prev);
            newSet.delete(jobId);
            return newSet;
          });

          if (currentJobId === jobId) {
            setIsGenerating(false);
            setCurrentJobId(null);
          }

          toast({
            title: "Erro na geração",
            description: status.error || "O vídeo falhou ao ser processado.",
            variant: "destructive",
          });
        } else if (pollCount >= maxPolls) {
          console.log("⏱️ Timeout atingido!");
          clearInterval(interval);
          intervalsRef.current.delete(jobId);
          
          setActivePolls(prev => {
            const newSet = new Set(prev);
            newSet.delete(jobId);
            return newSet;
          });

          if (currentJobId === jobId) {
            setIsGenerating(false);
            setCurrentJobId(null);
          }

          toast({
            title: "Demora incomum",
            description: "O vídeo está levando mais tempo que o normal. Tente verificar novamente em 'Meus Vídeos' em alguns instantes.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("❌ Erro no polling:", error);
        clearInterval(interval);
        intervalsRef.current.delete(jobId);
        
        setActivePolls(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });

        if (currentJobId === jobId) {
          setIsGenerating(false);
          setCurrentJobId(null);
        }
      }
    }, 3000); // Poll a cada 3 segundos

    intervalsRef.current.set(jobId, interval);
  };

  const pollJobStatus = async (jobId: string) => {
    startPollingJob(jobId);
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
      setJobs(jobs.filter(job => job.job_id !== jobId));

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
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon?: React.ReactNode }> = {
      pending: {
        label: "Pendente",
        variant: "secondary",
        icon: <Settings className="w-3 h-3 animate-spin mr-1" />
      },
      processing: {
        label: "Processando",
        variant: "default",
        icon: <Loader2 className="w-3 h-3 animate-spin mr-1" />
      },
      completed: {
        label: "Concluído",
        variant: "outline"
      },
      failed: {
        label: "Falhou",
        variant: "destructive"
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
    <div
      key={job.job_id}
      className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1 flex-1">
          <p className="font-mono text-xs text-muted-foreground break-all">
            {job.job_id}
          </p>
          {getStatusBadge(job.status)}
          <p className="text-xs text-muted-foreground">
            Criado: {new Date(job.created_at).toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="flex gap-2">
          {job.status === "completed" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownload(job.job_id)}
              title="Baixar vídeo"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDelete(job.job_id)}
            title="Deletar vídeo"
          >
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

      {job.message && (
        <p className="text-sm text-muted-foreground italic">{job.message}</p>
      )}
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
              <CardDescription>
                Preencha os campos abaixo para gerar seu vídeo viral com IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duracao">Duração (segundos)</Label>
                    <Input
                      id="duracao"
                      type="number"
                      min="10"
                      max="120"
                      value={formData.duracao}
                      onChange={(e) => setFormData({ ...formData, duracao: parseInt(e.target.value) })}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cenas">Número de Cenas</Label>
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

                <div className="pt-4">
                  <Button type="submit" className="w-full" disabled={loading}>
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
                  {processingJobs.length > 0 && (
                    <div className="text-sm text-muted-foreground text-center mt-2 space-y-1">
                      <p>Seu vídeo está sendo gerado! Isso pode levar até 2 minutos.</p>
                      <p>Você verá ele sair de "Processando" e aparecer em "Meus vídeos" automaticamente.</p>
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Videos Section with Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Meus Vídeos</CardTitle>
              <CardDescription>
                Acompanhe o progresso e gerencie seus vídeos
              </CardDescription>
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
                    <TabsTrigger value="all">
                      Todos ({jobs.length})
                    </TabsTrigger>
                    <TabsTrigger value="processing">
                      Processando ({processingJobs.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                      Concluídos ({completedJobs.length})
                    </TabsTrigger>
                    <TabsTrigger value="failed">
                      Falhos ({failedJobs.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4 mt-4">
                    {jobs.map(renderJobCard)}
                  </TabsContent>

                  <TabsContent value="processing" className="space-y-4 mt-4">
                    {processingJobs.length > 0 ? (
                      processingJobs.map(renderJobCard)
                    ) : (
                      <p className="text-center py-8 text-muted-foreground">
                        Nenhum vídeo em processamento
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="completed" className="space-y-4 mt-4">
                    {completedJobs.length > 0 ? (
                      completedJobs.map(renderJobCard)
                    ) : (
                      <p className="text-center py-8 text-muted-foreground">
                        Nenhum vídeo concluído
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="failed" className="space-y-4 mt-4">
                    {failedJobs.length > 0 ? (
                      failedJobs.map(renderJobCard)
                    ) : (
                      <p className="text-center py-8 text-muted-foreground">
                        Nenhum vídeo falhou
                      </p>
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
                <Badge variant="secondary" className="mb-2">EM BREVE</Badge>
                <h3 className="font-semibold mb-1">Edição Avançada</h3>
                <p className="text-sm text-muted-foreground">
                  Ajuste fino de cores, transições e efeitos especiais
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <Badge variant="secondary" className="mb-2">EM BREVE</Badge>
                <h3 className="font-semibold mb-1">Biblioteca de Músicas</h3>
                <p className="text-sm text-muted-foreground">
                  Adicione trilhas sonoras e efeitos de áudio
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <Badge variant="secondary" className="mb-2">EM BREVE</Badge>
                <h3 className="font-semibold mb-1">Templates Personalizados</h3>
                <p className="text-sm text-muted-foreground">
                  Crie e salve seus próprios templates de vídeo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}