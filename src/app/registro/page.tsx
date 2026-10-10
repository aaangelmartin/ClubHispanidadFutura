// Dueño: perfil 1 (entrada y demanda). Registro de estudiantes y empresas. Ver docs/PRD.md §8 P1.
// Embarca: el estudiante crea su pasaporte; la empresa se da de alta y prepara su primer reto (tarjeta de embarque).
import Link from "next/link";
import type { Metadata } from "next";
import r from "./registro.module.css";
import { FormEmpresa, FormEstudiante } from "./Formularios";

export const metadata: Metadata = { title: "Registro · Embarca" };

export default async function Registro({ searchParams }: { searchParams: Promise<{ rol?: string }> }) {
  const { rol } = await searchParams;
  const empresa = rol === "empresa";

  const selector = (
    <nav
      aria-label="Tipo de registro"
      className={`${r.selector} grid w-full grid-cols-2 gap-1 rounded-lg bg-[var(--paper)] p-1 text-center text-[15px] font-semibold ring-1 ring-[var(--line)] sm:w-fit`}
    >
      <Link
        href="/registro?rol=estudiante"
        className="rounded-md px-5 py-2.5 text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
        aria-current={!empresa ? "page" : undefined}
      >
        Soy estudiante
      </Link>
      <Link
        href="/registro?rol=empresa"
        className="rounded-md px-5 py-2.5 text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
        aria-current={empresa ? "page" : undefined}
      >
        Soy empresa
      </Link>
    </nav>
  );

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-[var(--bg)] px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
      <div className="mx-auto max-w-6xl">
        {empresa ? <FormEmpresa selector={selector} /> : <FormEstudiante selector={selector} />}
      </div>
    </main>
  );
}
