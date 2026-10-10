// Dueño: perfil 4 (valorar y pasaporte). Ver docs/perfiles/4-valorar-y-pasaporte.md.
import Link from "next/link";
import { pasaporteFonts } from "@/app/empresa/_lib/fonts";
import p from "@/app/empresa/_lib/pasaporte.module.css";
import { notFound } from "next/navigation";
import {
  daysLeft,
  formatDate,
  getChallengeForCompany,
  getSubmissions,
  initials,
  requireCompany,
  weightedScore,
} from "../../_lib/queries";
import StatusChip from "../../_lib/StatusChip";
import { countryCode, ProgressRing } from "../../_lib/visuals";
import Sello, { fechaSello } from "../../_lib/Sello";
import AiSummaryBlock from "./AiSummaryBlock";
import EvaluationForm from "./EvaluationForm";
import { closeChallenge, closeSubmissions, requestContact } from "./actions";

export const dynamic = "force-dynamic";

const RUBRIC_SHADES = ["bg-ink", "bg-gold", "bg-ink-2", "bg-ink-3", "bg-ok"];

export default async function ValorarReto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await requireCompany();
  const challenge = await getChallengeForCompany(id, company.id);
  if (!challenge) notFound();

  const all = await getSubmissions(id);
  const delivered = all.filter((s) => s.submitted_at);
  const enrolled = all.filter((s) => !s.submitted_at);
  const done = delivered.filter((s) => s.evaluation).length;
  const pending = delivered.length - done;
  const canEvaluate = challenge.status === "en_valoracion" || challenge.status === "cerrado";
  const d = daysLeft(challenge.deadline);

  return (
    <div className={`${pasaporteFonts} ${p.page} ${p.seguridad} min-h-screen`}>
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Link href="/empresa" className="text-sm text-ink-2 hover:text-ink">
        ← Tus retos
      </Link>

      {/* Cabecera del reto */}
      <section className={`${p.tapa} grid items-center gap-8 rounded-2xl p-6  sm:p-10 md:grid-cols-[1fr_auto]`}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip status={challenge.status} />
            {challenge.is_example && <span className="chip border-paper/30 text-paper/80">Ejemplo piloto</span>}
            {challenge.status === "abierto" && d !== null && d > 0 && (
              <span className="font-mono text-xs text-paper/70">Quedan {d} días</span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-paper sm:text-5xl">{challenge.title}</h1>
          <p className="max-w-2xl text-lg text-paper/80">{challenge.summary}</p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {challenge.status === "abierto" && (
              <form action={closeSubmissions}>
                <input type="hidden" name="challenge_id" value={challenge.id} />
                <button className={p.botonOro}>
                  Cerrar entregas y empezar a valorar
                </button>
              </form>
            )}
            {challenge.status === "en_valoracion" && (
              <form action={closeChallenge} className="flex flex-wrap items-center gap-3">
                <input type="hidden" name="challenge_id" value={challenge.id} />
                <button
                  className={`${p.botonOro} disabled:cursor-not-allowed disabled:opacity-40`}
                  disabled={pending > 0}
                >
                  Cerrar reto
                </button>
                {pending > 0 && (
                  <span className="text-sm text-paper/70">
                    Valora {pending === 1 ? "la entrega que falta" : `las ${pending} que faltan`} para poder cerrarlo
                  </span>
                )}
              </form>
            )}
            {challenge.status === "cerrado" && (
              <span className="text-paper/80">Reto cerrado. Todas las valoraciones están en los pasaportes.</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <ProgressRing value={done} total={delivered.length} size={160} />
          <span className="font-mono text-xs uppercase tracking-widest text-paper/70">valoradas</span>
          <span className="font-mono text-sm tabular">
            {done} de {delivered.length}
            {enrolled.length > 0 && ` · ${enrolled.length} sin entregar`}
          </span>
        </div>
      </section>

      {/* Rúbrica como barra de pesos */}
      <section className={`${p.hoja} flex flex-col gap-4 p-6`}>
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold">Cómo se valora</h2>
          <span className="font-mono text-xs text-ink-3">la IA resume · tú decides</span>
        </div>
        <div className="flex h-4 overflow-hidden rounded-full">
          {challenge.rubric.map((r, i) => (
            <div key={r.criterion} className={RUBRIC_SHADES[i % RUBRIC_SHADES.length]} style={{ width: `${r.weight}%` }} />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {challenge.rubric.map((r, i) => (
            <div key={r.criterion} className="flex gap-3">
              <span className={`mt-1.5 h-3 w-3 shrink-0 rounded-sm ${RUBRIC_SHADES[i % RUBRIC_SHADES.length]}`} />
              <div className="flex flex-col">
                <span className="font-semibold">
                  {r.criterion} <span className="font-mono text-sm text-gold tabular">{r.weight}%</span>
                </span>
                <span className="text-sm text-ink-2">{r.description}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {challenge.status === "abierto" && delivered.length > 0 && (
        <p className={`${p.hoja} border-gold bg-gold-soft p-4`}>
          El reto sigue abierto: puedes leer las entregas ya. La valoración se activa al cerrar las entregas.
        </p>
      )}

      {/* Entregas */}
      <section className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold">
          Entregas <span className="font-mono text-lg text-ink-3">{delivered.length}</span>
        </h2>
        {delivered.length === 0 && <div className={`${p.hoja} p-8 text-ink-2`}>Todavía no ha llegado ninguna entrega.</div>}

        {delivered.map((s, i) => {
          const score = s.evaluation ? weightedScore(challenge.rubric, s.evaluation.scores) : null;
          return (
            <article
              key={s.id}
              className={`${p.hoja} overflow-hidden ${s.evaluation ? "" : "border-gold ring-1 ring-gold"}`}
            >
              <header className="flex flex-wrap items-center gap-4 border-b border-line p-6">
                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full font-display text-2xl font-bold text-paper ${
                    s.evaluation ? "bg-ink" : "bg-gold"
                  }`}
                >
                  {initials(s.student.name)}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="font-mono text-xs text-ink-3">
                    Entrega {i + 1} · {formatDate(s.submitted_at)}
                  </span>
                  <h3 className="text-2xl font-bold">{s.student.name}</h3>
                  <span className="flex items-center gap-2 text-ink-2">
                    <span className="rounded bg-ink px-1.5 font-mono text-xs text-paper">{countryCode(s.student.country)}</span>
                    {s.student.university}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {s.evaluation ? (
                    <Sello
                      i={i}
                      forma="circulo"
                      size={96}
                      empresa={company.name}
                      lugar={company.country}
                      fecha={fechaSello(s.evaluation.created_at)}
                      nota={score !== null ? score.toFixed(1).replace(".", ",") : "—"}
                    />
                  ) : (
                    <span className="chip border-gold bg-gold-soft text-gold">Por valorar</span>
                  )}
                  <Link href={`/pasaporte/${s.student.id}`} className="text-sm text-ink-2 hover:text-gold">
                    Ver pasaporte →
                  </Link>
                </div>
              </header>

              <div className="grid lg:grid-cols-[1.4fr_1fr]">
                <div className="flex flex-col gap-5 p-6">
                  {s.notes && (
                    <blockquote className="border-l-4 border-gold pl-4 text-lg text-ink">{s.notes}</blockquote>
                  )}
                  {s.link && (
                    <a href={s.link} target="_blank" rel="noreferrer" className="btn self-start">
                      Abrir la entrega ↗
                    </a>
                  )}
                  <AiSummaryBlock submissionId={s.id} initial={s.ai_summary} />
                </div>

                <aside className="flex flex-col gap-5 border-t border-line bg-bg/60 p-6 lg:border-l lg:border-t-0">
                  {canEvaluate ? (
                    <EvaluationForm submissionId={s.id} rubric={challenge.rubric} existing={s.evaluation} />
                  ) : (
                    <p className="text-ink-2">La valoración se activa al cerrar las entregas.</p>
                  )}
                  {s.evaluation &&
                    (s.evaluation.contact_requested ? (
                      <div className="rounded-md border border-ok p-4">
                        <span className="font-semibold text-ok">Contactado.</span>{" "}
                        <span className="text-sm">
                          Escríbele a <span className="font-mono">{s.student.email}</span>
                        </span>
                      </div>
                    ) : (
                      <form action={requestContact}>
                        <input type="hidden" name="submission_id" value={s.id} />
                        <button className="btn w-full border-gold py-3 text-base text-gold hover:bg-gold-soft">
                          Quiero contactar con {s.student.name.split(" ")[0]}
                        </button>
                      </form>
                    ))}
                </aside>
              </div>
            </article>
          );
        })}
      </section>
    </main>
    </div>
  );
}
