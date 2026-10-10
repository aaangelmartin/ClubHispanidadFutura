// Dueño: perfil 4. Inicio del estudiante en Embarca: su pasaporte arriba, los retos abiertos como
// tarjetas de embarque y, al lado, lo que cierra pronto, sus retos y las empresas con retos.
// Solo usa lo que devuelven ./queries: no inventa notas, entregas ni sellos.
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Accion from "@/app/empresa/_lib/Accion";
import { cierre, codigoPais, estadoReto, puerta, ruta } from "@/app/retos/embarque";
import {
  C,
  EstadoEntrega,
  EstadoReto,
  Nota,
  Pasaporte,
  Sello,
  TarjetaEmbarque,
  type EstadoEntregaValor,
} from "@/components/embarca";
import { getSession } from "@/lib/session";
import { area, getActividad, getEstudiante, getFeed, hace, PLATAFORMA_ID, quedan, type Actividad, type RetoFeed } from "./queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Mi panel · Embarca" };

const FILTROS = [
  { k: "todos", l: "Todos" },
  { k: "empresas", l: "De empresas" },
  { k: "plataforma", l: "Del Club" },
  { k: "espana", l: "España" },
  { k: "colombia", l: "Colombia" },
] as const;

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;
const iniciales = (n: string) =>
  n
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

type Yo = NonNullable<Awaited<ReturnType<typeof getEstudiante>>>;

export default async function Inicio({ searchParams }: { searchParams: Promise<{ ver?: string }> }) {
  const { ver = "todos" } = await searchParams;
  const s = await getSession();
  if (s?.role !== "student") redirect("/registro?rol=estudiante");
  const [yo, retos, actividad] = await Promise.all([getEstudiante(s.id), getFeed(s.id), getActividad()]);
  if (!yo) redirect("/registro?rol=estudiante");

  const filtro = FILTROS.some((f) => f.k === ver) ? ver : "todos";
  const visibles = retos.filter((r) => {
    if (filtro === "empresas") return r.company.id !== PLATAFORMA_ID;
    if (filtro === "plataforma") return r.company.id === PLATAFORMA_ID;
    if (filtro === "espana") return r.company.country === "España";
    if (filtro === "colombia") return r.company.country === "Colombia";
    return true;
  });

  // Sellos propios que aparecen en la actividad reciente (con su nota real). El resto, de otros estudiantes.
  const misSellos = actividad.filter((a) => a.estudiante.id === yo.id && a.nota !== null);
  const deOtros = actividad.filter((a) => a.estudiante.id !== yo.id);

  // Cada dos tarjetas, un sello conseguido por otra persona.
  const items: ({ t: "reto"; r: RetoFeed } | { t: "act"; a: Actividad })[] = [];
  visibles.forEach((r, i) => {
    items.push({ t: "reto", r });
    const a = deOtros[(i - 1) / 2];
    if (i % 2 === 1 && a) items.push({ t: "act", a });
  });

  const cierran = retos
    .filter((r) => (quedan(r.deadline) ?? 0) > 0)
    .sort((a, b) => (quedan(a.deadline) ?? 0) - (quedan(b.deadline) ?? 0))
    .slice(0, 4);
  const mios = retos.filter((r) => r.yoApuntado);
  const empresas = [
    ...retos
      .filter((r) => r.company.id !== PLATAFORMA_ID)
      .reduce((m, r) => m.set(r.company.id, { ...r.company, retos: (m.get(r.company.id)?.retos ?? 0) + 1 }), new Map<string, RetoFeed["company"] & { retos: number }>())
      .values(),
  ];
  const nombre = yo.name.split(/\s+/)[0];
  const numero = `EMB${yo.id.replace(/-/g, "").slice(-6).toUpperCase()}`;
  const sellos = misSellos.map((a) => ({ nota: a.nota as number, empresa: a.empresa }));

  return (
    <div className="min-h-screen">
      {/* Cabecera: saludo y pasaporte */}
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-9 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-12">
          <div className="flex min-w-0 flex-col gap-4">
            <p className="text-[15px] font-semibold" style={{ color: C.oro }}>
              Tu panel de embarque
            </p>
            <h1 className="text-[40px] font-bold leading-[1.02] tracking-[-0.03em] sm:text-6xl">Hola, {nombre}.</h1>
            <p className="max-w-xl text-lg leading-snug text-white/75">
              Hay <b className="text-white">{plural(retos.length, "reto embarcando", "retos embarcando")}</b> ahora mismo
              {cierran[0] && (quedan(cierran[0].deadline) ?? 99) <= 3 ? " y alguno cierra en días" : ""}. Llevas{" "}
              <b className="text-white">{plural(yo.sellos, "sello", "sellos")}</b> en tu pasaporte
              {mios.length > 0 ? ` y ${plural(mios.length, "reto abierto en marcha", "retos abiertos en marcha")}` : ""}.
            </p>
            <dl className="flex flex-wrap gap-x-8 gap-y-3 pt-1">
              {[
                ["Retos", yo.apuntado],
                ["Entregas", yo.entregados],
                ["Sellos", yo.sellos],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col">
                  <dt className="text-sm text-white/60">{k}</dt>
                  <dd className="text-3xl font-bold tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/retos" className="btn btn-primary">
                Explorar retos
              </Link>
              <Link
                href={`/pasaporte/${yo.id}`}
                className="btn border-white/30 bg-transparent text-white hover:border-white hover:bg-white/10"
              >
                Ver mi pasaporte
              </Link>
            </div>
          </div>
          {/* Móvil: el pasaporte abierto no cabe; va cerrado, como una tira con su sello más reciente. */}
          <Link
            href={`/pasaporte/${yo.id}`}
            aria-label="Abrir mi pasaporte"
            className="flex items-center gap-4 rounded-2xl p-1.5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)] sm:hidden"
            style={{ background: C.oro }}
          >
            <span className="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-3.5" style={{ background: C.papel }}>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-sm font-bold" style={{ color: C.marino }}>
                  Pasaporte Embarca
                </span>
                <span className="font-mono text-[11px]" style={{ color: C.texto2 }}>
                  Nº {numero}
                </span>
                <span className="mt-2 truncate text-[15px] font-bold" style={{ color: C.marino }}>
                  {yo.name}
                </span>
                <span className="truncate text-xs" style={{ color: C.texto2 }}>
                  {yo.university}
                </span>
              </span>
              {sellos[0] ? (
                <Sello nota={sellos[0].nota} empresa={sellos[0].empresa} size={78} />
              ) : (
                <span className="max-w-[12ch] text-right text-xs leading-snug" style={{ color: C.texto2 }}>
                  Tu primer sello llegará con tu primera valoración
                </span>
              )}
            </span>
          </Link>
          <Link href={`/pasaporte/${yo.id}`} aria-label="Abrir mi pasaporte" className="hidden min-w-0 transition-transform hover:-translate-y-1 sm:block">
            <Pasaporte
              compacto
              className="min-h-[230px] sm:min-h-[270px]"
              d={{
                nombre: yo.name,
                universidad: yo.university,
                pais: yo.country,
                retos: yo.sellos,
                numero,
                sellos,
              }}
            />
          </Link>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_330px]">
        {/* Retos */}
        <section aria-labelledby="salidas" className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
            <h2 id="salidas" className="text-[28px] font-bold tracking-[-0.02em]">
              Próximas salidas
            </h2>
            <p role="status" className="text-sm text-ink-2">
              {plural(visibles.length, "reto con este filtro", "retos con este filtro")}
            </p>
          </div>
          <nav aria-label="Filtrar retos" className="-mt-1 overflow-x-auto [scrollbar-width:none]">
            <ul className="flex min-w-max gap-4 border-b border-line sm:gap-6">
              {FILTROS.map((f) => {
                const activo = filtro === f.k;
                return (
                  <li key={f.k}>
                    <Link
                      href={f.k === "todos" ? "/estudiante" : `/estudiante?ver=${f.k}`}
                      aria-current={activo ? "page" : undefined}
                      className={`-mb-px block border-b-2 pb-2.5 pt-1 text-sm font-semibold sm:text-[15px] transition-colors ${
                        activo ? "border-gold text-ink" : "border-transparent text-ink-2 hover:text-ink"
                      }`}
                    >
                      {f.l}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {items.length === 0 && (
            <div className="rounded-xl bg-white p-6 ring-1 ring-line sm:p-8">
              <h3 className="text-xl font-bold">Aún no hay retos con este filtro</h3>
              <p className="mt-2 max-w-md text-ink-2">
                Las empresas publican retos nuevos cada semana. Mientras tanto, mira el resto de salidas.
              </p>
              <Link href="/estudiante" className="btn mt-4">
                Ver todos los retos
              </Link>
            </div>
          )}

          <ul className="flex flex-col gap-5">
            {items.map((it) => (
              <li key={it.t === "act" ? `a-${it.a.id}` : it.r.id}>
                {it.t === "act" ? <FilaSello a={it.a} /> : <Reto r={it.r} paisEstudiante={yo.country} />}
              </li>
            ))}
          </ul>
        </section>

        {/* Lateral */}
        <aside className="flex min-w-0 flex-col gap-5 lg:sticky lg:top-6">
          <Panel titulo="Cierran pronto">
            {cierran.length ? (
              <ul className="divide-y divide-line">
                {cierran.map((r) => {
                  const d = quedan(r.deadline) ?? 0;
                  return (
                    <li key={r.id}>
                      <Link href={`/retos/${r.id}`} className="group flex items-start justify-between gap-3 px-5 py-3.5">
                        <span className="flex min-w-0 flex-col">
                          <span className="font-semibold leading-snug group-hover:underline">{r.title}</span>
                          <span className="text-sm text-ink-2">{r.company.name}</span>
                        </span>
                        <span
                          className="shrink-0 rounded px-2 py-1 text-xs font-bold tabular-nums"
                          style={d <= 7 ? { background: C.ambar, color: C.marino } : { background: C.superficie, color: C.marino }}
                        >
                          {plural(d, "día", "días")}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="px-5 py-4 text-sm text-ink-2">Ningún reto abierto tiene fecha de cierre próxima.</p>
            )}
          </Panel>

          <Panel titulo="Mis retos" enlace={{ href: `/pasaporte/${yo.id}`, texto: "Mi pasaporte →" }}>
            {mios.length ? (
              <ul className="divide-y divide-line">
                {mios.map((r) => {
                  const est = estadoMio(yo);
                  const d = quedan(r.deadline);
                  return (
                    <li key={r.id} className="flex flex-col gap-2 px-5 py-3.5">
                      <Link href={`/retos/${r.id}`} className="font-semibold leading-snug hover:underline">
                        {r.title}
                      </Link>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs text-ink-2">
                          {r.company.name} · <span className="font-mono">{codigoPais(r.company.country)}</span>
                          {d !== null && d > 0 ? ` · cierra en ${plural(d, "día", "días")}` : ""}
                        </span>
                        {est && <EstadoEntrega estado={est} />}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="px-5 py-4 text-sm text-ink-2">
                <p>
                  {yo.apuntado > 0
                    ? `${yo.apuntado === 1 ? "Tu reto ya no admite entregas" : `Tus ${yo.apuntado} retos ya no admiten entregas`}. Cada valoración llega a tu pasaporte como un sello.`
                    : "Todavía no te has apuntado a ningún reto abierto."}
                </p>
                <p className={yo.apuntado > 0 ? "hidden" : "mt-1"}>Elige una tarjeta y pulsa «Me apunto»: cuando la empresa valore tu entrega, el sello llega a tu pasaporte.</p>
              </div>
            )}
          </Panel>

          {empresas.length > 0 && (
            <Panel titulo="Empresas con retos">
              <ul className="divide-y divide-line">
                {empresas.map((c) => (
                  <li key={c.id} className="flex items-center gap-3 px-5 py-3">
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-xs font-bold"
                      style={{ background: C.marino, color: C.oro }}
                    >
                      {iniciales(c.name)}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-semibold">{c.name}</span>
                      <span className="text-xs text-ink-2">
                        <span className="font-mono">{codigoPais(c.country)}</span> · {c.country}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm text-ink-2">{plural(c.retos, "reto", "retos")}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </aside>
      </div>
    </div>
  );
}

/**
 * Estado de entrega de mis retos abiertos. El feed solo dice si estoy apuntado, así que
 * solo lo mostramos cuando los totales del pasaporte lo dejan sin ambigüedad.
 */
function estadoMio(yo: Yo): EstadoEntregaValor | null {
  if (yo.apuntado === 0) return null;
  if (yo.entregados === 0) return "inscrito";
  if (yo.sellos === yo.apuntado) return "valorada";
  if (yo.entregados === yo.apuntado && yo.sellos === 0) return "entregada";
  return null;
}

function Panel({ titulo, enlace, children }: { titulo: string; enlace?: { href: string; texto: string }; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-xl bg-white ring-1 ring-line">
      <div className="flex items-center justify-between gap-3 px-5 py-3" style={{ background: C.marino }}>
        <h2 className="text-lg font-bold text-white">{titulo}</h2>
        {enlace && (
          <Link href={enlace.href} className="text-sm font-semibold underline-offset-4 hover:underline" style={{ color: C.oro }}>
            {enlace.texto}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function FilaSello({ a }: { a: Actividad }) {
  return (
    <Link
      href={`/pasaporte/${a.estudiante.id}`}
      className="flex items-center gap-4 rounded-xl border border-dashed border-line bg-white/50 px-4 py-3 transition-colors hover:bg-white sm:px-5"
    >
      {a.nota !== null ? (
        <Nota valor={a.nota} size="sm" />
      ) : (
        <span className="grid h-7 min-w-[40px] place-items-center rounded-md text-sm font-bold" style={{ background: C.superficie }}>
          ✓
        </span>
      )}
      <span className="min-w-0 flex-1 text-[15px] leading-snug">
        <b>{a.estudiante.name}</b> ha sellado su pasaporte con <b>{a.empresa}</b>
        <span className="block truncate text-sm text-ink-2">
          {a.reto} · {hace(a.fecha)}
        </span>
      </span>
    </Link>
  );
}

function Reto({ r, paisEstudiante }: { r: RetoFeed; paisEstudiante: string }) {
  const club = r.company.id === PLATAFORMA_ID;
  const estado = estadoReto(r);
  return (
    <TarjetaEmbarque
      t={{
        empresa: club ? "Reto del Club" : r.company.name,
        ...ruta(r.company.country, paisEstudiante),
        titulo: r.title,
        puerta: puerta(r.id),
        estado,
        datos: [
          { etiqueta: "Duración", valor: `${r.duration_days} días` },
          { etiqueta: "Área", valor: area(r) },
          { etiqueta: "Cierra", valor: cierre(r.deadline) },
          { etiqueta: "Premio", valor: r.suggested_prize || "Sin premio" },
        ],
        pie: (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-3 border-t border-dashed border-line pt-3.5">
            <span className="flex min-w-0 flex-1 basis-[180px] items-center gap-2 text-sm text-ink-2">
              <span className="sm:hidden">
                <EstadoReto estado={estado} />
              </span>
              <span className="truncate">
                {r.apuntados > 0 ? plural(r.apuntados, "persona apuntada", "personas apuntadas") : "Sé la primera persona"}
                {r.is_example ? " · ejemplo piloto" : ""}
              </span>
            </span>
            <span className="flex items-center gap-2">
              <Accion
                hecho="Guardado en tus retos"
                label="Guardar reto"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-ink-2 ring-1 ring-line transition-colors hover:text-ink hover:ring-ink/30"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M6 3h12v18l-6-4-6 4z" />
                </svg>
              </Accion>
              <Link href={`/retos/${r.id}`} className="btn">
                Ver reto
              </Link>
              {r.yoApuntado ? (
                <Link href={`/retos/${r.id}`} className="btn" style={{ background: C.verde, borderColor: C.verde, color: "#fff" }}>
                  ✓ Apuntado
                </Link>
              ) : (
                <Link href={`/retos/${r.id}`} className="btn btn-primary">
                  Me apunto
                </Link>
              )}
            </span>
          </div>
        ),
      }}
    />
  );
}
