import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { AiSummary, Challenge, GeneratedChallenge, Submission } from "./types";

// Dueña: persona 2 (motor de retos). Prompts = PRD §10.

const MODEL = "claude-sonnet-5-5";

const GENERATE_SYSTEM = `Eres el diseñador de retos de una plataforma que conecta empresas con talento joven
universitario de España y Latinoamérica mediante retos reales online.

La empresa te describe en texto libre su problema y el perfil que busca. Devuelve SOLO JSON:
{
  "title": string,
  "summary": string (1 frase),
  "context": string (qué hace la empresa y por qué importa el problema),
  "task": string (qué hay que hacer, concreto y acotado),
  "profile": string (perfil buscado),
  "deliverable": string (formato exacto de la entrega),
  "duration_days": number (entre 2 y 10),
  "rubric": [{"criterion": string, "weight": number, "description": string}] (3-5 criterios, pesos suman 100),
  "suggested_prize": string,
  "warnings": [string]
}

Reglas:
- El reto debe poder hacerlo una persona junior en remoto en el plazo indicado.
- Si lo que pide la empresa parece trabajo de producción (algo que la empresa usaría tal cual
  sin contratar), redúcelo a una prueba de capacidad y explícalo en "warnings".
- Si el plazo pedido supera 10 días, acórtalo y avisa en "warnings".
- Escribe en español neutro, claro, sin jerga.`;

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

function client() {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("Falta ANTHROPIC_API_KEY en .env.local");
  return new Anthropic();
}

async function askJson<T>(system: string, user: string): Promise<T> {
  const res = await client().messages.create({
    model: MODEL,
    max_tokens: 2000,
    system,
    messages: [{ role: "user", content: user }],
  });
  const text = res.content.map((b) => (b.type === "text" ? b.text : "")).join("");
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("La IA no devolvió JSON");
  return JSON.parse(text.slice(start, end + 1)) as T;
}

export function generateChallenge(description: string, companyName: string, companyCountry: string) {
  return askJson<GeneratedChallenge>(
    GENERATE_SYSTEM,
    `Empresa: ${companyName} (${companyCountry})\n\nLo que necesita:\n${description}`,
  );
}

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
