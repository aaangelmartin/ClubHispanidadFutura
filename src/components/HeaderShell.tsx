"use client";
// Dueño: perfil 1. Envoltorio de la cabecera de Embarca: blanca y fija en toda la app.
// En /panel (se proyecta) va en marino y no repite el enlace al propio panel.
import { usePathname } from "next/navigation";

export default function HeaderShell({ children }: { children: React.ReactNode }) {
  const ruta = usePathname();
  const enPanel = ruta === "/panel" || ruta.startsWith("/panel/");
  if (enPanel) {
    return (
      <header className="hf-sin-panel hf-oscura sticky top-0 z-50 border-b border-white/10 bg-[#14233d] [&_a]:!text-[#c3cbd8] [&_a:hover]:!text-white [&_.hf-logo-texto]:!text-white">
        <style>{`.hf-sin-panel .hf-panel{display:none}`}</style>
        {children}
      </header>
    );
  }
  return <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">{children}</header>;
}
