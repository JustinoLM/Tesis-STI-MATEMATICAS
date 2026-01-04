/**
 * Tipos TypeScript para problemas matemáticos y prácticas.
 */

export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';

export interface Problem {
  problem_id: string;
  statement: string;
  operation: Operation;
  level: number; // 1-5
  correct_answer: string;
  distractors: string[];
  has_decimals: boolean;
  narrative_context?: string;
}

export interface PracticeSession {
  practice_id: string;
  student_id: string;
  total_problems: number;
  current_problem_index: number;
  started_at: string;
  completed_at?: string;
  problems: Problem[];
}

export interface Attempt {
  attempt_id: string;
  problem_id: string;
  student_answer: string;
  is_correct: boolean;
  time_taken_seconds: number;
  hint_requested: boolean;
  created_at: string;
}

export interface SubmitAnswerRequest {
  problem_id: string;
  answer: string;
  time_taken_seconds: number;
}

export interface SubmitAnswerResponse {
  is_correct: boolean;
  feedback: string;
  next_problem?: Problem;
  progress: {
    current: number;
    total: number;
  };
  level_changed?: {
    from: number;
    to: number;
  };
}
