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
        error.code === "ERR_NETWORK" ||
        error.code === "ETIMEDOUT" ||
        error.code === "ECONNRESET" ||
        error.name === "AbortError" ||
        error.name === "TimeoutError" ||
        error.message === "canceled" ||
        error.message?.toLowerCase().includes("cancel") ||
        error.message?.toLowerCase().includes("timeout") ||
        error.message?.toLowerCase().includes("aborted") ||
        error.message?.toLowerCase().includes("network") ||
        error.message?.toLowerCase().includes("connect") ||
        !error.response; // Sem resposta do servidor = problema de rede

      if (isTimeout) {
        console.log("⚠️ Timeout/Cancelamento/Rede (ESPERADO) - job iniciado no backend");
        return { started: true };
      }

      // Apenas erros HTTP reais (4xx, 5xx com resposta do servidor)
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
      // ⚠️ NÃO lançar erro - retornar dados parciais para não quebrar UI
      console.log("⚠️ Falha momentânea ao buscar status do job", jobId, error);
      return {
        job_id: jobId,
        status: "processing",
        progress: null,
        message: "Verificando status...",
        result: null,
        error: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
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
      // ⚠️ NÃO lançar erro - retornar lista vazia para não quebrar UI
      console.log("⚠️ Falha momentânea ao listar vídeos (normal durante render):", error);
      return [];
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