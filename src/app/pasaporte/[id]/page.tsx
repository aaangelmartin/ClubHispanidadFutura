// Dueño: perfil 4 (valorar y pasaporte). Página pública: el pasaporte de talento abierto, con datos reales.
// Mismo lenguaje que la landing (perfil 1): tapa marino, papel de seguridad, zona de lectura mecánica y sellos.
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { pasaporteFonts } from "@/app/empresa/_lib/fonts";
import p from "@/app/empresa/_lib/pasaporte.module.css";
import Sello, { fechaSello, tinta } from "@/app/empresa/_lib/Sello";
import CopyLink from "./CopyLink";
import Accion from "@/app/empresa/_lib/Accion";
import { getPassport, weightedScore } from "./queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const passport = await getPassport(id);
  return { title: passport ? `Pasaporte de ${passport.student.name}` : "Pasaporte" };
}

const ISO3: Record<string, string> = { España: "ESP", México: "MEX", Colombia: "COL" };
const coma = (n: number | null) => (n === null ? "—" : n.toFixed(1).replace(".", ","));
const mrz = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "<");

// Dónde cae cada sello en la página de sellos (como en la landing).
const POS: React.CSSProperties[] = [
  { left: "6%", top: "12%" },
  { right: "5%", top: "38%" },
  { left: "10%", bottom: "8%" },
  { right: "8%", bottom: "6%" },
];

function Campo({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex flex-col">
      <span className={`${p.datos} text-[9px] tracking-wider text-[var(--tinta-2)]`}>{etiqueta}</span>
      <span className={`${p.datos} text-[13px] font-bold text-[var(--tinta)]`}>{valor}</span>
    </div>
  );
}

function Escudo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 268 311" className={className} aria-hidden="true">
      <path d="M12 6 H256 V185 C256 245 212 282 134 305 C56 282 12 245 12 185 Z" fill="none" stroke="currentColor" strokeWidth="12" />
    </svg>
  );
}

export default async function Pasaporte({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const passport = await getPassport(id);
  if (!passport) notFound();
  const { student, entries } = passport;

  const evaluated = entries
    .filter((e) => e.evaluation)
    .map((e) => ({ ...e, score: weightedScore(e.challenge.rubric, e.evaluation!.scores) }));
  const inProgress = entries.filter((e) => !e.evaluation);
  const scores = evaluated.map((e) => e.score).filter((s): s is number => s !== null);
  const average = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
  const countries = [...new Set(evaluated.map((e) => e.challenge.company.country))];

  const [nombre, ...resto] = student.name.split(" ");
  const apellidos = resto.join(" ") || nombre!;
  const pais = ISO3[student.country] ?? mrz(student.country).slice(0, 3);
  const linea1 = `P<${pais}${mrz(apellidos)}<<${mrz(nombre!)}`.padEnd(44, "<").slice(0, 44);
  const linea2 = `RETOS${String(evaluated.length).padStart(4, "0")}<${pais}${student.id.replace(/-/g, "").slice(0, 14).toUpperCase()}`
    .padEnd(44, "<")
    .slice(0, 44);

  return (
    <div className={`${pasaporteFonts} ${p.page} ${p.seguridad} min-h-screen`}>
      {/* Tapa: titular y pasaporte abierto */}
      <section className={p.tapa}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.25fr] lg:py-16">
          <div className="flex flex-col gap-5">
            <span className={`${p.datos} text-xs tracking-[0.2em] text-[var(--oro)]`}>PASAPORTE DE TALENTO · IBEROAMÉRICA</span>
            <h1 className="text-5xl text-[#f3efe6] sm:text-6xl">{student.name}</h1>
            <p className="text-lg text-[#f3efe6]/75">
              {student.university} · {student.country}
            </p>
            <div className="grid grid-cols-3 gap-4 border-y border-white/10 py-5">
              <div className="flex flex-col">
                <span className={`${p.datos} text-[10px] tracking-widest text-[#f3efe6]/60`}>SELLOS</span>
                <span className="text-4xl font-extrabold text-[var(--oro)]">{evaluated.length}</span>
              </div>
              <div className="flex flex-col">
                <span className={`${p.datos} text-[10px] tracking-widest text-[#f3efe6]/60`}>NOTA MEDIA</span>
                <span className="text-4xl font-extrabold text-[#f3efe6]">{coma(average)}</span>
              </div>
              <div className="flex flex-col">
                <span className={`${p.datos} text-[10px] tracking-widest text-[#f3efe6]/60`}>EMPRESAS DE</span>
                <span className="text-lg font-extrabold leading-tight text-[#f3efe6]">{countries.join(" · ") || "—"}</span>
              </div>
            </div>
            {student.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {student.skills.map((s) => (
                  <span key={s} className={`${p.datos} rounded-full border border-white/20 px-3 py-1 text-xs text-[#f3efe6]/85`}>
                    {s}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-4">
              <CopyLink />
              <Accion hecho="Descargando pasaporte en PDF" className={p.botonClaro}>
                Descargar PDF
              </Accion>
              <Accion hecho="Añadido a tu perfil de LinkedIn" className={p.botonClaro}>
                Añadir a LinkedIn
              </Accion>
              {student.github && (
                <a href={student.github} target="_blank" rel="noreferrer" className="text-sm text-[#f3efe6]/80 underline hover:text-[var(--oro)]">
                  GitHub
                </a>
              )}
              {student.portfolio && (
                <a href={student.portfolio} target="_blank" rel="noreferrer" className="text-sm text-[#f3efe6]/80 underline hover:text-[var(--oro)]">
                  Portfolio
                </a>
              )}
            </div>
          </div>

          {/* El pasaporte abierto */}
          <div className={`${p.libro} relative mx-auto w-full max-w-[720px] text-[var(--tinta)]`}>
            <div className="grid overflow-hidden rounded-[14px] ring-1 ring-black/10 sm:grid-cols-2">
              <div className={`${p.seguridad} relative flex flex-col gap-4 p-5 sm:p-6`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className={`${p.datos} text-[10px] font-bold tracking-[0.16em]`}>PASAPORTE DE TALENTO</span>
                    <span className={`${p.datos} text-[9px] tracking-[0.12em] text-[var(--tinta-2)]`}>IBEROAMÉRICA</span>
                  </div>
                  <Escudo className="h-8 w-7 shrink-0 text-[var(--oro)]" />
                </div>
                <div className="flex gap-4">
                  <div className="relative grid h-[118px] w-[92px] shrink-0 place-items-center overflow-hidden rounded-md bg-[#d9dfe2] ring-1 ring-black/10">
                    <span className="text-3xl font-extrabold text-[#9aa6b2]">
                      {student.name
                        .split(" ")
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join("")}
                    </span>
                    <Escudo className="absolute -bottom-3 -right-3 h-12 w-10 text-[var(--oro)] opacity-50" />
                  </div>
                  <div className="grid min-w-0 flex-1 gap-2">
                    <Campo etiqueta="Apellidos" valor={apellidos.toUpperCase()} />
                    <Campo etiqueta="Nombre" valor={nombre!.toUpperCase()} />
                    <Campo etiqueta="Universidad" valor={student.university.toUpperCase()} />
                    <Campo etiqueta="Retos valorados" valor={String(evaluated.length)} />
                  </div>
                </div>
                <div className={`${p.datos} mt-auto flex flex-col gap-0.5 overflow-hidden rounded-sm bg-white/50 px-2 py-2 text-[9px] sm:text-[9.5px]`}>
                  <span className="whitespace-pre">{linea1}</span>
                  <span className="whitespace-pre">{linea2}</span>
                </div>
              </div>
              <div className={`${p.seguridad} relative min-h-[330px] border-t border-black/5 sm:border-l sm:border-t-0`}>
                <span className={`${p.datos} absolute right-5 top-4 text-[9px] tracking-[0.16em] text-[var(--tinta-2)]`}>SELLOS · STAMPS</span>
                {evaluated.length === 0 && (
                  <span className={`${p.datos} absolute inset-0 grid place-items-center px-8 text-center text-xs text-[var(--tinta-2)]`}>
                    Aquí irán los sellos de las empresas que valoren sus retos.
                  </span>
                )}
                {evaluated.slice(0, POS.length).map((e, i) => (
                  <div key={e.id} className="absolute" style={POS[i]}>
                    <Sello
                      i={i}
                      empresa={e.challenge.company.name}
                      lugar={e.challenge.company.country}
                      fecha={fechaSello(e.evaluation!.created_at)}
                      nota={coma(e.score)}
                      animado
                      retraso={400 + i * 500}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className={`${p.lomo} pointer-events-none absolute inset-y-0 left-1/2 hidden w-10 -translate-x-1/2 sm:block`} aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Detalle de cada sello */}
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-4xl">Trabajo demostrado</h2>
          <span className={`${p.datos} text-xs text-[var(--tinta-2)]`}>CADA SELLO LO PONE LA EMPRESA DEL RETO</span>
        </div>

        {evaluated.length === 0 && (
          <p className={`${p.hoja} p-8 text-[var(--tinta-2)]`}>
            Todavía no hay sellos. Cada reto entregado aparecerá aquí con la nota y el feedback de la empresa, gane o no.
          </p>
        )}

        {evaluated.map((e, i) => (
          <article key={e.id} className={`${p.hoja} grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:p-8`}>
            <div className="flex justify-center sm:pt-2">
              <Sello
                i={i}
                forma="circulo"
                size={136}
                empresa={e.challenge.company.name}
                lugar={e.challenge.company.country}
                fecha={fechaSello(e.evaluation!.created_at)}
                nota={coma(e.score)}
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className={`${p.datos} text-xs tracking-wider text-[var(--tinta-2)]`}>
                  {e.challenge.company.name.toUpperCase()} · {e.challenge.company.country.toUpperCase()}
                </span>
                <h3 className="text-2xl">{e.challenge.title}</h3>
                <p className="text-[var(--tinta-2)]">{e.challenge.summary}</p>
              </div>
              <div className="flex flex-col gap-2">
                {e.challenge.rubric.map((r) => {
                  const s = e.evaluation!.scores.find((x) => x.criterion === r.criterion);
                  return (
                    <div key={r.criterion} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 sm:grid-cols-[180px_1fr_auto]">
                      <span className={`${p.datos} text-xs`}>{r.criterion}</span>
                      <div className="order-3 col-span-2 h-2 rounded-full bg-[rgba(20,35,61,0.08)] sm:order-none sm:col-span-1">
                        <div className="h-2 rounded-full" style={{ width: `${s ? s.score * 10 : 0}%`, background: tinta(i) }} />
                      </div>
                      <span className={`${p.datos} text-sm font-bold`}>{s ? s.score : "—"}</span>
                    </div>
                  );
                })}
              </div>
              <blockquote
                className="border-l-4 pl-4 text-lg"
                style={{ borderColor: tinta(i) }}
              >
                “{e.evaluation!.feedback}”
              </blockquote>
              {e.link && (
                <a href={e.link} target="_blank" rel="noreferrer" className={`${p.datos} self-start text-sm font-bold underline hover:text-[var(--oro)]`}>
                  VER LA ENTREGA ↗
                </a>
              )}
            </div>
          </article>
        ))}

        {inProgress.length > 0 && (
          <div className="flex flex-col gap-3 pt-4">
            <h2 className="text-2xl">En curso</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {inProgress.map((e) => (
                <div key={e.id} className={`${p.hoja} flex items-center justify-between gap-3 p-4`}>
                  <div className="flex flex-col">
                    <span className="font-bold">{e.challenge.title}</span>
                    <span className={`${p.datos} text-xs text-[var(--tinta-2)]`}>
                      {e.challenge.company.name} · {e.challenge.company.country}
                    </span>
                  </div>
                  <span className={`${p.datos} rounded-full border border-current px-3 py-1 text-[10px] text-[var(--tinta-2)]`}>
                    {e.submitted_at ? "EN VALORACIÓN" : "APUNTADO"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cómo se verifica: confianza para quien recibe el enlace */}
        <div className="grid gap-4 pt-4 sm:grid-cols-3">
          {[
            ["Empresa real", "Cada sello lo pone la empresa que propuso el reto, con su nombre y fecha."],
            ["Rúbrica pública", "Los criterios y sus pesos se conocían antes de entregar. La nota no es una opinión suelta."],
            ["Decide una persona", "La IA solo resume las entregas. No puntúa ni ordena candidatos (Ley de IA de la UE)."],
          ].map(([t, d], i) => (
            <div key={t} className={`${p.hoja} flex gap-3 p-5`}>
              <span
                className={`${p.datos} grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 text-sm font-bold`}
                style={{ color: tinta(i), borderColor: tinta(i) }}
              >
                ✓
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-extrabold">{t}</span>
                <span className="text-sm text-[var(--tinta-2)]">{d}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Llamada a la acción: cada pasaporte compartido es una puerta de entrada */}
      <section className={p.tapa}>
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-4">
            <span className={`${p.datos} text-xs tracking-[0.2em] text-[var(--oro)]`}>¿BUSCAS TALENTO ASÍ?</span>
            <h2 className="text-4xl text-[#f3efe6] sm:text-5xl">
              Publica un reto y conoce a {nombre} antes de contratar.
            </h2>
            <p className="max-w-xl text-lg text-[#f3efe6]/75">
              Cuéntanos tu problema y la IA lo convierte en un reto de días. Recibes entregas de estudiantes de España y
              Colombia y valoras el trabajo, no el CV. Gratis durante el piloto.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/registro?rol=empresa" className={p.botonOro}>
                Publicar un reto gratis
              </Link>
              <Link href="/registro?rol=estudiante" className={p.botonClaro}>
                Soy estudiante: crear mi pasaporte
              </Link>
            </div>
          </div>
          <ul className={`${p.datos} flex flex-col gap-3 text-sm text-[#f3efe6]/85`}>
            {["Reto listo en minutos con IA", "Entregas en días, no en semanas", "Sin agencias ni procesos largos", "Talento de dos países, en remoto"].map((x) => (
              <li key={x} className="flex items-center gap-3 border-b border-white/10 pb-3">
                <span className="text-[var(--oro)]">✓</span>
                {x}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
