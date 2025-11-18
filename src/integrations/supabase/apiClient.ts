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
      timeout: 0,
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
        // Read token from localStorage first, then cookie
        const lsToken = typeof window !== "undefined" 
          ? window.localStorage.getItem("auth_token")
          : null;
        const cookieToken = Cookies.get(TOKEN_COOKIE_NAME);
        const token = lsToken || cookieToken;
        
        console.log("🔐 LENDO TOKEN:");
        console.log("  - localStorage:", lsToken ? lsToken.substring(0, 20) + "..." : "NENHUM");
        console.log("  - cookie:", cookieToken ? cookieToken.substring(0, 20) + "..." : "NENHUM");
        console.log("  - token usado:", token ? token.substring(0, 20) + "..." : "NENHUM");
        
        if (token) {
          if (!config.headers) {
            config.headers = {} as any;
          }
          (config.headers as any).Authorization = `Bearer ${token}`;
          console.log("✅ AUTHORIZATION HEADER ADICIONADO:", `Bearer ${token.substring(0, 20)}...`);
        } else {
          console.log("❌ TOKEN NÃO ENCONTRADO EM LOCALSTORAGE NEM COOKIE");
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
        console.log("═══════════════════════════════════════════════════════");
        console.log("🌐 API CLIENT - RESPONSE INTERCEPTOR (SUCCESS)");
        console.log("═══════════════════════════════════════════════════════");
        console.log("📍 URL:", response.config.url);
        console.log("📊 STATUS:", response.status);
        console.log("📊 STATUS TEXT:", response.statusText);
        console.log("📦 RESPONSE.DATA COMPLETO:", JSON.stringify(response.data, null, 2));
        console.log("🔍 TIPO response.data:", typeof response.data);
        console.log("🔍 É OBJETO?", response.data !== null && typeof response.data === 'object');
        
        if (response.data && typeof response.data === 'object') {
          console.log("🔍 KEYS de response.data:", Object.keys(response.data));
        }
        console.log("═══════════════════════════════════════════════════════");
        return response;
      },
      (error) => {
        console.log("═══════════════════════════════════════════════════════");
        console.log("🌐 API CLIENT - RESPONSE INTERCEPTOR (ERROR)");
        console.log("═══════════════════════════════════════════════════════");
        
        // Detectar timeout/cancelamento UNIVERSAL
        const isTimeout = 
          error.code === "ERR_CANCELED" ||
          error.code === "ECONNABORTED" ||
          error.code === "ERR_NETWORK" ||
          error.name === "AbortError" ||
          error.message === "canceled" ||
          error.message?.includes("cancel") ||
          error.message?.includes("timeout") ||
          error.message?.includes("aborted") ||
          error.message?.includes("Network Error");

        if (isTimeout) {
          console.log("⚠️ TIMEOUT/CANCELAMENTO DETECTADO (ESPERADO) - neutralizando erro");
          console.log("📍 URL:", error.config?.url);
          console.log("🔴 ERROR CODE:", error.code);
          console.log("🔴 ERROR MESSAGE:", error.message);
          
          // Marcar erro como "esperado" para que serviços possam tratá-lo
          error.isTimeout = true;
          error.isSanitized = true;
          console.log("═══════════════════════════════════════════════════════");
          return Promise.reject(error);
        }
        
        if (error.response) {
          console.log("📊 STATUS:", error.response.status);
          console.log("📊 STATUS TEXT:", error.response.statusText);
          console.log("📦 ERROR DATA:", JSON.stringify(error.response.data, null, 2));
          console.log("📋 HEADERS:", error.response.headers);
        } else if (error.request) {
          console.log("📡 REQUEST FEITO MAS SEM RESPOSTA");
          console.log("🔴 ERROR CODE:", error.code);
          console.log("🔴 ERROR MESSAGE:", error.message);
        } else {
          console.log("🔧 ERRO NA CONFIGURAÇÃO:", error.message);
        }
        console.log("═══════════════════════════════════════════════════════");
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
