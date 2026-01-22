/**
 * Store de estudiante con Zustand.
 */

import { create } from 'zustand';
import { PerfilEstudiante } from '@/types';

interface StudentState {
  // Estado
  perfil: PerfilEstudiante | null;
  puntosTotales: number;
  narrativaId: number | null;
  
  // Acciones
  setPerfil: (perfil: PerfilEstudiante) => void;
  updatePuntos: (cantidad: number) => void;
  setNarrativa: (narrativaId: number) => void;
  reset: () => void;
}

export const useStudentStore = create<StudentState>((set) => ({
  // Estado inicial
  perfil: null,
  puntosTotales: 0,
  narrativaId: null,

  // Actualizar perfil completo
  setPerfil: (perfil) => {
    set({ perfil });
  },

  // Actualizar puntos (sumar o restar)
  updatePuntos: (cantidad) => {
    set((state) => ({
      puntosTotales: state.puntosTotales + cantidad,
    }));
  },

  // Cambiar narrativa seleccionada
  setNarrativa: (narrativaId) => {
    set({ narrativaId });
  },

  // Limpiar estado (al logout)
  reset: () => {
    set({
      perfil: null,
      puntosTotales: 0,
      narrativaId: null,
    });
  },
}));
