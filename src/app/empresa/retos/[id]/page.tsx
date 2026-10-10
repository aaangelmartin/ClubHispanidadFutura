// Dueño: perfil 4 (valorar y pasaporte). Ver docs/perfiles/4-valorar-y-pasaporte.md.
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getChallengeForCompany, getSubmissions, requireCompany, weightedScore } from "../../_lib/queries";
import StatusChip from "../../_lib/StatusChip";
import AiSummaryBlock from "./AiSummaryBlock";
import EvaluationForm from "./EvaluationForm";
import { closeChallenge, closeSubmissions, requestContact } from "./actions";

export const dynamic = "force-dynamic";

export default async function ValorarReto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await requireCompany();
  const challenge = await getChallengeForCompany(id, company.id);
  if (!challenge) notFound();

  const all = await getSubmissions(id);
  const delivered = all.filter((s) => s.submitted_at);
  const enrolled = all.filter((s) => !s.submitted_at);
  const pending = delivered.filter((s) => !s.evaluation).length;
  const canEvaluate = challenge.status === "en_valoracion" || challenge.status === "cerrado";

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
      <Link href="/empresa" className="text-sm text-ink-2 hover:text-ink">← Tus retos</Link>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip status={challenge.status} />
          {challenge.is_example && <span className="chip">Ejemplo piloto</span>}
          {challenge.deadline && <span className="text-sm text-ink-3">Plazo: {formatDate(challenge.deadline)}</span>}
        </div>
        <h1 className="text-4xl font-bold">{challenge.title}</h1>
        <p className="max-w-3xl text-lg text-ink-2">{challenge.summary}</p>

        <div className="card flex flex-col gap-3 p-5">
          <span className="eyebrow">Rúbrica</span>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {challenge.rubric.map((r) => (
              <div key={r.criterion} className="flex flex-col gap-1">
                <span className="flex items-baseline justify-between gap-2">
                  <b>{r.criterion}</b>
                  <span className="font-mono text-sm text-gold tabular">{r.weight}%</span>
                </span>
                <span className="text-sm text-ink-2">{r.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card flex flex-wrap items-center justify-between gap-4 p-5">
        <p className="font-mono text-sm tabular">
          {delivered.length} {delivered.length === 1 ? "entrega" : "entregas"} · {delivered.length - pending} valoradas
          {enrolled.length > 0 && ` · ${enrolled.length} apuntados sin entregar`}
        </p>
        {challenge.status === "abierto" && (
          <form action={closeSubmissions}>
            <input type="hidden" name="challenge_id" value={challenge.id} />
            <button className="btn btn-primary">Cerrar entregas y empezar a valorar</button>
          </form>
        )}
        {challenge.status === "en_valoracion" && (
          <form action={closeChallenge} className="flex flex-wrap items-center gap-3">
            <input type="hidden" name="challenge_id" value={challenge.id} />
            {pending > 0 && (
              <span className="text-sm text-warn">
                Faltan {pending} {pending === 1 ? "entrega" : "entregas"} por valorar
              </span>
            )}
            <button className="btn btn-primary" disabled={pending > 0}>Cerrar reto</button>
          </form>
        )}
        {challenge.status === "cerrado" && <span className="text-sm text-ok">Reto cerrado: todas las valoraciones están en los pasaportes.</span>}
      </section>

      {challenge.status === "abierto" && delivered.length > 0 && (
        <p className="text-sm text-ink-2">
          El reto sigue abierto. Puedes leer las entregas ya; la valoración se abre al cerrar las entregas.
        </p>
      )}

      <section className="flex flex-col gap-6">
        {delivered.length === 0 && (
          <div className="card p-8 text-ink-2">Todavía no ha llegado ninguna entrega.</div>
        )}
        {delivered.map((s, i) => {
          const score = s.evaluation ? weightedScore(challenge.rubric, s.evaluation.scores) : null;
          return (
            <article key={s.id} className={`card flex flex-col gap-5 p-6 ${s.evaluation ? "" : "border-gold"}`}>
              <header className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-xs text-ink-3">Entrega {i + 1} · {formatDate(s.submitted_at)}</span>
                  <h2 className="text-2xl font-bold">{s.student.name}</h2>
                  <span className="text-sm text-ink-2">
                    {s.student.university} · {s.student.country}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {s.evaluation ? (
                    <span className="chip border-ok text-ok">Valorada · {score} / 10</span>
                  ) : (
                    <span className="chip border-gold bg-gold-soft text-gold">Por valorar</span>
                  )}
                  <Link href={`/pasaporte/${s.student.id}`} className="text-sm text-ink-2 hover:text-ink">
                    Ver pasaporte →
                  </Link>
                </div>
              </header>

              <div className="flex flex-col gap-2">
                {s.link && (
                  <a href={s.link} target="_blank" rel="noreferrer" className="break-all text-sm text-gold underline">
                    {s.link}
                  </a>
                )}
                {s.notes && <p className="text-ink">{s.notes}</p>}
              </div>

              <AiSummaryBlock submissionId={s.id} initial={s.ai_summary} />

              {canEvaluate ? (
                <EvaluationForm submissionId={s.id} rubric={challenge.rubric} existing={s.evaluation} />
              ) : null}

              {s.evaluation && (
                <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
                  {s.evaluation.contact_requested ? (
                    <span className="text-sm">
                      <b className="text-ok">Contactado.</b> Escríbele a{" "}
                      <span className="font-mono">{s.student.email}</span>
                    </span>
                  ) : (
                    <form action={requestContact}>
                      <input type="hidden" name="submission_id" value={s.id} />
                      <button className="btn">Contactar con {s.student.name.split(" ")[0]}</button>
                    </form>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
}
