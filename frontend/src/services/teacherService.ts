/**
 * Servicio de profesor (grupos, desafíos, alertas).
 */

import apiClient, { getErrorMessage } from './api';
import { Grupo, AlertaEstudiante, DesafioGrupal } from '@/types';

export const teacherService = {
  /**
   * Obtener grupos del profesor.
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
   * Obtener detalle de un grupo.
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
   * Obtener alertas activas.
   */
  async getAlertas(): Promise<AlertaEstudiante[]> {
    try {
      const response = await apiClient.get<AlertaEstudiante[]>('/teachers/alerts');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Obtener desafíos.
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
    tipo: string;
    objetivo_cantidad: number;
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
};
