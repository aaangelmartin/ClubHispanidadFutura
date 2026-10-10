import "server-only";
import type { AiSummary, Challenge, GeneratedChallenge, RubricItem, Submission } from "../types";

// IA simulada: con AI_ENABLED apagado, generate.ts y summarize.ts devuelven esto en vez de llamar a Claude.
// Construye un resultado creíble a partir del texto real, para que la demo enseñe el flujo completo.

const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Area = { claves: RegExp; perfil: string; entregable: string; rubrica: RubricItem[]; tarea: string };

const AREAS: Area[] = [
  {
    claves: /dato|analí|métric|conversi|abandono|excel|python|sql|dashboard/i,
    perfil: "Estudiante de último curso o recién titulado con base de análisis de datos (Excel, SQL o Python).",
    entregable: "Un informe de máximo 5 páginas (o un notebook) y un resumen de una página para dirección.",
    tarea: "Analiza los datos que te facilitamos, encuentra los patrones que explican el problema y propón tres hipótesis con cómo comprobarlas.",
    rubrica: [
      { criterion: "Rigor del análisis", weight: 40, description: "Las conclusiones se apoyan en los datos" },
      { criterion: "Calidad de las propuestas", weight: 35, description: "Concretas, accionables y medibles" },
      { criterion: "Comunicación", weight: 25, description: "Dirección lo entiende en dos minutos" },
    ],
  },
  {
    claves: /marketing|campaña|redes|linkedin|instagram|marca|captaci|clientes nuevos|pymes/i,
    perfil: "Estudiante de marketing, comunicación o ADE.",
    entregable: "Una presentación de máximo 10 diapositivas con la estrategia y tres piezas de ejemplo.",
    tarea: "Define el público, el mensaje y tres piezas de campaña, con el presupuesto y las métricas para un mes de prueba.",
    rubrica: [
      { criterion: "Entendimiento del cliente", weight: 35, description: "Conoce el problema real del público" },
      { criterion: "Creatividad del mensaje", weight: 35, description: "Las piezas destacan y son coherentes" },
      { criterion: "Medición", weight: 30, description: "Métricas y presupuesto realistas" },
    ],
  },
  {
    claves: /diseñ|ux|ui|usuario|experiencia|flujo|pantalla|app móvil|web/i,
    perfil: "Estudiante de diseño, UX o ingeniería con interés en producto.",
    entregable: "Wireframes en Figma y un documento de una página con el razonamiento.",
    tarea: "Identifica los tres mayores problemas de la experiencia actual y propón un rediseño en wireframes.",
    rubrica: [
      { criterion: "Diagnóstico", weight: 40, description: "Los problemas salen de evidencias reales" },
      { criterion: "Solución", weight: 40, description: "El rediseño los resuelve y es viable" },
      { criterion: "Presentación", weight: 20, description: "Claro y fácil de revisar" },
    ],
  },
  {
    claves: /desarroll|program|código|api|software|integraci|automatiz|backend|frontend/i,
    perfil: "Estudiante de ingeniería informática o de software.",
    entregable: "Un repositorio con una prueba de concepto y un README que explique las decisiones.",
    tarea: "Construye una prueba de concepto pequeña que demuestre cómo resolverías el problema, sin llegar a producto final.",
    rubrica: [
      { criterion: "Solución técnica", weight: 40, description: "Funciona y resuelve el núcleo del problema" },
      { criterion: "Calidad del código", weight: 30, description: "Legible, organizado y con pruebas básicas" },
      { criterion: "Explicación", weight: 30, description: "Las decisiones están justificadas" },
    ],
  },
];

const GENERAL: Area = {
  claves: /./,
  perfil: "Estudiante universitario de último curso con interés en el área.",
  entregable: "Un documento de máximo 5 páginas con el diagnóstico y la propuesta.",
  tarea: "Analiza el problema, identifica sus causas principales y propón una solución concreta y viable.",
  rubrica: [
    { criterion: "Diagnóstico", weight: 35, description: "Entiende bien el problema y sus causas" },
    { criterion: "Propuesta", weight: 40, description: "Concreta, viable y con impacto" },
    { criterion: "Comunicación", weight: 25, description: "Clara y bien estructurada" },
  ],
};

function frase(texto: string) {
  const limpia = texto.replace(/\s+/g, " ").trim();
  const primera = limpia.split(/(?<=[.!?])\s/)[0] ?? limpia;
  return primera.length > 160 ? primera.slice(0, 157) + "…" : primera;
}

const NOMBRE_AREA = ["datos", "marketing", "UX", "desarrollo"];

function titulo(texto: string, area: Area) {
  // «Tenemos clientes en Colombia que abandonan la app al pagar.» → «Reto de UX: clientes en Colombia que abandonan la app al pagar»
  const base = frase(texto)
    .replace(/[.!?…]+$/, "")
    .replace(/^(tenemos|hay|somos|vendemos|nuestros?|nuestras?|en nuestra empresa)\s+/i, "")
    .split(/\s(?:y buscamos|buscamos|y queremos|porque)\s/i)[0]!;
  const i = AREAS.indexOf(area);
  const cuerpo = base.length > 64 ? base.slice(0, 61).replace(/\s\S*$/, "") + "…" : base;
  return i >= 0 ? `Reto de ${NOMBRE_AREA[i]}: ${cuerpo}` : cuerpo.charAt(0).toUpperCase() + cuerpo.slice(1);
}

export async function generarSimulado(description: string, companyName: string, companyCountry: string): Promise<GeneratedChallenge> {
  await espera(2600);
  const area = AREAS.find((a) => a.claves.test(description)) ?? GENERAL;
  const warnings: string[] = [];
  if (/semanas|un mes|meses|producción|toda la app|completa/i.test(description)) {
    warnings.push("Lo que describes parece más largo que un reto: lo hemos acotado a una prueba de capacidad de 5 días.");
  }
  return {
    title: titulo(description, area),
    summary: frase(description),
    context: `${companyName} (${companyCountry}) plantea este reto a partir de un problema real de su negocio. ${frase(description)}`,
    task: area.tarea,
    profile: area.perfil,
    deliverable: area.entregable,
    duration_days: 5,
    rubric: area.rubrica,
    suggested_prize: "250 € y entrevista con el equipo",
    warnings,
  };
}

export async function resumirSimulado(challenge: Challenge, submission: Pick<Submission, "link" | "notes">): Promise<AiSummary> {
  await espera(1800);
  const notas = (submission.notes ?? "").replace(/\s+/g, " ").trim();
  const frases = notas.split(/(?<=[.!?])\s/).filter(Boolean);
  const resumen = frases.slice(0, 2).join(" ") || "La entrega incluye un enlace con el trabajo, sin explicación escrita.";
  return {
    what_it_does: resumen,
    by_criterion: challenge.rubric.map((r, i) => ({
      criterion: r.criterion,
      observations:
        frases[i + 1] ??
        (notas.length > 200
          ? `La explicación aporta detalle suficiente para valorar «${r.criterion.toLowerCase()}».`
          : `La explicación es breve: conviene revisar el enlace para valorar «${r.criterion.toLowerCase()}».`),
    })),
    strengths: [notas.length > 200 ? "Explica con detalle su razonamiento" : "Va al grano", submission.link ? "Entrega el trabajo en un enlace revisable" : "Responde a lo que pide el reto"],
    questions_for_reviewer: ["¿La propuesta es viable con vuestros recursos actuales?"],
  };
}
