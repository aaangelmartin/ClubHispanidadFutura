import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { C, EstadoEntrega, TarjetaEmbarque } from "@/components/embarca";
import {
  aceptaEntregas,
  detalle,
  estado,
  miEntrega,
  plazo,
  validId,
} from "../queries";
import Participar from "../Participar";
import { cierre, estadoEntrega, estadoReto, puerta, ruta } from "../embarque";

const PESO = [C.marino, C.oro, C.azul, C.verde, C.texto2];

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
  const estadoMio = entrega
    ? estadoEntrega(
        { submitted_at: entrega.submitted_at, evaluada: entrega.evaluations.length > 0 },
        abierto,
      )
    : null;
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link
        href="/retos"
        className="text-sm font-semibold text-ink-2 hover:text-ink"
      >
        ← Todos los retos
      </Link>

      <div className="mt-5">
        <TarjetaEmbarque
          t={{
            empresa: `${reto.companies.name} · ${reto.companies.country}`,
            ...ruta(reto.companies.country),
            titulo: reto.title,
            puerta: puerta(reto.id),
            estado: estadoReto(reto),
            datos: [
              { etiqueta: "Duración", valor: `${reto.duration_days} días` },
              { etiqueta: "Perfil", valor: reto.profile },
              { etiqueta: "Cierra", valor: cierre(reto.deadline) },
              { etiqueta: "Modalidad", valor: "En remoto, sin visado" },
            ],
            pie: (
              <p className="max-w-3xl text-ink-2">
                {reto.summary}
                {reto.is_example && (
                  <span className="ml-2 rounded bg-paper px-1.5 py-0.5 text-xs font-semibold text-ink">
                    Ejemplo piloto
                  </span>
                )}
              </p>
            ),
          }}
        />
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-8">
          {[
            ["El contexto", reto.context],
            ["Tu reto", reto.task],
            ["Qué entregar", reto.deliverable],
          ].map(([title, text], i) => (
            <section key={title} className="flex gap-4">
              <span
                className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-xs font-bold"
                style={{ background: C.marino, color: C.oro }}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="mt-2 whitespace-pre-wrap break-words text-ink-2">
                  {text}
                </p>
              </div>
            </section>
          ))}

          <section className="rounded-xl bg-white p-5 ring-1 ring-line sm:p-6">
            <h2 className="text-xl font-bold">Cómo se valorará tu solución</h2>
            <p className="mt-1 text-sm text-ink-2">
              La empresa pone una nota de 0 a 10 en cada criterio, según su
              peso. La IA no pone la nota.
            </p>
            <div
              className="mt-5 flex h-3 overflow-hidden rounded-full"
              aria-hidden="true"
            >
              {reto.rubric.map((r, i) => (
                <span
                  key={i}
                  style={{ width: `${r.weight}%`, background: PESO[i % PESO.length] }}
                />
              ))}
            </div>
            <ul className="mt-5 flex flex-col gap-4">
              {reto.rubric.map((r, i) => (
                <li key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-sm"
                        style={{ background: PESO[i % PESO.length] }}
                      />
                      {r.criterion}
                    </h3>
                    <span className="font-mono text-sm font-bold">
                      {r.weight}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-paper">
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${r.weight}%`, background: PESO[i % PESO.length] }}
                    />
                  </div>
                  <p className="text-sm text-ink-2">{r.description}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
          <div className="overflow-hidden rounded-xl bg-white ring-1 ring-line">
            <div
              className="flex items-center justify-between gap-3 px-5 py-3"
              style={{ background: C.marino }}
            >
              <h2 className="text-lg font-bold text-white">Tu participación</h2>
              {estadoMio && <EstadoEntrega estado={estadoMio} />}
            </div>
            <div className="p-5">
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs text-ink-2">Plazo</dt>
                  <dd className="font-bold">{plazo(reto)}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs text-ink-2">Premio</dt>
                  <dd className="font-bold">
                    {reto.suggested_prize || "Sin premio anunciado"}
                  </dd>
                </div>
                {reto.deadline && (
                  <div className="col-span-2">
                    <dt className="text-xs text-ink-2">Cierre</dt>
                    <dd className="text-sm">
                      {new Intl.DateTimeFormat("es", {
                        dateStyle: "long",
                        timeStyle: "short",
                        timeZone: "Europe/Madrid",
                      }).format(new Date(reto.deadline))}{" "}
                      (hora de Madrid)
                    </dd>
                  </div>
                )}
              </dl>
              <p
                className="mt-4 rounded-lg px-3 py-2.5 text-sm font-semibold"
                style={{ background: "var(--gold-soft)", color: C.marino }}
              >
                Tu entrega es tuya salvo que la empresa te contrate.
              </p>

              {entrega && (
                <p role="status" className="mt-4 text-sm font-semibold">
                  {estado(reto, entrega)}
                </p>
              )}
              {entrega?.submitted_at ? (
                <div className="mt-4 flex flex-col gap-3 border-t border-dashed border-line pt-4">
                  <h3 className="font-bold">Tu entrega</h3>
                  {entrega.link && /^https?:\/\//i.test(entrega.link) && (
                    <a
                      className="break-all text-sm font-semibold text-blue underline"
                      href={entrega.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Abrir solución ↗
                    </a>
                  )}
                  <p className="whitespace-pre-wrap break-words text-sm text-ink-2">
                    {entrega.notes}
                  </p>
                  <p className="text-xs text-ink-2">
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
                    <p className="text-sm text-ink-2">
                      Regístrate como estudiante para apuntarte. Participar es
                      gratis.
                    </p>
                    <Link
                      className="btn btn-primary mt-4 w-full"
                      href="/registro?rol=estudiante"
                    >
                      Me apunto
                    </Link>
                  </div>
                )
              ) : (
                <p className="mt-4 text-sm text-ink-2">
                  El plazo ha terminado. Ya no se aceptan entregas.{" "}
                  <Link href="/retos" className="underline">
                    Busca otro reto abierto.
                  </Link>
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
