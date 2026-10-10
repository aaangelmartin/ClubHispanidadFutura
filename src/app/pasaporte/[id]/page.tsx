// Dueño: perfil 4 (valorar y pasaporte). Página pública: la prueba de lo que el estudiante sabe hacer.
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { countryCode, ProgressRing } from "@/app/empresa/_lib/visuals";
import CopyLink from "./CopyLink";
import { getPassport, weightedScore } from "./queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const passport = await getPassport(id);
  return { title: passport ? `Pasaporte de ${passport.student.name}` : "Pasaporte" };
}

function date(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

// Sello circular con texto en arco, como el de un pasaporte.
function Seal({ count }: { count: number }) {
  return (
    <svg viewBox="0 0 200 200" className="h-40 w-40 sm:h-48 sm:w-48" role="img" aria-label={`${count} retos valorados por empresas`}>
      <defs>
        <path id="arc" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
      </defs>
      <circle cx="100" cy="100" r="94" fill="none" stroke="var(--gold)" strokeWidth="2" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="var(--gold)" strokeWidth="1" strokeDasharray="2 4" />
      <circle cx="100" cy="100" r="56" fill="var(--gold)" />
      <text fill="var(--gold)" style={{ font: "500 13px var(--font-plex-mono), monospace", letterSpacing: "3px" }}>
        <textPath href="#arc">VALORADO POR EMPRESAS · ESPAÑA · LATAM ·</textPath>
      </text>
      <text x="100" y="98" textAnchor="middle" fill="var(--ink)" style={{ font: "700 46px var(--font-fraunces), Georgia, serif" }}>
        {count}
      </text>
      <text x="100" y="122" textAnchor="middle" fill="var(--ink)" style={{ font: "500 10px var(--font-plex-mono), monospace", letterSpacing: "2px" }}>
        {count === 1 ? "RETO" : "RETOS"}
      </text>
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
  const countries = [...new Set(evaluated.map((e) => e.challenge.company.country))];
  const scores = evaluated.map((e) => e.score).filter((s): s is number => s !== null);
  const average = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6">
      {/* Portada del pasaporte */}
      <section className="relative overflow-hidden rounded-lg bg-ink text-paper">
        <div className="h-2 bg-gold" />
        <div className="grid items-center gap-8 p-6 sm:p-10 md:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-4">
            <span className="eyebrow">Pasaporte de talento · Iberoamérica</span>
            <h1 className="text-5xl font-bold leading-none text-paper sm:text-7xl">{student.name}</h1>
            <p className="flex items-center gap-2 text-lg text-paper/80">
              <span className="rounded bg-gold px-1.5 font-mono text-xs text-paper">{countryCode(student.country)}</span>
              {student.university}
            </p>
            {student.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {student.skills.map((s) => (
                  <span key={s} className="chip border-paper/30 text-paper/90">
                    {s}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <CopyLink />
              {student.github && (
                <a href={student.github} target="_blank" rel="noreferrer" className="text-sm text-paper/80 underline hover:text-gold">
                  GitHub
                </a>
              )}
              {student.portfolio && (
                <a href={student.portfolio} target="_blank" rel="noreferrer" className="text-sm text-paper/80 underline hover:text-gold">
                  Portfolio
                </a>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <Seal count={evaluated.length} />
          </div>
        </div>
        <dl className="grid grid-cols-3 border-t border-paper/15">
          <div className="flex flex-col gap-1 p-5 sm:p-6">
            <dt className="font-mono text-xs uppercase tracking-widest text-paper/60">Nota media</dt>
            <dd className="font-display text-4xl font-bold text-gold tabular">{average !== null ? average.toFixed(1) : "—"}</dd>
          </div>
          <div className="flex flex-col gap-1 border-l border-paper/15 p-5 sm:p-6">
            <dt className="font-mono text-xs uppercase tracking-widest text-paper/60">Empresas de</dt>
            <dd className="font-display text-2xl font-bold sm:text-3xl">{countries.length ? countries.join(" · ") : "—"}</dd>
          </div>
          <div className="flex flex-col gap-1 border-l border-paper/15 p-5 sm:p-6">
            <dt className="font-mono text-xs uppercase tracking-widest text-paper/60">En curso</dt>
            <dd className="font-display text-4xl font-bold tabular">{inProgress.length}</dd>
          </div>
        </dl>
      </section>

      {/* Trabajo demostrado */}
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-3xl font-bold">Trabajo demostrado</h2>
          <span className="font-mono text-xs text-ink-3">cada nota la pone la empresa del reto</span>
        </div>
        {evaluated.length === 0 && (
          <p className="card p-8 text-ink-2">
            Todavía no hay retos valorados. Cada reto entregado aparecerá aquí con la nota y el feedback de la empresa, gane o no.
          </p>
        )}
        {evaluated.map((e) => (
          <article key={e.id} className="card overflow-hidden">
            <div className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:p-8">
              <div className="flex flex-col items-center gap-1">
                <ProgressRing value={e.score ?? 0} total={10} size={112} tone="light" label={e.score?.toFixed(1) ?? "—"} />
                <span className="font-mono text-xs text-ink-3">sobre 10</span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="flex flex-wrap items-center gap-2 font-mono text-xs text-ink-3">
                    <span className="rounded bg-ink px-1.5 text-paper">{countryCode(e.challenge.company.country)}</span>
                    {e.challenge.company.name} · {date(e.evaluation!.created_at)}
                  </span>
                  <h3 className="text-2xl font-bold">{e.challenge.title}</h3>
                  <p className="text-ink-2">{e.challenge.summary}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {e.challenge.rubric.map((r) => {
                    const s = e.evaluation!.scores.find((x) => x.criterion === r.criterion);
                    return (
                      <div key={r.criterion} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 sm:grid-cols-[180px_1fr_auto]">
                        <span className="text-sm">{r.criterion}</span>
                        <div className="order-3 col-span-2 h-2.5 rounded-full bg-bg sm:order-none sm:col-span-1">
                          <div className="h-2.5 rounded-full bg-ink" style={{ width: `${s ? s.score * 10 : 0}%` }} />
                        </div>
                        <span className="font-mono text-sm tabular">{s ? s.score : "—"}</span>
                      </div>
                    );
                  })}
                </div>
                <blockquote className="border-l-4 border-gold pl-4 text-lg text-ink">“{e.evaluation!.feedback}”</blockquote>
              </div>
            </div>
            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-gold-soft px-6 py-4 sm:px-8">
              <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gold font-bold">✓</span>
                Valorado por {e.challenge.company.name}
              </span>
              {e.link && (
                <a href={e.link} target="_blank" rel="noreferrer" className="text-sm font-semibold text-ink hover:text-gold">
                  Ver la entrega ↗
                </a>
              )}
            </footer>
          </article>
        ))}
      </section>

      {inProgress.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold">En curso</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {inProgress.map((e) => (
              <div key={e.id} className="card flex items-center justify-between gap-3 p-4">
                <div className="flex flex-col">
                  <span className="font-semibold">{e.challenge.title}</span>
                  <span className="text-sm text-ink-3">
                    {e.challenge.company.name} · {e.challenge.company.country}
                  </span>
                </div>
                <span className="chip">{e.submitted_at ? "En valoración" : "Apuntado"}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="text-center text-sm text-ink-3">
        Cada valoración la ha puesto la empresa que propuso el reto. La IA solo ayuda a resumir; no puntúa.
      </p>
    </main>
  );
}
