// Dueño: perfil 4 (valorar y pasaporte). Todas las personas que han entregado a algún reto de la empresa.
// Sin ranking automático: orden por fecha de entrega (PRD §5).
import Link from "next/link";
import { C, EstadoEntrega, Nota } from "@/components/embarca";
import e from "@/app/empresa/_lib/empresa.module.css";
import { formatDate, getCandidates, initials, requireCompany, weightedScore } from "../_lib/queries";
import { estadoEntrega } from "../_lib/embarca";
import Accion from "../_lib/Accion";

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
    <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl" style={{ color: C.marino }}>
            Candidatos
          </h1>
          <p className="text-[15px]" style={{ color: C.texto2 }}>
            {counts.todos} {counts.todos === 1 ? "persona ha entregado" : "personas han entregado"} a tus retos · {counts.por_valorar} por
            valorar · {counts.contactados} {counts.contactados === 1 ? "contactada" : "contactadas"}
          </p>
        </div>
        <Accion hecho="Exportado: candidatos.csv" className="btn px-4 py-2.5 font-bold">
          Exportar CSV
        </Accion>
      </header>

      <p className="rounded-xl px-4 py-3 text-[15px]" style={{ background: "#eef3fa", color: C.marino, boxShadow: "inset 0 0 0 1px #c9d8ee" }}>
        <b>La nota la pones tú: la IA no ordena ni descarta a nadie.</b> Aquí salen por orden de entrega.
      </p>

      <nav className="flex flex-wrap gap-2" aria-label="Filtrar por estado">
        {filters.map((f) => {
          const on = estado === f.key;
          return (
            <Link
              key={f.key}
              href={f.key === "todos" ? "/empresa/candidatos" : `/empresa/candidatos?estado=${f.key}`}
              aria-current={on ? "page" : undefined}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold ${
                on ? "bg-[#14233d] text-white" : "bg-white text-[#14233d] ring-1 ring-[#e2e2de] hover:ring-[#c8963a]"
              }`}
            >
              {f.label} <span className="tabular-nums opacity-70">{counts[f.key]}</span>
            </Link>
          );
        })}
      </nav>

      {rows.length === 0 ? (
        <div className={`${e.panel} p-10 text-center`} style={{ color: C.texto2 }}>
          No hay candidatos con este filtro.
        </div>
      ) : (
        <section className={`${e.panel} overflow-hidden`}>
          <div
            className="hidden grid-cols-[minmax(0,2fr)_minmax(0,2fr)_90px_150px_170px] gap-4 border-b border-[#e2e2de] px-5 py-3 text-sm font-semibold md:grid"
            style={{ color: C.texto2, background: C.superficie }}
          >
            <span>Estudiante</span>
            <span>Reto</span>
            <span>Nota</span>
            <span>Estado</span>
            <span className="text-right">Acción</span>
          </div>
          <ul className="divide-y divide-[#e2e2de]">
            {rows.map((c) => {
              const score = c.evaluation ? weightedScore(c.challenge.rubric, c.evaluation.scores) : null;
              const contacted = !!c.evaluation?.contact_requested;
              return (
                <li
                  key={c.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-4 py-3.5 md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_90px_150px_170px] md:px-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold"
                      style={{ background: C.superficie, color: C.marino }}
                    >
                      {initials(c.student.name)}
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <Link href={`/pasaporte/${c.student.id}`} className="truncate font-bold hover:underline" style={{ color: C.marino }}>
                        {c.student.name}
                      </Link>
                      <span className="truncate text-xs" style={{ color: C.texto2 }}>
                        {c.student.university} · {c.student.country}
                      </span>
                    </span>
                  </div>
                  <div className="col-span-2 row-start-2 min-w-0 md:col-span-1 md:row-start-auto">
                    <span className="block truncate text-sm font-semibold" style={{ color: C.marino }}>
                      {c.challenge.title}
                    </span>
                    <span className="text-xs" style={{ color: C.texto2 }}>
                      Entregó el {formatDate(c.submitted_at)}
                    </span>
                  </div>
                  <div className="col-start-2 row-start-1 md:col-start-auto md:row-start-auto">
                    {score !== null ? <Nota valor={score} size="sm" /> : <span style={{ color: C.texto2 }}>—</span>}
                  </div>
                  <div className="row-start-3 md:row-start-auto">
                    <EstadoEntrega estado={estadoEntrega(c, c.challenge.status)} />
                  </div>
                  <div className="col-start-2 row-start-3 text-right text-sm font-semibold md:col-start-auto md:row-start-auto">
                    {contacted ? (
                      <span style={{ color: C.verde }}>Contactado</span>
                    ) : c.evaluation ? (
                      <Accion hecho={`Invitación a entrevista enviada a ${c.student.name.split(" ")[0]}`} className="font-semibold text-[#0b4ea2] hover:underline">
                        Invitar a entrevista
                      </Accion>
                    ) : (
                      <Link href={`/empresa/retos/${c.challenge.id}?e=${c.id}`} className="hover:underline" style={{ color: "#8a5a00" }}>
                        Valorar
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </main>
  );
}
