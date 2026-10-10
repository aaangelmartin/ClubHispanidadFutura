// Dueño: perfil 4 (valorar y pasaporte). Página pública: el pasaporte de talento abierto, con datos reales.
// Mismo lenguaje que la landing (perfil 1): tapa marino, papel de seguridad, zona de lectura mecánica y sellos.
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { pasaporteFonts } from "@/app/empresa/_lib/fonts";
import p from "@/app/empresa/_lib/pasaporte.module.css";
import { C, EstadoEntrega, Nota, Pasaporte as PasaporteKit, Sello, TarjetaEmbarque } from "@/components/embarca";
import { estadoEntrega, estadoReto, puerta, ruta } from "@/app/retos/embarque";
import CopyLink from "./CopyLink";
import Accion from "@/app/empresa/_lib/Accion";
import { getPassport, weightedScore } from "./queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const passport = await getPassport(id);
  return { title: passport ? `Pasaporte de ${passport.student.name}` : "Pasaporte" };
}

const TINTA = [C.marino, C.oro, C.azul, C.verde];
const tinta = (i: number) => TINTA[i % TINTA.length]!;

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

  const nombre = student.name.split(" ")[0]!;
  const datos = {
    nombre: student.name,
    universidad: student.university,
    pais: student.country,
    retos: evaluated.length,
    numero: `EMB${student.id.replace(/-/g, "").slice(-6).toUpperCase()}`,
    sellos: evaluated.filter((e) => e.score !== null).map((e) => ({ nota: e.score!, empresa: e.challenge.company.name })),
  };

  return (
    <div className={`${pasaporteFonts} ${p.page} ${p.seguridad} min-h-screen`}>
      {/* Tapa: titular y pasaporte abierto */}
      <section className={p.tapa}>
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:py-16">
          <div className="flex min-w-0 flex-col gap-5">
            <span className="text-sm font-semibold text-[var(--oro)]">Pasaporte Embarca · talento de España y Colombia</span>
            <h1 className="break-words text-4xl text-[#f3efe6] sm:text-6xl">{student.name}</h1>
            <p className="text-lg text-[#f3efe6]/75">
              {student.university} · {student.country}
            </p>
            <div className="grid grid-cols-3 gap-3 sm:gap-4 border-y border-white/10 py-5">
              <div className="flex flex-col">
                <span className="text-xs text-[#f3efe6]/60">Sellos</span>
                <span className="text-4xl font-extrabold text-[var(--oro)]">{evaluated.length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#f3efe6]/60">Nota media</span>
                {average === null ? <span className="text-4xl font-extrabold text-[#f3efe6]">—</span> : <span className="mt-1"><Nota valor={Math.round(average * 10) / 10} /></span>}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#f3efe6]/60">Empresas de</span>
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

          {/* El pasaporte abierto, con los sellos reales */}
          <div className="min-w-0">
            <div className="sm:hidden">
              <PasaporteKit d={datos} compacto className="min-h-[300px] w-full" />
            </div>
            <div className="hidden sm:block">
              <PasaporteKit d={datos} className="mx-auto w-full max-w-[640px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Detalle de cada sello */}
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-4xl">Historial de retos</h2>
          <span className="text-sm text-[var(--tinta-2)]">Cada sello lo pone la empresa del reto</span>
        </div>

        {entries.length === 0 && (
          <p className={`${p.hoja} p-8 text-[var(--tinta-2)]`}>
            Todavía no hay retos. Cada reto entregado aparecerá aquí con la nota y el comentario de la empresa, gane o no.
          </p>
        )}

        {[...evaluated, ...inProgress.map((e) => ({ ...e, score: null as number | null }))].map((e, i) => {
          const est = estadoEntrega({ submitted_at: e.submitted_at, evaluada: !!e.evaluation }, e.challenge.status === "abierto");
          return (
            <article key={e.id} className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <TarjetaEmbarque
                compacta
                t={{
                  empresa: `${e.challenge.company.name} · ${e.challenge.company.country}`,
                  ...ruta(e.challenge.company.country),
                  titulo: e.challenge.title,
                  puerta: puerta(e.challenge.id),
                  estado: estadoReto({ status: e.challenge.status, deadline: null }),
                  datos: [],
                  pie: <p className="text-sm text-[var(--tinta-2)]">{e.challenge.summary}</p>,
                }}
              />
              <div className={`${p.hoja} relative flex flex-col gap-4 p-5 sm:p-6`}>
                <div className="flex flex-wrap items-center gap-3">
                  <EstadoEntrega estado={est} />
                  {e.score !== null && <Nota valor={e.score} nivel />}
                </div>
                {e.evaluation && e.score !== null && (
                  <div className="pointer-events-none absolute right-5 top-5 hidden sm:block">
                    <Sello nota={e.score} empresa={e.challenge.company.name} size={84} giro={[-8, 10, -3][i % 3]} />
                  </div>
                )}
                {e.evaluation && (
                  <>
                    <div className="flex flex-col gap-2 sm:pr-24">
                      {e.challenge.rubric.map((r) => {
                        const sc = e.evaluation!.scores.find((x) => x.criterion === r.criterion);
                        return (
                          <div key={r.criterion} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1">
                            <span className="text-sm">
                              {r.criterion} <span className="text-xs text-[var(--tinta-2)]">· {r.weight}%</span>
                            </span>
                            {sc ? <Nota valor={sc.score} size="sm" /> : <span className="text-sm">—</span>}
                            <div className="col-span-2 h-1.5 rounded-full bg-[rgba(20,35,61,0.08)]">
                              <div className="h-1.5 rounded-full" style={{ width: `${sc ? sc.score * 10 : 0}%`, background: tinta(i) }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {e.evaluation.feedback && (
                      <blockquote className="border-l-4 pl-4" style={{ borderColor: C.oro }}>
                        “{e.evaluation.feedback}”
                      </blockquote>
                    )}
                  </>
                )}
                {!e.evaluation && (
                  <p className="text-sm text-[var(--tinta-2)]">
                    {e.submitted_at ? "La empresa todavía está valorando esta entrega." : "Inscrito en el reto. Aún no ha entregado."}
                  </p>
                )}
                {e.link && /^https?:\/\//i.test(e.link) && (
                  <a href={e.link} target="_blank" rel="noreferrer" className="self-start text-sm font-bold text-[var(--azul,#0b4ea2)] underline">
                    Ver la entrega ↗
                  </a>
                )}
              </div>
            </article>
          );
        })}

        {/* Cómo se verifica: confianza para quien recibe el enlace */}
        <div className="grid gap-4 pt-4 sm:grid-cols-3">
          {[
            ["Empresa real", "Cada sello lo pone la empresa que propuso el reto, con su nombre y fecha."],
            ["Rúbrica pública", "Los criterios y sus pesos se conocían antes de entregar. La nota no es una opinión suelta."],
            ["Decide una persona", "La IA solo resume las entregas. No puntúa ni ordena candidatos (Ley de IA de la UE)."],
          ].map(([t, d], i) => (
            <div key={t} className={`${p.hoja} flex gap-3 p-5`}>
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 text-sm font-bold`}
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
            <span className="text-sm font-semibold text-[var(--oro)]">¿Buscas talento así?</span>
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
