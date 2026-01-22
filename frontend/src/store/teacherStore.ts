/**
 * Store de profesor con Zustand.
 */

import { create } from 'zustand';
import { Grupo, AlertaEstudiante } from '@/types';

interface TeacherState {
  // Estado
  grupos: Grupo[];
  grupoSeleccionado: Grupo | null;
  alertas: AlertaEstudiante[];
  
  // Acciones
  setGrupos: (grupos: Grupo[]) => void;
  addGrupo: (grupo: Grupo) => void;
  selectGrupo: (grupoId: number) => void;
  updateGrupo: (grupoId: number, data: Partial<Grupo>) => void;
  setAlertas: (alertas: AlertaEstudiante[]) => void;
  marcarAlertaLeida: (alertaId: number) => void;
  reset: () => void;
}

export const useTeacherStore = create<TeacherState>((set, get) => ({
  // Estado inicial
  grupos: [],
  grupoSeleccionado: null,
  alertas: [],

  // Establecer lista de grupos
  setGrupos: (grupos) => {
    set({ grupos });
  },

  // Agregar nuevo grupo
  addGrupo: (grupo) => {
    set((state) => ({
      grupos: [...state.grupos, grupo],
    }));
  },

  // Seleccionar grupo por ID
  selectGrupo: (grupoId) => {
    const { grupos } = get();
    const grupo = grupos.find((g) => g.id === grupoId);
    set({ grupoSeleccionado: grupo || null });
  },

  // Actualizar datos de un grupo
  updateGrupo: (grupoId, data) => {
    set((state) => ({
      grupos: state.grupos.map((g) =>
        g.id === grupoId ? { ...g, ...data } : g
      ),
    }));
  },

  // Establecer alertas
  setAlertas: (alertas) => {
    set({ alertas });
  },

  // Marcar alerta como leída
  marcarAlertaLeida: (alertaId) => {
    set((state) => ({
      alertas: state.alertas.map((a) =>
        a.id === alertaId ? { ...a, leida: true } : a
      ),
    }));
  },

  // Limpiar estado
  reset: () => {
    set({
      grupos: [],
      grupoSeleccionado: null,
      alertas: [],
    });
  },
}));
