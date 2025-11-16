import Cookies from "js-cookie";

interface LoginParams {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  username: string;
  expires_in_hours: number;
}

interface SessionResponse {
  success: boolean;
  message: string;
  sessionData?: LoginResponse;
}

const TOKEN_COOKIE_NAME = "auth_token";
const USER_INFO_KEY = "user_info";

export const authService = {
  login: async ({ email, password }: LoginParams): Promise<SessionResponse> => {
    // Mock login - aceita qualquer email/senha
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Gerar token mockado
      const mockToken = `mock_token_${Date.now()}`;
      const mockUserId = Math.floor(Math.random() * 10000);
      const mockUsername = email.split('@')[0];
      
      // Store token in cookie (expires in 24 hours)
      Cookies.set(TOKEN_COOKIE_NAME, mockToken, {
        expires: 1, // 1 day
        secure: false, // Changed to false for local development
        sameSite: 'lax' // Changed to lax for better compatibility
      });

      // Store user info in localStorage
      const userInfo = {
        user_id: mockUserId,
        username: mockUsername,
      };
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));

      // Verify data was saved immediately
      const savedToken = Cookies.get(TOKEN_COOKIE_NAME);
      const savedUserInfo = localStorage.getItem(USER_INFO_KEY);
      
      console.log("AUTH DEBUG - Login:", {
        tokenSaved: !!savedToken,
        userInfoSaved: !!savedUserInfo,
        isAuthenticatedNow: authService.isAuthenticated()
      });

      return {
        success: true,
        message: "Login realizado com sucesso",
        sessionData: {
          access_token: mockToken,
          token_type: "Bearer",
          user_id: mockUserId,
          username: mockUsername,
          expires_in_hours: 24,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Erro ao fazer login",
      };
    }
  },

  logout: async (): Promise<SessionResponse> => {
    try {
      // Remove token from cookie
      Cookies.remove(TOKEN_COOKIE_NAME);
      localStorage.removeItem(USER_INFO_KEY);
      
      return {
        success: true,
        message: "Logout successful",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred during logout",
      };
    }
  },

  getSession: async (): Promise<SessionResponse> => {
    try {
      const token = Cookies.get(TOKEN_COOKIE_NAME);
      const userInfo = localStorage.getItem(USER_INFO_KEY);
      
      if (!token || !userInfo) {
        return {
          success: false,
          message: "Nenhuma sessão encontrada",
        };
      }

      const userData = JSON.parse(userInfo);
      
      return {
        success: true,
        message: "Sessão recuperada com sucesso",
        sessionData: {
          access_token: token,
          token_type: "Bearer",
          user_id: userData.user_id,
          username: userData.username,
          expires_in_hours: 24,
        },
      };
    } catch (error: any) {
      // If token is invalid, clear it
      Cookies.remove(TOKEN_COOKIE_NAME);
      localStorage.removeItem(USER_INFO_KEY);
      
      return {
        success: false,
        message: "Falha ao recuperar sessão",
      };
    }
  },

  isAuthenticated: (): boolean => {
    const token = Cookies.get(TOKEN_COOKIE_NAME);
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    const hasToken = !!token;
    const hasUserInfo = !!userInfo;
    const isAuth = hasToken && hasUserInfo;
    
    console.log("AUTH DEBUG - isAuthenticated:", {
      hasToken,
      hasUserInfo,
      isAuth,
      token: token?.substring(0, 20) + "...",
      userInfo: userInfo?.substring(0, 50) + "..."
    });
    
    // Ambos devem existir para considerar autenticado
    return isAuth;
  },

  getToken: (): string | undefined => {
    return Cookies.get(TOKEN_COOKIE_NAME);
  },

  getUserInfo: () => {
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  }
};
