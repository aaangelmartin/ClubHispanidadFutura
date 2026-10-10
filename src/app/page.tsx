// Dueño: perfil 1 (entrada y demanda). Landing «pasaporte de talento»: el producto es el pasaporte,
// así que la portada es un pasaporte abierto al que llegan los sellos de las empresas.
// Ver docs/PRD.md §1–3 y §8 P1.
import Link from "next/link";
import { contarEstudiantes } from "./panel/queries";
import Pasaporte from "./_landing/Pasaporte";
import p from "./_landing/pasaporte.module.css";

export const dynamic = "force-dynamic";

const PASOS = [
  {
    titulo: "Una empresa cuenta lo que necesita",
    texto: "Con sus palabras, sin redactar ofertas. Empresas de España y Colombia con un problema real.",
  },
  {
    titulo: "La IA lo convierte en un reto de días",
    texto: "Enunciado, entregable y rúbrica. Acotado para que lo pueda hacer alguien junior en remoto.",
  },
  {
    titulo: "Lo resuelves y la empresa pone su sello",
    texto: "Valora cada entrega con la rúbrica y escribe feedback. Ganes o no, el sello queda en tu pasaporte.",
  },
];

function Artefacto({ i }: { i: number }) {
  if (i === 0)
    return (
      <p className="rounded-lg bg-white/70 p-4 text-[15px] leading-relaxed text-[var(--tinta)] ring-1 ring-black/5">
        “Queremos entender por qué los clientes abandonan el carrito en la app. Buscamos a alguien junior que sepa de datos.”
        <span className="mt-2 block text-sm text-[var(--tinta-2)]">Ibérica Retail, Madrid</span>
      </p>
    );
  if (i === 1)
    return (
      <div className="rounded-lg bg-white/70 p-4 ring-1 ring-black/5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-bold text-[var(--tinta)]">Reduce el abandono del carrito</span>
          <span className={`${p.datos} shrink-0 text-xs text-[var(--tinta-2)]`}>5 días</span>
        </div>
        <ul className={`${p.datos} mt-3 flex flex-col gap-1.5 text-xs text-[var(--tinta-2)]`}>
          {[
            ["Rigor del análisis", 40],
            ["Propuestas medibles", 35],
            ["Claridad", 25],
          ].map(([c, w]) => (
            <li key={c} className="flex items-center gap-2">
              <span className="w-32 shrink-0">{c}</span>
              <span className="h-1.5 flex-1 rounded-full bg-[var(--tinta)]/10">
                <span className="block h-1.5 rounded-full bg-[var(--tinta)]" style={{ width: `${w}%` }} />
              </span>
              <span className="w-8 text-right">{w}%</span>
            </li>
          ))}
        </ul>
      </div>
    );
  return (
    <div className="flex items-center gap-4 rounded-lg bg-white/70 p-4 ring-1 ring-black/5">
      <span
        className={`${p.datos} grid h-20 w-20 shrink-0 -rotate-6 place-items-center rounded-full border-[3px] border-[var(--sello-a)] text-center text-[var(--sello-a)] mix-blend-multiply`}
      >
        <span className="text-[8px] font-bold leading-tight tracking-[0.14em]">
          VALORADO
          <br />
          <span className="text-xl leading-none">8,6</span>
        </span>
      </span>
      <p className="text-sm text-[var(--tinta-2)]">
        “Buen análisis del embudo. Las propuestas se pueden medir desde la primera semana.”
      </p>
    </div>
  );
}

export default async function Home() {
  const registrados = await contarEstudiantes();

  return (
    <main className={`${p.page} overflow-x-clip`}>
      {/* Portada: la tapa del pasaporte */}
      <section className={p.tapa}>
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:pb-28 lg:pt-20">
          <div className="flex flex-col gap-7">
            <h1 className={`${p.display} ${p.entra} text-[38px] sm:text-5xl lg:text-[54px]`}>
              El CV dice lo que hiciste. Aquí demuestras lo que sabes hacer.
            </h1>
            <p className={`${p.entra} max-w-[34rem] text-lg leading-relaxed text-[#c9d1de]`} style={{ animationDelay: "150ms" }}>
              Resuelve retos reales de empresas de España y Colombia. Cada entrega valorada es un sello en tu pasaporte de
              talento, ganes o no.
            </p>
            <div className={`${p.entra} flex flex-col gap-3 sm:flex-row`} style={{ animationDelay: "280ms" }}>
              <Link
                href="/registro?rol=estudiante"
                className={`${p.boton} inline-flex items-center justify-center rounded-lg bg-[var(--oro)] px-7 py-3.5 text-[17px] font-bold text-[var(--tapa)] shadow-[0_10px_30px_-10px_rgba(200,150,58,0.8)]`}
              >
                Crear mi pasaporte
              </Link>
              <Link
                href="/registro?rol=empresa"
                className={`${p.boton} inline-flex items-center justify-center rounded-lg px-7 py-3.5 text-[17px] font-bold text-[#f3efe6] ring-1 ring-white/30 hover:ring-white/60`}
              >
                Publicar un reto
              </Link>
            </div>
            <p className={`${p.entra} text-sm text-[#9aa6b8]`} style={{ animationDelay: "400ms" }}>
              {registrados ? (
                <Link href="/panel" className="underline decoration-white/30 underline-offset-4 hover:text-white">
                  <span className="tabular font-bold text-white">{registrados}</span>{" "}
                  {registrados === 1 ? "estudiante ya tiene" : "estudiantes ya tienen"} su pasaporte
                </Link>
              ) : (
                "Gratis para estudiantes. Piloto de 90 días entre España y Colombia."
              )}
            </p>
          </div>

          <Pasaporte />
        </div>
      </section>

      {/* Cómo se consigue un sello: es una secuencia, de ahí la numeración */}
      <section className={`${p.seguridad} text-[var(--tinta)]`}>
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <h2 className={`${p.display} max-w-3xl text-4xl sm:text-5xl`}>Así se consigue un sello</h2>
          <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {PASOS.map((paso, i) => (
              <li key={paso.titulo} className="flex flex-col gap-4">
                <span className={`${p.display} text-6xl text-[var(--oro)]`}>{i + 1}</span>
                <h3 className="text-xl font-bold leading-snug" style={{ fontFamily: "var(--font-archivo), sans-serif" }}>{paso.titulo}</h3>
                <p className="leading-relaxed text-[var(--tinta-2)]">{paso.texto}</p>
                <div className="mt-2">
                  <Artefacto i={i} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Para empresas y la regla de la IA */}
      <section className={p.tapa}>
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 sm:px-8 md:grid-cols-2 md:items-end">
          <div className="flex flex-col gap-6">
            <h2 className={`${p.display} text-4xl sm:text-5xl`}>Ve el trabajo antes de contratar</h2>
            <p className="max-w-md text-lg leading-relaxed text-[#c9d1de]">
              Describe lo que necesitas y recibe entregas de estudiantes de dos países. Sin organizar procesos ni
              hackathons propios.
            </p>
            <Link
              href="/registro?rol=empresa"
              className={`${p.boton} inline-flex w-fit items-center justify-center rounded-lg bg-[#f3efe6] px-7 py-3.5 text-[17px] font-bold text-[var(--tapa)]`}
            >
              Publicar un reto
            </Link>
          </div>
          <div className="flex flex-col gap-3 border-l-2 border-[var(--oro)] pl-6">
            <p className={`${p.display} text-2xl sm:text-3xl`}>La IA prepara. Decide una persona.</p>
            <p className="leading-relaxed text-[#c9d1de]">
              La IA monta el reto y resume cada entrega, pero no pone notas ni ordena candidatos. Las notas y los sellos
              los pone la empresa.
            </p>
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section className={`${p.seguridad} text-[var(--tinta)]`}>
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-20 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p className={`${p.display} max-w-xl text-3xl sm:text-4xl`}>Tu primer sello está a un reto de distancia.</p>
          <Link
            href="/registro?rol=estudiante"
            className={`${p.boton} inline-flex items-center justify-center rounded-lg bg-[var(--tapa)] px-7 py-3.5 text-[17px] font-bold text-[#f3efe6]`}
          >
            Crear mi pasaporte
          </Link>
        </div>
      </section>
    </main>
  );
}
