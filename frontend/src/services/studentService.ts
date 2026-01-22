/**
 * Servicio de estudiante (perfil, práctica, tienda).
 */

import apiClient, { getErrorMessage } from './api';
import { PerfilEstudiante, SesionPractica, Problema } from '@/types';

export const studentService = {
  /**
   * Obtener perfil del estudiante.
   */
  async getPerfil(): Promise<PerfilEstudiante> {
    try {
      const response = await apiClient.get<PerfilEstudiante>('/adaptive/profile');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Iniciar sesión de práctica.
   */
  async iniciarPractica(cantidad: number): Promise<{ sesion: SesionPractica; problemas: Problema[] }> {
    try {
      const response = await apiClient.post('/practices/start', { cantidad_problemas: cantidad });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Enviar respuesta de problema.
   */
  async enviarRespuesta(
    sesionId: number,
    problemaId: number,
    respuesta: number
  ): Promise<{ es_correcto: boolean; tiempo_resolucion: number }> {
    try {
      const response = await apiClient.post('/practices/submit', {
        sesion_id: sesionId,
        problema_id: problemaId,
        respuesta_estudiante: respuesta,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Finalizar sesión de práctica.
   */
  async finalizarPractica(sesionId: number): Promise<void> {
    try {
      await apiClient.post(`/practices/${sesionId}/complete`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Solicitar pista.
   */
  async solicitarPista(sesionId: number, problemaId: number, nivel: number): Promise<{ contenido: string; costo_puntos: number }> {
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
};
