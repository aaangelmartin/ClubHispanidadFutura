"use client";
// Dueño: perfil 4. Barra lateral de la app de empresa.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Escudo } from "@/components/Marca";

const ITEMS = [
  { href: "/empresa", label: "Panel", icon: "M3 12l9-8 9 8M5 10v10h14V10" },
  { href: "/empresa/nuevo", label: "Publicar reto", icon: "M12 5v14M5 12h14" },
  { href: "/empresa/candidatos", label: "Candidatos", icon: "M16 19v-1a4 4 0 0 0-8 0v1M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6" },
  { href: "/empresa/mensajes", label: "Mensajes", icon: "M4 5h16v11H8l-4 4z", badge: 1 },
  { href: "/empresa/ajustes", label: "Ajustes y plan", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M4 12h2M18 12h2M12 4v2M12 18v2" },
];

export default function Lateral({ empresa, pais }: { empresa: string; pais: string }) {
  const ruta = usePathname();
  const activo = (href: string) =>
    href === "/empresa" ? ruta === "/empresa" || ruta.startsWith("/empresa/retos") : ruta.startsWith(href);
  return (
    <aside className="flex flex-col gap-6 border-b border-white/10 bg-[#14233d] p-4 text-[#f3efe6] lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:p-6">
      <Link href="/empresa" className="flex items-center gap-2.5" aria-label="Hispanidad Futura para empresas">
        <Escudo size={30} fondo="#14233d" />
        <span className="flex flex-col leading-none">
          <span className="font-script text-xl text-[#f3efe6]">Hispanidad Futura</span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c8963a]">Empresas</span>
        </span>
      </Link>
      <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#c8963a] text-lg font-extrabold text-[#14233d]">
          {empresa
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("")}
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-bold">{empresa}</span>
          <span className="text-xs text-[#f3efe6]/60">{pais} · Plan piloto</span>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Empresa">
        {ITEMS.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
              activo(it.href) ? "bg-white/10 text-white ring-1 ring-[#c8963a]/50" : "text-[#f3efe6]/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d={it.icon} />
            </svg>
            {it.label}
            {it.badge ? (
              <span className="ml-auto rounded-full bg-[#c8963a] px-1.5 text-[10px] font-bold text-[#14233d]">{it.badge}</span>
            ) : null}
          </Link>
        ))}
      </nav>
      <div className="mt-auto hidden flex-col gap-2 rounded-xl bg-white/5 p-4 ring-1 ring-white/10 lg:flex">
        <span className="text-xs uppercase tracking-widest text-[#c8963a]">Piloto España · Colombia</span>
        <span className="text-sm text-[#f3efe6]/80">Publicar retos es gratis durante el piloto de 90 días.</span>
        <div className="mt-1 h-1.5 rounded-full bg-white/10">
          <div className="h-1.5 w-[22%] rounded-full bg-[#c8963a]" />
        </div>
        <span className="text-xs text-[#f3efe6]/60">Día 20 de 90</span>
      </div>
    </aside>
  );
}
