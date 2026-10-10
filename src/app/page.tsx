// Dueño: perfil 1 (entrada y demanda). Landing oscura y tecnológica: la IA monta un reto en directo,
// retos reales en vez de puzzles, evidencia en vez de CV y las dos entradas. Ver docs/PRD.md §1–3 y §8 P1.
import Link from "next/link";
import { contarEstudiantes } from "./panel/queries";
import { Contador, Revelar } from "./_landing/movimiento";
import { Escribir, Inclinar } from "./_landing/tech";
import t from "./_landing/tech.module.css";

export const dynamic = "force-dynamic";

const SANS = { fontFamily: "var(--font-source-sans), system-ui, sans-serif" };

const JSON_RETO = `{
  "title": "Reduce el abandono del carrito",
  "duration_days": 5,
  "profile": "Junior de datos (Python o SQL)",
  "deliverable": "Repo + informe de 2 páginas",
  "rubric": [
    { "criterion": "Rigor del análisis", "weight": 40 },
    { "criterion": "Propuestas medibles", "weight": 35 },
    { "criterion": "Claridad al explicarlo", "weight": 25 }
  ],
  "warnings": []
}`;

const STACK = ["Python", "SQL", "React", "Node.js", "TypeScript", "Power BI", "Figma", "Java", "Ciberseguridad", "Machine learning", "Cloud", "Producto"];

const BLOQUES = [
  {
    eyebrow: "Retos reales",
    titulo: "Problemas de empresas, no puzzles de algoritmos",
    puntos: ["La empresa describe su necesidad con sus palabras", "La IA la convierte en un reto acotado: días, no semanas", "Entrega real: repo, demo o informe"],
  },
  {
    eyebrow: "Pasaporte",
    titulo: "Evidencia valorada, no un CV más",
    puntos: ["Cada entrega recibe nota por criterio y feedback", "Ganes o no, queda en tu pasaporte público", "Un enlace que enseñas en cualquier entrevista"],
  },
  {
    eyebrow: "IA responsable",
    titulo: "La IA prepara. Decide una persona",
    puntos: ["Monta el reto y resume cada entrega", "No pone notas ni ordena candidatos", "Alineado con la Ley de IA de la UE"],
  },
];

const ENTRADAS = [
  {
    quien: "Para estudiantes",
    titulo: "Tu primera experiencia real",
    texto: "Elige un reto, entrégalo en días y construye un pasaporte que enseña lo que sabes hacer. Gratis, siempre.",
    cta: "Crear mi pasaporte",
    href: "/registro?rol=estudiante",
    destacado: true,
  },
  {
    quien: "Para empresas",
    titulo: "Ve el trabajo antes de contratar",
    texto: "Describe tu necesidad y la IA monta el reto. Recibe entregas de dos países y contacta a quien lo demuestra.",
    cta: "Publicar un reto",
    href: "/registro?rol=empresa",
    destacado: false,
  },
];

function Flecha() {
  return (
    <span className="text-[var(--d-gold)]" aria-hidden="true">
      →
    </span>
  );
}

function Punto() {
  return (
    <span className="relative flex h-2 w-2">
      <span className={`absolute inline-flex h-full w-full rounded-full bg-[var(--d-live)] ${t.ping}`} />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--d-live)]" />
    </span>
  );
}

function Etiqueta({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--d-gold)]">{children}</span>;
}

function VentanaProducto() {
  return (
    <div className={t.ring}>
      <div className="overflow-hidden rounded-[17px] bg-[#0b111d]">
        <div className="flex items-center gap-2 border-b border-[var(--d-line)] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 truncate font-mono text-xs text-[var(--d-muted)]">retos · hispanidad futura · nuevo reto</span>
          <span className="ml-auto hidden rounded-full border border-[var(--d-line)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[var(--d-muted)] sm:inline">
            Ejemplo piloto
          </span>
        </div>
        <div className="grid md:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col gap-4 border-b border-[var(--d-line)] p-5 md:border-b-0 md:border-r">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--d-gold)]">La empresa escribe</span>
            <p className="rounded-lg border border-[var(--d-line)] bg-white/[0.03] p-3 text-sm leading-relaxed">
              “Somos un e-commerce de Madrid. Queremos entender por qué los clientes abandonan el carrito en la app.
              Buscamos a alguien junior que sepa de datos.”
            </p>
            <div className="flex flex-col gap-2.5">
              {(
                [
                  ["Rigor del análisis", 40],
                  ["Propuestas medibles", 35],
                  ["Claridad al explicarlo", 25],
                ] as const
              ).map(([c, w], i) => (
                <div key={c} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs text-[var(--d-muted)]">
                    <span>{c}</span>
                    <span className="font-mono">{w}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06]">
                    <div
                      className={`h-1.5 rounded-full bg-[var(--d-gold)] ${t.bar}`}
                      style={{ width: `${w}%`, animationDelay: `${1200 + i * 200}ms` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex min-h-[340px] flex-col gap-3 p-5">
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[var(--d-gold)]">
              <Punto />
              La IA monta el reto
            </span>
            <Escribir texto={JSON_RETO} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  const registrados = await contarEstudiantes();

  return (
    <main className={`${t.page} relative overflow-x-clip`}>
      {/* Hero */}
      <section className="relative">
        <div className={`absolute inset-0 ${t.grid}`} aria-hidden="true" />
        <div className={t.glow} style={{ width: 520, height: 520, left: "8%", top: -120, background: "#1d3b7a" }} />
        <div className={t.glow} style={{ width: 420, height: 420, right: "6%", top: 80, background: "#8a5d12", animationDelay: "-4s" }} />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
          <Link
            href="/panel"
            className={`${t.rise} ${t.glass} inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-[var(--d-muted)] hover:text-[var(--d-text)]`}
          >
            <Punto />
            {registrados ? (
              <span>
                <strong className="tabular text-[var(--d-text)]">{registrados}</strong> estudiantes ya dentro · ver en vivo
              </span>
            ) : (
              <span>Piloto abierto · España ↔ Colombia</span>
            )}
            <Flecha />
          </Link>

          <h1
            className={`${t.rise} max-w-5xl text-5xl font-bold leading-[0.98] tracking-[-0.035em] sm:text-7xl lg:text-[88px]`}
            style={{ ...SANS, animationDelay: "120ms" }}
          >
            El CV dice lo que hiciste.
            <br />
            <span className={t.gradText}>Aquí demuestras lo que sabes hacer.</span>
          </h1>

          <p className={`${t.rise} max-w-2xl text-lg text-[var(--d-muted)] sm:text-xl`} style={{ animationDelay: "260ms" }}>
            Empresas de España y Colombia publican retos reales. La IA los monta en segundos. Tú los resuelves en remoto y
            te llevas una evidencia valorada por una empresa, ganes o no.
          </p>

          <div className={`${t.rise} flex w-full flex-col gap-3 sm:w-auto sm:flex-row`} style={{ animationDelay: "380ms" }}>
            <Link
              href="/registro?rol=estudiante"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--d-gold)] px-7 py-3.5 font-semibold text-[#14110a] shadow-[0_0_40px_-8px_var(--d-gold)] transition hover:-translate-y-0.5 hover:shadow-[0_0_60px_-6px_var(--d-gold)]"
            >
              Soy estudiante · Empezar gratis
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </Link>
            <Link
              href="/registro?rol=empresa"
              className={`${t.glass} inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-semibold transition hover:-translate-y-0.5 hover:border-white/25`}
            >
              Soy empresa · Publicar un reto
            </Link>
          </div>

          <div className={`${t.rise} mt-6 w-full max-w-5xl text-left`} style={{ animationDelay: "520ms" }}>
            <Inclinar>
              <VentanaProducto />
            </Inclinar>
          </div>
        </div>
      </section>

      {/* Banda de tecnologías */}
      <section className="border-y border-[var(--d-line)] py-6" aria-label="Áreas de los retos">
        <p className="mb-4 text-center font-mono text-xs uppercase tracking-[0.2em] text-[var(--d-muted)]">
          Retos de software y datos para el talento joven iberoamericano
        </p>
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_15%,#000_85%,transparent)]">
          <div className={t.marquee}>
            {[...STACK, ...STACK].map((s, i) => (
              <span key={i} className="mx-2 rounded-full border border-[var(--d-line)] px-4 py-1.5 font-mono text-sm text-[var(--d-muted)]">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* El problema y cómo lo resolvemos */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Revelar className="flex flex-col items-center gap-4 text-center">
          <Etiqueta>El círculo que rompemos</Etiqueta>
          <h2 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl" style={SANS}>
            Sin experiencia no hay trabajo. Sin trabajo no hay experiencia.
          </h2>
        </Revelar>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {BLOQUES.map((b, i) => (
            <Revelar key={b.titulo} retraso={i * 120} className="h-full">
              <div className={`${t.glass} flex h-full flex-col gap-4 rounded-2xl p-7 transition hover:-translate-y-1 hover:border-white/20`}>
                <Etiqueta>{b.eyebrow}</Etiqueta>
                <h3 className="text-2xl font-bold leading-tight" style={SANS}>
                  {b.titulo}
                </h3>
                <ul className="flex flex-col gap-2.5 text-[var(--d-muted)]">
                  {b.puntos.map((p) => (
                    <li key={p} className="flex gap-2">
                      <Flecha />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Revelar>
          ))}
        </div>
      </section>

      {/* Dos entradas */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <Revelar className="mb-12 flex flex-col items-center gap-3 text-center">
          <Etiqueta>Una plataforma, dos lados</Etiqueta>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl" style={SANS}>
            ¿Desde qué lado entras?
          </h2>
        </Revelar>
        <div className="grid gap-5 md:grid-cols-2">
          {ENTRADAS.map((c, i) => (
            <Revelar key={c.quien} retraso={i * 120} className="h-full">
              <Link
                href={c.href}
                className={`${t.glass} group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl p-8 transition hover:-translate-y-1 hover:border-white/20`}
              >
                {c.destacado && (
                  <span className={t.glow} style={{ width: 260, height: 260, right: -60, top: -80, background: "#8a5d12", opacity: 0.35 }} />
                )}
                <span className="relative">
                  <Etiqueta>{c.quien}</Etiqueta>
                </span>
                <h3 className="relative text-3xl font-bold" style={SANS}>
                  {c.titulo}
                </h3>
                <p className="relative text-[var(--d-muted)]">{c.texto}</p>
                <span className="relative mt-auto inline-flex items-center gap-2 pt-4 font-semibold">
                  {c.cta}
                  <span className="transition-transform group-hover:translate-x-1">
                    <Flecha />
                  </span>
                </span>
              </Link>
            </Revelar>
          ))}
        </div>
      </section>

      {/* Cierre */}
      <section className="relative overflow-hidden border-t border-[var(--d-line)]">
        <div className={`absolute inset-0 ${t.grid}`} aria-hidden="true" />
        <div className={t.glow} style={{ width: 600, height: 300, left: "50%", bottom: -200, marginLeft: -300, background: "#8a5d12" }} />
        <Revelar className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-28 text-center sm:px-6">
          {registrados !== null && registrados > 0 && (
            <p className="text-7xl font-bold tracking-tight sm:text-8xl" style={SANS}>
              <Contador hasta={registrados} />
            </p>
          )}
          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl" style={SANS}>
            {registrados ? (
              registrados === 1 ? "estudiante ya está demostrando. ¿Y tú?" : "estudiantes ya están demostrando. ¿Y tú?"
            ) : (
              <>
                Empieza a <span className={t.gradText}>demostrar</span>.
              </>
            )}
          </h2>
          <p className="text-[var(--d-muted)]">Piloto de 90 días entre España y Colombia · Una iniciativa del Club Hispanidad Futura</p>
          <Link
            href="/registro?rol=estudiante"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--d-gold)] px-8 py-4 font-semibold text-[#14110a] shadow-[0_0_40px_-8px_var(--d-gold)] transition hover:-translate-y-0.5"
          >
            Crear mi pasaporte gratis <span aria-hidden="true">→</span>
          </Link>
        </Revelar>
      </section>
    </main>
  );
}
