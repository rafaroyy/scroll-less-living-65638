
import { apiClient } from "@/integrations/supabase/client";
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
    try {
      const response = await apiClient.post<LoginResponse>(
        "/auth/login",
        { email, password },
        { skipAuth: true }
      );
      
      // Store token in cookie (expires in hours returned by API)
      Cookies.set(TOKEN_COOKIE_NAME, response.data.access_token, {
        expires: response.data.expires_in_hours / 24, // Convert hours to days
        secure: true, // Only send over HTTPS in production
        sameSite: 'strict'
      });

      // Store user info in localStorage
      localStorage.setItem(USER_INFO_KEY, JSON.stringify({
        user_id: response.data.user_id,
        username: response.data.username,
      }));

      return {
        success: true,
        message: "Login successful",
        sessionData: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred during login",
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
      
      if (!token) {
        return {
          success: false,
          message: "No session found",
        };
      }

      const response = await apiClient.get("/auth/me");
      
      return {
        success: true,
        message: "Session fetched successfully",
        sessionData: response.data,
      };
    } catch (error: any) {
      // If token is invalid, clear it
      Cookies.remove(TOKEN_COOKIE_NAME);
      localStorage.removeItem(USER_INFO_KEY);
      
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch session",
      };
    }
  },

  isAuthenticated: (): boolean => {
    return !!Cookies.get(TOKEN_COOKIE_NAME);
  },

  getToken: (): string | undefined => {
    return Cookies.get(TOKEN_COOKIE_NAME);
  },

  getUserInfo: () => {
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  }
};
