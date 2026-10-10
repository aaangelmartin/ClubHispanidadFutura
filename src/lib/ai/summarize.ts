import "server-only";
import { askJson } from "./client";
import type { AiSummary, Challenge, Submission } from "../types";

// Dueño: perfil 4 (valorar y pasaporte). Prompt = PRD §10.2.

const SUMMARIZE_SYSTEM = `Eres un asistente que ayuda a una empresa a revisar entregas de un reto. NO pones nota
final ni ordenas candidatos: eso lo decide la empresa.

Recibes el reto (con su rúbrica) y una entrega. Devuelve SOLO JSON:
{
  "what_it_does": string (2-3 frases),
  "by_criterion": [{"criterion": string, "observations": string}],
  "strengths": [string],
  "questions_for_reviewer": [string]
}
Sé factual. No inventes lo que no está en la entrega. No uses datos personales
(nombre, país, universidad, género) para valorar.`;

// Solo se pasa el contenido de la entrega, nunca los datos del estudiante.
export function summarizeSubmission(challenge: Challenge, submission: Pick<Submission, "link" | "notes">) {
  const reto = {
    title: challenge.title,
    task: challenge.task,
    deliverable: challenge.deliverable,
    rubric: challenge.rubric,
  };
  return askJson<AiSummary>(
    SUMMARIZE_SYSTEM,
    `RETO:\n${JSON.stringify(reto, null, 2)}\n\nENTREGA:\nEnlace: ${submission.link ?? "(sin enlace)"}\nExplicación:\n${submission.notes ?? "(vacía)"}`,
  );
}
