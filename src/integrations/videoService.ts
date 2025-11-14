// Video service usando apenas localStorage

interface VideoRequest {
  objetivo: string;
  tema: string;
  nicho: string;
  palavra_chave_global: string;
  idioma: string;
  duracao: number;
  cenas: number;
  aspect_ratio: string;
}

interface JobResponse {
  job_id: string;
  status: string;
  message: string;
}

interface JobStatusResponse {
  job_id: string;
  status: string;
  progress: number | null;
  message: string | null;
  created_at: string;
  updated_at?: string;
}

interface VideoListItem {
  job_id: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

const STORAGE_KEY = "viralize_videos";

// Helper para obter todos os vídeos do localStorage
const getVideosFromStorage = (): JobStatusResponse[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Helper para salvar vídeos no localStorage
const saveVideosToStorage = (videos: JobStatusResponse[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
};

export const videoService = {
  // Simula criação de vídeo
  renderVideo: async (params: VideoRequest): Promise<JobResponse> => {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newVideo: JobStatusResponse = {
      job_id: jobId,
      status: "pending",
      progress: 0,
      message: "Vídeo criado com sucesso",
      created_at: new Date().toISOString(),
    };

    const videos = getVideosFromStorage();
    videos.unshift(newVideo);
    saveVideosToStorage(videos);

    // Simula processamento em background
    setTimeout(() => {
      const vids = getVideosFromStorage();
      const video = vids.find(v => v.job_id === jobId);
      if (video) {
        video.status = "processing";
        video.progress = 50;
        video.message = "Processando vídeo...";
        video.updated_at = new Date().toISOString();
        saveVideosToStorage(vids);
      }
    }, 2000);

    setTimeout(() => {
      const vids = getVideosFromStorage();
      const video = vids.find(v => v.job_id === jobId);
      if (video) {
        video.status = "completed";
        video.progress = 100;
        video.message = "Vídeo concluído";
        video.updated_at = new Date().toISOString();
        saveVideosToStorage(vids);
      }
    }, 5000);

    return {
      job_id: jobId,
      status: "pending",
      message: "Vídeo criado com sucesso",
    };
  },

  // Obtém status de um job
  getJobStatus: async (jobId: string): Promise<JobStatusResponse> => {
    const videos = getVideosFromStorage();
    const video = videos.find(v => v.job_id === jobId);

    if (!video) {
      throw new Error("Vídeo não encontrado");
    }

    return video;
  },

  // Lista todos os vídeos do usuário
  listVideos: async (skip = 0, limit = 50): Promise<VideoListItem[]> => {
    const videos = getVideosFromStorage();
    return videos.slice(skip, skip + limit).map(v => ({
      job_id: v.job_id,
      status: v.status,
      created_at: v.created_at,
      updated_at: v.updated_at,
    }));
  },

  // Simula download (retorna blob vazio)
  downloadVideo: async (jobId: string): Promise<Blob> => {
    const videos = getVideosFromStorage();
    const video = videos.find(v => v.job_id === jobId);

    if (!video) {
      throw new Error("Vídeo não encontrado");
    }

    if (video.status !== "completed") {
      throw new Error("Vídeo ainda não está completo");
    }

    // Retorna um blob vazio para simular download
    return new Blob([""], { type: "video/mp4" });
  },

  // Deleta um vídeo
  deleteVideo: async (jobId: string): Promise<void> => {
    const videos = getVideosFromStorage();
    const filtered = videos.filter(v => v.job_id !== jobId);
    saveVideosToStorage(filtered);
  },
};
