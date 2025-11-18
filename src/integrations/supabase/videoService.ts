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
  // Criar um novo vídeo
  renderVideo: async (params: VideoRequest): Promise<JobResponse> => {
    console.log("═══════════════════════════════════════════════════════");
    console.log("🎬 VIDEO SERVICE - INICIANDO RENDER VIDEO");
    console.log("═══════════════════════════════════════════════════════");
    console.log("📍 URL BASE:", API_URL);
    console.log("📍 ENDPOINT:", "/videos/render");
    console.log("📍 URL COMPLETA:", `${API_URL}/videos/render`);
    console.log("📍 MÉTODO:", "POST");
    console.log("📦 PAYLOAD ENVIADO:", JSON.stringify(params, null, 2));
    console.log("═══════════════════════════════════════════════════════");
    
    try {
      const response = await apiClient.post<JobResponse>("/videos/render", params);
      
      console.log("═══════════════════════════════════════════════════════");
      console.log("✅ VIDEO SERVICE - RESPOSTA SUCESSO");
      console.log("═══════════════════════════════════════════════════════");
      console.log("📦 RESPONSE COMPLETO:", JSON.stringify(response, null, 2));
      console.log("📦 RESPONSE DATA:", JSON.stringify(response.data, null, 2));
      console.log("🔍 TIPO DE response.data:", typeof response.data);
      console.log("🔍 É OBJETO?", response.data !== null && typeof response.data === 'object');
      console.log("═══════════════════════════════════════════════════════");
      
      // Valida se o response.data existe e tem job_id
      if (!response.data) {
        console.error("❌ response.data é null ou undefined");
        throw new Error("Resposta da API inválida: response.data está vazio");
      }
      
      const jobData = response.data;
      console.log("🔍 VERIFICANDO job_id:");
      console.log("  - jobData.job_id:", jobData.job_id);
      console.log("  - Tipo:", typeof jobData.job_id);
      
      if (!jobData.job_id) {
        console.error("❌ job_id não encontrado em response.data");
        console.error("📦 Estrutura recebida:", Object.keys(jobData));
        throw new Error("job_id não retornado pela API");
      }
      
      console.log("✅ job_id VALIDADO:", jobData.job_id);
      console.log("✅ RETORNANDO:", JSON.stringify(jobData, null, 2));
      
      return jobData;
    } catch (error: any) {
      console.log("═══════════════════════════════════════════════════════");
      console.log("❌ VIDEO SERVICE - ERRO NA REQUISIÇÃO");
      console.log("═══════════════════════════════════════════════════════");
      console.log("🔴 ERRO TIPO:", error.name);
      console.log("🔴 ERRO CÓDIGO:", error.code);
      console.log("🔴 ERRO MENSAGEM:", error.message);
      
      if (error.response) {
        console.log("📊 RESPONSE STATUS:", error.response.status);
        console.log("📊 RESPONSE STATUS TEXT:", error.response.statusText);
        console.log("📦 RESPONSE DATA (ERRO):", JSON.stringify(error.response.data, null, 2));
        console.log("📋 RESPONSE HEADERS:", error.response.headers);
      } else if (error.request) {
        console.log("📡 REQUEST FEITO MAS SEM RESPOSTA");
        console.log("📡 REQUEST:", error.request);
      } else {
        console.log("🔧 ERRO NA CONFIGURAÇÃO:", error.message);
      }
      
      console.log("🔍 ERRO COMPLETO:", error);
      console.log("═══════════════════════════════════════════════════════");
      
      if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
        throw new Error("Tempo limite excedido. O servidor pode estar ocupado.");
      }
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

  // Baixar vídeo
  downloadVideo: async (jobId: string): Promise<Blob> => {
    try {
      const response = await apiClient.get(`/videos/download/${jobId}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
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