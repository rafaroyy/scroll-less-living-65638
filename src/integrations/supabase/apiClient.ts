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
      
      if (!skipAuth) {
        const token = Cookies.get(TOKEN_COOKIE_NAME);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      
      return config;
    });
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
