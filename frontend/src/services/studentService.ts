/**
 * Servicio del estudiante — práctica, gamificación, pistas.
 */

import apiClient, { getErrorMessage } from './api';
import type { PerfilEstudiante, DesafioEstudiante } from '@/types';

// ─── Tipos de práctica ────────────────────────────────────────────────────────

export interface ProblemaBE {
  id: number;
  operacion: string;
  numero1: string | number;
  numero2: string | number;
  resultado?: string | number; // El backend NO lo envía al iniciar, pero lo tipamos por si acaso
  nivel_dificultad: number;
  cantidad_decimales: number;
  pregunta?: string;
}

export interface SesionStartResponse {
  sesion_id: number;
  cantidad_problemas: number;
  operaciones_incluidas: Record<string, number>;
  nivel_actual: number;
  problemas: ProblemaBE[];
  mensaje_intro: string;
}

export interface SubmitProblemResponse {
  es_correcto: boolean;
  respuesta_correcta: string | null;
  intentos_restantes: number;
  mensaje: string;
  siguiente_problema: {
    sesion_id: number;
    problema_numero: number;
    total_problemas: number;
    problema: ProblemaBE;
    intentos_restantes: number;
    es_ultimo: boolean;
  } | null;
  sesion_completada: boolean;
}

// ─── Tipos de respuesta ──────────────────────────────────────────────────────

export interface SaldoPuntosResponse {
  estudiante_id: number;
  puntos_totales: number;
}

export interface ItemPoseido {
  id: number;
  categoria: string;
  nombre: string;
  descripcion: string | null;
  precio_puntos: number;
  nivel_minimo_requerido: number;
  archivo_referencia: string | null;
  poseido: boolean;
  es_tema_inicial: boolean;
  orden: number;
}

export interface PersonalizacionRequest {
  tema_activo_id?: number | null;
  fondo_activo_id?: number | null;
  musica_activa_id?: number | null;
  color_fondo?: string | null;
  color_texto?: string | null;
  color_botones?: string | null;
}

export interface PersonalizacionResponse {
  estudiante_id: number;
  tema_activo_id: number | null;
  fondo_activo_id: number | null;
  musica_activa_id: number | null;
  tema_activo_nombre: string | null;
  fondo_activo_nombre: string | null;
  musica_activa_nombre: string | null;
  color_fondo: string;
  color_texto: string;
  color_botones: string;
  efectos_activos: number[];
}

export interface ComprarItemResponse {
  exito: boolean;
  mensaje: string;
  item_comprado: ItemPoseido | null;
  puntos_gastados: number;
  saldo_nuevo: number;
}

export interface MedallaItem {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  imagen_url: string | null;  // Ahora contiene el emoji directamente
  es_secreta: boolean;
  obtenida: boolean;
  fecha_obtencion: string | null;
  orden: number;
}

export interface MedallasResponse {
  total_medallas: number;
  medallas_obtenidas: number;
  medallas: MedallaItem[];
  medalla_destacada_id: number | null;
}

export interface RecompensasSesionResponse {
  sesion_id: number;
  puntos_ganados: number;
  desglose_puntos: Record<string, number>;
  saldo_total: number;
  medallas_nuevas: Array<{ id: number; nombre: string; descripcion: string; imagen_url: string | null }>;
  mensaje_motivacional: string;
}

// ─── Tipos de videos ──────────────────────────────────────────────────────────

export interface VideoEducativoResponse {
  id: number;
  titulo: string;
  descripcion: string | null;
  duracion_segundos: number;
  url: string;
  thumbnail_url: string | null;
  fuente: string;           // "youtube" | "generado"
  tipo_error: string;
  operacion: string;
  nivel_dificultad: number;
  guardado: boolean;
  fecha_guardado: string | null;
  visto: boolean;
  progreso_segundos: number;
}

export interface GaleriaVideosResponse {
  total: number;
  maximo: number;           // 10
  videos: VideoEducativoResponse[];
}

export interface GuardarVideoResponse {
  exito: boolean;
  mensaje: string;
  videos_guardados_total: number;
  video_eliminado: VideoEducativoResponse | null;
}

// ─── Servicio ────────────────────────────────────────────────────────────────

export const studentService = {
  // ── Perfil adaptativo ──────────────────────────────────────────────────────

  async getPerfil(): Promise<PerfilEstudiante> {
    try {
      const response = await apiClient.get<PerfilEstudiante>('/adaptive/profile');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // ── Diagnóstico ────────────────────────────────────────────────────────────

  /**
   * Inicia la prueba diagnóstica (8 problemas, 2 por operación).
   * Ruta: POST /adaptive/diagnostic/start
   */
  async iniciarDiagnostico(): Promise<{ diagnostico_id: number; problemas: ProblemaBE[]; mensaje: string }> {
    try {
      const response = await apiClient.post('/adaptive/diagnostic/start');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Envía todas las respuestas del diagnóstico y obtiene los niveles asignados.
   * Ruta: POST /adaptive/diagnostic/submit
   */
  async enviarDiagnostico(
    diagnosticoId: number,
    respuestas: Record<number, number>
  ): Promise<{
    estudiante_id: number;
    perfecto: boolean;
    nivel_suma: number;
    nivel_resta: number;
    nivel_multiplicacion: number;
    nivel_division: number;
    nivel_actual: number;
    correctos_por_operacion: Record<string, number>;
    mensaje: string;
  }> {
    try {
      const response = await apiClient.post('/adaptive/diagnostic/submit', {
        diagnostico_id: diagnosticoId,
        respuestas,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // ── Práctica ───────────────────────────────────────────────────────────────

  /**
   * Iniciar sesión de práctica adaptativa.
   * Ruta: POST /adaptive/practice/start
   * El sistema decide automáticamente cantidad y operaciones.
   */
  async iniciarPractica(): Promise<SesionStartResponse> {
    try {
      const response = await apiClient.post<SesionStartResponse>('/adaptive/practice/start');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Enviar respuesta a un problema dentro de una sesión.
   * Ruta: POST /practices/{sesion_id}/submit-problem
   * El backend valida, registra el intento, y devuelve el siguiente problema.
   */
  async enviarRespuesta(
    sesionId: number,
    problemaId: number,
    respuesta: number,
    tiempoResolucion: number
  ): Promise<SubmitProblemResponse> {
    try {
      const response = await apiClient.post<SubmitProblemResponse>(
        `/practices/${sesionId}/submit-problem`,
        {
          problema_id: problemaId,
          respuesta,
          tiempo_resolucion: tiempoResolucion,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Completar sesión de práctica (sólo si el backend no lo hizo automáticamente).
   * Ruta: POST /adaptive/practice/complete
   */
  async finalizarPractica(sesionId: number): Promise<void> {
    try {
      await apiClient.post('/adaptive/practice/complete', { sesion_id: sesionId });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // ── Gamificación ───────────────────────────────────────────────────────────

  async getSaldo(): Promise<SaldoPuntosResponse> {
    try {
      const response = await apiClient.get<SaldoPuntosResponse>('/gamification/balance');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Catálogo completo (BD) con IDs numéricos y flag poseido.
   * Se usa para mapear el archivo_referencia → id de BD al comprar.
   */
  async getCatalogo(): Promise<{
    temas: ItemPoseido[];
    fondos: ItemPoseido[];
    colores: ItemPoseido[];
    musicas: ItemPoseido[];
    efectos: ItemPoseido[];
    total_items: number;
  }> {
    try {
      const response = await apiClient.get('/gamification/store');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getItemsPoseidos(): Promise<ItemPoseido[]> {
    try {
      const response = await apiClient.get<ItemPoseido[]>('/gamification/store/owned');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async comprarItem(desbloqueableId: number): Promise<ComprarItemResponse> {
    try {
      const response = await apiClient.post<ComprarItemResponse>(
        `/gamification/store/buy/${desbloqueableId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getPersonalizacion(): Promise<PersonalizacionResponse> {
    try {
      const response = await apiClient.get<PersonalizacionResponse>('/gamification/customization');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async savePersonalizacion(data: PersonalizacionRequest): Promise<PersonalizacionResponse> {
    try {
      const response = await apiClient.put<PersonalizacionResponse>(
        '/gamification/customization',
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getMedallas(): Promise<MedallasResponse> {
    try {
      const response = await apiClient.get<MedallasResponse>('/gamification/medals');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async setMedallaDestacada(medalId: number): Promise<void> {
    try {
      await apiClient.put(`/gamification/medals/highlight/${medalId}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async quitarMedallaDestacada(): Promise<void> {
    try {
      await apiClient.delete('/gamification/medals/highlight');
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getRecompensasSesion(sesionId: number): Promise<RecompensasSesionResponse> {
    try {
      const response = await apiClient.get<RecompensasSesionResponse>(
        `/gamification/session/${sesionId}/rewards`
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // ── Pistas ─────────────────────────────────────────────────────────────────

  async solicitarPista(
    sesionId: number,
    problemaId: number,
    nivel: number
  ): Promise<{ contenido: string; costo_puntos: number }> {
    try {
      const response = await apiClient.post('/hints/request', {
        sesion_id: sesionId,
        problema_id: problemaId,
        nivel_pista: nivel,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // ── Videos educativos ───────────────────────────────────────────────────────

  async getGaleriaVideos(): Promise<GaleriaVideosResponse> {
    try {
      const response = await apiClient.get<GaleriaVideosResponse>('/videos/gallery');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async guardarVideo(videoId: number): Promise<GuardarVideoResponse> {
    try {
      const response = await apiClient.post<GuardarVideoResponse>(`/videos/${videoId}/save`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async actualizarProgresoVideo(
    videoId: number,
    progresoSegundos: number,
    completo: boolean = false
  ): Promise<void> {
    try {
      await apiClient.put(`/videos/${videoId}/progress`, {
        video_id: videoId,
        progreso_segundos: progresoSegundos,
        completo,
      });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // ── Desafíos grupales ──────────────────────────────────────────────────────

  /**
   * Obtiene los desafíos grupales asignados al grupo del estudiante.
   * Ruta: GET /challenges/mis-desafios
   * El progreso se calcula en tiempo real en el servidor.
   */
  async getDesafios(): Promise<DesafioEstudiante[]> {
    try {
      const response = await apiClient.get<DesafioEstudiante[]>('/challenges/mis-desafios');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
