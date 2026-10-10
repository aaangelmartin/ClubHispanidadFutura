// Dueño: perfil 4 (valorar y pasaporte). Ver docs/perfiles/4-valorar-y-pasaporte.md.
// Valorar en Embarca: lista de entregas a la izquierda, pasaporte + entrega en el centro, nota por criterio a la derecha.
import Link from "next/link";
import { notFound } from "next/navigation";
import { C, EstadoEntrega, Nota, Pasaporte, TarjetaEmbarque } from "@/components/embarca";
import e from "@/app/empresa/_lib/empresa.module.css";
import { formatDate, getChallengeForCompany, getSubmissions, initials, requireCompany, weightedScore } from "../../_lib/queries";
import { estadoEntrega, tarjetaDeReto } from "../../_lib/embarca";
import AiSummaryBlock from "./AiSummaryBlock";
import EvaluationForm from "./EvaluationForm";
import { closeChallenge, closeSubmissions, requestContact } from "./actions";

export const dynamic = "force-dynamic";

export default async function ValorarReto({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ e?: string }>;
}) {
  const { id } = await params;
  const { e: elegida } = await searchParams;
  const company = await requireCompany();
  const challenge = await getChallengeForCompany(id, company.id);
  if (!challenge) notFound();

  const all = await getSubmissions(id);
  const delivered = all.filter((s) => s.submitted_at);
  const done = delivered.filter((s) => s.evaluation).length;
  const pending = delivered.length - done;
  const canEvaluate = challenge.status === "en_valoracion" || challenge.status === "cerrado";

  const lista = [...delivered, ...all.filter((s) => !s.submitted_at)];
  const s = delivered.find((x) => x.id === elegida) ?? delivered.find((x) => !x.evaluation) ?? delivered[0] ?? null;
  const score = s?.evaluation ? weightedScore(challenge.rubric, s.evaluation.scores) : null;

  return (
    <main className="mx-auto flex max-w-[1240px] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-col gap-1.5">
        <nav className="text-sm" style={{ color: C.texto2 }} aria-label="Ruta">
          <Link href="/empresa" className="font-semibold hover:underline">
            Tu terminal
          </Link>{" "}
          <span aria-hidden="true">/</span> <span>{challenge.title}</span>
        </nav>
        <h1 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl" style={{ color: C.marino }}>
          Valorar entregas
        </h1>
      </header>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <TarjetaEmbarque t={tarjetaDeReto(challenge, company.name, company.country)} compacta />
        <div className={`${e.panel} flex flex-col gap-3 p-5`}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="flex flex-col gap-1">
              <span className="text-sm font-semibold" style={{ color: C.texto2 }}>
                Valoradas
              </span>
              <span className="text-4xl font-bold leading-none tabular-nums tracking-[-0.02em]" style={{ color: C.marino }}>
                {done}
                <span className="text-xl font-semibold" style={{ color: C.texto2 }}>
                  {" "}
                  / {delivered.length}
                </span>
              </span>
            </span>
            {pending > 0 && (
              <span className="rounded-md px-2 py-1 text-xs font-bold" style={{ background: "#fdf3dc", color: "#8a5a00" }}>
                Quedan {pending}
              </span>
            )}
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[#eeeeec]">
            <div className="h-2.5 rounded-full" style={{ width: `${delivered.length ? (done / delivered.length) * 100 : 0}%`, background: C.verde }} />
          </div>
          {challenge.status === "abierto" && (
            <form action={closeSubmissions} className="mt-auto">
              <input type="hidden" name="challenge_id" value={challenge.id} />
              <button className="btn btn-primary w-full">Cerrar entregas y empezar a valorar</button>
            </form>
          )}
          {challenge.status === "en_valoracion" && (
            <form action={closeChallenge} className="mt-auto flex flex-col gap-2">
              <input type="hidden" name="challenge_id" value={challenge.id} />
              <button className="btn w-full" disabled={pending > 0}>
                Cerrar reto
              </button>
              <span className="text-xs" style={{ color: C.texto2 }}>
                {pending > 0
                  ? `Podrás cerrarlo cuando valores ${pending === 1 ? "la entrega que falta" : `las ${pending} que faltan`}. Nadie se queda sin respuesta.`
                  : "Todas valoradas. Al cerrar, cada nota queda en su pasaporte."}
              </span>
            </form>
          )}
          {challenge.status === "cerrado" && (
            <p className="mt-auto text-sm" style={{ color: C.texto2 }}>
              Reto cerrado. Todas las valoraciones están en los pasaportes.
            </p>
          )}
        </div>
      </section>

      {challenge.status === "abierto" && delivered.length > 0 && (
        <p className="rounded-xl px-4 py-3 text-sm" style={{ background: "#fdf3dc", color: C.marino, boxShadow: `inset 0 0 0 1px ${C.ambar}` }}>
          El reto sigue abierto: ya puedes leer las entregas. La valoración se activa al cerrar las entregas.
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_340px]">
        {/* Lista de entregas */}
        <aside className="flex min-w-0 flex-col gap-2">
          <h2 className="text-lg font-bold" style={{ color: C.marino }}>
            Entregas <span className="font-semibold" style={{ color: C.texto2 }}>{lista.length}</span>
          </h2>
          {lista.length === 0 && (
            <p className={`${e.panel} px-4 py-6 text-center text-sm`} style={{ color: C.texto2 }}>
              Todavía no se ha inscrito nadie. Las entregas aparecerán aquí por orden de llegada.
            </p>
          )}
          <ul className="flex flex-col gap-2">
            {lista.map((x) => {
              const nota = x.evaluation ? weightedScore(challenge.rubric, x.evaluation.scores) : null;
              const activa = s?.id === x.id;
              const contenido = (
                <>
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold"
                    style={{ background: activa ? C.oro : C.superficie, color: C.marino }}
                  >
                    {initials(x.student.name)}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-bold" style={{ color: C.marino }}>
                      {x.student.name}
                    </span>
                    <span className="truncate text-xs" style={{ color: C.texto2 }}>
                      {x.student.university} · {x.student.country}
                    </span>
                  </span>
                  {nota !== null ? <Nota valor={nota} size="sm" /> : <EstadoEntrega estado={estadoEntrega(x, challenge.status)} />}
                </>
              );
              const cls = `flex items-center gap-2.5 rounded-xl bg-white p-2.5 ${activa ? "ring-2 ring-[#c8963a]" : "ring-1 ring-[#e2e2de]"}`;
              return (
                <li key={x.id}>
                  {x.submitted_at ? (
                    <Link href={`/empresa/retos/${challenge.id}?e=${x.id}`} scroll={false} className={`${cls} hover:ring-[#c8963a]`}>
                      {contenido}
                    </Link>
                  ) : (
                    <div className={`${cls} opacity-70`}>{contenido}</div>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="text-xs leading-snug" style={{ color: C.texto2 }}>
            Por orden de entrega. La IA no ordena ni descarta a nadie.
          </p>
        </aside>

        {/* Pasaporte + entrega */}
        {s ? (
          <section className="flex min-w-0 flex-col gap-4">
            <Pasaporte
              className="w-full max-w-[560px]"
              d={{
                nombre: s.student.name,
                universidad: s.student.university,
                pais: s.student.country,
                retos: s.evaluation ? 1 : 0,
                numero: `EMB${s.student.id.replace(/-/g, "").slice(0, 6).toUpperCase()}`,
                sellos: score !== null ? [{ nota: score, empresa: company.name }] : [],
              }}
            />
            <div className={`${e.panel} flex flex-col gap-4 p-5`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-bold" style={{ color: C.marino }}>
                  Su entrega
                </h2>
                <span className="text-sm" style={{ color: C.texto2 }}>
                  Entregada el {formatDate(s.submitted_at)}
                </span>
              </div>
              {s.link && (
                <a
                  href={s.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-w-0 items-center gap-3 rounded-lg p-3 ring-1 ring-[#e2e2de] hover:ring-[#c8963a]"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-white" style={{ background: C.azul }} aria-hidden="true">
                    ↗
                  </span>
                  <span className="min-w-0 truncate text-sm font-semibold" style={{ color: C.azul }}>
                    {s.link.replace(/^https?:\/\//, "")}
                  </span>
                </a>
              )}
              {s.notes && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold" style={{ color: C.marino }}>
                    Descripción
                  </span>
                  <p className="whitespace-pre-line text-[15px] leading-relaxed" style={{ color: C.marino }}>
                    {s.notes}
                  </p>
                </div>
              )}
              <Link href={`/pasaporte/${s.student.id}`} className="self-start text-sm font-semibold hover:underline" style={{ color: C.texto2 }}>
                Ver su pasaporte completo
              </Link>
            </div>
            <AiSummaryBlock key={s.id} submissionId={s.id} initial={s.ai_summary} />
          </section>
        ) : (
          <section className={`${e.panel} flex flex-col items-center gap-2 px-6 py-14 text-center lg:col-span-1 xl:col-span-2`}>
            <span className="grid h-14 w-14 place-items-center rounded-full text-2xl" style={{ background: C.superficie, color: C.azul }} aria-hidden="true">
              ✈
            </span>
            <p className="text-lg font-bold" style={{ color: C.marino }}>
              Todavía no ha llegado ninguna entrega
            </p>
            <p className="max-w-sm text-[15px]" style={{ color: C.texto2 }}>
              Cuando alguien entregue, verás aquí su pasaporte, su trabajo y la rúbrica para valorarlo.
            </p>
          </section>
        )}

        {/* Valoración */}
        {s && (
          <aside className="flex min-w-0 flex-col gap-4 lg:col-span-2 xl:col-span-1">
            <div className={`${e.panel} flex flex-col gap-4 p-5`}>
              {canEvaluate ? (
                <EvaluationForm key={s.id} submissionId={s.id} rubric={challenge.rubric} existing={s.evaluation} />
              ) : (
                <p style={{ color: C.texto2 }}>La valoración se activa al cerrar las entregas.</p>
              )}
              {s.evaluation &&
                (s.evaluation.contact_requested ? (
                  <div className="rounded-lg p-3 text-sm" style={{ boxShadow: `inset 0 0 0 1.5px ${C.verde}` }}>
                    <b style={{ color: C.verde }}>Contactado.</b> Escríbele a <span className="font-mono">{s.student.email}</span>
                  </div>
                ) : (
                  <form action={requestContact}>
                    <input type="hidden" name="submission_id" value={s.id} />
                    <button className="btn w-full">Contactar con {s.student.name.split(" ")[0]}</button>
                  </form>
                ))}
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
