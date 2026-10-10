// Dueño: perfil 1 (entrada y demanda). Registro de estudiantes y empresas. Ver docs/PRD.md §8 P1.
// Concepto: solicitar tu pasaporte de talento (estudiante) o el sello de entidad (empresa).
import Link from "next/link";
import type { Metadata } from "next";
import p from "../_landing/pasaporte.module.css";
import r from "./registro.module.css";
import { FormEmpresa, FormEstudiante } from "./Formularios";

export const metadata: Metadata = { title: "Registro · Retos Hispanidad Futura" };

export default async function Registro({ searchParams }: { searchParams: Promise<{ rol?: string }> }) {
  const { rol } = await searchParams;
  const empresa = rol === "empresa";

  return (
    <main className={`${p.page} ${p.tapa} min-h-[calc(100dvh-4rem)] px-4 pb-16 pt-6 sm:px-6 sm:pt-12`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:gap-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-2xl flex-col gap-3">
            <h1 className={`${p.display} text-[2.15rem] text-[#f3efe6] sm:text-5xl lg:text-6xl`}>
              {empresa ? "Registro de empresa" : "Solicita tu pasaporte de talento"}
            </h1>
            <p className="text-base leading-relaxed text-[#f3efe6]/75 sm:text-lg">
              {empresa
                ? "Un minuto para registrar tu empresa. Después la IA te ayuda a convertir tu necesidad en un reto real."
                : "Un minuto y lo tienes. Cada reto que resuelvas para una empresa de España o Colombia es un sello más."}
            </p>
          </div>

          <nav
            aria-label="Tipo de registro"
            className={`${r.selector} grid w-full shrink-0 grid-cols-2 gap-1 rounded-full bg-white/10 p-1 text-center text-[15px] font-semibold ring-1 ring-white/15 sm:w-auto`}
          >
            <Link
              href="/registro?rol=estudiante"
              className="rounded-full px-5 py-2.5 text-[#f3efe6]/80 transition-colors hover:text-[#f3efe6]"
              aria-current={!empresa ? "page" : undefined}
            >
              Soy estudiante
            </Link>
            <Link
              href="/registro?rol=empresa"
              className="rounded-full px-5 py-2.5 text-[#f3efe6]/80 transition-colors hover:text-[#f3efe6]"
              aria-current={empresa ? "page" : undefined}
            >
              Soy empresa
            </Link>
          </nav>
        </div>

        {empresa ? <FormEmpresa /> : <FormEstudiante />}

        <p className="text-center text-sm text-[#f3efe6]/60">
          {empresa ? "El piloto es gratuito para las empresas." : "Para el estudiante es gratis. Siempre."}
        </p>
      </div>
    </main>
  );
}
