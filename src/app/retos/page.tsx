import Link from "next/link";
import { getSession } from "@/lib/session";
import { retosAbiertos, misRetos, estado, plazo } from "./queries";

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
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <p className="eyebrow">Talento sin fronteras</p>
      <h1 className="mt-2 text-4xl font-bold">
        Retos reales. Tu próxima oportunidad.
      </h1>
      <p className="mt-3 max-w-3xl text-ink-2">
        Retos reales de empresas de España y Colombia. Sin CV. Ganes o no, te
        llevas la valoración a tu pasaporte.
      </p>
      {session?.role === "student" && (
        <section className="mt-8" aria-labelledby="mis-retos">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="mis-retos" className="text-2xl font-bold">
              Mis retos
            </h2>
            <Link className="btn" href={`/pasaporte/${session.id}`}>
              Mi pasaporte
            </Link>
          </div>
          {mios.length ? (
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {mios.map((e) => (
                <li key={e.id} className="card p-4">
                  <Link
                    className="font-semibold underline underline-offset-4"
                    href={`/retos/${e.challenge_id}`}
                  >
                    {e.challenges.title}
                  </Link>
                  <p className="mt-1 text-sm text-ink-2">
                    {e.challenges.companies.name} ·{" "}
                    {e.challenges.companies.country}
                  </p>
                  <p
                    className={`mt-2 text-sm ${e.evaluations.length ? "text-ok" : "text-ink-2"}`}
                  >
                    {estado(e.challenges, e)}
                  </p>
                  {e.evaluations.length > 0 && (
                    <Link
                      className="mt-2 inline-block underline"
                      href={`/pasaporte/${session.id}`}
                    >
                      Ver valoración en mi pasaporte
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-ink-2">
              Todavía no te has apuntado. Elige un reto abajo y empieza a
              demostrar lo que sabes.
            </p>
          )}
        </section>
      )}
      <section className="mt-8" aria-labelledby="abiertos">
        <h2 id="abiertos" className="text-2xl font-bold">
          Retos abiertos
        </h2>
        <form
          className="card my-5 grid items-end gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4"
          action="/retos"
        >
          <label>
            Buscar
            <input
              className="field mt-1"
              name="q"
              defaultValue={params.q}
              placeholder="Título, empresa o competencia"
              maxLength={200}
            />
          </label>
          <label>
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
          <label>
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
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary">Filtrar</button>
            <Link className="btn" href="/retos">
              Limpiar
            </Link>
          </div>
        </form>
        <p role="status" className="mb-3 text-sm text-ink-2">
          {visibles.length}{" "}
          {visibles.length === 1 ? "reto disponible" : "retos disponibles"}
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          {visibles.map((r) => (
            <article key={r.id} className="card flex flex-col p-5 sm:p-6">
              <div className="flex flex-wrap gap-2">
                <span className="chip">{r.companies.country}</span>
                {r.is_example && <span className="chip">Ejemplo piloto</span>}
              </div>
              <p className="mt-4 text-sm text-ink-2">{r.companies.name}</p>
              <h3 className="mt-1 text-2xl font-bold">
                <Link href={`/retos/${r.id}`} className="hover:underline">
                  {r.title}
                </Link>
              </h3>
              <p className="mt-3 text-ink-2">{r.summary}</p>
              <dl className="my-5 grid gap-3 text-sm">
                <div>
                  <dt className="font-semibold">Perfil buscado</dt>
                  <dd>{r.profile}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Plazo</dt>
                  <dd>
                    {r.duration_days} días de duración · {plazo(r)}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Premio</dt>
                  <dd>{r.suggested_prize || "Sin premio anunciado"}</dd>
                </div>
              </dl>
              <Link className="btn mt-auto self-start" href={`/retos/${r.id}`}>
                Ver reto y rúbrica →
              </Link>
            </article>
          ))}
        </div>
        {!visibles.length && (
          <div className="card p-6">
            <h3 className="text-xl">No hay retos con estos filtros</h3>
            <p className="mt-2 text-ink-2">
              Prueba otro país o elimina la búsqueda para ver las oportunidades
              disponibles.
            </p>
            <Link className="btn mt-4" href="/retos">
              Ver todos los retos
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
