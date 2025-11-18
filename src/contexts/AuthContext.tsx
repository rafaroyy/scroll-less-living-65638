import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService } from "@/integrations/supabase/authService";
import { videoService } from "@/integrations/supabase/videoService";

interface AuthContextType {
  isAuthenticated: boolean;
  authReady: boolean;
  token: string | null;
  userInfo: any | null;
  videos: any[];
  processingVideos: any[];
  reloadVideos: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authReady, setAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [processingVideos, setProcessingVideos] = useState<any[]>([]);

  const reloadVideos = async () => {
    try {
      const list = await videoService.listVideos();
      
      const completed = list.filter((v: any) => v.status === "completed");
      const processing = list.filter((v: any) => v.status !== "completed");
      
      setVideos(completed);
      setProcessingVideos(processing);
    } catch (error) {
      console.error("Error loading videos:", error);
    }
  };

  useEffect(() => {
    console.log("AUTH CONTEXT - Initializing...");
    
    // Load auth state from storage
    const loadAuthState = async () => {
      const storedToken = authService.getToken();
      const storedUserInfo = authService.getUserInfo();
      
      console.log("AUTH CONTEXT - Loaded from storage:", {
        hasToken: !!storedToken,
        hasUserInfo: !!storedUserInfo,
        userInfo: storedUserInfo
      });

      if (storedToken && storedUserInfo) {
        setToken(storedToken);
        setUserInfo(storedUserInfo);
        setIsAuthenticated(true);
        
        // Load videos after authentication is confirmed
        await reloadVideos();
      }
      
      setAuthReady(true);
      console.log("AUTH CONTEXT - Ready:", { isAuthenticated: !!(storedToken && storedUserInfo) });
    };

    loadAuthState();
  }, []);

  const login = async (email: string, password: string) => {
    console.log("AUTH CONTEXT - Login attempt");
    
    const result = await authService.login({ email, password });
    
    if (result.success && result.sessionData) {
      const newToken = result.sessionData.access_token;
      const newUserInfo = {
        user_id: result.sessionData.user_id,
        username: result.sessionData.username,
        email: email
      };

      console.log("AUTH CONTEXT - Login successful, updating state:", {
        token: newToken,
        userInfo: newUserInfo
      });

      setToken(newToken);
      setUserInfo(newUserInfo);
      setIsAuthenticated(true);
      
      return { success: true, message: result.message };
    }

    return { success: false, message: result.message };
  };

  const logout = async () => {
    console.log("AUTH CONTEXT - Logout");
    await authService.logout();
    setToken(null);
    setUserInfo(null);
    setIsAuthenticated(false);
  };

  console.log("AUTH CONTEXT - Current state:", { authReady, isAuthenticated, hasToken: !!token, hasUserInfo: !!userInfo });

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      authReady, 
      token, 
      userInfo, 
      videos, 
      processingVideos, 
      reloadVideos,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
