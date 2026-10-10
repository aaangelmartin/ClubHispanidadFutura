// Dueño: perfil 1 (entrada y demanda). Registro de estudiantes y empresas. Ver docs/PRD.md §8 P1.
import Link from "next/link";
import type { Metadata } from "next";
import { FormEmpresa, FormEstudiante } from "./Formularios";

export const metadata: Metadata = { title: "Registro · Retos Hispanidad Futura" };

export default async function Registro({ searchParams }: { searchParams: Promise<{ rol?: string }> }) {
  const { rol } = await searchParams;
  const empresa = rol === "empresa";

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-3">
        <span className="eyebrow">{empresa ? "Para empresas" : "Para estudiantes"}</span>
        <h1 className="text-3xl font-bold sm:text-4xl">
          {empresa ? "Cuéntanos qué necesitas resolver" : "Demuestra lo que sabes hacer"}
        </h1>
        <p className="text-lg text-ink-2">
          {empresa
            ? "Te registras en un minuto y la IA te ayuda a convertir tu necesidad en un reto real."
            : "Un minuto para registrarte. Después eliges un reto real de una empresa de España o México."}
        </p>
      </div>

      <div className="grid grid-cols-2 rounded-md border border-line bg-paper p-1 text-center text-sm font-semibold">
        <Link
          href="/registro?rol=estudiante"
          className={`rounded px-3 py-2 ${!empresa ? "bg-ink text-paper" : "text-ink-2 hover:text-ink"}`}
          aria-current={!empresa ? "page" : undefined}
        >
          Soy estudiante
        </Link>
        <Link
          href="/registro?rol=empresa"
          className={`rounded px-3 py-2 ${empresa ? "bg-ink text-paper" : "text-ink-2 hover:text-ink"}`}
          aria-current={empresa ? "page" : undefined}
        >
          Soy empresa
        </Link>
      </div>

      <section className="card p-5 sm:p-8">{empresa ? <FormEmpresa /> : <FormEstudiante />}</section>

      <p className="text-center text-sm text-ink-3">
        {empresa ? "El piloto es gratuito para las empresas." : "Para el estudiante es gratis. Siempre."}
      </p>
    </main>
  );
}
