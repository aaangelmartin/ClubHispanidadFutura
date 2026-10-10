"use client";
// Dueño: perfil 1. Pasaporte animado de la landing: sube cerrado, la tapa oro gira sobre el lomo,
// la MRZ se escribe letra a letra y los sellos caen. Mismos estilos que <Pasaporte> del kit,
// pero por piezas para poder animarlas. Con «reducir movimiento» se pinta abierto y quieto.
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { C, Isotipo, Sello, mrz, type DatosPasaporte } from "@/components/embarca";

const MONO = "var(--font-b612), ui-monospace, monospace";
const MUELLE = { type: "spring" as const, stiffness: 140, damping: 18 };

/** Escribe `texto` letra a letra cuando `activo` pasa a true. */
export function useEscritura(texto: string, activo: boolean, retrasoMs: number, duracionMs: number) {
  const quieto = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!activo || quieto) return;
    let i = 0;
    let intervalo: ReturnType<typeof setInterval> | undefined;
    const paso = Math.max(8, duracionMs / texto.length);
    const t = setTimeout(() => {
      intervalo = setInterval(() => {
        i += 1;
        setN(i);
        if (i >= texto.length && intervalo) clearInterval(intervalo);
      }, paso);
    }, retrasoMs);
    return () => {
      clearTimeout(t);
      if (intervalo) clearInterval(intervalo);
    };
  }, [activo, quieto, texto, retrasoMs, duracionMs]);
  return quieto ? texto : texto.slice(0, n);
}

/**
 * `inicio`: segundos de retraso de toda la secuencia. `enVista`: arranca al entrar en pantalla
 * (si no, al montar). `children` se pinta encima (la tarjeta de embarque de la portada).
 */
export default function PasaporteVivo({
  d,
  inicio = 0,
  enVista = false,
  children,
}: {
  d: DatosPasaporte;
  inicio?: number;
  enVista?: boolean;
  children?: ReactNode;
}) {
  const quieto = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const visto = useInView(ref, { once: true, amount: 0.4 });
  const activo = enVista ? visto : true;
  const [l1, l2] = mrz(d);
  const escrito = useEscritura(`${l1}\n${l2}`, activo, (inicio + 1.25) * 1000, 650);
  const [e1, e2 = ""] = escrito.split("\n");
  const iniciales = d.nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  const [tamSello, setTamSello] = useState(92);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setTamSello(Math.round(Math.min(96, Math.max(52, e.contentRect.width * 0.2)))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const ir = (v: Record<string, number | string>) => (quieto ? false : activo ? v : undefined);

  return (
    <div ref={ref} className="relative w-full" style={{ perspective: 1800 }}>
      <motion.div
        className="relative w-full"
        style={{ aspectRatio: "1.62 / 1", transformStyle: "preserve-3d" }}
        initial={quieto ? false : { y: 90, opacity: 0, x: "-25%" }}
        animate={quieto ? { y: 0, opacity: 1, x: 0 } : activo ? { y: 0, opacity: 1, x: 0 } : undefined}
        transition={{
          y: { ...MUELLE, delay: inicio },
          opacity: { duration: 0.35, delay: inicio },
          x: { duration: 0.8, ease: [0.65, 0, 0.35, 1], delay: inicio + 0.5 },
        }}
      >
        {/* Página derecha: sellos */}
        <div
          className="absolute inset-y-0 right-0 w-1/2 rounded-r-2xl py-2 pr-2"
          style={{ background: C.oro, boxShadow: "0 24px 50px -20px rgba(20,35,61,0.45)" }}
        >
          <div className="relative h-full rounded-r-lg p-3 sm:p-4" style={{ background: C.papel }}>
            <span className="text-xs font-bold sm:text-sm" style={{ color: C.marino }}>Sellos</span>
            {d.sellos.slice(0, 3).map((s, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={[{ left: "10%", top: "20%" }, { right: "6%", top: "46%" }, { left: "22%", bottom: "6%" }][i]}
                initial={quieto ? false : { scale: 1.8, opacity: 0, rotate: 24 }}
                animate={ir({ scale: 1, opacity: 1, rotate: 0 })}
                transition={{ type: "spring", stiffness: 520, damping: 17, delay: inicio + 1.65 + i * 0.32 }}
              >
                <Sello nota={s.nota} empresa={s.empresa} giro={[-8, 10, -3][i]} size={tamSello} />
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute inset-y-2 left-1/2 z-10 w-1 -translate-x-1/2 bg-black/15" aria-hidden="true" />

        {/* Tapa: delante oro, detrás la página de datos. Gira sobre el lomo (borde izquierdo). */}
        <motion.div
          className="absolute inset-y-0 right-0 z-20 w-1/2"
          style={{ transformOrigin: "0% 50%", transformStyle: "preserve-3d" }}
          initial={quieto ? false : { rotateY: 0 }}
          animate={quieto ? { rotateY: -180 } : activo ? { rotateY: -180 } : undefined}
          transition={{ duration: 0.85, ease: [0.6, 0.02, 0.3, 1], delay: inicio + 0.5 }}
        >
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-r-2xl rounded-l-md"
            style={{ background: `linear-gradient(135deg, #d4a24a, ${C.oro} 55%, #b5852f)`, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          >
            <span className="rounded-lg p-1 ring-2 ring-[#14233d]/30">
              <Isotipo size={44} />
            </span>
            <span className="text-xl font-extrabold tracking-[-0.03em] sm:text-2xl" style={{ color: C.marino }}>Embarca</span>
            <span className="text-[11px] font-semibold" style={{ color: C.marino, opacity: 0.7 }}>Pasaporte de talento</span>
          </div>
          <div
            className="absolute inset-0 rounded-l-2xl py-2 pl-2"
            style={{ background: C.oro, transform: "rotateY(180deg)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          >
            <div className="flex h-full flex-col gap-2 rounded-l-lg p-3 sm:gap-3 sm:p-4" style={{ background: C.papel }}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-bold sm:text-sm" style={{ color: C.marino }}>Pasaporte Embarca</span>
                <span className="hidden text-[10px] sm:inline" style={{ fontFamily: MONO, color: C.texto2 }}>Nº {d.numero}</span>
              </div>
              <div className="flex gap-2 sm:gap-3">
                <div className="grid h-14 w-11 shrink-0 place-items-center rounded-md bg-[#dadce0] text-base font-bold text-[#9aa0a6] sm:h-24 sm:w-[76px] sm:text-2xl">
                  {iniciales}
                </div>
                <dl className="flex min-w-0 flex-col gap-0.5 sm:gap-1.5">
                  {[
                    ["Nombre", d.nombre],
                    ["Universidad", d.universidad],
                    ["País", d.pais],
                    ["Retos valorados", String(d.retos)],
                  ].map(([k, v], i) => (
                    <div key={k} className={`min-w-0 ${i === 3 ? "hidden sm:block" : ""}`}>
                      <dt className="text-[9px] sm:text-[10px]" style={{ color: C.texto2 }}>{k}</dt>
                      <dd className="truncate text-[11px] font-bold sm:text-[13px]" style={{ color: C.marino }}>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="mt-auto min-h-[2.4em] overflow-hidden text-[7px] leading-snug sm:text-[9.5px] lg:text-[10.5px]" style={{ fontFamily: MONO, color: C.marino }} aria-label={`${l1} ${l2}`}>
                <div className="truncate">{e1 || " "}</div>
                <div className="truncate">{e2 || " "}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      {children}
    </div>
  );
}
