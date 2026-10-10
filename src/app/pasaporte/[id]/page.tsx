// Dueño: perfil 4 (valorar y pasaporte). Página pública: la prueba de lo que el estudiante sabe hacer.
import { notFound } from "next/navigation";
import type { Metadata } from "next";
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
  const average = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null;

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6">
      {/* Cabecera del pasaporte */}
      <section className="card flex flex-col gap-6 border-t-4 border-t-gold p-6 sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="eyebrow">Pasaporte de talento · Iberoamérica</span>
            <h1 className="text-4xl font-bold sm:text-5xl">{student.name}</h1>
            <p className="text-lg text-ink-2">
              {student.university} · {student.country}
            </p>
          </div>
          <CopyLink />
        </div>

        {student.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {student.skills.map((s) => (
              <span key={s} className="chip">{s}</span>
            ))}
          </div>
        )}

        {(student.github || student.portfolio) && (
          <div className="flex flex-wrap gap-4 text-sm">
            {student.github && (
              <a href={student.github} target="_blank" rel="noreferrer" className="text-ink-2 underline hover:text-ink">
                GitHub
              </a>
            )}
            {student.portfolio && (
              <a href={student.portfolio} target="_blank" rel="noreferrer" className="text-ink-2 underline hover:text-ink">
                Portfolio
              </a>
            )}
          </div>
        )}

        <dl className="grid grid-cols-3 gap-4 border-t border-line pt-6">
          <div className="flex flex-col gap-1">
            <dt className="text-sm text-ink-2">Retos valorados</dt>
            <dd className="font-display text-4xl font-bold tabular">{evaluated.length}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-sm text-ink-2">Nota media</dt>
            <dd className="font-display text-4xl font-bold text-gold tabular">{average ?? "—"}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-sm text-ink-2">Empresas de</dt>
            <dd className="font-display text-2xl font-bold">{countries.length ? countries.join(" · ") : "—"}</dd>
          </div>
        </dl>
      </section>

      {/* Retos valorados */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Trabajo demostrado</h2>
        {evaluated.length === 0 && (
          <p className="card p-6 text-ink-2">
            Todavía no hay retos valorados. Cada reto entregado aparecerá aquí con la nota y el feedback de la empresa, gane o no.
          </p>
        )}
        {evaluated.map((e) => (
          <article key={e.id} className="card flex flex-col gap-5 p-6">
            <header className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs text-ink-3">{date(e.evaluation!.created_at)}</span>
                <h3 className="text-2xl font-bold">{e.challenge.title}</h3>
                <p className="text-ink-2">{e.challenge.summary}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-display text-4xl font-bold tabular">{e.score ?? "—"}</span>
                <span className="font-mono text-xs text-ink-3">sobre 10</span>
              </div>
            </header>

            <div className="flex flex-col gap-2">
              {e.challenge.rubric.map((r) => {
                const s = e.evaluation!.scores.find((x) => x.criterion === r.criterion);
                const pct = s ? (s.score / 10) * 100 : 0;
                return (
                  <div key={r.criterion} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 sm:grid-cols-[200px_1fr_auto]">
                    <span className="text-sm">{r.criterion}</span>
                    <div className="order-3 col-span-2 h-2 rounded-full bg-bg sm:order-none sm:col-span-1">
                      <div className="h-2 rounded-full bg-ink" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="font-mono text-sm tabular">{s ? s.score : "—"}</span>
                  </div>
                );
              })}
            </div>

            <blockquote className="border-l-2 border-gold pl-4 text-ink">
              “{e.evaluation!.feedback}”
            </blockquote>

            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <span className="chip border-gold bg-gold-soft text-gold">
                Valorado por {e.challenge.company.name} · {e.challenge.company.country}
              </span>
              {e.link && (
                <a href={e.link} target="_blank" rel="noreferrer" className="text-sm text-ink-2 underline hover:text-ink">
                  Ver la entrega
                </a>
              )}
            </footer>
          </article>
        ))}
      </section>

      {/* En curso */}
      {inProgress.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold">En curso</h2>
          {inProgress.map((e) => (
            <div key={e.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex flex-col">
                <span className="font-semibold">{e.challenge.title}</span>
                <span className="text-sm text-ink-3">
                  {e.challenge.company.name} · {e.challenge.company.country}
                </span>
              </div>
              <span className="chip">{e.submitted_at ? "Pendiente de valoración" : "Apuntado"}</span>
            </div>
          ))}
        </section>
      )}

      <p className="text-center text-sm text-ink-3">
        Cada valoración la ha puesto la empresa que propuso el reto. La IA solo ayuda a resumir; no puntúa.
      </p>
    </main>
  );
}
