/**
 * Configuração central da API
 * Todas as requisições devem usar esta URL
 */
export const API_URL = "http://178.156.217.149:8443";

// Logs para debug (remover em produção se necessário)
console.log("API Configuration:", {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_URL,
  mode: import.meta.env.MODE,
});
