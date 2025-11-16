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
    const API_URL = import.meta.env.VITE_API_URL || "https://www.viralizeia.com";
    const loginURL = `${API_URL}/api/login`;
    const payload = { email, password };
    
    console.log("═══════════════════════════════════════════════════════");
    console.log("🔐 AUTH SERVICE - INICIANDO LOGIN");
    console.log("═══════════════════════════════════════════════════════");
    console.log("📍 URL BASE:", API_URL);
    console.log("📍 ENDPOINT:", "/api/login");
    console.log("📍 URL COMPLETA:", loginURL);
    console.log("📍 MÉTODO:", "POST");
    console.log("📦 PAYLOAD:", JSON.stringify(payload, null, 2));
    console.log("🌐 ORIGEM (window.location.origin):", window.location.origin);
    console.log("🌐 PROTOCOLO:", window.location.protocol);
    console.log("═══════════════════════════════════════════════════════");
    
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      const fetchOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
        mode: 'cors' as RequestMode,
        credentials: 'include' as RequestCredentials,
      };
      
      console.log("📋 HEADERS ENVIADOS:", JSON.stringify(headers, null, 2));
      console.log("⚙️ FETCH OPTIONS:", JSON.stringify({
        ...fetchOptions,
        body: payload
      }, null, 2));
      console.log("═══════════════════════════════════════════════════════");
      console.log("🚀 EXECUTANDO FETCH...");
      
      const response = await fetch(loginURL, fetchOptions);
      
      console.log("═══════════════════════════════════════════════════════");
      console.log("📨 RESPOSTA RECEBIDA");
      console.log("═══════════════════════════════════════════════════════");
      console.log("📊 STATUS:", response.status);
      console.log("📊 STATUS TEXT:", response.statusText);
      console.log("📊 OK:", response.ok);
      console.log("📊 TYPE:", response.type);
      console.log("📊 URL:", response.url);
      console.log("📋 HEADERS:", Object.fromEntries(response.headers.entries()));
      console.log("═══════════════════════════════════════════════════════");

      if (!response.ok) {
        let errorData;
        const contentType = response.headers.get('content-type');
        
        console.log("❌ RESPOSTA NÃO OK - Content-Type:", contentType);
        
        try {
          const text = await response.text();
          console.log("📦 RESPONSE TEXT:", text);
          errorData = JSON.parse(text);
          console.log("📦 RESPONSE DATA (parsed):", JSON.stringify(errorData, null, 2));
        } catch (parseError) {
          console.log("⚠️ ERRO AO PARSEAR JSON:", parseError);
          errorData = {};
        }
        
        throw new Error(errorData.detail || errorData.message || 'Erro ao fazer login');
      }

      const responseText = await response.text();
      console.log("📦 RESPONSE TEXT (SUCCESS):", responseText);
      
      const data: LoginResponse = JSON.parse(responseText);
      console.log("📦 RESPONSE DATA (SUCCESS):", JSON.stringify(data, null, 2));
      
      // Store token in cookie (expires in 24 hours)
      Cookies.set(TOKEN_COOKIE_NAME, data.access_token, {
        expires: 1, // 1 day
        secure: window.location.protocol === 'https:',
        sameSite: 'lax'
      });

      // Store user info in localStorage
      const userInfo = {
        user_id: data.user_id,
        username: data.username,
      };
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));

      console.log("✅ AUTH DEBUG - Login sucesso:", {
        tokenSaved: !!Cookies.get(TOKEN_COOKIE_NAME),
        userInfoSaved: !!localStorage.getItem(USER_INFO_KEY),
        isAuthenticatedNow: authService.isAuthenticated()
      });
      console.log("═══════════════════════════════════════════════════════");

      return {
        success: true,
        message: "Login realizado com sucesso",
        sessionData: data,
      };
    } catch (error: any) {
      console.log("═══════════════════════════════════════════════════════");
      console.log("❌ AUTH SERVICE - ERRO NO LOGIN");
      console.log("═══════════════════════════════════════════════════════");
      console.log("🔴 ERRO TIPO:", error.constructor.name);
      console.log("🔴 ERRO MENSAGEM:", error.message);
      console.log("🔴 ERRO STACK:", error.stack);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.log("🔴 TIPO DE ERRO: Network/CORS/Fetch failure");
        console.log("🔴 POSSÍVEIS CAUSAS:");
        console.log("   1. Backend offline");
        console.log("   2. CORS bloqueado");
        console.log("   3. SSL/Certificate issue");
        console.log("   4. Network timeout");
        console.log("   5. URL incorreta");
      }
      
      console.log("🔍 ERRO COMPLETO:", error);
      console.log("═══════════════════════════════════════════════════════");
      
      return {
        success: false,
        message: error.message || "Erro ao fazer login",
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
