/**
 * Servicio de autenticación.
 */

import apiClient, { getErrorMessage } from './api';
import { LoginRequest, TokenResponse } from '@/types';

export const authService = {
  /**
   * Login con código y contraseña.
   */
  async login(credentials: LoginRequest): Promise<TokenResponse> {
    try {
      const response = await apiClient.post<TokenResponse>('/auth/login', credentials);
      
      // Guardar token en localStorage
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Logout: limpiar token.
   */
  logout(): void {
    localStorage.removeItem('access_token');
  },

  /**
   * Verificar si hay token válido.
   */
  hasValidToken(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  },

  /**
   * Obtener token actual.
   */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  },
};
