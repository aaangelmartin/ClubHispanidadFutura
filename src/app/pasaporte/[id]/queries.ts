import "server-only";
import { db } from "@/lib/supabase";
import type { Challenge, Company, Evaluation, Student, Submission } from "@/lib/types";

// Dueño: perfil 4. Datos del pasaporte público. Copia de `one` y `weightedScore` para no depender de /empresa.

function one<T>(x: T | T[] | null | undefined): T | null {
  if (Array.isArray(x)) return x[0] ?? null;
  return x ?? null;
}

export type PassportEntry = Submission & {
  evaluation: Evaluation | null;
  challenge: Pick<Challenge, "id" | "title" | "summary" | "rubric" | "status"> & {
    company: Pick<Company, "name" | "country">;
  };
};

export async function getPassport(studentId: string) {
  const supa = db();
  const { data: student } = await supa.from("students").select("*").eq("id", studentId).maybeSingle();
  if (!student) return null;

  const { data, error } = await supa
    .from("submissions")
    .select("*, evaluations(*), challenges(id, title, summary, rubric, status, companies(name, country))")
    .eq("student_id", studentId)
    .order("submitted_at", { ascending: false, nullsFirst: false });
  if (error) throw new Error(error.message);

  const entries: PassportEntry[] = (data ?? []).map(({ evaluations, challenges, ...s }) => {
    const c = one(challenges);
    const { companies, ...challenge } = c;
    return {
      ...(s as Submission),
      evaluation: one(evaluations) as Evaluation | null,
      challenge: { ...challenge, company: one(companies) },
    } as PassportEntry;
  });

  return { student: student as Student, entries };
}

export function weightedScore(rubric: Challenge["rubric"], scores: Evaluation["scores"]): number | null {
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
