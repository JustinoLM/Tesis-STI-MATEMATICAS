/**
 * Servicio de autenticación.
 * 
 * Maneja login, register, logout y gestión de tokens.
 */

import apiClient from './api';

export const authService = {
  /**
   * Inicia sesión con email y contraseña.
   */
  async login(email: string, password: string) {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await apiClient.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Guardar token en localStorage
    localStorage.setItem('access_token', response.data.access_token);
    
    return response.data;
  },

  /**
   * Registra un nuevo usuario.
   */
  async register(data: any) {
    const response = await apiClient.post('/auth/register', data);
    
    // Guardar token en localStorage
    localStorage.setItem('access_token', response.data.access_token);
    
    return response.data;
  },

  /**
   * Cierra sesión y limpia el token.
   */
  logout(): void {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  },

  /**
   * Obtiene información del usuario autenticado actual.
   */
  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  /**
   * Verifica si hay un token válido.
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },
};
