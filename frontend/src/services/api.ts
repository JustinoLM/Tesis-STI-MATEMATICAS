/**
 * Cliente HTTP centralizado con Axios.
 * 
 * Configura interceptores para:
 * - Agregar token JWT automáticamente
 * - Manejo de errores global
 */

import axios, { AxiosError } from 'axios';

// URL base de la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Crear instancia de Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request: Agregar token JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response: Manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Token inválido o expirado
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

// Helper para extraer mensajes de error
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.detail || error.message || 'Error desconocido';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Error desconocido';
};
