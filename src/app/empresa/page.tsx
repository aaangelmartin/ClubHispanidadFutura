// Dueño: perfil 4 (valorar y pasaporte): dashboard de la empresa. Ver docs/perfiles/4-valorar-y-pasaporte.md.
import Link from "next/link";
import { formatDate, getCompanyChallenges, requireCompany } from "./_lib/queries";
import StatusChip from "./_lib/StatusChip";

export const dynamic = "force-dynamic";

export default async function EmpresaDashboard() {
  const company = await requireCompany();
  const rows = await getCompanyChallenges(company.id);

  const active = rows.filter((r) => r.challenge.status === "abierto" || r.challenge.status === "en_valoracion").length;
  const submitted = rows.reduce((n, r) => n + r.submitted, 0);
  const pending = rows.reduce((n, r) => n + (r.submitted - r.evaluated), 0);
  const contacted = rows.reduce((n, r) => n + r.contacted, 0);

  const stats = [
    { label: "Retos activos", value: active },
    { label: "Entregas recibidas", value: submitted },
    { label: "Por valorar", value: pending, highlight: pending > 0 },
    { label: "Candidatos contactados", value: contacted },
  ];

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="eyebrow">{company.name} · {company.country}</span>
          <h1 className="text-4xl font-bold">Tus retos</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/empresa/candidatos" className="btn">Ver candidatos</Link>
          <Link href="/empresa/nuevo" className="btn btn-primary">Publicar un reto nuevo</Link>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`card flex flex-col gap-1 p-5 ${s.highlight ? "border-gold bg-gold-soft" : ""}`}>
            <span className={`font-display text-4xl font-bold tabular ${s.highlight ? "text-gold" : ""}`}>{s.value}</span>
            <span className="text-sm text-ink-2">{s.label}</span>
          </div>
        ))}
      </section>

      {pending > 0 && (
        <p className="card border-gold p-4 text-ink">
          Tienes <b>{pending} {pending === 1 ? "entrega" : "entregas"} sin valorar</b>. Cada estudiante recibe tu valoración en su
          pasaporte, gane o no: es lo que le das a cambio de su trabajo.
        </p>
      )}

      <section className="flex flex-col gap-3">
        {rows.length === 0 && (
          <div className="card flex flex-col items-start gap-3 p-8">
            <h2 className="text-2xl font-bold">Todavía no has publicado ningún reto</h2>
            <p className="text-ink-2">Cuéntanos qué necesitas resolver y la IA lo convierte en un reto listo para publicar.</p>
            <Link href="/empresa/nuevo" className="btn btn-primary">Publicar mi primer reto</Link>
          </div>
        )}
        {rows.map(({ challenge: c, submitted: n, evaluated: m }) => (
          <Link
            key={c.id}
            href={c.status === "borrador" ? "/empresa/nuevo" : `/empresa/retos/${c.id}`}
            className="card flex flex-wrap items-center gap-x-6 gap-y-3 p-5 hover:border-gold"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusChip status={c.status} />
                {c.is_example && <span className="chip">Ejemplo piloto</span>}
              </div>
              <h3 className="text-xl font-bold">{c.title}</h3>
              <p className="text-sm text-ink-2">
                {c.duration_days} días{c.deadline ? ` · plazo ${formatDate(c.deadline)}` : ""}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 font-mono text-sm tabular">
              <span>{n} {n === 1 ? "entrega" : "entregas"}</span>
              <span className={n - m > 0 ? "text-warn" : "text-ok"}>
                {n === 0 ? "—" : n - m > 0 ? `${m} de ${n} valoradas` : "todas valoradas"}
              </span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
