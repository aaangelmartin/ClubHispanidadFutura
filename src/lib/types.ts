// Tipos que reflejan supabase/schema.sql. Si cambia el esquema, cambia esto.

export type ChallengeStatus = "borrador" | "abierto" | "en_valoracion" | "cerrado";

export type RubricItem = { criterion: string; weight: number; description: string };

export type Student = {
  id: string;
  name: string;
  email: string;
  country: string;
  university: string;
  skills: string[];
  github: string | null;
  portfolio: string | null;
  consent_at: string;
  created_at: string;
};

export type Company = {
  id: string;
  name: string;
  contact_name: string;
  email: string;
  country: string;
  created_at: string;
};

export type Challenge = {
  id: string;
  company_id: string;
  description: string;
  title: string;
  summary: string;
  context: string;
  task: string;
  profile: string;
  deliverable: string;
  duration_days: number;
  rubric: RubricItem[];
  suggested_prize: string | null;
  warnings: string[];
  is_example: boolean;
  status: ChallengeStatus;
  deadline: string | null;
  created_at: string;
};

export type AiSummary = {
  what_it_does: string;
  by_criterion: { criterion: string; observations: string }[];
  strengths: string[];
  questions_for_reviewer: string[];
};

export type Submission = {
  id: string;
  challenge_id: string;
  student_id: string;
  link: string | null;
  notes: string | null;
  ai_summary: AiSummary | null;
  submitted_at: string | null;
  created_at: string;
};

export type Evaluation = {
  id: string;
  submission_id: string;
  scores: { criterion: string; score: number }[];
  feedback: string;
  contact_requested: boolean;
  created_at: string;
};

// Lo que devuelve la IA al generar un reto (PRD §10.1)
export type GeneratedChallenge = Pick<
  Challenge,
  "title" | "summary" | "context" | "task" | "profile" | "deliverable" | "duration_days" | "rubric" | "warnings"
> & { suggested_prize: string };

export const COUNTRIES = ["España", "México", "Colombia"] as const;
