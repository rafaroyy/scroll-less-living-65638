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

export const videoService = {
  renderVideo: async (params: VideoRequest): Promise<{ started: boolean }> => {
    try {
      console.log("🎬 INICIANDO renderVideo (sem esperar resposta completa)");
      await apiClient.post("/videos/render", params);
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
        console.log("⚠️ Timeout/Cancelamento (ESPERADO) - job iniciado no backend");
        return { started: true };
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