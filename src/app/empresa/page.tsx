// Dueño: perfil 4 (valorar y pasaporte): panel de la empresa en Embarca, «Tu terminal».
// La empresa es el aeropuerto: cada reto es una tarjeta de embarque y cada entrega se valora.
import Link from "next/link";
import { C, EstadoEntrega, TarjetaEmbarque, type EstadoEntregaValor } from "@/components/embarca";
import e from "@/app/empresa/_lib/empresa.module.css";
import { getCompanyChallenges, requireCompany } from "./_lib/queries";
import { estadoEntrega, tarjetaDeReto } from "./_lib/embarca";

export const dynamic = "force-dynamic";

const RECUENTO: { estado: EstadoEntregaValor; etiqueta: string; color: string }[] = [
  { estado: "inscrito", etiqueta: "Inscritos sin entregar", color: "#c9cbcf" },
  { estado: "entregada", etiqueta: "Entregadas", color: C.azul },
  { estado: "por_valorar", etiqueta: "Por valorar", color: C.oro },
  { estado: "valorada", etiqueta: "Valoradas", color: C.verde },
  { estado: "no_entregada", etiqueta: "No entregadas", color: C.rojo },
];

export default async function EmpresaDashboard() {
  const company = await requireCompany();
  const rows = await getCompanyChallenges(company.id);

  const people = rows.flatMap((r) => r.people);
  const enrolled = people.length;
  const submitted = rows.reduce((n, r) => n + r.submitted, 0);
  const evaluated = rows.reduce((n, r) => n + r.evaluated, 0);
  const pending = submitted - evaluated;
  const active = rows.filter((r) => r.challenge.status === "abierto" || r.challenge.status === "en_valoracion").length;

  const next = [...rows].sort((a, b) => b.submitted - b.evaluated - (a.submitted - a.evaluated))[0];
  const nextPending = next ? next.submitted - next.evaluated : 0;

  const byCountry = Object.entries(
    people.reduce<Record<string, number>>((acc, p) => ((acc[p.country] = (acc[p.country] ?? 0) + 1), acc), {}),
  ).sort((a, b) => b[1] - a[1]);

  const actividad = rows
    .flatMap((r) =>
      r.people.map((p) => ({ ...p, reto: r.challenge, estado: estadoEntrega({ submitted_at: p.submitted ? "x" : null, evaluation: p.evaluated || null }, r.challenge.status) })),
    )
    .filter((a) => a.submitted)
    .slice(0, 6);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl" style={{ color: C.marino }}>
            Tu terminal
          </h1>
          <p className="text-[15px]" style={{ color: C.texto2 }}>
            {active} {active === 1 ? "reto en curso" : "retos en curso"} · {submitted} {submitted === 1 ? "entrega" : "entregas"} ·{" "}
            {enrolled} {enrolled === 1 ? "persona inscrita" : "personas inscritas"}
          </p>
        </div>
        <Link href="/empresa/nuevo" className="btn btn-primary px-5 py-3 text-[15px] font-bold">
          Publicar reto
        </Link>
      </header>

      {pending > 0 && next && nextPending > 0 ? (
        <section
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-5 py-4"
          style={{ background: C.oro, color: C.marino }}
        >
          <p className="text-[15px]">
            <b className="font-bold">
              Tienes {pending} {pending === 1 ? "entrega" : "entregas"} por valorar.
            </b>{" "}
            Cada valoración llega al pasaporte del estudiante, gane o no.
          </p>
          <Link
            href={`/empresa/retos/${next.challenge.id}`}
            className="rounded-lg px-4 py-2.5 text-sm font-bold text-white"
            style={{ background: C.marino }}
          >
            Valorar ahora
          </Link>
        </section>
      ) : rows.length ? (
        <p className={`${e.panel} px-5 py-4 text-[15px]`}>Todo valorado. Buen momento para lanzar otro reto.</p>
      ) : null}

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-bold" style={{ color: C.marino }}>
            Vuelos en curso
          </h2>
          <Link href="/empresa/candidatos" className="text-sm font-semibold hover:underline" style={{ color: C.texto2 }}>
            Ver candidatos
          </Link>
        </div>

        {rows.length === 0 && (
          <div className={`${e.panel} p-8 text-center`} style={{ color: C.texto2 }}>
            Aún no has publicado ningún reto. Escribe tu problema y la IA monta el borrador y la rúbrica.
          </div>
        )}

        {rows.map(({ challenge: c, people: ps, submitted: n, evaluated: m }) => {
          const conteo = Object.fromEntries(RECUENTO.map((r) => [r.estado, 0])) as Record<EstadoEntregaValor, number>;
          for (const p of ps) conteo[estadoEntrega({ submitted_at: p.submitted ? "x" : null, evaluation: p.evaluated || null }, c.status)]++;
          const total = Math.max(1, ps.length);
          const href = c.status === "borrador" ? "/empresa/nuevo" : `/empresa/retos/${c.id}`;
          const left = n - m;
          return (
            <div key={c.id} className="grid gap-4 lg:grid-cols-[1fr_320px]">
              <Link href={href} className="block min-w-0 transition hover:-translate-y-0.5">
                <TarjetaEmbarque
                  t={{
                    ...tarjetaDeReto(c, company.name, company.country),
                    pie: c.is_example ? (
                      <span className="text-xs font-semibold" style={{ color: C.texto2 }}>
                        Ejemplo del piloto
                      </span>
                    ) : undefined,
                  }}
                />
              </Link>
              <div className={`${e.panel} flex flex-col gap-3 p-5`}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-bold" style={{ color: C.marino }}>
                    Entregas
                  </h3>
                  <span className="text-sm tabular-nums" style={{ color: C.texto2 }}>
                    {m} de {n} valoradas
                  </span>
                </div>
                <div className="flex h-2 overflow-hidden rounded-full bg-[#eeeeec]" aria-hidden="true">
                  {RECUENTO.map((r) =>
                    conteo[r.estado] ? (
                      <span key={r.estado} style={{ width: `${(conteo[r.estado] / total) * 100}%`, background: r.color }} />
                    ) : null,
                  )}
                </div>
                <ul className="flex flex-col gap-1.5 text-sm">
                  {RECUENTO.filter((r) => conteo[r.estado] > 0 || r.estado === "por_valorar" || r.estado === "valorada").map((r) => (
                    <li key={r.estado} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2" style={{ color: C.marino }}>
                        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: r.color }} />
                        {r.etiqueta}
                      </span>
                      <span className="font-bold tabular-nums" style={{ color: C.marino }}>
                        {conteo[r.estado]}
                      </span>
                    </li>
                  ))}
                </ul>
                {c.status !== "borrador" && (
                  <Link
                    href={href}
                    className={`btn mt-auto w-full ${left > 0 && (c.status === "en_valoracion" || c.status === "cerrado") ? "btn-primary" : ""}`}
                  >
                    {left > 0 && (c.status === "en_valoracion" || c.status === "cerrado") ? `Valorar ${left}` : "Ver entregas"}
                  </Link>
                )}
              </div>
            </div>
          );
        })}

        <Link
          href="/empresa/nuevo"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-dashed border-[#e2e2de] px-5 py-4 hover:border-[#c8963a]"
        >
          <span className="font-bold" style={{ color: C.marino }}>
            Publicar otro reto
          </span>
          <span className="text-sm" style={{ color: C.texto2 }}>
            Escribe tu problema; la IA monta el borrador y la rúbrica.
          </span>
        </Link>
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr_3fr]">
        <div className={`${e.panel} flex flex-col gap-4 p-5`}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-bold" style={{ color: C.marino }}>
              De dónde vienen
            </h2>
            <span className="text-sm" style={{ color: C.texto2 }}>
              {enrolled} {enrolled === 1 ? "candidato" : "candidatos"}
            </span>
          </div>
          {byCountry.length === 0 ? (
            <p style={{ color: C.texto2 }}>Aún no hay candidatos.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {byCountry.map(([country, k]) => (
                <li key={country} className="flex flex-col gap-1.5">
                  <span className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold" style={{ color: C.marino }}>
                      {country}
                    </span>
                    <span className="tabular-nums" style={{ color: C.texto2 }}>
                      {k} · {Math.round((k / enrolled) * 100)} %
                    </span>
                  </span>
                  <span className="h-2 rounded-full bg-[#eeeeec]">
                    <span className="block h-2 rounded-full" style={{ width: `${(k / enrolled) * 100}%`, background: C.marino }} />
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="text-sm" style={{ color: C.texto2 }}>
            Talento de los dos lados del Atlántico, sin CV ni visado.
          </p>
        </div>

        <div className={`${e.panel} flex flex-col gap-3 p-5`}>
          <h2 className="text-lg font-bold" style={{ color: C.marino }}>
            Actividad reciente
          </h2>
          {actividad.length === 0 ? (
            <p style={{ color: C.texto2 }}>Cuando lleguen entregas las verás aquí.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-[#e2e2de]">
              {actividad.map((a, i) => (
                <li key={a.name + i} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 py-2.5">
                  <span className="min-w-0 text-sm" style={{ color: C.marino }}>
                    <b>{a.name}</b>
                    <span style={{ color: C.texto2 }}> entregó en </span>
                    {a.reto.title}
                  </span>
                  <EstadoEntrega estado={a.estado} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
