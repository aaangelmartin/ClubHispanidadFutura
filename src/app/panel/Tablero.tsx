"use client";
// Dueño: perfil 1. Piezas animadas del panel de llegadas: filas de últimos registros y barras por país/universidad.
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import s from "./panel.module.css";

export type Llegada = { id: string; nombre: string; universidad: string; pais: string; hora: string; hace: string };

const CODIGOS: Record<string, string> = { España: "ESP", Colombia: "COL", México: "MEX", Argentina: "ARG", Chile: "CHL", Perú: "PER" };
export function codigoPais(pais: string) {
  return CODIGOS[pais] ?? pais.normalize("NFD").replace(/[̀-ͯ]/g, "").slice(0, 3).toUpperCase();
}

export function Llegadas({ filas }: { filas: Llegada[] }) {
  const quieto = useReducedMotion() ?? false;
  return (
    <div role="table" aria-label="Últimos registros" className="flex flex-col" style={{ perspective: 900 }}>
      <div
        role="row"
        className="grid font-[family-name:var(--datos)] grid-cols-[4.5rem_1fr_3.5rem] gap-4 border-b border-white/10 px-5 pb-3 text-xs md:px-7 tracking-[0.2em] text-white/45 uppercase md:grid-cols-[5.5rem_minmax(0,1.1fr)_minmax(0,1.5fr)_4.5rem_8.5rem] md:text-sm"
      >
        <span role="columnheader">Hora</span>
        <span role="columnheader">Estudiante</span>
        <span role="columnheader" className="hidden md:block">Procedencia</span>
        <span role="columnheader">País</span>
        <span role="columnheader" className="hidden md:block">Estado</span>
      </div>
      <AnimatePresence initial={false}>
        {filas.map((f, i) => (
          <motion.div
            role="row"
            key={f.id}
            layout={!quieto}
            initial={quieto ? false : { opacity: 0, rotateX: -80, y: -12, backgroundColor: "rgba(200,150,58,0.35)" }}
            animate={{ opacity: 1, rotateX: 0, y: 0, backgroundColor: "rgba(200,150,58,0)" }}
            exit={quieto ? undefined : { opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1], backgroundColor: { duration: 2.4 } }}
            style={{ transformOrigin: "50% 0%" }}
            className={`grid grid-cols-[4.5rem_1fr_3.5rem] items-center gap-4 border-b border-white/[0.06] px-5 py-4 md:px-7 md:py-5 md:grid-cols-[5.5rem_minmax(0,1.1fr)_minmax(0,1.5fr)_4.5rem_8.5rem] ${i % 2 ? s.filaPar : ""}`}
          >
            <span role="cell" className="font-[family-name:var(--datos)] text-lg text-[var(--oro)] md:text-2xl">
              {f.hora}
            </span>
            <span role="cell" className="min-w-0">
              <span className="block truncate text-xl font-bold text-[#f3efe6] md:text-3xl" style={{ fontStretch: "115%" }}>
                {f.nombre}
              </span>
              <span className="block truncate font-[family-name:var(--datos)] text-xs text-white/55 md:hidden">{f.universidad}</span>
            </span>
            <span role="cell" className="hidden min-w-0 truncate font-[family-name:var(--datos)] text-base text-white/70 md:block md:text-lg" title={f.universidad}>
              {f.universidad}
            </span>
            <span role="cell">
              <span className="inline-block rounded-[4px] border border-white/25 px-2 py-0.5 font-[family-name:var(--datos)] text-sm font-bold tracking-wider text-[#f3efe6] md:text-lg">
                {codigoPais(f.pais)}
              </span>
            </span>
            <span role="cell" className="hidden items-center gap-2 font-[family-name:var(--datos)] text-base text-[#3ecf8e] md:flex md:text-base whitespace-nowrap">
              <span aria-hidden="true">●</span> {f.hace}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function Barras({ filas, codigo = false }: { filas: { nombre: string; total: number }[]; codigo?: boolean }) {
  const quieto = useReducedMotion() ?? false;
  const max = Math.max(1, ...filas.map((f) => f.total));
  return (
    <ul className="flex flex-col gap-4">
      <AnimatePresence initial={false}>
        {filas.map((f, i) => (
          <motion.li
            key={f.nombre}
            layout={!quieto}
            initial={quieto ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-4 gap-y-2"
          >
            <span className="flex min-w-0 items-baseline gap-3">
              {codigo && (
                <span className="font-[family-name:var(--datos)] text-sm font-bold tracking-wider text-[var(--oro)]">{codigoPais(f.nombre)}</span>
              )}
              <span className="truncate text-lg font-semibold text-[#f3efe6] md:text-xl" title={f.nombre}>
                {f.nombre}
              </span>
            </span>
            <span className="font-[family-name:var(--datos)] text-2xl font-bold text-[#f3efe6] tabular-nums md:text-3xl">{f.total}</span>
            <span className="col-span-2 block h-3 overflow-hidden rounded-[2px] bg-white/[0.06]">
              <motion.span
                className={`block h-full ${s.barra}`}
                initial={quieto ? false : { width: 0 }}
                animate={{ width: `${(f.total / max) * 100}%` }}
                transition={{ duration: 1.1, delay: quieto ? 0 : 0.3 + i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
              />
            </span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
