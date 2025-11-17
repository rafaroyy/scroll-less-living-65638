import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { API_URL } from "@/config/apiConfig";

const TOKEN_COOKIE_NAME = "auth_token";

interface ApiClientConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30s default timeout
    });

    // Interceptor para adicionar token de autenticação
    this.client.interceptors.request.use((config) => {
      const skipAuth = (config as ApiClientConfig).skipAuth;

      if (skipAuth) {
        console.log("🔓 SKIP AUTH - Removendo Authorization header");
        // Remove Authorization header if skipAuth is true
        if (config.headers && "Authorization" in config.headers) {
          try {
            delete (config.headers as any).Authorization;
          } catch {
            // fallback caso seja AxiosHeaders
            if (typeof config.headers.set === "function") {
              config.headers.set("Authorization", "");
            }
          }
        }
      } else {
        // Add Authorization header with JWT token
        const token = Cookies.get(TOKEN_COOKIE_NAME);
        console.log("🔐 LENDO TOKEN DO COOKIE:", TOKEN_COOKIE_NAME);
        console.log("🔐 TOKEN ENCONTRADO:", token ? token.substring(0, 20) + "..." : "NENHUM");
        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log("✅ AUTHORIZATION HEADER ADICIONADO");
        } else if (!token) {
          console.log("❌ TOKEN NÃO ENCONTRADO NO COOKIE");
        }
      }

      console.log("🌐 API CLIENT - REQUEST INTERCEPTOR:");
      console.log("  URL:", config.baseURL + config.url);
      console.log("  MÉTODO:", config.method?.toUpperCase());
      console.log("  HEADERS:", JSON.stringify(config.headers, null, 2));
      console.log("  DATA:", config.data);

      return config;
    });

    // Interceptor para logar respostas
    this.client.interceptors.response.use(
      (response) => {
        console.log("🌐 API CLIENT - RESPONSE INTERCEPTOR (SUCCESS):");
        console.log("  STATUS:", response.status);
        console.log("  DATA:", response.data);
        return response;
      },
      (error) => {
        console.log("🌐 API CLIENT - RESPONSE INTERCEPTOR (ERROR):");
        if (error.response) {
          console.log("  STATUS:", error.response.status);
          console.log("  DATA:", error.response.data);
          console.log("  HEADERS:", error.response.headers);
        }
        return Promise.reject(error);
      },
    );
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<{ data: T }> {
    const response = await this.client.get<T>(url, config);
    return response;
  }

  async post<T = any>(url: string, data?: any, config?: ApiClientConfig): Promise<{ data: T }> {
    const response = await this.client.post<T>(url, data, config);
    return response;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<{ data: T }> {
    const response = await this.client.put<T>(url, data, config);
    return response;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<{ data: T }> {
    const response = await this.client.delete<T>(url, config);
    return response;
  }
}

export const apiClient = new ApiClient();
