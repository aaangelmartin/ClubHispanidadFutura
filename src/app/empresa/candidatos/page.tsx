// Dueño: perfil 4 (valorar y pasaporte). Todas las personas que han entregado a algún reto de la empresa.
// Sin ranking automático: orden por fecha de entrega (PRD §5).
import Link from "next/link";
import { formatDate, getCandidates, initials, requireCompany, weightedScore } from "../_lib/queries";
import { countryCode, ProgressRing } from "../_lib/visuals";

export const dynamic = "force-dynamic";

export default async function Candidatos({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado = "todos" } = await searchParams;
  const company = await requireCompany();
  const all = await getCandidates(company.id);

  const counts = {
    todos: all.length,
    por_valorar: all.filter((c) => !c.evaluation).length,
    valorados: all.filter((c) => c.evaluation).length,
    contactados: all.filter((c) => c.evaluation?.contact_requested).length,
  };
  const filters = [
    { key: "todos", label: "Todos" },
    { key: "por_valorar", label: "Por valorar" },
    { key: "valorados", label: "Valorados" },
    { key: "contactados", label: "Contactados" },
  ] as const;

  const rows = all.filter((c) => {
    if (estado === "por_valorar") return !c.evaluation;
    if (estado === "valorados") return !!c.evaluation;
    if (estado === "contactados") return !!c.evaluation?.contact_requested;
    return true;
  });

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <section className="flex flex-wrap items-end justify-between gap-6 rounded-lg bg-ink p-6 text-paper sm:p-10">
        <div className="flex flex-col gap-3">
          <span className="eyebrow">{company.name}</span>
          <h1 className="text-4xl font-bold text-paper sm:text-5xl">Candidatos</h1>
          <p className="max-w-xl text-lg text-paper/80">
            Todas las personas que han entregado a tus retos, por orden de entrega. La nota la pones tú: la IA no ordena ni
            descarta a nadie.
          </p>
        </div>
        <div className="flex gap-6 font-mono text-sm">
          {[
            ["Total", counts.todos],
            ["Por valorar", counts.por_valorar],
            ["Contactados", counts.contactados],
          ].map(([l, n]) => (
            <div key={l as string} className="flex flex-col items-center">
              <span className="font-display text-5xl font-bold text-paper tabular">{n}</span>
              <span className="text-xs uppercase tracking-widest text-paper/70">{l}</span>
            </div>
          ))}
        </div>
      </section>

      <nav className="flex flex-wrap gap-2" aria-label="Filtrar por estado">
        {filters.map((f) => (
          <Link
            key={f.key}
            href={f.key === "todos" ? "/empresa/candidatos" : `/empresa/candidatos?estado=${f.key}`}
            className={`btn rounded-full ${estado === f.key ? "btn-primary" : ""}`}
          >
            {f.label} <span className="font-mono text-xs opacity-70">{counts[f.key]}</span>
          </Link>
        ))}
      </nav>

      {rows.length === 0 && <div className="card p-10 text-center text-ink-2">No hay candidatos con este filtro.</div>}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((c) => {
          const score = c.evaluation ? weightedScore(c.challenge.rubric, c.evaluation.scores) : null;
          const contacted = !!c.evaluation?.contact_requested;
          return (
            <article
              key={c.id}
              className={`card flex flex-col gap-4 p-5 ${!c.evaluation ? "border-gold" : contacted ? "border-ok" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full font-display text-xl font-bold text-paper ${
                    c.evaluation ? "bg-ink" : "bg-gold"
                  }`}
                >
                  {initials(c.student.name)}
                </div>
                {score !== null ? (
                  <ProgressRing value={score} total={10} size={64} tone="light" label={score.toFixed(1)} />
                ) : (
                  <span className="chip border-gold bg-gold-soft text-gold">Por valorar</span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold">{c.student.name}</h2>
                <span className="flex items-center gap-2 text-sm text-ink-2">
                  <span className="rounded bg-ink px-1.5 font-mono text-xs text-paper">{countryCode(c.student.country)}</span>
                  {c.student.university}
                </span>
              </div>
              <div className="rounded-md bg-bg p-3 text-sm">
                <span className="font-mono text-xs text-ink-3">Reto · {formatDate(c.submitted_at)}</span>
                <p className="font-semibold">{c.challenge.title}</p>
              </div>
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3 text-sm">
                {contacted ? (
                  <span className="font-semibold text-ok">Contactado</span>
                ) : c.evaluation ? (
                  <span className="text-ink-2">Valorado</span>
                ) : (
                  <Link href={`/empresa/retos/${c.challenge.id}`} className="font-semibold text-gold">
                    Valorar →
                  </Link>
                )}
                <Link href={`/pasaporte/${c.student.id}`} className="text-ink-2 hover:text-ink">
                  Pasaporte →
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
