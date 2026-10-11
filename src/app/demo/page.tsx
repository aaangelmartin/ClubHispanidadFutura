// Lanzador de la demo: todas las pantallas a un clic, con la sesión adecuada. Dueño: perfil 1.
// Los pasos viven en ./pasos.ts; cada perfil añade los suyos.
// Enlaces <a> normales, no <Link>: Next precarga los <Link> y cada precarga de /dev/sesion cambiaría la sesión.
import { notFound } from "next/navigation";
import { DEMO_MODE } from "@/lib/demo";
import { ACTOS, enlace, etiqueta, PASOS, SESIONES, type Sesion } from "./pasos";

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

      {ACTOS.map((acto, a) => {
        const pasos = PASOS.map((p, i) => ({ p, n: i + 1 })).filter(({ p }) => p.acto === acto.k);
        if (pasos.length === 0) return null;
        return (
          <section key={acto.k} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-2">
              <h2 className="text-xl font-bold">
                <span className="text-ink-2">Acto {a + 1} · </span>
                {acto.titulo}
              </h2>
              <span className="text-sm text-ink-2">{acto.quien}</span>
            </div>
            <ol className="flex flex-col gap-3">
              {pasos.map(({ p, n }) => (
                <li key={p.ruta + n}>
                  <a href={enlace(p)} className="card flex flex-wrap items-center gap-x-5 gap-y-2 p-4 hover:border-gold">
                    <span className="w-9 font-display text-3xl font-bold text-gold tabular">{n}</span>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="font-semibold">{p.titulo}</span>
                      <span className="text-sm text-ink-2">{p.frase}</span>
                      <span className="font-mono text-xs text-ink-2">{p.ruta}</span>
                    </div>
                    <span className="chip">{etiqueta(p.como)}</span>
                  </a>
                </li>
              ))}
            </ol>
          </section>
        );
      })}

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">Entrar como</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.entries(SESIONES) as [Sesion, (typeof SESIONES)[Sesion]][]).map(([key, s]) => (
            <a
              key={key}
              href={enlace({ ruta: s.rol === "empresa" ? "/empresa" : "/estudiante", como: key })}
              className="card flex items-center justify-between gap-3 p-4 hover:border-gold"
            >
              <span>{s.nombre}</span>
              <span className="chip">{s.rol}</span>
            </a>
          ))}
          <a href={enlace({ ruta: "/", como: "visitante" })} className="card flex items-center justify-between gap-3 p-4 hover:border-gold">
            <span>Salir y ver la web como visitante</span>
            <span className="chip">sin sesión</span>
          </a>
        </div>
      </section>
    </main>
  );
}
