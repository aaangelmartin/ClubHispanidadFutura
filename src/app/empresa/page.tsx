// Dueño: perfil 4 (valorar y pasaporte): dashboard de la empresa. Ver docs/perfiles/4-valorar-y-pasaporte.md.
import Link from "next/link";
import { pasaporteFonts } from "@/app/empresa/_lib/fonts";
import p from "@/app/empresa/_lib/pasaporte.module.css";
import { daysLeft, getCompanyChallenges, requireCompany } from "./_lib/queries";
import StatusChip from "./_lib/StatusChip";
import { Avatars, countryCode, ProgressRing, SegmentBar } from "./_lib/visuals";

export const dynamic = "force-dynamic";

function Countdown({ deadline, status }: { deadline: string | null; status: string }) {
  if (status === "cerrado") return <span className="font-mono text-xs text-ok">Cerrado</span>;
  if (status === "borrador") return <span className="font-mono text-xs text-ink-3">Sin publicar</span>;
  const d = daysLeft(deadline);
  if (d === null) return null;
  if (d <= 0) return <span className="font-mono text-xs text-ink-3">Plazo cerrado</span>;
  return (
    <span className="flex items-baseline gap-1 font-mono text-xs text-ink-2">
      Quedan <b className="font-display text-xl text-ink tabular">{d}</b> {d === 1 ? "día" : "días"}
    </span>
  );
}

export default async function EmpresaDashboard() {
  const company = await requireCompany();
  const rows = await getCompanyChallenges(company.id);

  const people = rows.flatMap((r) => r.people);
  const enrolled = people.length;
  const submitted = rows.reduce((n, r) => n + r.submitted, 0);
  const evaluated = rows.reduce((n, r) => n + r.evaluated, 0);
  const contacted = rows.reduce((n, r) => n + r.contacted, 0);
  const pending = submitted - evaluated;
  const active = rows.filter((r) => r.challenge.status === "abierto" || r.challenge.status === "en_valoracion").length;

  const next = [...rows].sort((a, b) => b.submitted - b.evaluated - (a.submitted - a.evaluated))[0];
  const nextPending = next ? next.submitted - next.evaluated : 0;

  const byCountry = Object.entries(
    people.reduce<Record<string, number>>((acc, p) => ((acc[p.country] = (acc[p.country] ?? 0) + 1), acc), {}),
  ).sort((a, b) => b[1] - a[1]);

  const funnel = [
    { label: "Apuntados", value: enrolled },
    { label: "Entregaron", value: submitted },
    { label: "Valorados", value: evaluated },
    { label: "Contactados", value: contacted, gold: true },
  ];
  const funnelMax = Math.max(1, ...funnel.map((f) => f.value));

  return (
    <div className={`${pasaporteFonts} ${p.page} ${p.seguridad} min-h-screen`}>
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      {/* Cabecera: saludo, siguiente acción y progreso */}
      <section className={`${p.tapa} grid items-center gap-8 rounded-2xl p-6  sm:p-10 md:grid-cols-[1fr_auto]`}>
        <div className="flex flex-col gap-4">
          <span className="eyebrow">
            {company.name} · {company.country}
          </span>
          <h1 className="text-4xl font-bold text-paper sm:text-6xl">Hola, {company.contact_name.split(" ")[0]}.</h1>
          <p className="max-w-xl text-lg text-paper/80 sm:text-xl">
            {pending > 0 ? (
              <>
                Tienes <b className="text-gold">{pending} {pending === 1 ? "entrega" : "entregas"}</b> esperando tu
                valoración. Cada una llega al pasaporte del estudiante, gane o no.
              </>
            ) : rows.length ? (
              <>Todo valorado. Buen momento para lanzar otro reto.</>
            ) : (
              <>Cuéntanos qué necesitas resolver y la IA lo convierte en un reto listo para publicar.</>
            )}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            {nextPending > 0 && next && (
              <Link href={`/empresa/retos/${next.challenge.id}`} className={p.botonOro}>
                Valorar ahora →
              </Link>
            )}
            <Link href="/empresa/nuevo" className={p.botonClaro}>
              Publicar un reto nuevo
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <ProgressRing value={evaluated} total={submitted} size={168} />
          <span className="font-mono text-xs uppercase tracking-widest text-paper/70">entregas valoradas</span>
          <span className="font-mono text-sm text-paper tabular">
            {evaluated} de {submitted}
          </span>
        </div>
      </section>

      {/* Cifras */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Retos activos", value: active, hint: `${rows.length} en total` },
          { label: "Entregas recibidas", value: submitted, hint: `${enrolled} apuntados` },
          { label: "Por valorar", value: pending, hint: pending ? "te están esperando" : "al día", gold: pending > 0 },
          { label: "Contactados", value: contacted, hint: "candidatos que te interesan" },
        ].map((s) => (
          <div key={s.label} className={`${p.hoja} flex flex-col gap-1 p-5 ${s.gold ? "border-gold bg-gold-soft" : ""}`}>
            <span className="font-mono text-xs uppercase tracking-widest text-ink-3">{s.label}</span>
            <span className={`font-display text-5xl font-bold tabular ${s.gold ? "text-gold" : ""}`}>{s.value}</span>
            <span className="text-sm text-ink-2">{s.hint}</span>
          </div>
        ))}
      </section>

      {/* Embudo y países */}
      <section className="grid gap-4 lg:grid-cols-[3fr_2fr]">
        <div className={`${p.hoja} flex flex-col gap-5 p-6`}>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold">Embudo de talento</h2>
            <span className="font-mono text-xs text-ink-3">todos tus retos</span>
          </div>
          <div className="flex flex-col gap-3">
            {funnel.map((f) => (
              <div key={f.label} className="grid grid-cols-[96px_1fr_40px] items-center gap-3">
                <span className="text-sm text-ink-2">{f.label}</span>
                <div className="h-8 rounded bg-bg">
                  <div
                    className={`h-8 rounded ${f.gold ? "bg-gold" : "bg-ink"}`}
                    style={{ width: `${Math.max(f.value ? 4 : 0, (f.value / funnelMax) * 100)}%` }}
                  />
                </div>
                <span className="text-right font-display text-2xl font-bold tabular">{f.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${p.hoja} flex flex-col gap-5 p-6`}>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold">De dónde vienen</h2>
            <span className="font-mono text-xs text-ink-3">{enrolled} candidatos</span>
          </div>
          {byCountry.length === 0 ? (
            <p className="text-ink-2">Aún no hay candidatos.</p>
          ) : (
            <>
              <div className="flex h-10 overflow-hidden rounded">
                {byCountry.map(([country, n], i) => (
                  <div
                    key={country}
                    className={`flex items-center justify-center font-mono text-xs text-paper ${i % 2 ? "bg-gold" : "bg-ink"}`}
                    style={{ width: `${(n / enrolled) * 100}%` }}
                  >
                    {countryCode(country)}
                  </div>
                ))}
              </div>
              <ul className="flex flex-col gap-2">
                {byCountry.map(([country, n], i) => (
                  <li key={country} className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <span className={`h-3 w-3 rounded-sm ${i % 2 ? "bg-gold" : "bg-ink"}`} />
                      {country}
                    </span>
                    <span className="font-mono tabular">
                      {n} · {Math.round((n / enrolled) * 100)}%
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-ink-2">Talento de los dos lados del Atlántico, sin CV ni visado.</p>
            </>
          )}
        </div>
      </section>

      {/* Retos */}
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-3xl font-bold">Tus retos</h2>
          <Link href="/empresa/candidatos" className="text-sm text-ink-2 hover:text-ink">
            Ver todos los candidatos →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {rows.map(({ challenge: c, people: ps, submitted: n, evaluated: m }) => {
            const left = n - m;
            return (
              <Link
                key={c.id}
                href={c.status === "borrador" ? "/empresa/nuevo" : `/empresa/retos/${c.id}`}
                className={`${p.hoja} group flex flex-col gap-4 p-6 transition hover:-translate-y-0.5 hover:border-gold ${
                  left > 0 ? "border-gold" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusChip status={c.status} />
                    {c.is_example && <span className="chip">Ejemplo piloto</span>}
                  </div>
                  <Countdown deadline={c.deadline} status={c.status} />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-2xl font-bold leading-tight">{c.title}</h3>
                  <p className="line-clamp-2 text-ink-2">{c.summary}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <SegmentBar evaluated={m} submitted={n} />
                  <div className="flex justify-between font-mono text-xs text-ink-2 tabular">
                    <span>
                      {m} {m === 1 ? "valorada" : "valoradas"}{left > 0 && <b className="text-gold"> · {left} por valorar</b>}
                    </span>
                    <span>{n} entregas</span>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
                  {ps.length ? <Avatars people={ps} /> : <span className="text-sm text-ink-3">Sin candidatos todavía</span>}
                  <span className="font-semibold text-ink group-hover:text-gold">
                    {left > 0 ? "Valorar →" : "Ver entregas →"}
                  </span>
                </div>
              </Link>
            );
          })}
          <Link
            href="/empresa/nuevo"
            className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-line p-6 text-center hover:border-gold"
          >
            <span className="font-display text-4xl text-gold">+</span>
            <span className="font-semibold">Publicar un reto nuevo</span>
            <span className="text-sm text-ink-2">Escribe tu problema; la IA monta el reto y la rúbrica.</span>
          </Link>
        </div>
      </section>
    </main>
    </div>
  );
}
