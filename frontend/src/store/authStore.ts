/**
 * Store de autenticación con Zustand.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Usuario, TipoUsuario } from '@/types';

interface AuthState {
  // Estado
  isAuthenticated: boolean;
  user: Usuario | null;
  token: string | null;
  nombreCompleto: string;
  codigo: string;

  // Acciones
  login: (token: string, user: Usuario, nombreCompleto: string, codigo: string) => void;
  logout: () => void;

  // Helpers
  getUserRole: () => TipoUsuario | null;
  getUserName: () => string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      isAuthenticated: false,
      user: null,
      token: null,
      nombreCompleto: '',
      codigo: '',

      // Login: guardar token, usuario y datos de presentación
      login: (token, user, nombreCompleto, codigo) => {
        set({
          isAuthenticated: true,
          token,
          user,
          nombreCompleto,
          codigo,
        });
      },

      // Logout: limpiar estado
      logout: () => {
        set({
          isAuthenticated: false,
          token: null,
          user: null,
          nombreCompleto: '',
          codigo: '',
        });
      },

      // Obtener rol del usuario
      getUserRole: () => {
        const { user } = get();
        return user?.tipo_usuario || null;
      },

      // Obtener nombre del usuario
      getUserName: () => {
        return get().nombreCompleto;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        nombreCompleto: state.nombreCompleto,
        codigo: state.codigo,
      }),
    }
  )
);
