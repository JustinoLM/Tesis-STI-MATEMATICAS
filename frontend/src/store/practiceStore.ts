/**
 * Store de práctica con Zustand.
 */

import { create } from 'zustand';
import { SesionPractica, Problema } from '@/types';

interface PracticeState {
  // Estado
  sesionActiva: SesionPractica | null;
  problemas: Problema[];
  problemaActual: Problema | null;
  indiceActual: number;
  tiempoInicio: number | null;
  
  // Acciones
  iniciarSesion: (sesion: SesionPractica, problemas: Problema[]) => void;
  siguienteProblema: () => void;
  registrarRespuesta: (esCorrecta: boolean) => void;
  finalizarSesion: () => void;
  pausarSesion: () => void;
  reanudarSesion: () => void;
  reset: () => void;
  
  // Getters
  getProgreso: () => number;
  getTiempoTranscurrido: () => number;
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  // Estado inicial
  sesionActiva: null,
  problemas: [],
  problemaActual: null,
  indiceActual: 0,
  tiempoInicio: null,

  // Iniciar nueva sesión
  iniciarSesion: (sesion, problemas) => {
    set({
      sesionActiva: sesion,
      problemas,
      problemaActual: problemas[0] || null,
      indiceActual: 0,
      tiempoInicio: Date.now(),
    });
  },

  // Avanzar al siguiente problema
  siguienteProblema: () => {
    const { problemas, indiceActual } = get();
    const nuevoIndice = indiceActual + 1;
    
    if (nuevoIndice < problemas.length) {
      set({
        indiceActual: nuevoIndice,
        problemaActual: problemas[nuevoIndice],
        tiempoInicio: Date.now(),
      });
    } else {
      // No hay más problemas, finalizar sesión
      get().finalizarSesion();
    }
  },

  // Registrar respuesta correcta/incorrecta
  registrarRespuesta: (esCorrecta) => {
    set((state) => {
      if (!state.sesionActiva) return state;
      
      return {
        sesionActiva: {
          ...state.sesionActiva,
          progreso_actual: state.sesionActiva.progreso_actual + 1,
          problemas_correctos: esCorrecta
            ? state.sesionActiva.problemas_correctos + 1
            : state.sesionActiva.problemas_correctos,
          problemas_incorrectos: !esCorrecta
            ? state.sesionActiva.problemas_incorrectos + 1
            : state.sesionActiva.problemas_incorrectos,
        },
      };
    });
  },

  // Finalizar sesión
  finalizarSesion: () => {
    set((state) => ({
      sesionActiva: state.sesionActiva
        ? { ...state.sesionActiva, estado: 'completada' }
        : null,
      problemaActual: null,
      tiempoInicio: null,
    }));
  },

  // Pausar sesión
  pausarSesion: () => {
    set((state) => ({
      sesionActiva: state.sesionActiva
        ? { ...state.sesionActiva, estado: 'pausada' }
        : null,
      tiempoInicio: null,
    }));
  },

  // Reanudar sesión
  reanudarSesion: () => {
    set((state) => ({
      sesionActiva: state.sesionActiva
        ? { ...state.sesionActiva, estado: 'en_progreso' }
        : null,
      tiempoInicio: Date.now(),
    }));
  },

  // Limpiar estado
  reset: () => {
    set({
      sesionActiva: null,
      problemas: [],
      problemaActual: null,
      indiceActual: 0,
      tiempoInicio: null,
    });
  },

  // Calcular progreso actual (%)
  getProgreso: () => {
    const { sesionActiva } = get();
    if (!sesionActiva) return 0;
    
    return Math.round(
      (sesionActiva.progreso_actual / sesionActiva.cantidad_problemas) * 100
    );
  },

  // Calcular tiempo transcurrido (segundos)
  getTiempoTranscurrido: () => {
    const { tiempoInicio } = get();
    if (!tiempoInicio) return 0;
    
    return Math.floor((Date.now() - tiempoInicio) / 1000);
  },
}));
