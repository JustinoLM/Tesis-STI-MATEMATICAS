/**
 * Servicio de profesor (grupos, desafíos, alertas, configuración).
 */

import apiClient, { getErrorMessage } from './api';
import {
  Grupo,
  AlertaEstudianteDetalle,
  DesafioGrupal,
  EstadisticasGrupo,
  ConfiguracionPractica,
  ProgresoEstudiante,
} from '@/types';

export const teacherService = {
  // ==================== GRUPOS ====================

  /**
   * Obtener todos los grupos del profesor.
   */
  async getGrupos(): Promise<Grupo[]> {
    try {
      const response = await apiClient.get<Grupo[]>('/teachers/groups');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Obtener detalle de un grupo específico.
   */
  async getGrupoDetalle(grupoId: number): Promise<Grupo> {
    try {
      const response = await apiClient.get<Grupo>(`/teachers/groups/${grupoId}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Crear nuevo grupo.
   */
  async crearGrupo(nombre: string, codigoGrupo: string): Promise<Grupo> {
    try {
      const response = await apiClient.post<Grupo>('/teachers/groups', {
        nombre,
        codigo_grupo: codigoGrupo,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Agregar estudiante a un grupo.
   */
  async agregarEstudiante(grupoId: number, estudianteId: number): Promise<void> {
    try {
      await apiClient.post(`/teachers/groups/${grupoId}/students/${estudianteId}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Remover estudiante de un grupo.
   */
  async removerEstudiante(grupoId: number, estudianteId: number): Promise<void> {
    try {
      await apiClient.delete(`/teachers/groups/${grupoId}/students/${estudianteId}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // ==================== ESTADÍSTICAS ====================

  /**
   * Obtener estadísticas detalladas de un grupo.
   */
  async getEstadisticasGrupo(grupoId: number): Promise<EstadisticasGrupo> {
    try {
      const response = await apiClient.get<EstadisticasGrupo>(`/teachers/groups/${grupoId}/statistics`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // ==================== ALERTAS ====================

  /**
   * Obtener alertas activas de todos los grupos.
   */
  async getAlertas(): Promise<AlertaEstudianteDetalle[]> {
    try {
      const response = await apiClient.get<AlertaEstudianteDetalle[]>('/teachers/alerts');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // ==================== DESAFÍOS ====================

  /**
   * Obtener todos los desafíos del profesor.
   */
  async getDesafios(): Promise<DesafioGrupal[]> {
    try {
      const response = await apiClient.get<DesafioGrupal[]>('/teachers/challenges');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Crear desafío grupal.
   */
  async crearDesafio(data: {
    nombre: string;
    descripcion?: string;
    tipo: string;
    objetivo_cantidad: number;
    recompensa_texto?: string;
    grupos_ids: number[];
    fecha_limite?: string;
  }): Promise<DesafioGrupal> {
    try {
      const response = await apiClient.post<DesafioGrupal>('/teachers/challenges', data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Eliminar desafío (soft delete).
   */
  async eliminarDesafio(desafioId: number): Promise<void> {
    try {
      await apiClient.delete(`/teachers/challenges/${desafioId}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // ==================== CONFIGURACIÓN ====================

  /**
   * Crear configuración de práctica para un grupo.
   */
  async crearConfiguracion(data: {
    grupo_id: number;
    operaciones_permitidas: string[];
    niveles_permitidos: number[];
    rango_min: number;
    rango_max: number;
    decimales_maximos: number;
    pistas_habilitadas: Record<string, boolean>;
  }): Promise<ConfiguracionPractica> {
    try {
      const response = await apiClient.post<ConfiguracionPractica>('/teachers/configuration', data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Obtener configuración activa de un grupo.
   */
  async getConfiguracionGrupo(grupoId: number): Promise<ConfiguracionPractica> {
    try {
      const response = await apiClient.get<ConfiguracionPractica>(`/teachers/groups/${grupoId}/configuration`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // ==================== ESTUDIANTES ====================

  /**
   * Buscar estudiantes por nombre o código.
   */
  async buscarEstudiantes(query: string): Promise<any[]> {
    try {
      const response = await apiClient.post('/teachers/students/search', { query });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Obtener progreso detallado de un estudiante.
   */
  async getProgresoEstudiante(estudianteId: number): Promise<ProgresoEstudiante> {
    try {
      // Asumiendo que existe este endpoint o lo adaptamos del endpoint de estudiante
      const response = await apiClient.get<ProgresoEstudiante>(`/students/${estudianteId}/progress`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
