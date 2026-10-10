// Dueño: perfil 4 (valorar y pasaporte). Todas las personas que han entregado a algún reto de la empresa.
// Sin ranking automático: orden por fecha de entrega (PRD §5).
import Link from "next/link";
import { formatDate, getCandidates, requireCompany, weightedScore } from "../_lib/queries";

export const dynamic = "force-dynamic";

const FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "por_valorar", label: "Por valorar" },
  { key: "valorados", label: "Valorados" },
  { key: "contactados", label: "Contactados" },
] as const;

export default async function Candidatos({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado = "todos" } = await searchParams;
  const company = await requireCompany();
  const all = await getCandidates(company.id);

  const rows = all.filter((c) => {
    if (estado === "por_valorar") return !c.evaluation;
    if (estado === "valorados") return !!c.evaluation;
    if (estado === "contactados") return !!c.evaluation?.contact_requested;
    return true;
  });

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2">
        <span className="eyebrow">{company.name}</span>
        <h1 className="text-4xl font-bold">Candidatos</h1>
        <p className="max-w-2xl text-ink-2">
          Todas las personas que han entregado a tus retos, por orden de entrega. La nota la pones tú; la IA no ordena ni
          descarta a nadie.
        </p>
      </div>

      <nav className="flex flex-wrap gap-2" aria-label="Filtrar por estado">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={f.key === "todos" ? "/empresa/candidatos" : `/empresa/candidatos?estado=${f.key}`}
            className={`btn ${estado === f.key ? "btn-primary" : ""}`}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line font-mono text-xs uppercase tracking-wider text-ink-3">
              <th className="px-4 py-3 font-medium">Candidato</th>
              <th className="px-4 py-3 font-medium">Reto</th>
              <th className="px-4 py-3 font-medium">Entrega</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 text-right font-medium">Nota</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-2">
                  No hay candidatos con este filtro.
                </td>
              </tr>
            )}
            {rows.map((c) => {
              const score = c.evaluation ? weightedScore(c.challenge.rubric, c.evaluation.scores) : null;
              return (
                <tr key={c.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/pasaporte/${c.student.id}`} className="font-semibold text-ink hover:text-gold">
                      {c.student.name}
                    </Link>
                    <div className="text-xs text-ink-3">
                      {c.student.university} · {c.student.country}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/empresa/retos/${c.challenge.id}`} className="text-ink-2 hover:text-ink">
                      {c.challenge.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-ink-2">{formatDate(c.submitted_at)}</td>
                  <td className="px-4 py-3">
                    {c.evaluation?.contact_requested ? (
                      <span className="chip border-ok text-ok">Contactado</span>
                    ) : c.evaluation ? (
                      <span className="chip">Valorado</span>
                    ) : (
                      <span className="chip border-gold bg-gold-soft text-gold">Por valorar</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular">{score !== null ? `${score} / 10` : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
