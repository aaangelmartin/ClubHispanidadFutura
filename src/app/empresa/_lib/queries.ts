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

export type DashboardPerson = { name: string; country: string; submitted: boolean; evaluated: boolean; contacted: boolean };

export async function getCompanyChallenges(companyId: string) {
  const { data, error } = await db()
    .from("challenges")
    .select("*, submissions(id, submitted_at, students(name, country), evaluations(id, contact_requested))")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  return (data ?? []).map((c) => {
    const people: DashboardPerson[] = (
      (c.submissions ?? []) as { submitted_at: string | null; students: unknown; evaluations: unknown }[]
    ).map((s) => {
      const st = one(s.students as { name: string; country: string }[] | null);
      const ev = one(s.evaluations as { id: string; contact_requested: boolean }[] | null);
      return {
        name: st?.name ?? "—",
        country: st?.country ?? "",
        submitted: !!s.submitted_at,
        evaluated: !!ev,
        contacted: !!ev?.contact_requested,
      };
    });
    const delivered = people.filter((p) => p.submitted);
    return {
      challenge: c as Challenge,
      people,
      enrolled: people.length,
      submitted: delivered.length,
      evaluated: delivered.filter((p) => p.evaluated).length,
      contacted: delivered.filter((p) => p.contacted).length,
    };
  });
}

export function daysLeft(deadline: string | null): number | null {
  if (!deadline) return null;
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000);
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
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
