/**
 * Tipos centralizados del sistema.
 */

// ==================== AUTH ====================
export type TipoUsuario = 'estudiante' | 'profesor';

export interface Usuario {
  id: number;
  tipo_usuario: TipoUsuario;
  fecha_creacion: string;
  ultimo_acceso?: string;
  activo: boolean;
}

export interface Estudiante extends Usuario {
  tipo_usuario: 'estudiante';
  codigo_estudiante: string;
  nombre_completo: string;
  narrativa_seleccionada_id?: number;
}

export interface Profesor extends Usuario {
  tipo_usuario: 'profesor';
  codigo_profesor: string;
  nombre_completo: string;
  institucion?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: Estudiante | Profesor;
}

// ==================== ADAPTIVE ====================
export interface PerfilEstudiante {
  estudiante_id: number;
  nivel_actual: number;
  nivel_suma: number;
  nivel_resta: number;
  nivel_multiplicacion: number;
  nivel_division: number;
  precision_ultimos_15: number;
  velocidad_promedio: number;
  total_sesiones: number;
  ultima_actividad: string;
  dias_sin_practicar: number;
}

export type TipoAlerta = 
  | 'posible_trampa'
  | 'rezagado'
  | 'inactivo'
  | 'promocion_rapida'
  | 'dificultad_persistente'
  | 'excelencia';

export interface AlertaEstudiante {
  id: number;
  tipo: TipoAlerta;
  severidad: 'info' | 'warning' | 'critical';
  titulo: string;
  mensaje: string;
  activa: boolean;
  leida: boolean;
  fecha_creacion: string;
}

// ==================== PROBLEMS ====================
export type Operacion = 'SUMA' | 'RESTA' | 'MULTIPLICACION' | 'DIVISION';

export interface Problema {
  id: number;
  operacion: Operacion;
  numero1: number;
  numero2: number;
  resultado: number;
  nivel_dificultad: number;
  cantidad_decimales: number;
  pregunta: string;
}

export interface Intento {
  id: number;
  problema_id: number;
  respuesta_estudiante: number;
  es_correcto: boolean;
  tiempo_resolucion: number;
  timestamp: string;
}

// ==================== PRACTICE ====================
export interface SesionPractica {
  id: number;
  estudiante_id: number;
  estado: 'iniciada' | 'en_progreso' | 'pausada' | 'completada' | 'abandonada';
  progreso_actual: number;
  cantidad_problemas: number;
  problemas_ids: number[];
  problemas_correctos: number;
  problemas_incorrectos: number;
  fecha_inicio: string;
  puntos_ganados: number;
}

// ==================== GAMIFICATION ====================
export interface Medalla {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  icono_url: string;
  condicion_cantidad: number;
}

export interface Desbloqueable {
  id: number;
  nombre: string;
  categoria: 'tema' | 'fondo' | 'musica' | 'efectos';
  costo_puntos: number;
  asset_url: string;
  desbloqueado: boolean;
}

export interface EstadisticasEstudiante {
  puntos_totales: number;
  problemas_resueltos: number;
  precision_general: number;
  racha_actual: number;
  medallas_obtenidas: number;
}

// ==================== TEACHER ====================
export interface Grupo {
  id: number;
  nombre: string;
  codigo_grupo: string;
  activo: boolean;
  cantidad_estudiantes: number;
  promedio_precision: number;
  problemas_resueltos_hoy: number;
}

export interface EstudianteEnGrupo {
  estudiante_id: number;
  codigo_estudiante: string;
  nombre_completo: string;
  nivel_actual: number;
  precision_ultimos_15: number;
  fecha_ingreso: string;
  activo: boolean;
}

export interface DesafioGrupal {
  id: number;
  nombre: string;
  tipo: string;
  objetivo_cantidad: number;
  fecha_limite?: string;
  completado: boolean;
  progreso_grupos: ProgresoGrupoDesafio[];
}

export interface ProgresoGrupoDesafio {
  grupo_id: number;
  nombre_grupo: string;
  progreso_actual: number;
  objetivo_cantidad: number;
  porcentaje: number;
  completado: boolean;
}

// ==================== HINTS & VIDEOS ====================
export type NivelPista = 1 | 2 | 3;

export interface Pista {
  nivel: NivelPista;
  contenido: string;
  costo_puntos: number;
}

export interface VideoEducativo {
  id: number;
  titulo: string;
  descripcion?: string;
  duracion_segundos: number;
  url: string;
  thumbnail_url?: string;
}
