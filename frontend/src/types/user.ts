/**
 * Tipos TypeScript para entidades de usuarios.
 */

export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export interface Student extends User {
  role: 'student';
  grade: number;
  group_id: string;
  current_level: number; // 1-5
  narrative_theme: NarrativeTheme;
  total_problems_solved: number;
  current_streak: number;
}

export interface Teacher extends User {
  role: 'teacher';
  groups: string[];
  institution: string;
}

export type NarrativeTheme = 
  | 'pirates'
  | 'astronauts'
  | 'magicians'
  | 'knights'
  | 'cowboys'
  | 'princess-inventors';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  grade?: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
