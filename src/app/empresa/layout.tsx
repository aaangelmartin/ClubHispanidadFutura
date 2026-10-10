// Dueño: perfil 4. Estructura de la app de empresa (Embarca): barra lateral + barra superior con notificaciones.
// Envuelve también /empresa/nuevo (perfil 2) sin tocar su contenido.
import e from "./_lib/empresa.module.css";
import Lateral from "./_lib/Lateral";
import Notificaciones from "./_lib/Notificaciones";
import { requireCompany } from "./_lib/queries";

export default async function EmpresaLayout({ children }: { children: React.ReactNode }) {
  const company = await requireCompany();
  const iniciales = company.contact_name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <div data-app-empresa className={`${e.app} lg:flex`}>
      {/* La app de empresa lleva su propia cabecera en la barra lateral: se oculta la cabecera pública del sitio. */}
      <style>{"body:has([data-app-empresa]) > header{display:none}"}</style>
      <Lateral empresa={company.name} pais={company.country} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-end gap-3 border-b border-[#e2e2de] bg-white px-4 py-3 sm:px-6">
          <label className="mr-auto hidden max-w-sm flex-1 items-center gap-2 rounded-lg bg-[#f4f2ec] px-3 py-2 md:flex">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#5f6166]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input id="buscar-empresa" placeholder="Buscar candidatos, retos…" className="w-full bg-transparent text-sm outline-none" />
          </label>
          <Notificaciones />
          <div className="flex min-w-0 items-center gap-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#14233d] text-xs font-bold text-white">{iniciales}</span>
            <span className="hidden truncate text-sm font-semibold text-[#14233d] sm:inline">
              {company.contact_name} · {company.name}
            </span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
