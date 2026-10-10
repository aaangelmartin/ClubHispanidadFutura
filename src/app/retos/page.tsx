import Link from "next/link";
import { getSession } from "@/lib/session";
import { EstadoEntrega, TarjetaEmbarque, C } from "@/components/embarca";
import { retosAbiertos, misRetos, aceptaEntregas, plazo } from "./queries";
import { cierre, estadoEntrega, estadoReto, puerta, ruta } from "./embarque";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ pais?: string; q?: string; area?: string }>;
}) {
  const params = await searchParams;
  const session = await getSession();
  const [retos, mios] = await Promise.all([
    retosAbiertos(),
    session?.role === "student" ? misRetos(session.id) : Promise.resolve([]),
  ]);
  const paises = [...new Set(retos.map((r) => r.companies.country))].sort();
  const areas = [...new Set(retos.map((r) => r.profile))].sort();
  const q = (params.q ?? "").trim().toLocaleLowerCase("es");
  const visibles = retos.filter(
    (r) =>
      (!params.pais || r.companies.country === params.pais) &&
      (!params.area || r.profile === params.area) &&
      (!q ||
        `${r.title} ${r.summary} ${r.profile} ${r.companies.name}`
          .toLocaleLowerCase("es")
          .includes(q)),
  );
  const estudiante = session?.role === "student";
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div
        className={`grid items-start gap-8 ${estudiante ? "lg:grid-cols-[minmax(0,1fr)_340px]" : ""}`}
      >
        <section aria-labelledby="abiertos" className="min-w-0">
          <h1 id="abiertos" className="text-3xl font-bold sm:text-4xl">
            Retos abiertos
          </h1>
          <p className="mt-2 max-w-2xl text-ink-2">
            Retos reales de empresas de España y Colombia. Sin CV. Ganes o no,
            la valoración vuelve sellada a tu pasaporte.
          </p>
          <form
            className="mt-6 flex flex-wrap items-end gap-3 rounded-xl bg-white p-4 ring-1 ring-line"
            action="/retos"
          >
            <label className="min-w-0 flex-[2_1_220px] text-sm font-semibold">
              Buscar
              <input
                className="field mt-1"
                name="q"
                defaultValue={params.q}
                placeholder="Título, empresa o competencia"
                maxLength={200}
              />
            </label>
            <label className="min-w-0 flex-[1_1_150px] text-sm font-semibold">
              País de la empresa
              <select
                className="field mt-1"
                name="pais"
                defaultValue={params.pais ?? ""}
              >
                <option value="">Todos los países</option>
                {paises.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
            <label className="min-w-0 flex-[1_1_150px] text-sm font-semibold">
              Perfil buscado
              <select
                className="field mt-1"
                name="area"
                defaultValue={params.area ?? ""}
              >
                <option value="">Todos los perfiles</option>
                {areas.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </label>
            <div className="flex gap-2">
              <button className="btn btn-primary">Filtrar</button>
              <Link className="btn" href="/retos">
                Limpiar
              </Link>
            </div>
          </form>
          <p role="status" className="mb-4 mt-5 text-sm text-ink-2">
            {visibles.length}{" "}
            {visibles.length === 1 ? "reto embarcando" : "retos embarcando"}
          </p>
          <ul className="flex flex-col gap-5">
            {visibles.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/retos/${r.id}`}
                  className="block rounded-xl transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                  aria-label={`${r.title} · ${r.companies.name}`}
                >
                  <TarjetaEmbarque
                    t={{
                      empresa: r.companies.name,
                      ...ruta(r.companies.country),
                      titulo: r.title,
                      puerta: puerta(r.id),
                      estado: estadoReto(r),
                      datos: [
                        { etiqueta: "Duración", valor: `${r.duration_days} días` },
                        { etiqueta: "Perfil", valor: r.profile },
                        { etiqueta: "Cierra", valor: cierre(r.deadline) },
                        { etiqueta: "Premio", valor: r.suggested_prize || "Sin premio" },
                      ],
                      pie: (
                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-line pt-3 text-sm">
                          <span className="text-ink-2">
                            {r.companies.country} · {plazo(r)}
                            {r.is_example && " · Ejemplo piloto"}
                          </span>
                          <span className="font-bold" style={{ color: C.marino }}>
                            Ver reto y rúbrica →
                          </span>
                        </div>
                      ),
                    }}
                  />
                </Link>
              </li>
            ))}
          </ul>
          {!visibles.length && (
            <div className="rounded-xl bg-white p-6 ring-1 ring-line">
              <h2 className="text-xl font-bold">No hay retos con estos filtros</h2>
              <p className="mt-2 text-ink-2">
                Prueba otro país o elimina la búsqueda para ver las
                oportunidades disponibles.
              </p>
              <Link className="btn mt-4" href="/retos">
                Ver todos los retos
              </Link>
            </div>
          )}
        </section>

        {estudiante && (
          <aside
            aria-labelledby="mis-retos"
            className="flex flex-col gap-4 lg:sticky lg:top-6"
          >
            <div className="overflow-hidden rounded-xl bg-white ring-1 ring-line">
              <div
                className="flex items-center justify-between gap-3 px-5 py-3"
                style={{ background: C.marino }}
              >
                <h2 id="mis-retos" className="text-lg font-bold text-white">
                  Mis retos
                </h2>
                <Link
                  className="text-sm font-semibold underline-offset-4 hover:underline"
                  style={{ color: C.oro }}
                  href={`/pasaporte/${session.id}`}
                >
                  Mi pasaporte →
                </Link>
              </div>
              {mios.length ? (
                <ul className="divide-y divide-line">
                  {mios.map((e) => {
                    const est = estadoEntrega(
                      { submitted_at: e.submitted_at, evaluada: e.evaluations.length > 0 },
                      aceptaEntregas(e.challenges),
                    );
                    return (
                      <li key={e.id} className="flex flex-col gap-2 px-5 py-4">
                        <Link
                          className="font-semibold leading-snug hover:underline"
                          href={`/retos/${e.challenge_id}`}
                        >
                          {e.challenges.title}
                        </Link>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs text-ink-2">
                            {e.challenges.companies.name} ·{" "}
                            <span className="font-mono">
                              {ruta(e.challenges.companies.country).origen}
                            </span>
                          </span>
                          <EstadoEntrega estado={est} />
                        </div>
                        {est === "valorada" && (
                          <Link
                            className="text-sm font-semibold text-gold hover:underline"
                            href={`/pasaporte/${session.id}`}
                          >
                            Ver la nota y el sello en mi pasaporte
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="px-5 py-4 text-sm text-ink-2">
                  Todavía no te has apuntado. Elige una tarjeta y empieza a
                  demostrar lo que sabes.
                </p>
              )}
            </div>
            <div className="rounded-xl bg-white p-5 ring-1 ring-line">
              <h3 className="font-bold">Guía de colores</h3>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-ink-2">
                <li className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm" style={{ background: C.verde }} />
                  Embarcando: puedes apuntarte
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm" style={{ background: C.ambar }} />
                  Cierra pronto: quedan 3 días o menos
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm" style={{ background: C.rojo }} />
                  Cerrado: ya no admite entregas
                </li>
              </ul>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
