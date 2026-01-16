/**
 * Tipos de autenticación y usuarios
 */

export enum TipoUsuario {
  ESTUDIANTE = 'estudiante',
  PROFESOR = 'profesor'
}

export interface Usuario {
  id: number;
  tipo_usuario: TipoUsuario;
  fecha_creacion: string;
  ultimo_acceso?: string;
  activo: boolean;
}

export interface Estudiante extends Usuario {
  codigo_estudiante: string;
  nombre_completo: string;
  narrativa_seleccionada_id?: number;
}

export interface Profesor extends Usuario {
  codigo_profesor: string;
  nombre_completo: string;
  institucion?: string;
}

export interface LoginRequest {
  codigo: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: Estudiante | Profesor;
}
