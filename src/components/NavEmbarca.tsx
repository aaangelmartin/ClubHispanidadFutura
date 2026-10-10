"use client";
// Dueño: perfil 1. Barra de navegación de Embarca: enlaces según quién eres (visitante, estudiante o empresa),
// el enlace activo marcado, acciones a la derecha y menú desplegable en móvil.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Isotipo } from "@/components/embarca";

export type EnlaceNav = { href: string; label: string };
export type AccionNav = { href: string; label: string; tipo: "principal" | "secundaria" | "texto" };

function activo(ruta: string, href: string) {
  const base = href.split("#")[0].split("?")[0];
  if (base === "/" || base === "") return false;
  return ruta === base || ruta.startsWith(base + "/");
}

function claseAccion(tipo: AccionNav["tipo"]) {
  if (tipo === "principal") return "rounded-md bg-gold px-4 py-2 text-sm font-bold text-ink hover:brightness-95";
  if (tipo === "secundaria") return "rounded-md px-4 py-2 text-sm font-bold text-ink ring-1 ring-ink/25 hover:ring-ink/60";
  return "px-2 py-2 text-sm font-semibold text-ink-2 hover:text-ink";
}

function Avatar({ nombre }: { nombre: string }) {
  const ini = nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white" aria-hidden="true">
      {ini}
    </span>
  );
}

export default function NavEmbarca({
  enlaces,
  acciones,
  quien,
  rol,
}: {
  enlaces: EnlaceNav[];
  acciones: AccionNav[];
  quien?: string;
  rol?: "estudiante" | "empresa";
}) {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);
  useEffect(() => setAbierto(false), [ruta]);

  return (
    <nav aria-label="Principal" className="mx-auto max-w-[1312px] px-5 sm:px-8 lg:px-16">
      <div className="flex h-[58px] items-center gap-6">
        <Link href="/" aria-label="Embarca, inicio" className="inline-flex shrink-0 items-center gap-2.5">
          <Isotipo size={28} />
          <span className="hf-logo-texto text-[22px] font-bold tracking-[-0.03em] text-ink">Embarca</span>
        </Link>
        {rol && (
          <span className={`hidden rounded-full px-2.5 py-1 text-xs font-bold sm:inline-flex ${rol === "estudiante" ? "bg-blue-soft text-blue" : "bg-gold-soft text-ink"}`}>
            {rol === "estudiante" ? "Estudiante" : "Empresa"}
          </span>
        )}

        <ul className="hidden items-center gap-1 md:flex">
          {enlaces.map((e) => {
            const on = activo(ruta, e.href);
            return (
              <li key={e.href}>
                <Link
                  href={e.href}
                  aria-current={on ? "page" : undefined}
                  className={`relative rounded-md px-3 py-2 text-[15px] font-medium transition-colors ${
                    on ? "text-ink" : "text-ink-2 hover:text-ink"
                  } ${e.href === "/panel" ? "hf-panel inline-flex items-center gap-2" : ""}`}
                >
                  {e.href === "/panel" && <span className="h-2 w-2 rounded-full bg-ok" aria-hidden="true" />}
                  {e.label}
                  {on && <span className="absolute inset-x-3 -bottom-[11px] h-[3px] rounded-full bg-gold" aria-hidden="true" />}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          {quien && (
            <span className="mr-2 inline-flex items-center gap-2">
              <Avatar nombre={quien} />
              <span className="max-w-[18ch] truncate text-sm font-semibold text-ink">{quien}</span>
            </span>
          )}
          {acciones.map((a) => (
            <Link key={a.href + a.label} href={a.href} className={claseAccion(a.tipo)}>
              {a.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-controls="menu-movil"
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-md ring-1 ring-line md:hidden"
        >
          <span className="sr-only">{abierto ? "Cerrar menú" : "Abrir menú"}</span>
          <span aria-hidden="true" className="text-xl leading-none text-ink">{abierto ? "✕" : "☰"}</span>
        </button>
      </div>

      {abierto && (
        <div id="menu-movil" className="flex flex-col gap-1 border-t border-line pb-4 pt-2 md:hidden">
          {quien && (
            <span className="flex items-center gap-2 px-2 py-2 text-sm font-semibold text-ink">
              <Avatar nombre={quien} />
              {quien}
              {rol && <span className="text-ink-2">· {rol === "estudiante" ? "Estudiante" : "Empresa"}</span>}
            </span>
          )}
          {enlaces.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              aria-current={activo(ruta, e.href) ? "page" : undefined}
              className={`rounded-md px-2 py-3 text-base font-semibold ${activo(ruta, e.href) ? "bg-gold-soft text-ink" : "text-ink-2"}`}
            >
              {e.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2">
            {acciones.map((a) => (
              <Link key={a.href + a.label} href={a.href} className={`${claseAccion(a.tipo)} text-center !py-3`}>
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
