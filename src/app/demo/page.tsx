// Lanzador de la demo: todas las pantallas a un clic, con la sesión adecuada. Dueño: perfil 1.
// Los pasos viven en ./pasos.ts; cada perfil añade los suyos.
import Link from "next/link";
import { notFound } from "next/navigation";
import { DEMO_MODE } from "@/lib/demo";
import { enlace, PASOS, SESIONES } from "./pasos";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Demo · Retos reales" };

export default function Demo() {
  if (!DEMO_MODE) notFound();
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2">
        <span className="eyebrow">Modo demo</span>
        <h1 className="text-4xl font-bold">El recorrido completo, a un clic</h1>
        <p className="max-w-2xl text-ink-2">
          Cada paso abre la pantalla real con la sesión que hace falta. En orden, es el guion de la demo del pitch.
        </p>
      </div>

      <ol className="flex flex-col gap-3">
        {PASOS.map((p, i) => (
          <li key={p.ruta + i}>
            <Link href={enlace(p)} className="card flex flex-wrap items-center gap-x-5 gap-y-2 p-4 hover:border-gold">
              <span className="font-display text-3xl font-bold text-gold tabular">{i + 1}</span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="font-semibold">{p.titulo}</span>
                <span className="text-sm text-ink-2">{p.frase}</span>
              </div>
              <span className="chip">{p.como ? SESIONES[p.como].nombre : "Sin sesión"}</span>
            </Link>
          </li>
        ))}
      </ol>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">Entrar como</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(SESIONES).map(([key, s]) => (
            <Link
              key={key}
              href={enlace({ ruta: s.rol === "empresa" ? "/empresa" : "/retos", como: key as keyof typeof SESIONES })}
              className="card flex items-center justify-between gap-3 p-4 hover:border-gold"
            >
              <span>{s.nombre}</span>
              <span className="chip">{s.rol}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
