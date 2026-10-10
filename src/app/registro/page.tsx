// Dueño: perfil 1 (entrada y demanda). Registro de estudiantes y empresas. Ver docs/PRD.md §8 P1.
// Embarca: el estudiante crea su pasaporte; la empresa se da de alta y prepara su primer reto (tarjeta de embarque).
import Link from "next/link";
import type { Metadata } from "next";
import r from "./registro.module.css";
import { FormEmpresa, FormEstudiante } from "./Formularios";
import { getSession } from "@/lib/session";
import { DEMO_MODE } from "@/lib/demo";
import FormEntrar from "../entrar/Formulario";

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
            <Link href="/salir" className="font-semibold text-blue hover:underline">Salir y crear otra</Link>
          </p>
        )}
        {empresa ? <FormEmpresa selector={selector} /> : <FormEstudiante selector={selector} />}

        {/* Entrar con una cuenta que ya existe, o directo al panel en modo demo */}
        <section aria-labelledby="ya-tengo-cuenta" className="mt-10 grid gap-6 rounded-xl bg-white p-6 ring-1 ring-line sm:p-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-4">
            <div>
              <h2 id="ya-tengo-cuenta" className="text-2xl font-bold text-ink">¿Ya tienes cuenta?</h2>
              <p className="mt-1 text-ink-2">
                Entra con tu email y vas directo a {empresa ? "tu terminal" : "tu inicio"}.
              </p>
            </div>
            <FormEntrar />
          </div>
          {DEMO_MODE && (
            <div className="flex flex-col gap-4 rounded-lg bg-paper p-6 ring-1 ring-line">
              <div>
                <h3 className="text-lg font-bold text-ink">Entrar a la demo</h3>
                <p className="mt-1 text-sm text-ink-2">Cuentas de ejemplo para ver los paneles sin registrarte.</p>
              </div>
              <a
                href="/dev/sesion?rol=estudiante&id=22222222-2222-4222-8222-000000000002&ir=/estudiante"
                className="btn !justify-between !py-3"
              >
                Panel del estudiante <span className="text-ink-2">Andrés · Colombia</span>
              </a>
              <a
                href="/dev/sesion?rol=empresa&id=11111111-1111-4111-8111-000000000001&ir=/empresa"
                className="btn !justify-between !py-3"
              >
                Terminal de la empresa <span className="text-ink-2">Ibérica Retail · España</span>
              </a>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
