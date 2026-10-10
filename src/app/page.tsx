// Dueño: perfil 1 (entrada y demanda). Landing: problema, frase del producto y las dos entradas. Ver docs/PRD.md §1–3 y §8 P1.
import Link from "next/link";
import { Escudo } from "@/components/Marca";
import { contarEstudiantes } from "./panel/queries";

export const dynamic = "force-dynamic";

const PASOS = [
  { quien: "Empresa", texto: "Describe con sus palabras qué necesita resolver y qué perfil busca." },
  { quien: "IA", texto: "Lo convierte en un reto real: enunciado, entregable, plazo de días y rúbrica." },
  { quien: "Estudiante", texto: "Lo resuelve en remoto desde España o México, sin CV ni visado." },
  { quien: "Empresa", texto: "Valora cada entrega y contacta a quien lo demuestra. Todo queda en el pasaporte." },
];

export default async function Home() {
  const registrados = await contarEstudiantes();

  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-6">
            <span className="eyebrow">Retos reales online · España ↔ México</span>
            <h1 className="text-4xl font-bold leading-[1.05] sm:text-6xl">
              El CV dice lo que hiciste. Aquí demuestras lo que sabes hacer.
            </h1>
            <p className="max-w-xl text-lg text-ink-2 sm:text-xl">
              Sin experiencia no hay trabajo, y sin trabajo no hay experiencia. Las empresas publican retos reales;
              los estudiantes los resuelven y se llevan una evidencia valorada por una empresa de verdad.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/registro?rol=estudiante" className="btn btn-primary px-6 py-3 text-base">
                Soy estudiante
              </Link>
              <Link href="/registro?rol=empresa" className="btn px-6 py-3 text-base">
                Soy empresa
              </Link>
            </div>
            {registrados !== null && registrados > 0 && (
              <Link href="/panel" className="inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink">
                <span className="h-2 w-2 animate-pulse rounded-full bg-ok" aria-hidden="true" />
                <span>
                  <strong className="tabular text-ink">{registrados}</strong>{" "}
                  {registrados === 1 ? "estudiante ya registrado" : "estudiantes ya registrados"} · ver el panel en vivo
                </span>
              </Link>
            )}
          </div>
          <div className="hidden flex-col items-center gap-2 md:flex">
            <Escudo size={210} />
            <span className="font-script text-4xl text-ink">Hispanidad Futura</span>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-2">
          <span className="eyebrow">Cómo funciona</span>
          <h2 className="text-3xl font-bold">De una necesidad a una contratación, en días</h2>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PASOS.map((p, i) => (
            <li key={i} className="card flex flex-col gap-3 p-5">
              <span className="flex items-center gap-3">
                <span className="tabular grid h-8 w-8 place-items-center rounded-full border border-ink font-mono text-sm">
                  {i + 1}
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-ink-3">{p.quien}</span>
              </span>
              <p className="text-ink-2">{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Si no ganas, no pierdes */}
      <section className="bg-ink text-paper">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <span className="eyebrow">Para el estudiante</span>
            <h2 className="text-3xl font-bold sm:text-4xl">Si no ganas, no pierdes</h2>
            <p className="text-lg text-paper/80">
              Te llevas un proyecto real, valorado por una empresa real. Es la experiencia que te piden para tu primer
              trabajo y que nadie te da. Y es gratis, siempre.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <span className="eyebrow">Para la empresa</span>
            <h2 className="text-3xl font-bold sm:text-4xl">Ves el trabajo antes de contratar</h2>
            <p className="text-lg text-paper/80">
              Sin organizar procesos ni hackathons propios. Publicas un reto y descubres talento joven de dos países.
            </p>
            <p className="mt-2 border-l-2 border-gold pl-4 text-paper">
              <strong>La IA prepara; decide una persona.</strong>{" "}
              <span className="text-paper/80">Monta el reto y resume las entregas, pero no pone notas ni ordena candidatos.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Piloto entre dos países */}
      <section className="mx-auto flex w-full max-w-5xl flex-col items-start gap-6 px-4 py-14 sm:px-6">
        <span className="eyebrow">Piloto de 90 días</span>
        <h2 className="text-3xl font-bold">España y México, conectados por sus universidades</h2>
        <p className="max-w-2xl text-lg text-ink-2">
          Una iniciativa del Club Hispanidad Futura para convertir la comunidad iberoamericana en una plataforma de
          oportunidades para el talento joven.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/registro?rol=estudiante" className="btn btn-primary px-6 py-3 text-base">
            Crear mi pasaporte
          </Link>
          <Link href="/retos" className="btn px-6 py-3 text-base">
            Ver retos abiertos
          </Link>
        </div>
      </section>
    </main>
  );
}
