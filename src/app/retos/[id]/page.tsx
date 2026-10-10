import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import {
  aceptaEntregas,
  detalle,
  estado,
  miEntrega,
  plazo,
  validId,
} from "../queries";
import Participar from "../Participar";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!validId(id)) notFound();
  const reto = await detalle(id);
  if (!reto) notFound();
  const session = await getSession();
  const entrega =
    session?.role === "student" ? await miEntrega(id, session.id) : null;
  const abierto = aceptaEntregas(reto);
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <Link href="/retos" className="text-sm underline underline-offset-4">
        ← Todos los retos
      </Link>
      <div className="mt-6 flex flex-wrap gap-2">
        <span className="chip">{reto.companies.country}</span>
        {reto.is_example && <span className="chip">Ejemplo piloto</span>}
        <span className="chip">
          {abierto
            ? "Abierto"
            : reto.status === "cerrado"
              ? "Cerrado"
              : "En valoración"}
        </span>
      </div>
      <p className="mt-4 text-ink-2">
        {reto.companies.name} · {reto.companies.country} · En remoto, sin visado
      </p>
      <h1 className="mt-2 max-w-4xl text-4xl font-bold">{reto.title}</h1>
      <p className="mt-3 max-w-3xl text-xl text-ink-2">{reto.summary}</p>
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          {[
            ["El contexto", reto.context],
            ["Tu reto", reto.task],
            ["Qué entregar", reto.deliverable],
            ["Perfil buscado", reto.profile],
          ].map(([title, text]) => (
            <section key={title} className="card p-5 sm:p-6">
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="mt-3 whitespace-pre-wrap break-words text-ink-2">
                {text}
              </p>
            </section>
          ))}
          <section className="card p-5 sm:p-6">
            <h2 className="text-2xl font-bold">Cómo se valorará tu solución</h2>
            <p className="mt-2 text-ink-2">
              La empresa valora tu trabajo con estos criterios. La IA no pone la
              nota.
            </p>
            <ul className="mt-4 divide-y divide-line">
              {reto.rubric.map((r, i) => (
                <li key={i} className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold">{r.criterion}</h3>
                    <span className="font-mono text-gold">{r.weight}%</span>
                  </div>
                  <p className="mt-2 text-sm text-ink-2">{r.description}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <aside className="card p-5 sm:p-6">
          <h2 className="text-2xl font-bold">Tu participación</h2>
          <dl className="mt-4 space-y-3">
            <div>
              <dt className="font-semibold">Plazo</dt>
              <dd>
                {reto.duration_days} días · {plazo(reto)}
              </dd>
              {reto.deadline && (
                <dd className="text-sm text-ink-2">
                  Cierre:{" "}
                  {new Intl.DateTimeFormat("es", {
                    dateStyle: "long",
                    timeStyle: "short",
                    timeZone: "Europe/Madrid",
                  }).format(new Date(reto.deadline))}{" "}
                  (hora de Madrid)
                </dd>
              )}
            </div>
            <div>
              <dt className="font-semibold">Premio</dt>
              <dd>{reto.suggested_prize || "Sin premio anunciado"}</dd>
            </div>
          </dl>
          <p className="my-5 border-y border-line py-4 font-semibold">
            Tu entrega es tuya salvo que la empresa te contrate.
          </p>
          {entrega && (
            <p role="status" className="font-semibold">
              {estado(reto, entrega)}
            </p>
          )}
          {entrega?.submitted_at ? (
            <div className="mt-4 space-y-3">
              <h3 className="text-lg font-bold">Tu entrega</h3>
              {entrega.link && /^https?:\/\//i.test(entrega.link) && (
                <a
                  className="block break-all underline"
                  href={entrega.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir solución ↗
                </a>
              )}
              <p className="whitespace-pre-wrap break-words text-ink-2">
                {entrega.notes}
              </p>
              <p className="text-sm text-ink-2">
                Entregada el{" "}
                {new Date(entrega.submitted_at).toLocaleDateString("es", {
                  timeZone: "Europe/Madrid",
                })}
              </p>
              {entrega.evaluations.length > 0 && (
                <Link
                  className="btn btn-primary"
                  href={`/pasaporte/${session!.id}`}
                >
                  Ver valoración en mi pasaporte
                </Link>
              )}
            </div>
          ) : abierto ? (
            session?.role === "student" ? (
              <Participar id={id} apuntado={!!entrega} />
            ) : (
              <div className="mt-4">
                <p className="text-ink-2">
                  Regístrate como estudiante para apuntarte. Participar es
                  gratis.
                </p>
                <Link
                  className="btn btn-primary mt-4"
                  href="/registro?rol=estudiante"
                >
                  Me apunto
                </Link>
              </div>
            )
          ) : (
            <p className="mt-4 text-ink-2">
              El plazo ha terminado. Ya no se aceptan entregas.{" "}
              <Link href="/retos" className="underline">
                Busca otro reto abierto.
              </Link>
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}
