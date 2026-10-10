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
    <main className="flex flex-col">
      <section className="bg-ink text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-7 px-4 pb-7 pt-8 sm:px-6 sm:pb-8 sm:pt-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="flex min-w-0 flex-col gap-1.5">
              <span className="text-sm font-semibold" style={{ color: C.oro }}>
                {company.name} · {company.country}
              </span>
              <h1 className="text-[34px] font-bold leading-none tracking-[-0.02em] text-white sm:text-5xl">Tu terminal</h1>
            </div>
            <Link href="/empresa/nuevo" className="btn btn-primary px-5 py-3 text-[15px] font-bold">
              Publicar reto
            </Link>
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/10 sm:grid-cols-4">
            {[
              { k: "Retos en curso", v: active, color: "#fff" },
              { k: active === 1 ? "Persona inscrita" : "Personas inscritas", v: enrolled, color: "#fff" },
              { k: "Por valorar", v: pending, color: pending > 0 ? C.oro : "#fff" },
              { k: "Valoradas", v: evaluated, color: evaluated > 0 ? "#7fd39b" : "#fff" },
            ].map((x) => (
              <div key={x.k} className="flex flex-col gap-1 bg-[#14233d]/80 px-4 py-4 sm:px-5">
                <dt className="text-sm text-white/70">{x.k}</dt>
                <dd className="text-4xl font-bold leading-none tabular-nums tracking-[-0.02em]" style={{ color: x.color }}>
                  {x.v}
                </dd>
              </div>
            ))}
          </dl>

          {pending > 0 && next && nextPending > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl px-5 py-4" style={{ background: C.oro, color: C.marino }}>
              <p className="flex min-w-0 items-center gap-3 text-[15px]">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold text-white" style={{ background: C.marino }}>
                  {pending}
                </span>
                <span>
                  <b className="font-bold">
                    Tienes {pending} {pending === 1 ? "entrega" : "entregas"} por valorar.
                  </b>{" "}
                  Cada valoración llega al pasaporte del estudiante, gane o no.
                </span>
              </p>
              <Link
                href={`/empresa/retos/${next.challenge.id}`}
                className="rounded-lg px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                style={{ background: C.marino }}
              >
                Valorar ahora
              </Link>
            </div>
          ) : rows.length ? (
            <p className="rounded-xl bg-white/10 px-5 py-4 text-[15px] text-white/90 ring-1 ring-white/10">
              <b className="text-white">Todo valorado.</b> Buen momento para lanzar otro reto.
            </p>
          ) : null}
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-[-0.01em]" style={{ color: C.marino }}>
            Vuelos en curso
          </h2>
          <Link href="/empresa/candidatos" className="text-sm font-semibold hover:underline" style={{ color: C.azul }}>
            Ver candidatos
          </Link>
        </div>

        {rows.length === 0 && (
          <div className={`${e.panel} flex flex-col items-center gap-4 px-6 py-12 text-center`}>
            <span className="grid h-14 w-14 place-items-center rounded-full text-2xl" style={{ background: C.superficie, color: C.azul }} aria-hidden="true">
              ✈
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-bold" style={{ color: C.marino }}>
                Tu terminal aún no tiene vuelos
              </p>
              <p className="max-w-md text-[15px]" style={{ color: C.texto2 }}>
                Escribe tu problema con tus palabras y la IA monta el borrador y la rúbrica. Tú decides cuándo publicarlo.
              </p>
            </div>
            <Link href="/empresa/nuevo" className="btn btn-primary px-5 font-bold">
              Publicar tu primer reto
            </Link>
          </div>
        )}

        {rows.map(({ challenge: c, people: ps, submitted: n, evaluated: m }) => {
          const conteo = Object.fromEntries(RECUENTO.map((r) => [r.estado, 0])) as Record<EstadoEntregaValor, number>;
          for (const p of ps) conteo[estadoEntrega({ submitted_at: p.submitted ? "x" : null, evaluation: p.evaluated || null }, c.status)]++;
          const total = Math.max(1, ps.length);
          const href = c.status === "borrador" ? "/empresa/nuevo" : `/empresa/retos/${c.id}`;
          const left = n - m;
          return (
            <div key={c.id} className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
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
              <div className={`${e.panel} flex flex-col gap-4 p-5`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold" style={{ color: C.texto2 }}>
                      Entregas valoradas
                    </h3>
                    {n > 0 ? (
                      <span className="text-4xl font-bold leading-none tabular-nums tracking-[-0.02em]" style={{ color: C.marino }}>
                        {m}
                        <span className="text-xl font-semibold" style={{ color: C.texto2 }}>
                          {" "}
                          / {n}
                        </span>
                      </span>
                    ) : (
                      <span className="text-lg font-bold leading-snug" style={{ color: C.marino }}>
                        Aún sin entregas
                      </span>
                    )}
                  </div>
                  {left > 0 && (
                    <span className="rounded-md px-2 py-1 text-xs font-bold" style={{ background: "#fdf3dc", color: "#8a5a00" }}>
                      Faltan {left}
                    </span>
                  )}
                </div>
                <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-full bg-[#eeeeec]" aria-hidden="true">
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
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
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
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-dashed border-[#d6d4cc] bg-white/50 px-5 py-5 transition hover:border-[#c8963a] hover:bg-white"
        >
          <span className="flex items-center gap-2.5 font-bold" style={{ color: C.marino }}>
            <span className="grid h-8 w-8 place-items-center rounded-full text-lg leading-none" style={{ background: C.oro }} aria-hidden="true">
              +
            </span>
            Publicar otro reto
          </span>
          <span className="text-sm" style={{ color: C.texto2 }}>
            Escribe tu problema; la IA monta el borrador y la rúbrica.
          </span>
        </Link>
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr_3fr]">
        <div className={`${e.panel} flex flex-col gap-4 p-5 sm:p-6`}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-xl font-bold" style={{ color: C.marino }}>
              De dónde vienen
            </h2>
            <span className="text-sm" style={{ color: C.texto2 }}>
              {enrolled} {enrolled === 1 ? "candidato" : "candidatos"}
            </span>
          </div>
          {byCountry.length === 0 ? (
            <p className="rounded-lg px-4 py-6 text-center text-sm" style={{ background: C.superficie, color: C.texto2 }}>
              Aún no hay candidatos. Aparecerán aquí por país en cuanto alguien se inscriba.
            </p>
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

        <div className={`${e.panel} flex flex-col gap-3 p-5 sm:p-6`}>
          <h2 className="text-xl font-bold" style={{ color: C.marino }}>
            Actividad reciente
          </h2>
          {actividad.length === 0 ? (
            <p className="rounded-lg px-4 py-6 text-center text-sm" style={{ background: C.superficie, color: C.texto2 }}>
              Cuando lleguen entregas las verás aquí, por orden de llegada.
            </p>
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
      </div>
    </main>
  );
}
