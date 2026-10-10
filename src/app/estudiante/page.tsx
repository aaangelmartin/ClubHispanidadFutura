// Dueño: perfil 4. Página principal del joven talento: feed de retos (de empresas y de la plataforma) y actividad.
// Pensada primero para el móvil: una columna limpia; en escritorio se añaden las columnas laterales.
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { pasaporteFonts } from "@/app/empresa/_lib/fonts";
import p from "@/app/empresa/_lib/pasaporte.module.css";
import Accion from "@/app/empresa/_lib/Accion";
import { getSession } from "@/lib/session";
import { area, getActividad, getEstudiante, getFeed, hace, PLATAFORMA_ID, quedan, type RetoFeed } from "./queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Inicio · Retos reales" };

const FILTROS = [
  { k: "todos", l: "Todos" },
  { k: "empresas", l: "De empresas" },
  { k: "plataforma", l: "Del Club" },
  { k: "espana", l: "España" },
  { k: "colombia", l: "Colombia" },
] as const;

const ISO: Record<string, string> = { España: "ES", Colombia: "CO", México: "MX" };
const iniciales = (n: string) =>
  n
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

export default async function Inicio({ searchParams }: { searchParams: Promise<{ ver?: string }> }) {
  const { ver = "todos" } = await searchParams;
  const s = await getSession();
  if (s?.role !== "student") redirect("/registro?rol=estudiante");
  const [yo, retos, actividad] = await Promise.all([getEstudiante(s.id), getFeed(s.id), getActividad()]);
  if (!yo) redirect("/registro?rol=estudiante");

  const visibles = retos.filter((r) => {
    if (ver === "empresas") return r.company.id !== PLATAFORMA_ID;
    if (ver === "plataforma") return r.company.id === PLATAFORMA_ID;
    if (ver === "espana") return r.company.country === "España";
    if (ver === "colombia") return r.company.country === "Colombia";
    return true;
  });

  // Cada dos retos, una actividad (un sello conseguido por alguien).
  const items: ({ t: "reto"; r: RetoFeed } | { t: "act"; a: (typeof actividad)[number] })[] = [];
  visibles.forEach((r, i) => {
    items.push({ t: "reto", r });
    const a = actividad[(i - 1) / 2];
    if (i % 2 === 1 && a) items.push({ t: "act", a });
  });

  const cierran = [...retos]
    .filter((r) => (quedan(r.deadline) ?? 99) > 0)
    .sort((a, b) => (quedan(a.deadline) ?? 99) - (quedan(b.deadline) ?? 99))
    .slice(0, 4);
  const empresas = [...new Map(retos.filter((r) => r.company.id !== PLATAFORMA_ID).map((r) => [r.company.id, r.company])).values()];

  return (
    <div className={`${pasaporteFonts} ${p.page} ${p.seguridad} min-h-screen`}>
      {/* Cabecera */}
      <div className={p.tapa}>
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 pb-7 pt-6 sm:px-6 sm:pb-10 sm:pt-9">
          <span className={`${p.datos} text-[11px] tracking-[0.2em] text-[var(--oro)]`}>TU FEED</span>
          <h1 className="text-[34px] text-[#f3efe6] sm:text-5xl">Hola, {yo.name.split(" ")[0]}.</h1>
          <p className="text-base text-[#f3efe6]/70 sm:text-lg">
            <b className="text-[var(--oro)]">{retos.length} retos abiertos</b> de empresas de España y Colombia.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 pt-5 sm:px-6 sm:pt-8 lg:grid-cols-[230px_minmax(0,1fr)_270px] lg:gap-10">
        {/* Izquierda (escritorio): tu perfil y filtros */}
        <aside className="hidden flex-col gap-5 lg:sticky lg:top-6 lg:flex lg:self-start">
          <Perfil yo={yo} />
          <nav className="flex flex-col gap-1" aria-label="Filtrar el feed">
            {FILTROS.map((f) => (
              <Link
                key={f.k}
                href={f.k === "todos" ? "/estudiante" : `/estudiante?ver=${f.k}`}
                className={`rounded-xl px-4 py-2.5 text-[15px] font-semibold transition ${
                  ver === f.k ? "bg-[#14233d] text-[#f3efe6]" : "text-[var(--tinta-2)] hover:bg-white/70 hover:text-[var(--tinta)]"
                }`}
              >
                {f.l}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Centro */}
        <main className="flex min-w-0 flex-col gap-5 sm:gap-6">
          {/* Móvil: tu pasaporte en una línea, filtros y lo que cierra pronto */}
          <div className="flex flex-col gap-4 lg:hidden">
            <Link href={`/pasaporte/${yo.id}`} className="flex items-center gap-3 rounded-2xl bg-white p-3 pr-4 shadow-sm ring-1 ring-black/5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--oro)] text-sm font-extrabold text-[#14233d]">
                {iniciales(yo.name)}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-bold">Mi pasaporte</span>
                <span className="truncate text-sm text-[var(--tinta-2)]">
                  {yo.sellos} {yo.sellos === 1 ? "sello" : "sellos"} · {yo.entregados} {yo.entregados === 1 ? "entrega" : "entregas"}
                </span>
              </span>
              <span aria-hidden="true" className="text-xl text-[var(--tinta-2)]">
                ›
              </span>
            </Link>
            <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]" aria-label="Filtrar el feed">
              {FILTROS.map((f) => (
                <Link
                  key={f.k}
                  href={f.k === "todos" ? "/estudiante" : `/estudiante?ver=${f.k}`}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                    ver === f.k ? "bg-[#14233d] text-[#f3efe6]" : "bg-white text-[var(--tinta-2)] ring-1 ring-black/5"
                  }`}
                >
                  {f.l}
                </Link>
              ))}
            </nav>
            {cierran.length > 0 && (
              <section className="flex flex-col gap-2">
                <h2 className="text-base">Cierran pronto</h2>
                <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
                  {cierran.map((r) => (
                    <Link key={r.id} href={`/retos/${r.id}`} className="flex w-[70%] shrink-0 snap-start flex-col gap-2 rounded-2xl bg-[#14233d] p-4 text-[#f3efe6]">
                      <span className={`${p.datos} text-[11px] text-[var(--oro)]`}>
                        {quedan(r.deadline)} {quedan(r.deadline) === 1 ? "DÍA" : "DÍAS"} · {r.company.name.toUpperCase()}
                      </span>
                      <span className="line-clamp-2 text-[15px] font-bold leading-snug">{r.title}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {items.length === 0 && (
            <div className="rounded-3xl bg-white p-10 text-center text-[var(--tinta-2)] shadow-sm ring-1 ring-black/5">
              No hay retos con este filtro ahora mismo.
            </div>
          )}

          {items.map((it) =>
            it.t === "act" ? <PostActividad key={`a-${it.a.id}`} a={it.a} /> : <PostReto key={it.r.id} r={it.r} />,
          )}
        </main>

        {/* Derecha (escritorio) */}
        <aside className="hidden flex-col gap-5 lg:sticky lg:top-6 lg:flex lg:self-start">
          <section className="flex flex-col gap-1 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <h2 className="pb-2 text-lg">Cierran pronto</h2>
            {cierran.map((r) => (
              <Link key={r.id} href={`/retos/${r.id}`} className="group flex items-start justify-between gap-3 border-t border-black/5 py-3">
                <span className="text-[15px] font-semibold leading-snug group-hover:text-[var(--oro)]">{r.title}</span>
                <span className={`${p.datos} shrink-0 rounded-md bg-[#14233d] px-2 py-0.5 text-xs text-[#f3efe6]`}>{quedan(r.deadline)} d</span>
              </Link>
            ))}
          </section>
          <section className="flex flex-col gap-1 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <h2 className="pb-2 text-lg">Empresas con retos</h2>
            {empresas.map((c) => (
              <div key={c.id} className="flex items-center gap-3 border-t border-black/5 py-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#14233d] text-xs font-bold text-[#f3efe6]">{iniciales(c.name)}</span>
                <span className="flex flex-col">
                  <span className="text-[15px] font-semibold">{c.name}</span>
                  <span className="text-xs text-[var(--tinta-2)]">{c.country}</span>
                </span>
              </div>
            ))}
          </section>
        </aside>
      </div>
    </div>
  );
}

function Perfil({ yo }: { yo: NonNullable<Awaited<ReturnType<typeof getEstudiante>>> }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
      <div className="h-16 bg-[#14233d]" />
      <div className="-mt-9 flex flex-col items-center gap-1 px-5 pb-6 text-center">
        <span className="grid h-[72px] w-[72px] place-items-center rounded-full border-4 border-white bg-[var(--oro)] text-xl font-extrabold text-[#14233d]">
          {iniciales(yo.name)}
        </span>
        <span className="mt-2 text-lg font-extrabold leading-tight">{yo.name}</span>
        <span className="text-sm leading-snug text-[var(--tinta-2)]">{yo.university}</span>
        <dl className="mt-4 grid w-full grid-cols-3 gap-2">
          {[
            [yo.apuntado, "retos"],
            [yo.entregados, "entregas"],
            [yo.sellos, "sellos"],
          ].map(([v, l]) => (
            <div key={String(l)} className="flex flex-col items-center rounded-xl bg-[#eef1ee] py-2">
              <dd className="text-xl font-extrabold">{v}</dd>
              <dt className="text-[11px] text-[var(--tinta-2)]">{l}</dt>
            </div>
          ))}
        </dl>
        <Link href={`/pasaporte/${yo.id}`} className={`${p.botonOro} mt-4 w-full text-center text-sm`}>
          Ver mi pasaporte
        </Link>
      </div>
    </div>
  );
}

function PostActividad({ a }: { a: Awaited<ReturnType<typeof getActividad>>[number] }) {
  return (
    <Link
      href={`/pasaporte/${a.estudiante.id}`}
      className="flex items-center gap-4 rounded-3xl bg-white/60 px-5 py-4 ring-1 ring-black/5 transition hover:bg-white sm:px-6"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-[var(--sello-a)] text-sm font-bold text-[var(--sello-a)]">
        {a.nota?.toFixed(1).replace(".", ",") ?? "✓"}
      </span>
      <span className="min-w-0 flex-1 text-[15px] leading-snug">
        <b>{a.estudiante.name}</b> ha conseguido un sello de <b>{a.empresa}</b>
        <span className="block text-sm text-[var(--tinta-2)]">
          {a.estudiante.university} · {hace(a.fecha)}
        </span>
      </span>
    </Link>
  );
}

function PostReto({ r }: { r: RetoFeed }) {
  const club = r.company.id === PLATAFORMA_ID;
  const d = quedan(r.deadline);
  const meta = [area(r), `${r.duration_days} días`, d !== null && d > 0 ? `cierra en ${d} ${d === 1 ? "día" : "días"}` : null, "en remoto"].filter(Boolean);
  return (
    <article className="flex flex-col gap-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-7">
      {/* Autor */}
      <header className="flex items-center gap-3">
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-sm font-extrabold ${
            club ? "bg-[var(--oro)] text-[#14233d]" : "bg-[#14233d] text-[#f3efe6]"
          }`}
        >
          {club ? "HF" : iniciales(r.company.name)}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-bold">
            {r.company.name} <span className="font-normal text-[var(--tinta-2)]">· {ISO[r.company.country] ?? r.company.country}</span>
          </span>
          <span className="truncate text-sm text-[var(--tinta-2)]">
            {club ? "Reto del Club" : "Reto de empresa"} · {hace(r.created_at)}
            {r.is_example ? " · ejemplo piloto" : ""}
          </span>
        </div>
      </header>

      {/* Contenido */}
      <Link href={`/retos/${r.id}`} className="group flex flex-col gap-2">
        <h2 className="text-[22px] leading-[1.1] group-hover:text-[var(--oro)] sm:text-[26px]">{r.title}</h2>
        <p className="line-clamp-2 text-[15px] leading-relaxed text-[var(--tinta-2)] sm:text-base">{r.summary}</p>
      </Link>

      <p className="text-sm text-[var(--tinta-2)]">
        {meta.map((m, i) => (
          <span key={m}>
            {i > 0 && <span className="px-1.5 text-black/20">·</span>}
            {i === 0 ? <b className="font-semibold text-[var(--tinta)]">{m}</b> : m}
          </span>
        ))}
      </p>

      {r.suggested_prize && (
        <p className="flex items-start gap-3 rounded-2xl bg-[var(--oro)]/10 px-4 py-3 text-[15px] leading-snug">
          <span className={`${p.datos} shrink-0 pt-0.5 text-[11px] font-bold tracking-wider text-[#8a6420]`}>PREMIO</span>
          <span>{r.suggested_prize}</span>
        </p>
      )}

      {/* Pie */}
      <footer className="flex items-center gap-3 border-t border-black/5 pt-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {r.personas.length > 0 && (
            <div className="flex shrink-0">
              {r.personas.map((n, i) => (
                <span
                  key={n + i}
                  className="-ml-2 grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-[#14233d] text-[10px] font-bold text-[#f3efe6] first:ml-0"
                >
                  {iniciales(n)}
                </span>
              ))}
            </div>
          )}
          <span className="truncate text-sm text-[var(--tinta-2)]">
            {r.apuntados > 0 ? `${r.apuntados} ${r.apuntados === 1 ? "apuntado" : "apuntados"}` : "Sé el primero"}
          </span>
        </div>
        <Accion hecho="Guardado en tus retos" label="Guardar" className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-black/5">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M6 3h12v18l-6-4-6 4z" />
          </svg>
        </Accion>
        <Accion hecho="Enlace del reto copiado" label="Compartir" className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-black/5">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M4 12v7h16v-7M12 3v12M7 8l5-5 5 5" />
          </svg>
        </Accion>
        <Link href={`/retos/${r.id}`} className={`${p.botonOro} shrink-0 px-5 py-2.5 text-sm`}>
          {r.yoApuntado ? "Mi entrega" : "Me apunto"}
        </Link>
      </footer>
    </article>
  );
}
