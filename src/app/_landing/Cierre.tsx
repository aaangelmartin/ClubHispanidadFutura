"use client";
// Dueño: perfil 1. Cierre: un pasaporte en blanco que se abre al entrar en pantalla y espera su primer sello.
// Debajo, el pie de página.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { Escudo } from "@/components/Marca";
import p from "./pasaporte.module.css";

function Contador({ hasta, activo }: { hasta: number; activo: boolean }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? hasta : 0);
  useEffect(() => {
    if (!activo) return;
    if (reduce) {
      setN(hasta);
      return;
    }
    const c = animate(0, hasta, { duration: 1.6, delay: 0.9, ease: [0.2, 0.7, 0.2, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [activo, hasta, reduce]);
  return <span className="tabular-nums">{n.toLocaleString("es-ES")}</span>;
}

function Libro({ abierto }: { abierto: boolean }) {
  const reduce = useReducedMotion();
  const t = reduce ? { duration: 0 } : { duration: 1.3, ease: [0.65, 0, 0.25, 1] as const, delay: 0.15 };
  const ab = abierto || !!reduce;

  return (
    <motion.div
      className="relative mx-auto aspect-[1.42/1] w-full max-w-[560px] [perspective:1800px]"
      initial={false}
      animate={{ x: ab ? "0%" : "-25%" }}
      transition={t}
    >
      {/* Página derecha: la de sellos, en blanco */}
      <div className={`${p.seguridad} absolute inset-y-0 right-0 w-1/2 overflow-hidden rounded-r-[12px] shadow-[0_30px_50px_-20px_rgba(20,35,61,0.45)] ring-1 ring-black/10`}>
        <span className={`${p.datos} absolute right-3 top-3 text-[8px] tracking-[0.16em] text-[var(--tinta-2)] sm:text-[9px]`}>
          SELLOS · STAMPS
        </span>
        <motion.div
          initial={false}
          animate={{ opacity: ab ? 1 : 0, scale: ab ? 1 : 0.9 }}
          transition={{ ...t, delay: reduce ? 0 : 1.1, duration: reduce ? 0 : 0.6 }}
          className="absolute inset-[18%_14%] grid place-items-center rounded-full border-2 border-dashed border-[var(--tinta)]/25 text-center"
        >
          <span className={`${p.datos} px-2 text-[9px] leading-snug text-[var(--tinta-2)] sm:text-[11px]`}>
            Tu primer sello
            <br />
            va aquí
          </span>
        </motion.div>
        <span className={`${p.datos} absolute bottom-3 right-3 text-[8px] text-[var(--tinta-2)] sm:text-[9px]`}>01</span>
      </div>

      {/* Tapa: gira sobre el lomo y su cara interior se convierte en la página de identidad */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 [transform-style:preserve-3d]"
        style={{ transformOrigin: "0% 50%" }}
        initial={false}
        animate={{ rotateY: ab ? -180 : 0 }}
        transition={t}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-between rounded-r-[12px] bg-[#14233d] px-3 py-[12%] text-center text-[#c8963a] shadow-[0_30px_50px_-20px_rgba(20,35,61,0.6)] [backface-visibility:hidden]">
          <span className={`${p.datos} text-[8px] tracking-[0.22em] sm:text-[10px]`}>PASAPORTE DE TALENTO</span>
          <Escudo size={64} fondo="#14233d" />
          <span className="font-script text-[18px] leading-none sm:text-[24px]">Hispanidad Futura</span>
        </div>
        <div
          className={`${p.seguridad} absolute inset-0 flex flex-col gap-2 rounded-l-[12px] p-3 ring-1 ring-black/10 [backface-visibility:hidden] [transform:rotateY(180deg)] sm:gap-3 sm:p-5`}
        >
          <span className={`${p.datos} text-[8px] font-bold tracking-[0.16em] text-[var(--tinta)] sm:text-[10px]`}>
            PASAPORTE DE TALENTO
          </span>
          <div className="flex gap-2 sm:gap-3">
            <div className="grid aspect-[3/4] w-[32%] shrink-0 place-items-center rounded-[4px] border border-dashed border-[var(--tinta)]/30 bg-white/40">
              <span className={`${p.datos} text-[11px] text-[var(--tinta-2)]`}>?</span>
            </div>
            <div className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
              {["Nombre", "Universidad", "Retos valorados"].map((c) => (
                <div key={c} className="flex flex-col">
                  <span className={`${p.datos} text-[7px] text-[var(--tinta-2)] sm:text-[8.5px]`}>{c}</span>
                  <span className="mt-1 block h-px w-14 bg-[var(--tinta)]/30 sm:w-20" />
                </div>
              ))}
            </div>
          </div>
          <div className={`${p.datos} mt-auto overflow-hidden rounded-sm bg-white/50 px-1.5 py-1 text-[7px] leading-relaxed text-[var(--tinta)] sm:text-[9px]`}>
            <span className="block whitespace-nowrap">P&lt;ESPCOL&lt;&lt;TU&lt;NOMBRE&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</span>
            <span className="block whitespace-nowrap">RETOS0000&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ opacity: ab ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 1 }}
        className={`${p.lomo} pointer-events-none absolute inset-y-0 left-1/2 w-8 -translate-x-1/2`}
      />
    </motion.div>
  );
}

export default function Cierre({ registrados }: { registrados?: number | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const visto = useInView(ref, { once: true, amount: 0.45 });
  const hay = typeof registrados === "number" && registrados > 0;

  return (
    <section className={`${p.seguridad} text-[var(--tinta)]`} aria-labelledby="cierre-titulo">
      <div ref={ref} className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-24 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-28 lg:pt-32">
        <div className="flex flex-col gap-6">
          <h2 id="cierre-titulo" className={`${p.display} text-[42px] sm:text-[56px] lg:text-[62px]`}>
            Tu pasaporte está en blanco. Por ahora.
          </h2>
          <p className="max-w-md text-[17px] leading-relaxed text-[var(--tinta-2)]">
            Resuelve tu primer reto y una empresa de España o Colombia pondrá su sello, ganes o no. Para estudiantes,
            gratis siempre.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href="/registro?rol=estudiante"
              className={`${p.boton} rounded-full bg-[var(--tapa)] px-7 py-3.5 text-[15px] font-semibold text-[#f3efe6] shadow-[0_14px_30px_-12px_rgba(20,35,61,0.7)] hover:bg-[#1c3152]`}
            >
              Crear mi pasaporte
            </Link>
            {hay && (
              <p className="text-[15px] text-[var(--tinta-2)]">
                <span className={`${p.display} mr-1.5 text-[28px] text-[var(--tinta)]`}>
                  <Contador hasta={registrados} activo={visto} />
                </span>
                {registrados === 1 ? "estudiante ya tiene el suyo" : "estudiantes ya tienen el suyo"}
              </p>
            )}
          </div>
        </div>
        <Libro abierto={visto} />
      </div>

      <footer className="border-t border-[var(--tinta)]/12 bg-[var(--papel)]/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Escudo size={38} fondo="var(--papel)" />
            <div className="flex flex-col gap-1">
              <span className="font-script text-[24px] leading-none text-[var(--tinta)]">Hispanidad Futura</span>
              <span className="text-[13px] text-[var(--tinta-2)]">
                Una iniciativa del Club Hispanidad Futura · Hackathon Iberoamérica 2030
              </span>
            </div>
          </div>
          <nav aria-label="Pie de página" className="flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
            <Link href="/retos" className="text-[var(--tinta-2)] hover:text-[var(--tinta)]">Retos</Link>
            <Link href="/panel" className="text-[var(--tinta-2)] hover:text-[var(--tinta)]">Panel en vivo</Link>
            <Link href="/registro" className="text-[var(--tinta-2)] hover:text-[var(--tinta)]">Registro</Link>
          </nav>
        </div>
      </footer>
    </section>
  );
}
