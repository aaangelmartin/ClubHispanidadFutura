import "server-only";
import { AI_ENABLED, askJson } from "./client";
import { generarSimulado } from "./simulada";
import type { GeneratedChallenge } from "../types";

// Dueño: perfil 2 (publicar retos). Prompt = PRD §10.1.

const GENERATE_SYSTEM = `Eres el diseñador de retos de una plataforma que conecta empresas con talento joven
universitario de España y Latinoamérica mediante retos reales online.

La empresa te describe en texto libre su problema y el perfil que busca. Devuelve SOLO un objeto JSON,
sin texto antes ni después ni bloques de código:
{
  "title": string (máx. 80 caracteres),
  "summary": string (1 frase),
  "context": string (qué hace la empresa y por qué importa el problema, 2-3 frases),
  "task": string (qué hay que hacer, concreto y acotado, 3-6 frases),
  "profile": string (perfil buscado, 1-2 frases),
  "deliverable": string (formato exacto de la entrega, p. ej. "un enlace a un documento de 2 páginas"),
  "duration_days": number (entero entre 2 y 10),
  "rubric": [{"criterion": string, "weight": number, "description": string}] (3-5 criterios; los pesos son enteros y suman exactamente 100),
  "suggested_prize": string (premio simbólico o de reconocimiento para quien gane; no inventes cifras),
  "warnings": [string]
}

Reglas:
- El reto debe poder hacerlo una persona junior en remoto en el plazo indicado, sin acceso a datos internos ni sistemas de la empresa.
- Si lo que pide la empresa parece trabajo de producción (algo que la empresa usaría tal cual
  sin contratar), redúcelo a una prueba de capacidad sobre un caso acotado o con datos públicos
  y explícalo en "warnings".
- Si el plazo pedido supera 10 días, usa 10 y avisa en "warnings". Si no piden plazo, elige el más corto razonable.
- Si la descripción es vaga o falta información clave, haz suposiciones razonables y dilas en "warnings".
- Si no hay nada que avisar, "warnings" es [].
- Sé conciso. Escribe en español neutro, claro, sin jerga.
- No pidas datos personales de nadie en la entrega.`;

// La IA a veces se equivoca en los números: aquí garantizamos las reglas del producto.
export function normalizeChallenge(raw: GeneratedChallenge): GeneratedChallenge {
  const warnings = Array.isArray(raw.warnings) ? raw.warnings.filter((w) => typeof w === "string" && w.trim()) : [];

  let days = Math.round(Number(raw.duration_days));
  if (!Number.isFinite(days)) days = 5;
  if (days > 10) {
    warnings.push("El plazo se ha acortado a 10 días: los retos duran días, no semanas.");
    days = 10;
  }
  days = Math.max(2, days);

  let rubric = (Array.isArray(raw.rubric) ? raw.rubric : []).slice(0, 5).map((r) => ({
    criterion: String(r.criterion ?? "").trim(),
    description: String(r.description ?? "").trim(),
    weight: Math.max(0, Number(r.weight) || 0),
  }));
  if (rubric.length === 0) throw new Error("La IA no devolvió una rúbrica");
  const total = rubric.reduce((n, r) => n + r.weight, 0);
  const n = rubric.length;
  rubric = rubric.map((r) => ({ ...r, weight: total > 0 ? Math.round((r.weight / total) * 100) : Math.round(100 / n) }));
  rubric[0].weight += 100 - rubric.reduce((s, r) => s + r.weight, 0);

  return { ...raw, duration_days: days, rubric, warnings, suggested_prize: raw.suggested_prize ?? "" };
}

export async function generateChallenge(description: string, companyName: string, companyCountry: string) {
  if (!AI_ENABLED) return normalizeChallenge(await generarSimulado(description, companyName, companyCountry)); // IA apagada: simulada
  const raw = await askJson<GeneratedChallenge>(
    GENERATE_SYSTEM,
    `Empresa: ${companyName} (${companyCountry})\n\nLo que necesita:\n${description}`,
  );
  return normalizeChallenge(raw);
}
