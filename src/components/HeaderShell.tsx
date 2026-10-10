"use client";
// Dueño: perfil 1. Envoltorio de la cabecera: en la landing (/) va en oscuro y translúcida; en el resto, clara.
import { usePathname } from "next/navigation";

export default function HeaderShell({ children }: { children: React.ReactNode }) {
  const oscura = usePathname() === "/";
  return (
    <header
      style={{ ["--marca-fondo" as string]: oscura ? "#14233d" : "var(--paper)" }}
      className={
        oscura
          ? "sticky top-0 z-50 border-b border-white/10 bg-[#14233d]/90 backdrop-blur-xl [&_.font-script]:!text-[#e8ecf3] [&_a]:!text-[#a9b3c4] [&_a:hover]:!text-white"
          : "border-b border-line bg-paper"
      }
    >
      {children}
    </header>
  );
}
