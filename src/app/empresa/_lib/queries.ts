import "server-only";
import { redirect } from "next/navigation";
import { db } from "@/lib/supabase";
import { getSession } from "@/lib/session";
import type { Challenge, Company, Evaluation, RubricItem, Student, Submission } from "@/lib/types";

// Dueño: perfil 4. Consultas del lado empresa (dashboard, valorar, candidatos).

export type SubmissionRow = Submission & { student: Student; evaluation: Evaluation | null };
export type CandidateRow = SubmissionRow & { challenge: Pick<Challenge, "id" | "title" | "rubric" | "status"> };

// PostgREST devuelve las relaciones 1:1 como objeto o como array según cómo detecte la FK.
export function one<T>(x: T | T[] | null | undefined): T | null {
  if (Array.isArray(x)) return x[0] ?? null;
  return x ?? null;
}

export async function requireCompany(): Promise<Company> {
  const session = await getSession();
  if (session?.role !== "company") redirect("/registro?rol=empresa");
  const { data, error } = await db().from("companies").select("*").eq("id", session.id).single();
  if (error || !data) redirect("/registro?rol=empresa");
  return data as Company;
}

export async function getCompanyChallenges(companyId: string) {
  const { data, error } = await db()
    .from("challenges")
    .select("*, submissions(id, submitted_at, evaluations(id, contact_requested))")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  return (data ?? []).map((c) => {
    const subs = ((c.submissions ?? []) as { id: string; submitted_at: string | null; evaluations: unknown }[]).filter(
      (s) => s.submitted_at,
    );
    const evals = subs.map((s) => one(s.evaluations as { id: string; contact_requested: boolean }[] | null));
    return {
      challenge: c as Challenge,
      submitted: subs.length,
      evaluated: evals.filter(Boolean).length,
      contacted: evals.filter((e) => e?.contact_requested).length,
    };
  });
}

export async function getChallengeForCompany(challengeId: string, companyId: string) {
  const { data, error } = await db()
    .from("challenges")
    .select("*")
    .eq("id", challengeId)
    .eq("company_id", companyId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as Challenge | null;
}

export async function getSubmissions(challengeId: string): Promise<SubmissionRow[]> {
  const { data, error } = await db()
    .from("submissions")
    .select("*, students(*), evaluations(*)")
    .eq("challenge_id", challengeId)
    .order("submitted_at", { ascending: true, nullsFirst: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(({ students, evaluations, ...s }) => ({
    ...(s as Submission),
    student: one(students) as Student,
    evaluation: one(evaluations) as Evaluation | null,
  }));
}

export async function getCandidates(companyId: string): Promise<CandidateRow[]> {
  const { data, error } = await db()
    .from("submissions")
    .select("*, students(*), evaluations(*), challenges!inner(id, title, rubric, status, company_id)")
    .eq("challenges.company_id", companyId)
    .not("submitted_at", "is", null)
    .order("submitted_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(({ students, evaluations, challenges, ...s }) => ({
    ...(s as Submission),
    student: one(students) as Student,
    evaluation: one(evaluations) as Evaluation | null,
    challenge: one(challenges) as CandidateRow["challenge"],
  }));
}

// Nota ponderada sobre 10 con los pesos de la rúbrica. Solo de referencia: decide la empresa.
export function weightedScore(rubric: RubricItem[], scores: Evaluation["scores"]): number | null {
  let total = 0;
  let weights = 0;
  for (const item of rubric) {
    const s = scores.find((x) => x.criterion === item.criterion);
    if (!s) continue;
    total += s.score * item.weight;
    weights += item.weight;
  }
  return weights ? Math.round((total / weights) * 10) / 10 : null;
}

export const STATUS_LABEL: Record<Challenge["status"], string> = {
  borrador: "Borrador",
  abierto: "Abierto",
  en_valoracion: "En valoración",
  cerrado: "Cerrado",
};

export function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}
