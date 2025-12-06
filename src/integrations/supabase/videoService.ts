import { apiClient } from "@/integrations/supabase/apiClient";
import { API_URL } from "@/config/apiConfig";

interface VideoRequest {
  objetivo: string;
  tema: string;
  nicho: string;
  palavra_chave_global: string;
  idioma?: string;
  duracao?: number;
  cenas?: number;
  aspect_ratio?: string;
  tipoRoteiro?: string;
  roteiroSugerido?: string;
  bulletPointsRoteiro?: string;
}

interface JobResponse {
  job_id: string;
  status: string;
  message: string;
  created_at: string;
}

interface JobStatusResponse {
  job_id: string;
  status: string;
  progress: number | null;
  message: string | null;
  result: Record<string, any> | null;
  error: string | null;
  created_at: string;
  updated_at: string;
}

interface VideoListItem {
  job_id: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

// Função para mapear proporção para o formato esperado pelo backend
const mapearProporcao = (proporcao: string): string => {
  const mapa: Record<string, string> = {
    "9:16": "9:16",
    "16:9": "16:9",
    "1:1": "1:1",
  };
  return mapa[proporcao] || "9:16";
};

export const videoService = {
  renderVideo: async (params: VideoRequest, files?: File[]): Promise<{ started: boolean; timeout?: boolean }> => {
    try {
      console.log("🎬 INICIANDO renderVideo com FormData");

      // Montar payload estruturado
      const payload = {
        objetivo_video: params.objetivo,
        tema: params.tema,
        nicho: params.nicho,
        palavra_chave_global: params.palavra_chave_global,
        idioma: params.idioma || "pt-BR",
        duracao: Number(params.duracao || 30),
        cenas: Number(params.cenas || 5),
        tipo_roteiro: params.tipoRoteiro || "educativo-com-prova-social",
        roteiro_sugerido_usuario: params.roteiroSugerido || "",
        bullet_points_roteiro: (params.bulletPointsRoteiro || "")
          .split("\n")
          .map(line => line.trim())
          .filter(line => line.length > 0),
        metadata: {
          duration: Number(params.duracao || 30),
          cenas: Number(params.cenas || 5),
          aspect_ratio: mapearProporcao(params.aspect_ratio || "9:16"),
        },
      };

      // Criar FormData
      const formData = new FormData();
      formData.append("payload", JSON.stringify(payload));

      // Adicionar arquivos se existirem
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append("files", file);
        });
      }

      console.log("📦 Payload:", payload);
      console.log("📁 Arquivos:", files?.length || 0);

      await apiClient.post("/videos/render", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return { started: true };
    } catch (error: any) {
      // Timeout e cancelamento são ESPERADOS - backend continua processando
      const isTimeout = 
        error.code === "ERR_CANCELED" ||
        error.code === "ECONNABORTED" ||
        error.name === "AbortError" ||
        error.message === "canceled" ||
        error.message?.includes("cancel") ||
        error.message?.includes("timeout") ||
        error.message?.includes("aborted");

      if (isTimeout) {
        console.log("⚠️ Timeout/Cancelamento (ESPERADO) - job continua no backend");
        return { started: true, timeout: true };
      }

      console.error("❌ ERRO REAL em renderVideo:", error);
      throw new Error(error.response?.data?.message || error.response?.data?.detail || "Erro ao criar vídeo");
    }
  },

  // Verificar status do job
  getJobStatus: async (jobId: string): Promise<JobStatusResponse> => {
    try {
      const response = await apiClient.get<JobStatusResponse>(`/videos/status/${jobId}`);
      return response.data;
    } catch (error: any) {
      if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
        throw new Error("Tempo limite excedido ao verificar status");
      }
      throw new Error(error.response?.data?.message || "Erro ao buscar status do vídeo");
    }
  },

  downloadVideo: async (jobId: string): Promise<Blob> => {
    try {
      console.log("📥 BAIXANDO vídeo:", jobId);
      const response = await apiClient.get(`/videos/download/${jobId}`, {
        responseType: 'blob'
      });
      console.log("✅ Blob recebido:", response.data.size, "bytes");
      return response.data;
    } catch (error: any) {
      console.error("❌ ERRO ao baixar vídeo:", error);
      throw new Error(error.response?.data?.message || "Erro ao baixar vídeo");
    }
  },

  // Listar vídeos do usuário
  listVideos: async (skip: number = 0, limit: number = 100): Promise<VideoListItem[]> => {
    try {
      const response = await apiClient.get<{ items: VideoListItem[] }>("/videos/list", {
        params: { skip, limit },
      });

      console.log("Resposta da API /videos/list:", response.data);

      // Trata diferentes formatos de resposta do backend
      let videosList: VideoListItem[] = [];

      if (Array.isArray(response.data)) {
        // Se a resposta for diretamente um array
        videosList = response.data;
      } else if (response.data && Array.isArray(response.data.items)) {
        // Se a resposta tiver a propriedade 'items'
        videosList = response.data.items;
      } else if (response.data && typeof response.data === 'object') {
        // Se a resposta for um objeto, tenta encontrar a propriedade com array
        const possibleArrays = Object.values(response.data).filter(Array.isArray);
        if (possibleArrays.length > 0) {
          videosList = possibleArrays[0] as VideoListItem[];
        }
      }

      console.log("Videos processados:", videosList);
      return videosList || [];
    } catch (error: any) {
      console.error("Erro ao obter vídeos:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Erro ao listar vídeos");
    }
  },

  // Deletar vídeo
  deleteVideo: async (jobId: string): Promise<void> => {
    try {
      await apiClient.delete(`/videos/${jobId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao deletar vídeo");
    }
  }
};