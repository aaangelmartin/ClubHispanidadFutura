// Dueño: perfil 1. Entrar en Embarca con el email del registro: estudiantes van a su inicio y empresas a su terminal.
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Isotipo } from "@/components/embarca";
import Formulario from "./Formulario";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Entrar · Embarca" };

export default async function Entrar() {
  const s = await getSession();
  if (s) redirect(s.role === "company" ? "/empresa" : "/estudiante");

  return (
    <main className="flex min-h-[calc(100svh-58px)] items-center justify-center bg-paper px-5 py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_24px_60px_-30px_rgba(20,35,61,0.35)] ring-1 ring-line">
        <Isotipo size={40} />
        <h1 className="mt-6 text-3xl font-bold text-ink">Entra en Embarca</h1>
        <p className="mt-2 text-ink-2">Usa el email con el que creaste tu pasaporte o diste de alta tu empresa.</p>
        <div className="mt-8">
          <Formulario />
        </div>
        <p className="mt-6 text-sm text-ink-2">
          ¿Aún no tienes cuenta?{" "}
          <Link href="/registro?rol=estudiante" className="font-semibold text-blue hover:underline">Soy estudiante</Link>
          {" · "}
          <Link href="/registro?rol=empresa" className="font-semibold text-blue hover:underline">Soy empresa</Link>
        </p>
      </div>
    </main>
  );
}
