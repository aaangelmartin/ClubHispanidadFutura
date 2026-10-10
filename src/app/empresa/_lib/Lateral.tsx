"use client";
// Dueño: perfil 4. Barra lateral de la app de empresa (Embarca).
import Link from "next/link";
import { usePathname } from "next/navigation";
import { C, Logo } from "@/components/embarca";

const ITEMS = [
  { href: "/empresa", label: "Panel", icon: "M3 12l9-8 9 8M5 10v10h14V10" },
  { href: "/empresa/nuevo", label: "Publicar reto", icon: "M12 5v14M5 12h14" },
  { href: "/empresa/candidatos", label: "Candidatos", icon: "M16 19v-1a4 4 0 0 0-8 0v1M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6" },
  { href: "/empresa/mensajes", label: "Mensajes", icon: "M4 5h16v11H8l-4 4z", badge: 1 },
  { href: "/empresa/ajustes", label: "Ajustes", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M4 12h2M18 12h2M12 4v2M12 18v2" },
];

export default function Lateral({ empresa, pais }: { empresa: string; pais: string }) {
  const ruta = usePathname();
  const activo = (href: string) =>
    href === "/empresa" ? ruta === "/empresa" || ruta.startsWith("/empresa/retos") : ruta.startsWith(href);
  return (
    <aside className="flex flex-col gap-4 border-b border-[#e2e2de] bg-white p-4 lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0 lg:gap-6 lg:border-b-0 lg:border-r lg:p-5">
      <div className="flex items-center justify-between gap-3">
        <Link href="/empresa" aria-label="Embarca para empresas">
          <Logo size={26} />
        </Link>
        <span className="text-xs font-semibold lg:hidden" style={{ color: C.texto2 }}>
          {empresa}
        </span>
      </div>
      <nav className="flex flex-wrap gap-1 lg:flex-col lg:flex-nowrap" aria-label="Empresa">
        {ITEMS.map((it) => {
          const on = activo(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={on ? "page" : undefined}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-semibold transition lg:px-3 ${
                on ? "bg-[#14233d] text-white" : "text-[#14233d] hover:bg-[#f4f2ec]"
              }`}
            >
              <svg viewBox="0 0 24 24" className="hidden h-[18px] w-[18px] shrink-0 sm:block" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d={it.icon} />
              </svg>
              {it.label}
              {it.badge ? (
                <span className="ml-auto rounded-full px-1.5 text-[11px] font-bold" style={{ background: C.oro, color: C.marino }}>
                  {it.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto hidden flex-col gap-2 rounded-xl p-4 lg:flex" style={{ background: C.marino }}>
        <span className="text-sm font-bold" style={{ color: C.oro }}>
          Piloto España · Colombia
        </span>
        <span className="text-sm text-white/85">
          {empresa} · {pais}. Publicar retos es gratis durante el piloto de 90 días.
        </span>
        <div className="mt-1 h-1.5 rounded-full bg-white/15">
          <div className="h-1.5 w-[22%] rounded-full" style={{ background: C.oro }} />
        </div>
        <span className="text-xs text-white/60">Día 20 de 90</span>
      </div>
    </aside>
  );
}
