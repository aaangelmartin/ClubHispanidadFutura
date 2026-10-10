"use client";
// Dueño: perfil 1. Para empresas: «mesa de control» donde llegan entregas de España y Colombia.
// Ligado al scroll: llegan los documentos, la IA los resume (sin nota) y una persona pone el sello.
import Link from "next/link";
import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import p from "./pasaporte.module.css";

type Entrega = {
  pais: "ESP" | "COL";
  bandera: [string, string, string];
  ref: string;
  perfil: string;
  ciudad: string;
  entregado: string;
  resumen: string[];
  nota: string;
  decide: string;
  color: string;
  giro: string;
};

const ENTREGAS: Entrega[] = [
  {
    pais: "ESP",
    bandera: ["#aa151b", "#f1bf00", "#aa151b"],
    ref: "ENT-014",
    perfil: "Estudiante de ingeniería de datos",
    ciudad: "Valencia",
    entregado: "14 OCT 2026",
    resumen: ["Previsión semanal por tienda con validación temporal", "README claro; tests en la mitad de los módulos", "No trata los festivos locales"],
    nota: "8,4",
    decide: "Marta R. · responsable de datos",
    color: "var(--sello-a)",
    giro: "-9deg",
  },
  {
    pais: "COL",
    bandera: ["#fcd116", "#003893", "#ce1126"],
    ref: "ENT-022",
    perfil: "Estudiante de ingeniería de software",
    ciudad: "Medellín",
    entregado: "15 OCT 2026",
    resumen: ["API de alertas de stock con colas y reintentos", "Despliegue documentado paso a paso", "Sin pruebas de carga"],
    nota: "7,9",
    decide: "Marta R. · responsable de datos",
    color: "var(--sello-b)",
    giro: "6deg",
  },
];

function Bandera({ c }: { c: [string, string, string] }) {
  return (
    <span className="inline-flex h-3 w-[18px] flex-col overflow-hidden rounded-[2px] ring-1 ring-black/10" aria-hidden="true">
      <span className="flex-1" style={{ background: c[0] }} />
      <span className="flex-[1.4]" style={{ background: c[1] }} />
      <span className="flex-1" style={{ background: c[2] }} />
    </span>
  );
}

function Fila({ e, i, prog }: { e: Entrega; i: number; prog: MotionValue<number> }) {
  const d = i * 0.07;
  const docX = useTransform(prog, [0.04 + d, 0.2 + d], [80, 0]);
  const docO = useTransform(prog, [0.04 + d, 0.16 + d], [0, 1]);
  const iaO = useTransform(prog, [0.28 + d, 0.4 + d, 0.62, 0.74], [0, 1, 1, 0.85]);
  const iaX = useTransform(prog, [0.28 + d, 0.4 + d], [-28, 0]);
  const lineas = useTransform(prog, [0.3 + d, 0.46 + d], ["0%", "100%"]);
  const selloS = useTransform(prog, [0.6 + d, 0.67 + d], [2.2, 1]);
  const selloO = useTransform(prog, [0.6 + d, 0.64 + d], [0, 0.92]);
  const selloB = useTransform(prog, [0.6 + d, 0.67 + d], ["blur(4px)", "blur(0px)"]);
  const firmaO = useTransform(prog, [0.66 + d, 0.74 + d], [0, 1]);

  return (
    <div className="relative grid items-center gap-2 lg:grid-cols-[1fr_1.15fr_0.75fr] lg:gap-6">
      {/* Resumen de la IA: a un lado, sin nota */}
      <motion.aside
        style={{ opacity: iaO, x: iaX }}
        className="order-2 rounded-lg border border-dashed border-white/25 bg-white/[0.04] px-3 py-2.5 lg:order-1 lg:px-4 lg:py-3.5"
      >
        <div className="flex items-center justify-between gap-2">
          <span className={`${p.datos} text-[10px] text-[#c8963a]`}>Resumen IA</span>
          <span className={`${p.datos} text-[10px] text-white/50`}>sin nota · sin orden</span>
        </div>
        <ul className="mt-1.5 space-y-1 text-[12.5px] leading-snug text-white/80 lg:mt-2 lg:text-[13.5px]">
          {e.resumen.map((r, k) => (
            <li key={r} className={`flex gap-2 ${k === 2 ? "hidden sm:flex" : ""}`}>
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#c8963a]" aria-hidden="true" />
              {r}
            </li>
          ))}
        </ul>
        <div className="mt-2 hidden h-px bg-white/10 lg:block">
          <motion.div style={{ width: lineas }} className="h-px bg-[#c8963a]/70" />
        </div>
      </motion.aside>

      {/* La entrega: documento en papel de seguridad */}
      <motion.article
        style={{ x: docX, opacity: docO }}
        className={`${p.seguridad} relative order-1 overflow-hidden rounded-[10px] px-4 py-3 text-[var(--tinta)] shadow-[0_24px_40px_-18px_rgba(0,0,0,0.6)] lg:order-2 lg:px-5 lg:py-4`}
      >
        <div className="flex items-center justify-between gap-3">
          <span className={`${p.datos} flex items-center gap-2 text-[10px] font-bold tracking-[0.14em]`}>
            <Bandera c={e.bandera} />
            ENTREGA · {e.pais}
          </span>
          <span className={`${p.datos} text-[10px] text-[var(--tinta-2)]`}>{e.ref}</span>
        </div>
        <p className="mt-2 text-[15px] font-semibold leading-tight lg:text-[17px]">{e.perfil}</p>
        <p className="mt-0.5 text-[12.5px] text-[var(--tinta-2)]">
          {e.ciudad} · repositorio y vídeo de 3 minutos
        </p>
        <div className={`${p.datos} mt-2.5 hidden rounded-sm bg-white/55 px-2 py-1 text-[9.5px] tracking-[0.06em] sm:block`}>
          {`R<${e.pais}${e.ref.replace("-", "")}<<STOCK<<<<<<<<<<${e.entregado.replaceAll(" ", "")}<<`}
        </div>
      </motion.article>

      {/* La decisión: la pone una persona */}
      <div className="pointer-events-none absolute right-1 top-7 z-10 order-3 sm:right-4 flex flex-col items-center gap-2 lg:pointer-events-auto lg:static lg:items-start">
        <motion.div
          style={{ scale: selloS, opacity: selloO, filter: selloB, rotate: e.giro, color: e.color, borderColor: e.color }}
          className="grid h-[76px] w-[76px] place-items-center rounded-full border-[3px] bg-[#eef1ee]/0 text-center mix-blend-normal lg:h-[108px] lg:w-[108px]"
        >
          <div className={`${p.datos} flex flex-col items-center leading-tight`}>
            <span className="text-[7px] font-bold tracking-[0.18em] lg:text-[9px]">VALORADO</span>
            <span className="text-[20px] font-bold leading-none lg:text-[28px]">{e.nota}</span>
            <span className="hidden text-[8.5px] tracking-wider lg:inline">IBÉRICA RETAIL</span>
          </div>
        </motion.div>
        <motion.p style={{ opacity: firmaO }} className="hidden text-[12.5px] leading-snug text-white/70 lg:block">
          <span className="block font-semibold text-white">{e.decide}</span>
          Nota y comentario escritos a mano
        </motion.p>
      </div>
    </div>
  );
}

export default function SeccionEmpresas() {
  const reduce = useReducedMotion();
  const mesa = useRef<HTMLDivElement>(null);
  // La secuencia se reproduce una vez al entrar en pantalla (sin fijar la sección al scroll).
  const visible = useInView(mesa, { once: true, amount: 0.3 });
  const prog = useMotionValue(0);
  useEffect(() => {
    if (reduce) {
      prog.set(1);
      return;
    }
    if (!visible) return;
    const anim = animate(prog, 1, { duration: 3.2, ease: [0.2, 0.7, 0.2, 1] });
    return () => anim.stop();
  }, [visible, reduce, prog]);

  const prepara = useTransform(prog, [0.24, 0.36, 0.58, 0.68], [0.28, 1, 1, 0.8]);
  const decide = useTransform(prog, [0.56, 0.66], [0.28, 1]);
  const raya = useTransform(prog, [0.56, 0.7], ["0%", "100%"]);

  return (
    <section className={`${p.tapa} relative`} aria-labelledby="empresas-titulo">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 pb-6 pt-20 sm:px-8 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:pt-32">
        <h2 id="empresas-titulo" className={`${p.display} text-[44px] text-[#f3efe6] sm:text-[64px] lg:text-[80px]`}>
          Ve el trabajo antes de contratar.
        </h2>
        <div className="flex flex-col gap-5 lg:pb-2">
          <p className="text-[17px] leading-relaxed text-white/75">
            Publica un reto real de tu empresa. La IA lo monta en minutos y estudiantes de España y Colombia te
            entregan código, datos y una explicación. Tú valoras cada entrega, y tu sello queda en su pasaporte.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href="/registro?rol=empresa"
              className={`${p.boton} rounded-full bg-[#c8963a] px-6 py-3 text-[15px] font-semibold text-[#14233d] shadow-[0_10px_30px_-10px_rgba(200,150,58,0.7)] hover:bg-[#d6a44a]`}
            >
              Publicar un reto
            </Link>
            <span className="text-sm text-white/55">Piloto de 90 días entre España y Colombia</span>
          </div>
        </div>
      </div>

      <div ref={mesa}>
        <div className="flex flex-col justify-center overflow-hidden">
          <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 lg:mb-8">
              <p className={`${p.display} text-[30px] sm:text-[44px] lg:text-[56px]`}>
                <motion.span style={{ opacity: prepara }} className="inline-block text-[#c8963a]">
                  La IA prepara.
                </motion.span>{" "}
                <motion.span style={{ opacity: decide }} className="relative inline-block text-[#f3efe6]">
                  Decide una persona.
                  <motion.span
                    style={{ width: raya }}
                    className="absolute -bottom-1 left-0 h-[3px] rounded-full bg-[#b23a48]"
                    aria-hidden="true"
                  />
                </motion.span>
              </p>
              <span className={`${p.datos} text-[11px] text-white/45`}>Mesa de control · ejemplo piloto</span>
            </div>

            <div className="mb-3 hidden grid-cols-[1fr_1.15fr_0.75fr] gap-6 text-[13px] text-white/50 lg:grid">
              <span>Lo que hace la IA</span>
              <span>Lo que entrega el estudiante</span>
              <span>Lo que decide tu equipo</span>
            </div>

            <div className="flex flex-col gap-4 lg:gap-6">
              {ENTREGAS.map((e, i) => (
                <Fila key={e.ref} e={e} i={i} prog={prog} />
              ))}
            </div>

            <p className="mt-6 max-w-2xl text-[13.5px] leading-relaxed text-white/60 lg:mt-8">
              La IA resume cada entrega para que la leas antes, pero no pone notas ni ordena candidatos. Cada
              valoración la firma una persona de tu equipo, como pide la Ley de IA de la UE.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
