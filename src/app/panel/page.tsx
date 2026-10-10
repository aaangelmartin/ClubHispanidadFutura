// Dueño: perfil 1 (entrada y demanda). Panel público para el proyector: solo registros reales.
import type { Metadata } from "next";
import Link from "next/link";
import Refresco from "./Refresco";
import { getPanel } from "./queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Panel en vivo · Retos Hispanidad Futura" };

function hace(iso: string) {
  const min = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  return h < 24 ? `hace ${h} h` : new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

function Barras({ titulo, filas }: { titulo: string; filas: { nombre: string; total: number }[] }) {
  const max = Math.max(1, ...filas.map((f) => f.total));
  return (
    <section className="card flex flex-col gap-4 p-6">
      <h2 className="text-xl font-bold">{titulo}</h2>
      {filas.length === 0 ? (
        <p className="text-ink-3">Aparecerá en cuanto se registre el primer estudiante.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filas.map((f) => (
            <li key={f.nombre} className="grid grid-cols-[minmax(0,10rem)_1fr_auto] items-center gap-3">
              <span className="truncate text-ink-2" title={f.nombre}>
                {f.nombre}
              </span>
              <span className="h-3 rounded-full bg-line">
                <span className="block h-3 rounded-full bg-ink" style={{ width: `${(f.total / max) * 100}%` }} />
              </span>
              <span className="tabular font-mono text-sm">{f.total}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function Panel() {
  let data;
  try {
    data = await getPanel();
  } catch {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="card p-8">
          <h1 className="text-2xl font-bold">El panel no puede leer los datos ahora mismo</h1>
          <p className="mt-2 text-ink-2">Comprueba la conexión con la base de datos y recarga la página.</p>
        </div>
      </main>
    );
  }

  const cifras = [
    { label: "Estudiantes registrados", valor: data.estudiantes, destacada: true },
    { label: "Empresas", valor: data.empresas },
    { label: "Retos publicados", valor: data.retos },
    { label: "Entregas", valor: data.entregas },
  ];

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6">
      <Refresco />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="eyebrow inline-flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-ok" aria-hidden="true" />
            En vivo · se actualiza solo
          </span>
          <h1 className="text-4xl font-bold sm:text-5xl">Demanda real, hoy</h1>
        </div>
        <p className="max-w-sm text-ink-2">
          Solo registros reales. Los datos de ejemplo del piloto no cuentan aquí.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cifras.map((c) => (
          <div key={c.label} className={`card flex flex-col gap-1 p-6 ${c.destacada ? "border-t-4 border-t-gold" : ""}`}>
            <span className="tabular font-display text-5xl font-bold sm:text-6xl">{c.valor}</span>
            <span className="text-ink-2">{c.label}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Barras titulo="Estudiantes por país" filas={data.porPais} />
        <Barras titulo="Estudiantes por universidad" filas={data.porUniversidad} />
      </div>

      <section className="card flex flex-col gap-4 p-6">
        <h2 className="text-xl font-bold">Últimos registros</h2>
        {data.ultimos.length === 0 ? (
          <p className="text-ink-3">
            Aún no hay registros. <Link href="/registro" className="underline">Sé el primero</Link>.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {data.ultimos.map((u, i) => (
              <li key={i} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                <span>
                  <strong>{u.nombre}</strong> <span className="text-ink-2">· {u.universidad}</span>
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-ink-3">
                  {u.pais} · {hace(u.cuando)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
