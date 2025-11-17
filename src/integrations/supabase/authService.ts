import Cookies from "js-cookie";
import { apiClient } from "./apiClient";

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

const TOKEN_COOKIE_NAME = "auth_token";
const USER_INFO_KEY = "user_info";

export const authService = {
  login: async ({ email, password }: LoginParams) => {
    console.log("🔐 LOGIN VIA AXIOS");

    const payload = { email, password };

    try {
      const res = await apiClient.post<LoginResponse>("/auth/login", payload, {
        skipAuth: true, // ❗ VERY IMPORTANT
      });

      const data = res.data;

      // Salva token com nome padronizado
      Cookies.set(TOKEN_COOKIE_NAME, data.access_token, {
        expires: 1,
        secure: true,
        sameSite: "lax",
      });
      
      console.log("✅ TOKEN SALVO NO COOKIE:", TOKEN_COOKIE_NAME);
      console.log("✅ TOKEN VALUE:", data.access_token.substring(0, 20) + "...");

      // Salva user info
      localStorage.setItem(
        USER_INFO_KEY,
        JSON.stringify({
          user_id: data.user_id,
          username: data.username,
        }),
      );

      console.log("✅ LOGIN OK:", data);

      return {
        success: true,
        message: "Login realizado com sucesso",
        sessionData: data,
      };
    } catch (err: any) {
      console.log("❌ ERRO AO LOGAR:", err);
      return {
        success: false,
        message: err?.response?.data?.detail || "Erro ao fazer login",
      };
    }
  },

  getToken: () => {
    return Cookies.get(TOKEN_COOKIE_NAME) || null;
  },

  getUserInfo: () => {
    const info = localStorage.getItem(USER_INFO_KEY);
    return info ? JSON.parse(info) : null;
  },

  isAuthenticated: () => {
    const token = Cookies.get(TOKEN_COOKIE_NAME);
    const info = localStorage.getItem(USER_INFO_KEY);
    return !!token && !!info;
  },

  logout: () => {
    Cookies.remove(TOKEN_COOKIE_NAME);
    localStorage.removeItem(USER_INFO_KEY);
  },
};
