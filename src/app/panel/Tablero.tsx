"use client";
// Dueño: perfil 1. Piezas animadas del tablero de llegadas: filas de últimos registros, reparto por país y barras por universidad.
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import s from "./panel.module.css";

export type Llegada = { id: string; nombre: string; universidad: string; pais: string; hora: string; hace: string };

const CODIGOS: Record<string, string> = { España: "ESP", Colombia: "COL", México: "MEX", Argentina: "ARG", Chile: "CHL", Perú: "PER" };
const COLOR_PAIS: Record<string, string> = { ESP: "#d21034", COL: "#0b4ea2", MEX: "#00843d" };

export function codigoPais(pais: string) {
  return CODIGOS[pais] ?? pais.normalize("NFD").replace(/[̀-ͯ]/g, "").slice(0, 3).toUpperCase();
}
export function colorPais(pais: string) {
  return COLOR_PAIS[codigoPais(pais)] ?? "#5f6166";
}

export function Placa({ pais }: { pais: string }) {
  return (
    <span
      className="inline-block rounded-[3px] px-1.5 py-0.5 font-[family-name:var(--font-b612)] text-xs font-bold text-white md:text-sm"
      style={{ background: colorPais(pais) }}
    >
      {codigoPais(pais)}
    </span>
  );
}

export function Llegadas({ filas }: { filas: Llegada[] }) {
  const quieto = useReducedMotion() ?? false;
  return (
    <ol aria-label="Últimas llegadas" className="flex flex-col gap-1.5" style={{ perspective: 900 }}>
      <AnimatePresence initial={false}>
        {filas.map((f) => (
          <motion.li
            key={f.id}
            layout={!quieto}
            initial={quieto ? false : { opacity: 0, rotateX: -80, backgroundColor: "rgba(200,150,58,0.35)" }}
            animate={{ opacity: 1, rotateX: 0, backgroundColor: "rgba(255,255,255,0.035)" }}
            exit={quieto ? undefined : { opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1], backgroundColor: { duration: 2.4 } }}
            style={{ transformOrigin: "50% 0%" }}
            className={`${s.fila} grid grid-cols-[3.4rem_minmax(0,1fr)_auto] items-center gap-3 rounded-[4px] px-3 py-3 md:grid-cols-[4.5rem_minmax(0,0.9fr)_minmax(0,1.4fr)_auto_6.5rem] md:gap-4 md:px-4 md:py-3.5`}
          >
            <span className="font-[family-name:var(--font-b612)] text-base font-bold tabular-nums text-[#c8963a] md:text-xl">{f.hora}</span>
            <span className="min-w-0">
              <span className="block truncate text-lg font-bold text-white md:text-2xl">{f.nombre}</span>
              <span className="block truncate text-xs text-white/60 md:hidden">{f.universidad}</span>
            </span>
            <span className="hidden min-w-0 truncate text-base text-white/75 md:block md:text-lg" title={f.universidad}>
              {f.universidad}
            </span>
            <Placa pais={f.pais} />
            <span className="hidden whitespace-nowrap text-right text-sm font-semibold text-[#3fd07a] md:block">{f.hace}</span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ol>
  );
}

/** Reparto por país en una sola barra partida, como la ocupación de un vuelo. */
export function RepartoPais({ filas }: { filas: { nombre: string; total: number }[] }) {
  const quieto = useReducedMotion() ?? false;
  const total = Math.max(1, filas.reduce((a, f) => a + f.total, 0));
  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-3.5 w-full gap-[3px] overflow-hidden rounded-[2px]" aria-hidden="true">
        {filas.map((f, i) => (
          <motion.span
            key={f.nombre}
            className="block h-full"
            style={{ background: colorPais(f.nombre) }}
            initial={quieto ? false : { width: 0 }}
            animate={{ width: `${(f.total / total) * 100}%` }}
            transition={{ duration: 1.1, delay: quieto ? 0 : 0.2 + i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
          />
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {filas.map((f) => (
          <li key={f.nombre} className="flex items-center gap-2 text-base text-white md:text-lg">
            <Placa pais={f.nombre} />
            <span className="font-semibold">{f.nombre}</span>
            <span className="font-[family-name:var(--font-b612)] font-bold tabular-nums text-[#c8963a]">{f.total}</span>
            <span className="text-sm tabular-nums text-white/55">· {Math.round((f.total / total) * 100)} %</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Barras({ filas }: { filas: { nombre: string; total: number }[] }) {
  const quieto = useReducedMotion() ?? false;
  const max = Math.max(1, ...filas.map((f) => f.total));
  return (
    <ul className="flex flex-col gap-3">
      <AnimatePresence initial={false}>
        {filas.map((f, i) => (
          <motion.li
            key={f.nombre}
            layout={!quieto}
            initial={quieto ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_2.5rem]"
          >
            <span className="col-start-1 row-start-1 truncate text-base font-semibold text-white md:col-auto md:row-auto md:text-lg" title={f.nombre}>
              {f.nombre}
            </span>
            <span className="col-span-2 row-start-2 block h-2.5 overflow-hidden rounded-[2px] bg-white/[0.07] md:col-auto md:row-auto">
              <motion.span
                className="block h-full bg-[#c8963a]"
                initial={quieto ? false : { width: 0 }}
                animate={{ width: `${(f.total / max) * 100}%` }}
                transition={{ duration: 1.1, delay: quieto ? 0 : 0.3 + i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
              />
            </span>
            <span className="col-start-2 row-start-1 text-right font-[family-name:var(--font-b612)] text-lg font-bold tabular-nums text-[#c8963a] md:col-auto md:row-auto md:text-xl">
              {f.total}
            </span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
