"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/supabase";
import { generateChallenge } from "@/lib/ai/generate";
import type { RubricItem } from "@/lib/types";
import { requireCompany } from "./queries";

// Dueño: perfil 2. Generar (borrador), guardar y publicar.

export type GenerateState = { error?: string; description?: string };

export async function generateDraft(_prev: GenerateState, formData: FormData): Promise<GenerateState> {
  const company = await requireCompany();
  const description = String(formData.get("description") ?? "").trim();
  if (description.length < 30) {
    return { error: "Cuéntanos un poco más: qué necesitas resolver y qué perfil buscas.", description };
  }

  let id: string;
  try {
    const g = await generateChallenge(description, company.name, company.country);
    const { data, error } = await db()
      .from("challenges")
      .insert({
        company_id: company.id,
        description,
        title: g.title,
        summary: g.summary,
        context: g.context,
        task: g.task,
        profile: g.profile,
        deliverable: g.deliverable,
        duration_days: g.duration_days,
        rubric: g.rubric,
        suggested_prize: g.suggested_prize || null,
        warnings: g.warnings,
        status: "borrador",
      })
      .select("id")
      .single();
    if (error || !data) throw new Error(error?.message ?? "No se pudo guardar el borrador");
    id = data.id;
  } catch (e) {
    console.error("generateDraft", e);
    return { error: "No hemos podido generar el reto. Inténtalo de nuevo en unos segundos.", description };
  }
  redirect(`/empresa/nuevo?borrador=${id}`);
}

export type EditState = { error?: string };

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function saveDraft(_prev: EditState, formData: FormData): Promise<EditState> {
  const company = await requireCompany();
  const id = text(formData, "id");
  const intent = text(formData, "intent");

  const rubric: RubricItem[] = [];
  for (let i = 0; i < 5; i++) {
    const criterion = text(formData, `rubric_${i}_criterion`);
    if (!criterion) continue;
    rubric.push({
      criterion,
      description: text(formData, `rubric_${i}_description`),
      weight: Math.round(Number(text(formData, `rubric_${i}_weight`)) || 0),
    });
  }

  const duration = Math.round(Number(text(formData, "duration_days")));
  const fields = {
    title: text(formData, "title"),
    summary: text(formData, "summary"),
    context: text(formData, "context"),
    task: text(formData, "task"),
    profile: text(formData, "profile"),
    deliverable: text(formData, "deliverable"),
    suggested_prize: text(formData, "suggested_prize") || null,
    duration_days: duration,
    rubric,
  };

  if (intent === "publicar") {
    const missing = (["title", "summary", "context", "task", "profile", "deliverable"] as const).some((k) => !fields[k]);
    if (missing) return { error: "Rellena todos los campos del reto antes de publicar." };
    if (!(duration >= 2 && duration <= 10)) return { error: "El plazo tiene que estar entre 2 y 10 días." };
    if (rubric.length < 3) return { error: "La rúbrica necesita al menos 3 criterios." };
    if (rubric.reduce((n, r) => n + r.weight, 0) !== 100) return { error: "Los pesos de la rúbrica tienen que sumar 100." };
  } else if (!(duration >= 1 && duration <= 14)) {
    return { error: "El plazo no es válido." };
  }

  const update =
    intent === "publicar"
      ? { ...fields, status: "abierto", deadline: new Date(Date.now() + duration * 86400000).toISOString() }
      : fields;

  const { data, error } = await db()
    .from("challenges")
    .update(update)
    .eq("id", id)
    .eq("company_id", company.id)
    .eq("status", "borrador")
    .select("id")
    .maybeSingle();
  if (error) return { error: "No se pudo guardar. Inténtalo de nuevo." };
  if (!data) return { error: "Este reto ya no es un borrador." };

  redirect(intent === "publicar" ? `/empresa/nuevo?publicado=${id}` : `/empresa/nuevo?borrador=${id}&guardado=1`);
}

export async function deleteDraft(formData: FormData) {
  const company = await requireCompany();
  await db()
    .from("challenges")
    .delete()
    .eq("id", text(formData, "id"))
    .eq("company_id", company.id)
    .eq("status", "borrador");
  redirect("/empresa/nuevo");
}
