"use client";
// Dueño: perfil 1. Envoltorio de la cabecera. En la landing (/) va fija sobre la tapa marino, translúcida
// y se compacta al hacer scroll: arriba es parte de la tapa; al bajar, se vuelve translúcida con desenfoque. En el resto de páginas, clara.
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export default function HeaderShell({ children }: { children: React.ReactNode }) {
  const ruta = usePathname();
  const enPanel = ruta === "/panel" || ruta.startsWith("/panel/");
  // En /panel (se proyecta) y en /registro va sobre la tapa como la landing; en /panel no repite el enlace al propio panel.
  const oscura = ruta === "/" || enPanel || ruta === "/registro";
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const pad = useTransform(scrollY, [0, 140], reduce ? ["10px", "10px"] : ["16px", "8px"]);
  const fondo = useTransform(scrollY, [0, 140], ["rgba(20,35,61,1)", "rgba(20,35,61,0.84)"]);
  const sombra = useTransform(scrollY, [0, 140], ["0 0 0 rgba(0,0,0,0)", "0 10px 30px -12px rgba(0,0,0,0.55)"]);
  const borde = useTransform(scrollY, [0, 140], ["rgba(255,255,255,0)", "rgba(255,255,255,0.1)"]);
  const escala = useTransform(scrollY, [0, 140], reduce ? [1, 1] : [1, 0.86]);

  if (!oscura) {
    return (
      <header
        style={{ ["--marca-fondo" as string]: "var(--paper)", ["--hpad" as string]: "12px" }}
        className="border-b border-line bg-paper"
      >
        {children}
      </header>
    );
  }

  return (
    <motion.header
      style={{
        ["--marca-fondo" as string]: "#14233d",
        ["--gold" as string]: "#d2a24a",
        ["--hpad" as string]: pad,
        ["--hescala" as string]: escala,
        backgroundColor: fondo,
        boxShadow: sombra,
        borderColor: borde,
      }}
      className={`${enPanel ? "hf-sin-panel " : ""}hf-oscura sticky top-0 z-50 border-b backdrop-blur-xl backdrop-saturate-150 [&_.font-script]:!text-[#f3efe6] [&_a]:!text-[#c3cbd8] [&_a:hover]:!text-white [&_a.chip]:!border-[#d2a24a]/60 [&_a.chip]:!text-[#e2b863]`}
    >
      {enPanel && <style>{`.hf-sin-panel .hf-panel{display:none}`}</style>}
      {children}
    </motion.header>
  );
}
