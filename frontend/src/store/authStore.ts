/**
 * Store de autenticación con Zustand.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Estudiante, Profesor, TipoUsuario } from '@/types';

interface AuthState {
  // Estado
  isAuthenticated: boolean;
  user: Estudiante | Profesor | null;
  token: string | null;
  
  // Acciones
  login: (token: string, user: Estudiante | Profesor) => void;
  logout: () => void;
  updateUser: (user: Estudiante | Profesor) => void;
  
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

      // Login: guardar token y usuario
      login: (token, user) => {
        set({
          isAuthenticated: true,
          token,
          user,
        });
      },

      // Logout: limpiar estado
      logout: () => {
        set({
          isAuthenticated: false,
          token: null,
          user: null,
        });
      },

      // Actualizar usuario (ej: después de editar perfil)
      updateUser: (user) => {
        set({ user });
      },

      // Obtener rol del usuario
      getUserRole: () => {
        const { user } = get();
        return user?.tipo_usuario || null;
      },

      // Obtener nombre del usuario
      getUserName: () => {
        const { user } = get();
        if (!user) return '';
        
        if (user.tipo_usuario === 'estudiante') {
          return (user as Estudiante).nombre_completo;
        } else {
          return (user as Profesor).nombre_completo;
        }
      },
    }),
    {
      name: 'auth-storage', // nombre en localStorage
      partialize: (state) => ({
        // Solo persistir estos campos
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
);
