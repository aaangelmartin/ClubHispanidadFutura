import "server-only";
import { askJson } from "./client";
import type { GeneratedChallenge } from "../types";

// Dueño: perfil 2 (publicar retos). Prompt = PRD §10.1.

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

export function generateChallenge(description: string, companyName: string, companyCountry: string) {
  return askJson<GeneratedChallenge>(
    GENERATE_SYSTEM,
    `Empresa: ${companyName} (${companyCountry})\n\nLo que necesita:\n${description}`,
  );
}
