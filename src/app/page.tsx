// Dueño: perfil 1 (entrada y demanda). Landing con movimiento: titular animado, banda continua,
// recorrido fijo por escenas, texto que se ilumina con el scroll y arco España ↔ México.
// Ver docs/PRD.md §1–3 y §8 P1.
import Link from "next/link";
import { contarEstudiantes } from "./panel/queries";
import { AlVer, Contador, Recorrido, Revelar, TextoScroll, type Paso } from "./_landing/movimiento";
import s from "./_landing/landing.module.css";

export const dynamic = "force-dynamic";

const TITULAR = "El CV dice lo que hiciste. Aquí demuestras lo que sabes hacer.";

const BANDA = [
  "Retos reales de empresas",
  "Sin CV",
  "Sin visado",
  "En remoto",
  "Días, no semanas",
  "Valorado por la empresa",
  "Gratis para estudiantes",
  "España ↔ México",
];

const PASOS: Paso[] = [
  { quien: "Empresa", titulo: "Cuenta qué necesita", texto: "Con sus palabras: el problema que quiere resolver y el perfil que busca." },
  { quien: "IA", titulo: "Lo convierte en un reto", texto: "Enunciado, entregable, plazo de días y una rúbrica clara. La empresa lo revisa y publica." },
  { quien: "Estudiante", titulo: "Lo resuelve en remoto", texto: "Desde España o México, sin CV ni visado. Entrega un enlace y explica su solución." },
  { quien: "Empresa", titulo: "Valora y contacta", texto: "Valora cada entrega con la rúbrica. Gane o no, todo queda en el pasaporte del estudiante." },
];

function Escudo({ size }: { size: number }) {
  return (
    <svg width={size} height={(size * 311) / 268} viewBox="0 0 268 311" aria-hidden="true">
      <path
        className={s.draw}
        d="M12 6 H256 V185 C256 245 212 282 134 305 C56 282 12 245 12 185 Z"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="10"
      />
      <g className={s.fadeLate}>
        <rect x="0" y="92" width="268" height="70" fill="var(--bg)" />
        <text
          x="134"
          y="146"
          textAnchor="middle"
          fill="var(--gold)"
          style={{ fontFamily: "var(--font-raleway), sans-serif", fontWeight: 800, fontSize: 64, letterSpacing: 4 }}
        >
          RETOS
        </text>
      </g>
    </svg>
  );
}

function Tarjeta({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`card w-full max-w-md p-6 shadow-[0_24px_60px_-30px_rgba(20,35,61,0.45)] ${className}`}>{children}</div>;
}

const ESCENAS = [
  <Tarjeta key="empresa">
    <span className="eyebrow">Ibérica Retail · Madrid</span>
    <p className="mt-2 text-sm font-semibold">¿Qué necesitas resolver?</p>
    <p className={`mt-3 min-h-28 rounded-md border border-line bg-bg p-4 text-ink-2 ${s.caret}`}>
      Queremos saber por qué los clientes abandonan el carrito en la app y buscamos a alguien junior que sepa de datos
    </p>
    <span className="btn btn-primary mt-4">Generar reto con IA</span>
  </Tarjeta>,
  <Tarjeta key="ia">
    <div className="flex items-center justify-between">
      <span className="eyebrow">Reto generado</span>
      <span className="chip">5 días</span>
    </div>
    <h4 className="mt-3 font-display text-2xl font-bold">Encuentra por qué se abandona el carrito</h4>
    <p className="mt-2 text-sm text-ink-2">Analiza un mes de eventos anonimizados y propón tres mejoras medibles.</p>
    <div className="mt-5 flex flex-col gap-3">
      {[
        ["Rigor del análisis", 40],
        ["Calidad de las propuestas", 35],
        ["Claridad al explicarlo", 25],
      ].map(([c, w], i) => (
        <div key={c} className="flex flex-col gap-1">
          <div className="flex justify-between text-sm">
            <span>{c}</span>
            <span className="tabular font-mono text-ink-3">{w}%</span>
          </div>
          <div className="h-2 rounded-full bg-line">
            <div className={`h-2 rounded-full bg-ink ${s.grow}`} style={{ width: `${w}%`, animationDelay: `${i * 150}ms` }} />
          </div>
        </div>
      ))}
    </div>
  </Tarjeta>,
  <Tarjeta key="estudiante">
    <span className="eyebrow">Entrega · Diego, UNAM</span>
    <div className="mt-4 flex items-center gap-3 rounded-md border border-line bg-bg p-3">
      <span className="grid h-9 w-9 place-items-center rounded-md bg-ink font-mono text-xs text-paper">{"</>"}</span>
      <span className="truncate font-mono text-sm">github.com/diego-h/carrito-analisis</span>
    </div>
    <p className="mt-4 text-ink-2">
      “El 38 % abandona en el paso de envío. Propongo mostrar el coste antes y un pago en un clic.”
    </p>
    <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-ok">
      <span className={`grid h-6 w-6 place-items-center rounded-full bg-ok text-paper ${s.stamp}`}>✓</span>
      Entregado a tiempo
    </div>
  </Tarjeta>,
  <Tarjeta key="pasaporte" className="relative border-t-4 border-t-gold">
    <span className="eyebrow">Pasaporte de talento</span>
    <h4 className="mt-2 font-display text-3xl font-bold">Diego Hernández</h4>
    <p className="text-ink-2">UNAM · México</p>
    <div className="mt-5 flex items-center justify-between rounded-md bg-gold-soft p-4">
      <div>
        <p className="font-semibold">Abandono del carrito</p>
        <p className="text-sm text-ink-2">Valorado por Ibérica Retail · España</p>
      </div>
      <span className="font-display text-3xl font-bold text-gold">8,6</span>
    </div>
    <span
      className={`absolute -right-4 -top-6 grid h-24 w-24 place-items-center rounded-full border-4 border-gold bg-paper text-center font-mono text-[10px] font-bold uppercase leading-tight tracking-widest text-gold ${s.stamp}`}
    >
      Valorado
      <br />
      por la
      <br />
      empresa
    </span>
  </Tarjeta>,
];

export default async function Home() {
  const registrados = await contarEstudiantes();

  return (
    <main className="flex flex-col overflow-x-clip">
      {/* Hero */}
      <section className="relative">
        <div className="mx-auto grid min-h-[calc(100svh-64px)] max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.25fr_1fr]">
          <div className="flex flex-col gap-7">
            <span className={`eyebrow ${s.word}`} style={{ animationDelay: "0ms" }}>
              Retos reales online · España ↔ México
            </span>
            <h1 className="text-5xl font-bold leading-[1.02] sm:text-7xl">
              {TITULAR.split(" ").map((w, i) => (
                <span key={i}>
                  <span className={s.word} style={{ animationDelay: `${120 + i * 70}ms` }}>
                    {w.startsWith("demuestras") ? <em className="font-display not-italic text-gold">{w}</em> : w}
                  </span>{" "}
                </span>
              ))}
            </h1>
            <p className={`max-w-xl text-lg text-ink-2 sm:text-xl ${s.word}`} style={{ animationDelay: "900ms" }}>
              Sin experiencia no hay trabajo, y sin trabajo no hay experiencia. Rompe el círculo resolviendo retos
              reales de empresas. Ganes o no, te llevas una evidencia valorada.
            </p>
            <div className={s.word} style={{ animationDelay: "1050ms" }}>
             <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/registro?rol=estudiante"
                className="btn btn-primary group px-7 py-3.5 text-base transition-transform hover:-translate-y-0.5"
              >
                Soy estudiante
                <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
              <Link href="/registro?rol=empresa" className="btn px-7 py-3.5 text-base transition-transform hover:-translate-y-0.5">
                Soy empresa
              </Link>
             </div>
            </div>
            {registrados !== null && registrados > 0 && (
              <Link
                href="/panel"
                className={`inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink ${s.word}`}
                style={{ animationDelay: "1200ms" }}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ok" />
                </span>
                <strong className="tabular text-ink">{registrados}</strong>
                {registrados === 1 ? "estudiante ya registrado" : "estudiantes ya registrados"} · ver panel en vivo
              </Link>
            )}
          </div>

          <div className="relative mx-auto hidden h-[440px] w-full max-w-[420px] md:block">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <Escudo size={220} />
              <span className={`font-script text-5xl text-ink ${s.fadeLate}`}>Hispanidad Futura</span>
            </div>
            <div className={`card absolute -left-10 top-6 px-4 py-3 shadow-lg ${s.float}`}>
              <span className="font-mono text-xs uppercase tracking-widest text-ink-3">Reto · 5 días</span>
              <p className="font-semibold">Análisis de datos</p>
            </div>
            <div className={`card absolute -right-8 -bottom-2 flex items-center gap-3 px-4 py-3 shadow-lg ${s.floatSlow}`}>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gold text-paper">✓</span>
              <div>
                <p className="text-sm font-semibold">Valorado por la empresa</p>
                <p className="font-mono text-xs text-ink-3">8,6 / 10</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banda continua */}
      <section className="flex -rotate-1 flex-col gap-3 bg-ink py-5 text-paper" aria-label="Ventajas">
        {[false, true].map((rev) => (
          <div key={String(rev)} className="overflow-hidden">
            <div className={`${s.marquee} ${rev ? s.marqueeReverse : ""}`}>
              {[...BANDA, ...BANDA].map((t, i) => (
                <span key={i} className={`flex items-center gap-6 px-6 ${rev ? "font-mono text-sm uppercase tracking-widest text-paper/60" : "font-display text-2xl font-bold sm:text-3xl"}`}>
                  {t}
                  <span className="text-gold" aria-hidden="true">✦</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Recorrido por escenas */}
      <section id="como-funciona" className="mt-10">
        <Recorrido pasos={PASOS} escenas={ESCENAS} />
      </section>

      {/* Si no ganas, no pierdes */}
      <section id="si-no-ganas" className="bg-ink">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-24 sm:px-6 sm:py-32">
          <span className="eyebrow">Si no ganas, no pierdes</span>
          <TextoScroll
            texto="Te llevas un proyecto real, valorado por una empresa real. Es la experiencia que te piden para tu primer trabajo y que nadie te da."
            destacadas={["real", "experiencia"]}
          />
          <Revelar>
            <p className="max-w-2xl border-l-2 border-gold pl-5 text-lg text-paper/80">
              <strong className="text-paper">La IA prepara; decide una persona.</strong> Monta el reto y resume las
              entregas, pero no pone notas ni ordena candidatos. Gratis para el estudiante, siempre.
            </p>
          </Revelar>
        </div>
      </section>

      {/* Piloto entre dos países */}
      <section id="piloto" className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 md:grid-cols-2">
        <Revelar className="flex flex-col gap-5">
          <span className="eyebrow">Piloto de 90 días</span>
          <h2 className="text-4xl font-bold sm:text-5xl">España y México, conectados por sus universidades</h2>
          <p className="text-lg text-ink-2">
            Una iniciativa del Club Hispanidad Futura para convertir la comunidad iberoamericana en una plataforma de
            oportunidades para el talento joven.
          </p>
        </Revelar>
        <AlVer>
          <svg viewBox="-50 0 620 260" className="w-full" role="img" aria-label="Arco que une Ciudad de México y Madrid">
            <path className={s.arc} d="M60 200 C 160 20, 360 20, 460 170" fill="none" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" />
            <path d="M60 200 C 160 20, 360 20, 460 170" fill="none" stroke="var(--line)" strokeWidth="1" strokeDasharray="4 8" />
            {[
              [60, 200, "Ciudad de México"],
              [460, 170, "Madrid"],
            ].map(([x, y, label]) => (
              <g key={label as string}>
                <circle className={s.pulse} cx={x as number} cy={y as number} r="8" fill="var(--gold)" />
                <circle cx={x as number} cy={y as number} r="8" fill="var(--ink)" />
                <text x={x as number} y={(y as number) + 36} textAnchor="middle" fill="var(--ink)" style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 14, letterSpacing: 2 }}>
                  {(label as string).toUpperCase()}
                </text>
              </g>
            ))}
          </svg>
        </AlVer>
      </section>

      {/* Llamada final */}
      <section className="px-4 pb-24 sm:px-6">
        <Revelar className="mx-auto flex max-w-5xl flex-col items-center gap-6 rounded-2xl bg-paper px-6 py-16 text-center ring-1 ring-line">
          {registrados !== null && registrados > 0 && (
            <p className="font-display text-6xl font-bold sm:text-8xl">
              <Contador hasta={registrados} />
            </p>
          )}
          <h2 className="text-3xl font-bold sm:text-5xl">
            {registrados === 1 ? "estudiante ya ha empezado. ¿Y tú?" : registrados ? "estudiantes ya han empezado. ¿Y tú?" : "Empieza a demostrar lo que sabes hacer"}
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/registro?rol=estudiante" className="btn btn-primary px-7 py-3.5 text-base">
              Crear mi pasaporte
            </Link>
            <Link href="/retos" className="btn px-7 py-3.5 text-base">
              Ver retos abiertos
            </Link>
          </div>
        </Revelar>
      </section>
    </main>
  );
}
