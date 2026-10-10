// Dueño: perfil 4. Página principal del joven talento: feed de retos (de empresas y de la plataforma) y actividad.
// Mismo lenguaje que el pasaporte: es el lado del estudiante.
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { pasaporteFonts } from "@/app/empresa/_lib/fonts";
import p from "@/app/empresa/_lib/pasaporte.module.css";
import Accion from "@/app/empresa/_lib/Accion";
import { getSession } from "@/lib/session";
import { C, Nota, TarjetaEmbarque } from "@/components/embarca";
import { estadoReto, puerta, ruta, cierre } from "@/app/retos/embarque";
import { area, getActividad, getEstudiante, getFeed, hace, PLATAFORMA_ID, quedan } from "./queries";

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

  // Feed: retos intercalados con actividad (sellos conseguidos), cada dos retos una actividad.
  const items: ({ t: "reto"; r: (typeof retos)[number] } | { t: "act"; a: (typeof actividad)[number] })[] = [];
  visibles.forEach((r, i) => {
    items.push({ t: "reto", r });
    if (i % 2 === 1 && actividad[(i - 1) / 2]) items.push({ t: "act", a: actividad[(i - 1) / 2]! });
  });
  if (visibles.length < 2 && actividad[0]) items.push({ t: "act", a: actividad[0] });

  const cierran = [...retos]
    .filter((r) => (quedan(r.deadline) ?? 99) > 0)
    .sort((a, b) => (quedan(a.deadline) ?? 99) - (quedan(b.deadline) ?? 99))
    .slice(0, 3);
  const empresas = [...new Map(retos.filter((r) => r.company.id !== PLATAFORMA_ID).map((r) => [r.company.id, r.company])).values()];

  return (
    <div className={`${pasaporteFonts} ${p.page} ${p.seguridad} min-h-screen`}>
      <div className={p.tapa}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[var(--oro)]">Tu feed de España y Colombia</span>
            <h1 className="text-4xl text-[#f3efe6] sm:text-5xl">Hola, {yo.name.split(" ")[0]}.</h1>
            <p className="text-lg text-[#f3efe6]/75">
              Hay <b className="text-[var(--oro)]">{retos.length} retos abiertos</b> esperando a alguien como tú.
            </p>
          </div>
          <Link href="/retos" className={p.botonClaro}>
            Buscar con filtros
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[260px_1fr_280px]">
        {/* Izquierda: tú */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
          <div className={`${p.hoja} overflow-hidden`}>
            <div className="h-14 bg-[#14233d]" />
            <div className="-mt-8 flex flex-col items-center gap-2 px-5 pb-5 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full border-4 border-white bg-[var(--oro)] text-xl font-extrabold text-[#14233d]">
                {iniciales(yo.name)}
              </span>
              <span className="text-lg font-extrabold">{yo.name}</span>
              <span className="text-sm text-[var(--tinta-2)]">
                {yo.university} · {yo.country}
              </span>
              <dl className="mt-2 grid w-full grid-cols-3 border-t border-black/5 pt-3">
                {[
                  [yo.apuntado, "retos"],
                  [yo.entregados, "entregas"],
                  [yo.sellos, "sellos"],
                ].map(([v, l]) => (
                  <div key={String(l)} className="flex flex-col">
                    <dd className="text-xl font-extrabold">{v}</dd>
                    <dt className="text-xs text-[var(--tinta-2)]">{l}</dt>
                  </div>
                ))}
              </dl>
              <Link href={`/pasaporte/${yo.id}`} className={`${p.botonOro} mt-2 w-full text-center text-sm`}>
                Ver mi pasaporte
              </Link>
            </div>
          </div>
          <nav className={`${p.hoja} flex flex-col p-2`} aria-label="Filtrar el feed">
            {FILTROS.map((f) => (
              <Link
                key={f.k}
                href={f.k === "todos" ? "/estudiante" : `/estudiante?ver=${f.k}`}
                className={`rounded-lg px-3 py-2 text-sm font-semibold ${ver === f.k ? "bg-[#14233d] text-[#f3efe6]" : "hover:bg-black/5"}`}
              >
                {f.l}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Centro: el feed */}
        <main className="flex flex-col gap-5">
          {items.length === 0 && (
            <div className={`${p.hoja} p-10 text-center text-[var(--tinta-2)]`}>No hay retos con este filtro ahora mismo.</div>
          )}
          {items.map((it) =>
            it.t === "act" ? (
              <article key={`a-${it.a.id}`} className={`${p.hoja} flex items-center gap-4 border-l-4 border-l-[var(--oro)] p-5`}>
                {it.a.nota != null ? (
                  <Nota valor={it.a.nota} size="sm" />
                ) : (
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-[var(--oro)] text-xs font-bold text-[var(--oro)]">✓</span>
                )}
                <p className="flex-1 text-sm">
                  <b>{it.a.estudiante.name}</b> ({it.a.estudiante.university}) ha conseguido un sello de{" "}
                  <b>{it.a.empresa}</b> en «{it.a.reto}».
                  <span className={`${p.datos} block text-xs text-[var(--tinta-2)]`}>{hace(it.a.fecha)}</span>
                </p>
                <Link href={`/pasaporte/${it.a.estudiante.id}`} className="text-sm font-semibold underline hover:text-[var(--oro)]">
                  Ver pasaporte
                </Link>
              </article>
            ) : (
              <PostReto key={it.r.id} r={it.r} />
            ),
          )}
        </main>

        {/* Derecha: lo que cierra pronto y empresas */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
          <div className={`${p.hoja} flex flex-col gap-3 p-5`}>
            <h2 className="text-lg">Cierran pronto</h2>
            {cierran.map((r) => (
              <Link key={r.id} href={`/retos/${r.id}`} className="flex items-start justify-between gap-3 border-t border-black/5 pt-3 hover:text-[var(--oro)]">
                <span className="text-sm font-semibold leading-snug">{r.title}</span>
                <span className={`${p.datos} shrink-0 rounded bg-[#14233d] px-1.5 text-xs text-[#f3efe6]`}>{quedan(r.deadline)} d</span>
              </Link>
            ))}
          </div>
          <div className={`${p.hoja} flex flex-col gap-3 p-5`}>
            <h2 className="text-lg">Empresas con retos</h2>
            {empresas.map((c) => (
              <div key={c.id} className="flex items-center gap-3 border-t border-black/5 pt-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#14233d] text-xs font-bold text-[#f3efe6]">{iniciales(c.name)}</span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold">{c.name}</span>
                  <span className="text-xs text-[var(--tinta-2)]">{c.country} · <span className="font-mono">{ruta(c.country).origen}</span></span>
                </span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-[#14233d] p-5 text-[#f3efe6]">
            <span className="text-sm font-bold text-[var(--oro)]">Ganes o no</span>
            <p className="mt-1 text-sm">Cada reto que entregues vuelve con la valoración de la empresa y un sello en tu pasaporte.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PostReto({ r }: { r: Awaited<ReturnType<typeof getFeed>>[number] }) {
  const club = r.company.id === PLATAFORMA_ID;
  const d = quedan(r.deadline);
  return (
    <article className={`${p.hoja} flex flex-col gap-4 p-6 ${club ? "ring-2 ring-[var(--oro)]" : ""}`}>
      <header className="flex items-center gap-3">
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-extrabold ${
            club ? "bg-[var(--oro)] text-[#14233d]" : "bg-[#14233d] text-[#f3efe6]"
          }`}
        >
          {club ? "HF" : iniciales(r.company.name)}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="font-bold">
            {r.company.name}{" "}
            <span className={`${p.datos} rounded bg-black/5 px-1 text-[10px] font-normal`}>{ISO[r.company.country] ?? r.company.country}</span>
          </span>
          <span className="text-xs text-[var(--tinta-2)]">
            {club ? "Reto de la plataforma" : "Ha publicado un reto"} · {hace(r.created_at)}
          </span>
        </div>
        {r.is_example && <span className="rounded-full border border-current px-2 py-0.5 text-xs text-[var(--tinta-2)]">Ejemplo piloto</span>}
      </header>

      <Link href={`/retos/${r.id}`} className="group block rounded-xl">
        <TarjetaEmbarque
          compacta
          className="transition-transform group-hover:-translate-y-0.5"
          t={{
            empresa: r.company.name,
            ...ruta(r.company.country),
            titulo: r.title,
            puerta: puerta(r.id),
            estado: estadoReto(r),
            datos: [
              { etiqueta: "Área", valor: area(r) },
              { etiqueta: "Duración", valor: `${r.duration_days} días` },
              { etiqueta: "Cierra", valor: d !== null && d > 0 ? `${cierre(r.deadline)} · ${d} ${d === 1 ? "día" : "días"}` : cierre(r.deadline) },
              ...(r.suggested_prize ? [{ etiqueta: "Premio", valor: r.suggested_prize }] : []),
            ],
            pie: <p className="text-sm text-[var(--tinta-2)]">{r.summary}</p>,
          }}
        />
      </Link>

      <div className="flex flex-col gap-2">
        <div className="flex h-2 overflow-hidden rounded-full">
          {r.rubric.map((c, i) => (
            <div key={c.criterion} title={`${c.criterion} · ${c.weight}%`} style={{ width: `${c.weight}%`, background: [C.marino, C.oro, C.azul, C.verde][i % 4] }} />
          ))}
        </div>
        <p className="text-xs text-[var(--tinta-2)]">
          Se valora: {r.rubric.map((c) => `${c.criterion} ${c.weight}%`).join(" · ")}
        </p>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-black/5 pt-4">
        <span className="text-sm text-[var(--tinta-2)]">
          {r.apuntados > 0 ? `${r.apuntados} ${r.apuntados === 1 ? "apuntado" : "apuntados"} · ${r.entregas} ${r.entregas === 1 ? "entrega" : "entregas"}` : "Sé el primero en apuntarte"}
        </span>
        <div className="flex items-center gap-2">
          <Accion hecho="Guardado en tus retos" className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-black/5">
            Guardar
          </Accion>
          <Accion hecho="Enlace del reto copiado" className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-black/5">
            Compartir
          </Accion>
          <Link href={`/retos/${r.id}`} className={`${p.botonOro} text-sm`}>
            {r.yoApuntado ? "Ver mi entrega" : "Me apunto"}
          </Link>
        </div>
      </footer>
    </article>
  );
}
