"use client";
// Dueño: perfil 1. Piezas animadas de la landing. Todas se disparan una sola vez al entrar en pantalla
// (sin secciones fijas ni scroll secuestrado) y respetan «reducir movimiento».
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { EstadoEntrega, Nota, TarjetaEmbarque, colorNota } from "@/components/embarca";
import PasaporteVivo, { useEscritura } from "./PasaporteVivo";
import { CRITERIOS, PASAPORTE_EJEMPLO, RESUMEN_IA, SALIDAS, TARJETA_EJEMPLO } from "./datos";

/* ── Tarjeta de embarque que «sale impresa» desde abajo ── */
function TarjetaImpresa({ activo, retraso, giro = 0, destello = false }: { activo: boolean; retraso: number; giro?: number; destello?: boolean }) {
  const quieto = useReducedMotion();
  return (
    <motion.div
      initial={quieto ? false : { y: 70, opacity: 0, rotate: 0, clipPath: "inset(0% 0% 100% 0%)" }}
      animate={
        quieto
          ? { rotate: giro }
          : activo
            ? { y: 0, opacity: 1, rotate: giro, clipPath: "inset(-20% -20% -20% -20%)" }
            : undefined
      }
      transition={{
        y: { type: "spring", stiffness: 120, damping: 16, delay: retraso },
        opacity: { duration: 0.2, delay: retraso },
        clipPath: { duration: 0.55, ease: "easeOut", delay: retraso },
        rotate: { type: "spring", stiffness: 160, damping: 14, delay: retraso + 0.45 },
      }}
      className="relative"
    >
      <TarjetaEmbarque t={TARJETA_EJEMPLO} compacta />
      {destello && !quieto && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl"
          initial={{ boxShadow: "0 0 0 0 rgba(0,132,61,0)" }}
          animate={activo ? { boxShadow: ["0 0 0 0 rgba(0,132,61,0)", "0 0 0 6px rgba(0,132,61,0.55)", "0 0 0 0 rgba(0,132,61,0)"] } : undefined}
          transition={{ duration: 0.7, delay: retraso + 0.75, times: [0, 0.4, 1] }}
        />
      )}
    </motion.div>
  );
}

/* ── Portada: pasaporte + tarjeta, inclinación con el ratón y parallax ── */
export function PortadaAnimada() {
  const quieto = useReducedMotion();
  const caja = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 14 });
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 14 });
  const { scrollY } = useScroll();
  const yPas = useTransform(scrollY, [0, 700], [0, -30]);
  const yTar = useTransform(scrollY, [0, 700], [0, -80]);

  function mover(e: React.PointerEvent) {
    if (quieto || e.pointerType !== "mouse" || !caja.current) return;
    const r = caja.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function salir() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div ref={caja} onPointerMove={mover} onPointerLeave={salir} className="relative mx-auto w-full max-w-[620px] sm:pb-24" style={{ perspective: 1400 }}>
      <motion.div style={quieto ? undefined : { rotateX: rotX, rotateY: rotY, y: yPas, transformStyle: "preserve-3d" }}>
        <PasaporteVivo d={PASAPORTE_EJEMPLO} inicio={0.15} />
      </motion.div>
      <motion.div
        className="relative z-30 -mt-12 ml-[6%] sm:absolute sm:bottom-0 sm:left-[18%] sm:right-[-6%] sm:ml-0 sm:mt-0"
        style={quieto ? undefined : { y: yTar }}
      >
        <TarjetaImpresa activo retraso={2.15} giro={-4} destello />
      </motion.div>
    </div>
  );
}

/* ── Para empresas: la empresa escribe y sale la tarjeta ── */
const PETICION = "Queremos entender por qué los clientes de Colombia abandonan el carrito. Buscamos a alguien junior que sepa de datos.";
export function EmpresaEscribe() {
  const ref = useRef<HTMLDivElement>(null);
  const visto = useInView(ref, { once: true, amount: 0.5 });
  const texto = useEscritura(PETICION, visto, 200, 1400);
  const quieto = useReducedMotion();
  return (
    <div ref={ref} className="flex w-full flex-col gap-5">
      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-line">
        <span className="text-[13px] font-semibold text-ink-2">Lo que escribe la empresa</span>
        <p className="mt-2 min-h-[4.4em] text-[17px] leading-[1.45] text-ink">
          {texto}
          {!quieto && texto.length < PETICION.length && <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] animate-pulse bg-ink" />}
        </p>
      </div>
      <div className="flex items-center gap-2 text-sm font-semibold text-blue">
        <span aria-hidden="true">↓</span> La IA lo convierte en un reto
      </div>
      <TarjetaImpresa activo={visto} retraso={1.75} giro={0} destello />
    </div>
  );
}

/* ── Para estudiantes: pasaporte que se abre al entrar ── */
export function PasaporteEstudiante() {
  return (
    <div className="mx-auto w-full max-w-[560px]">
      <PasaporteVivo d={PASAPORTE_EJEMPLO} enVista />
    </div>
  );
}

/* ── Panel de salidas con filas split-flap ── */
export function PanelSalidas() {
  const ref = useRef<HTMLDivElement>(null);
  const visto = useInView(ref, { once: true, amount: 0.3 });
  const quieto = useReducedMotion();
  return (
    <div ref={ref} className="overflow-hidden rounded-xl bg-ink" style={{ perspective: 900 }}>
      <div className="hidden grid-cols-[1.4fr_2fr_1.1fr_1fr_0.5fr] gap-4 border-b border-white/10 px-6 py-3 text-[13px] font-semibold text-gold md:grid">
        <span>Estudiante</span>
        <span>Reto</span>
        <span>Empresa</span>
        <span>Estado</span>
        <span>Nota</span>
      </div>
      {SALIDAS.map((f, i) => (
        <motion.div
          key={f.estudiante}
          className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-white/10 px-4 py-3.5 last:border-b-0 md:grid-cols-[1.4fr_2fr_1.1fr_1fr_0.5fr] md:px-6"
          style={{ transformOrigin: "50% 0%", backfaceVisibility: "hidden" }}
          initial={quieto ? false : { rotateX: -92, opacity: 0.2 }}
          animate={visto && !quieto ? { rotateX: 0, opacity: 1 } : undefined}
          transition={{ duration: 0.5, ease: [0.3, 1.4, 0.6, 1], delay: 0.1 + i * 0.13 }}
        >
          <span className="text-base font-semibold text-white">{f.estudiante}</span>
          <span className="order-3 col-span-2 text-[15px] text-[#d5d7db] md:order-none md:col-span-1">
            {f.reto}
            <span className="md:hidden"> · {f.empresa}</span>
          </span>
          <span className="hidden text-[15px] text-[#d5d7db] md:block">{f.empresa}</span>
          <span className="order-2 flex items-center gap-2 justify-self-end md:order-none md:justify-self-start">
            <EstadoEntrega estado={f.estado} />
            <span className="md:hidden">{f.nota !== undefined && <Nota valor={f.nota} size="sm" />}</span>
          </span>
          <span className="hidden md:block">{f.nota !== undefined ? <Nota valor={f.nota} size="sm" /> : <span className="text-[#7a7d83]">—</span>}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ── La IA prepara, tú decides ── */
export function IADecides() {
  const ref = useRef<HTMLDivElement>(null);
  const visto = useInView(ref, { once: true, amount: 0.4 });
  const quieto = useReducedMotion();
  const aparece = (retraso: number, extra: Record<string, number> = {}) =>
    quieto
      ? {}
      : {
          initial: { opacity: 0, y: 10, ...extra },
          animate: visto ? { opacity: 1, y: 0, scale: 1 } : undefined,
          transition: { duration: 0.4, delay: retraso },
        };
  return (
    <div ref={ref} className="grid w-full gap-5 md:grid-cols-2">
      <div className="rounded-xl bg-white p-5 ring-1 ring-line">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold text-ink">Resumen de la IA</span>
          <span className="rounded bg-blue-soft px-2 py-1 text-xs font-semibold text-blue">Sin nota · sin orden</span>
        </div>
        <ul className="mt-4 flex flex-col gap-2.5">
          {RESUMEN_IA.map((l, i) => (
            <motion.li key={l} className="flex gap-2 text-[15px] leading-[1.45] text-ink-2" {...aparece(0.1 + i * 0.22)}>
              <span aria-hidden="true">·</span>
              {l}
            </motion.li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl bg-white p-5 ring-2 ring-ink">
        <span className="font-bold text-ink">Tu valoración</span>
        <ul className="mt-4 flex flex-col gap-3">
          {CRITERIOS.map((c, i) => (
            <li key={c.nombre} className="flex items-center justify-between gap-3 border-b border-line pb-3 text-[15px] text-ink">
              <span>
                {c.nombre} <span className="text-ink-2">· {c.peso}</span>
              </span>
              <motion.span {...aparece(1.05 + i * 0.2, { scale: 0.4 })}>
                <Nota valor={c.nota} size="sm" />
              </motion.span>
            </li>
          ))}
        </ul>
        <motion.p className="mt-4 text-[15px] leading-[1.45] text-ink" {...aparece(1.7)}>
          «Has encontrado el punto exacto donde perdemos al cliente. Lo probamos en la próxima versión.»
        </motion.p>
        <motion.p className="mt-2 text-[13px] font-semibold text-ink-2" {...aparece(1.85)}>
          Marta Gil · Ibérica Retail
        </motion.p>
      </div>
    </div>
  );
}

/* ── Contador que sube al entrar ── */
export function Contador({ valor }: { valor: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visto = useInView(ref, { once: true });
  const quieto = useReducedMotion();
  const [n, setN] = useState(quieto ? valor : 0);
  useEffect(() => {
    if (!visto) return;
    if (quieto) {
      setN(valor);
      return;
    }
    const c = animate(0, valor, { duration: 1.4, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [visto, quieto, valor]);
  return (
    <span ref={ref} className="tabular-nums">
      {n.toLocaleString("es-ES")}
    </span>
  );
}

/* ── Aparición simple de un bloque ── */
export function Aparece({ children, retraso = 0, className = "" }: { children: ReactNode; retraso?: number; className?: string }) {
  const quieto = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={quieto ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: retraso }}
    >
      {children}
    </motion.div>
  );
}

/* ── Leyenda de notas ── */
export function LeyendaNotas() {
  return (
    <div className="flex flex-wrap gap-2">
      {[9.4, 7.9, 6.2, 3.8].map((n) => (
        <span key={n} title={colorNota(n).nivel}>
          <Nota valor={n} size="sm" />
        </span>
      ))}
    </div>
  );
}

