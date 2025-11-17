import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { videoService } from "@/integrations/supabase/videoService";

interface VideoJob {
  job_id: string;
  status: string;
  progress: number | null;
  message: string | null;
  created_at: string;
  updated_at?: string;
}

interface VideoContextType {
  videos: VideoJob[];
  loading: boolean;
  reloadVideos: () => Promise<void>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: ReactNode }) {
  const [videos, setVideos] = useState<VideoJob[]>([]);
  const [loading, setLoading] = useState(true);

  const reloadVideos = async () => {
    setLoading(true);
    try {
      const videosData = await videoService.listVideos();

      if (!Array.isArray(videosData)) {
        console.error("Os vídeos retornados do backend não são um array:", videosData);
        setVideos([]);
        return;
      }

      const detailedJobs = await Promise.all(
        videosData.map(async (video) => {
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

      setVideos(detailedJobs);
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      reloadVideos();
    }, 150);
  }, []);

  return (
    <VideoContext.Provider value={{ videos, loading, reloadVideos }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideoContext() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error("useVideoContext must be used within a VideoProvider");
  }
  return context;
}
