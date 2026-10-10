// Dueño: perfil 4. Estructura de la app de empresa: barra lateral + barra superior con notificaciones.
// Envuelve también /empresa/nuevo (perfil 2) sin tocar su contenido.
import { pasaporteFonts } from "./_lib/fonts";
import p from "./_lib/pasaporte.module.css";
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
    <div className={`${pasaporteFonts} ${p.page} ${p.seguridad} min-h-screen lg:flex`}>
      <Lateral empresa={company.name} pais={company.country} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-end gap-3 px-4 pt-4 sm:px-6">
          <label className="mr-auto hidden max-w-sm flex-1 items-center gap-2 rounded-full bg-white/70 px-4 py-2 ring-1 ring-black/10 md:flex">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#4f5d73]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input id="buscar-empresa" placeholder="Buscar candidatos, retos…" className="w-full bg-transparent text-sm outline-none" />
          </label>
          <Notificaciones />
          <div className="flex items-center gap-2 rounded-full bg-white/70 py-1 pl-1 pr-3 ring-1 ring-black/10">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#14233d] text-xs font-bold text-[#f3efe6]">{iniciales}</span>
            <span className="text-sm font-semibold">{company.contact_name}</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
