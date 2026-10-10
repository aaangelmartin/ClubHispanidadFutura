"use server";
// Dueño: perfil 4. Acciones de valoración y de cambio de estado del reto (PRD §8.1).
import { revalidatePath } from "next/cache";
import { db } from "@/lib/supabase";
import { summarizeSubmission } from "@/lib/ai/summarize";
import type { AiSummary } from "@/lib/types";
import { getChallengeForCompany, getSubmissions, one, requireCompany } from "../../_lib/queries";

async function ownedSubmission(submissionId: string) {
  const company = await requireCompany();
  const { data, error } = await db()
    .from("submissions")
    .select("*, challenges!inner(*)")
    .eq("id", submissionId)
    .eq("challenges.company_id", company.id)
    .maybeSingle();
  if (error || !data) throw new Error("Entrega no encontrada");
  return data;
}

export async function summarizeAction(submissionId: string): Promise<AiSummary> {
  const sub = await ownedSubmission(submissionId);
  if (sub.ai_summary) return sub.ai_summary as AiSummary;
  const summary = await summarizeSubmission(one(sub.challenges), { link: sub.link, notes: sub.notes });
  await db().from("submissions").update({ ai_summary: summary }).eq("id", submissionId);
  return summary;
}

export type EvalState = { error?: string; ok?: boolean };

export async function saveEvaluation(_prev: EvalState, form: FormData): Promise<EvalState> {
  const submissionId = String(form.get("submission_id"));
  const sub = await ownedSubmission(submissionId);
  const challenge = one(sub.challenges);
  if (!sub.submitted_at) return { error: "Esta persona todavía no ha entregado." };

  const scores = [];
  for (const [i, item] of (challenge.rubric as { criterion: string }[]).entries()) {
    const raw = form.get(`score_${i}`);
    const score = Number(raw);
    if (raw === null || raw === "" || Number.isNaN(score) || score < 0 || score > 10) {
      return { error: `Pon una nota de 0 a 10 en "${item.criterion}".` };
    }
    scores.push({ criterion: item.criterion, score });
  }
  const feedback = String(form.get("feedback") ?? "").trim();
  if (feedback.length < 10) return { error: "Escribe un feedback de al menos una frase: es lo que verá el estudiante en su pasaporte." };

  const { error } = await db()
    .from("evaluations")
    .upsert({ submission_id: submissionId, scores, feedback }, { onConflict: "submission_id" });
  if (error) return { error: "No se ha podido guardar. Inténtalo otra vez." };

  revalidatePath(`/empresa/retos/${challenge.id}`);
  revalidatePath(`/pasaporte/${sub.student_id}`);
  return { ok: true };
}

export async function requestContact(form: FormData) {
  const submissionId = String(form.get("submission_id"));
  const sub = await ownedSubmission(submissionId);
  await db().from("evaluations").update({ contact_requested: true }).eq("submission_id", submissionId);
  revalidatePath(`/empresa/retos/${one(sub.challenges).id}`);
}

export async function closeSubmissions(form: FormData) {
  const company = await requireCompany();
  const id = String(form.get("challenge_id"));
  await db().from("challenges").update({ status: "en_valoracion" }).eq("id", id).eq("company_id", company.id).eq("status", "abierto");
  revalidatePath(`/empresa/retos/${id}`);
}

export async function closeChallenge(form: FormData) {
  const company = await requireCompany();
  const id = String(form.get("challenge_id"));
  const challenge = await getChallengeForCompany(id, company.id);
  if (!challenge || challenge.status !== "en_valoracion") return;
  const pending = (await getSubmissions(id)).filter((s) => s.submitted_at && !s.evaluation);
  if (pending.length > 0) return; // la regla: no se cierra sin valorar todas
  await db().from("challenges").update({ status: "cerrado" }).eq("id", id).eq("company_id", company.id);
  revalidatePath(`/empresa/retos/${id}`);
}
