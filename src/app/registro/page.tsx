// Dueño: perfil 1 (entrada y demanda). Registro de estudiantes y empresas. Ver docs/PRD.md §8 P1.
// Embarca: el estudiante crea su pasaporte; la empresa se da de alta y prepara su primer reto (tarjeta de embarque).
import Link from "next/link";
import type { Metadata } from "next";
import r from "./registro.module.css";
import { FormEmpresa, FormEstudiante } from "./Formularios";
import { getSession } from "@/lib/session";
import FormEntrar from "../entrar/Formulario";
import { salir } from "../salir/actions";
import EntrarDemo from "../entrar/Demo";

export const metadata: Metadata = { title: "Registro · Embarca" };

export default async function Registro({ searchParams }: { searchParams: Promise<{ rol?: string }> }) {
  const { rol } = await searchParams;
  const empresa = rol === "empresa";
  const sesion = await getSession();

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
    <main className="min-h-[calc(100dvh-4rem)] bg-paper px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
      <div className="mx-auto max-w-6xl">
        {sesion && (
          <p className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-blue-soft px-4 py-3 text-sm text-ink">
            Ya tienes una cuenta abierta como {sesion.role === "company" ? "empresa" : "estudiante"}.
            <Link href={sesion.role === "company" ? "/empresa" : "/estudiante"} className="font-semibold text-blue hover:underline">
              Ir a mi inicio
            </Link>
            <form action={salir} className="contents">
              <button type="submit" className="font-semibold text-blue hover:underline">Salir y crear otra</button>
            </form>
          </p>
        )}
        {/* Entrar con una cuenta que ya existe, o directo al panel en modo demo */}
        {!sesion && (
          <section
            aria-labelledby="ya-tengo-cuenta"
            className="mb-8 grid gap-5 rounded-xl bg-white p-5 ring-1 ring-line sm:p-6 lg:grid-cols-[1fr_1.2fr] lg:items-end lg:gap-10"
          >
            <div className="flex flex-col gap-2">
              <h2 id="ya-tengo-cuenta" className="text-lg font-bold text-ink">
                ¿Ya tienes cuenta? <span className="font-normal text-ink-2">Entra y vas directo a {empresa ? "tu terminal" : "tu inicio"}.</span>
              </h2>
              <FormEntrar compacto />
            </div>
            <EntrarDemo fila />
          </section>
        )}
        {empresa ? <FormEmpresa selector={selector} /> : <FormEstudiante selector={selector} />}

      </div>
    </main>
  );
}
