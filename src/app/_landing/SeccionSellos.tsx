"use client";
// Dueño: perfil 1. «Así se consigue un sello»: escenario fijo ligado al scroll que cuenta, en tres actos,
// cómo una petición de empresa acaba como sello en el pasaporte de talento. Datos de ejemplo piloto.
import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import p from "./pasaporte.module.css";
import s from "./sellos.module.css";

const PETICION =
  "Queremos entender por qué los clientes abandonan el carrito en la app. Buscamos a alguien junior que sepa de datos.";

const PASOS = [
  { n: 1, titulo: "Una empresa cuenta lo que necesita", corto: "La empresa pide", texto: "Con sus palabras, sin redactar un pliego. Basta con explicar el problema." },
  { n: 2, titulo: "La IA lo convierte en un reto de días", corto: "La IA lo prepara", texto: "Alcance, entregable y rúbrica claros. La empresa lo revisa antes de publicarlo." },
  { n: 3, titulo: "Lo resuelves y la empresa pone su sello", corto: "Tú lo resuelves", texto: "Una persona de la empresa valora tu entrega. El sello queda en tu pasaporte, ganes o no." },
];

const RUBRICA = [
  { criterio: "Análisis de los datos", peso: 40 },
  { criterio: "Propuesta accionable", peso: 35 },
  { criterio: "Comunicación del informe", peso: 25 },
];

// Cortes del recorrido (progreso 0–1 de la sección)
const ACTO_2 = 0.31;
const ACTO_3 = 0.64;
const SELLAR = 0.84;

/* ───────────────────────── Piezas de papel ───────────────────────── */

function Etiqueta({ children }: { children: React.ReactNode }) {
  return <span className={`${p.datos} text-[10px] text-[var(--tinta-2)]`}>{children}</span>;
}

function Peticion({ texto }: { texto: React.ReactNode }) {
  return (
    <div className={`${s.hoja} flex h-full flex-col rounded-[14px] p-5 sm:p-7`}>
      <div className="flex items-center gap-3 border-b border-[var(--papel-linea)] pb-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--tapa)] font-bold text-[#f3efe6]">
          <span className={`${p.datos} text-[13px]`}>IR</span>
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="text-[15px] font-semibold text-[var(--tinta)]">Ibérica Retail</span>
          <Etiqueta>Madrid · España · comercio minorista</Etiqueta>
        </div>
        <span className={`${p.datos} ml-auto shrink-0 rounded-full bg-[var(--tinta)]/5 px-2.5 py-1 text-[10px] text-[var(--tinta-2)]`}>
          Nueva petición
        </span>
      </div>
      <p className="mt-5 text-[19px] leading-[1.45] font-medium text-[var(--tinta)] sm:text-[22px]">{texto}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pt-5">
        <Etiqueta>Escrito por Lucía Martín, Producto</Etiqueta>
        <Etiqueta>Ejemplo piloto</Etiqueta>
      </div>
    </div>
  );
}

function Ficha({ barras }: { barras?: MotionValue<number>[] }) {
  return (
    <div className={`${s.ficha} flex h-full flex-col overflow-hidden rounded-[14px]`}>
      <div className={`${s.guilloche} flex items-center justify-between px-5 py-3 text-[#f3efe6] sm:px-7`}>
        <span className={`${p.datos} text-[10px] tracking-[0.16em]`}>RETO Nº 0412 · ES</span>
        <span className={`${p.datos} text-[10px] text-[var(--oro)]`}>
          Preparado con IA<span className="hidden sm:inline"> · revisado por la empresa</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-7">
        <h3 className={`${p.display} text-[26px] text-[var(--tinta)] sm:text-[32px]`}>Reduce el abandono del carrito</h3>
        <dl className="mt-4 grid grid-cols-3 gap-3 border-y border-[var(--papel-linea)] py-3">
          {[
            ["Duración", "5 días"],
            ["Nivel", "Junior"],
            ["Ámbito", "Datos"],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col">
              <dt className={`${p.datos} text-[10px] text-[var(--tinta-2)]`}>{k}</dt>
              <dd className={`${p.datos} text-[14px] font-bold text-[var(--tinta)]`}>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 flex flex-col">
          <Etiqueta>Entregable</Etiqueta>
          <span className="text-[15px] font-semibold text-[var(--tinta)]">Repo + informe de 2 páginas</span>
        </div>
        <div className="mt-4 flex flex-col gap-2.5">
          <Etiqueta>Rúbrica</Etiqueta>
          {RUBRICA.map((r, i) => (
            <div key={r.criterio} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1">
              <span className="text-[13.5px] text-[var(--tinta)]">{r.criterio}</span>
              <span className={`${p.datos} text-[13px] font-bold text-[var(--tinta)]`}>{r.peso}%</span>
              <div className="col-span-2 h-[6px] overflow-hidden rounded-full bg-[var(--tinta)]/8">
                <motion.div
                  className="h-full origin-left rounded-full bg-[var(--oro)]"
                  style={{ width: `${(r.peso / 40) * 100}%`, scaleX: barras ? barras[i] : 1 }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto flex justify-end pt-3">
          <Etiqueta>Ejemplo piloto</Etiqueta>
        </div>
      </div>
    </div>
  );
}

function Entrega() {
  return (
    <div className={`${s.hoja} flex h-full flex-col rounded-[14px] p-5 sm:p-7`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <Etiqueta>Entrega · Reduce el abandono del carrito</Etiqueta>
          <span className="mt-1 text-[17px] font-semibold text-[var(--tinta)]">Valentina Ortiz</span>
          <Etiqueta>Universidad Nacional · Bogotá · Colombia</Etiqueta>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className={`${p.datos} rounded-full bg-[var(--sello-c)]/10 px-2.5 py-1 text-[10px] text-[var(--sello-c)]`}>
            Día 5 de 5
          </span>
          <Etiqueta>Ejemplo piloto</Etiqueta>
        </div>
      </div>
      <ul className="mt-4 flex flex-col divide-y divide-[var(--papel-linea)] border-y border-[var(--papel-linea)]">
        <li className="flex items-center justify-between gap-3 py-2.5">
          <span className="text-[14px] text-[var(--tinta)]">Repositorio</span>
          <span className={`${p.datos} truncate text-[12px] text-[var(--sello-b)]`}>github.com/vortiz/carrito</span>
        </li>
        <li className="flex items-center justify-between gap-3 py-2.5">
          <span className="text-[14px] text-[var(--tinta)]">Informe</span>
          <span className={`${p.datos} text-[12px] text-[var(--tinta-2)]`}>2 páginas · PDF</span>
        </li>
      </ul>
      <p className={`${s.hallazgo} mt-4 text-[14.5px] leading-snug text-[var(--tinta)]`}>
        Hallazgo principal: el coste de envío aparece en el último paso y ahí se concentra el abandono.
      </p>
    </div>
  );
}

function SelloGrande() {
  return (
    <div
      className={`${s.tinta} relative grid h-[128px] w-[128px] place-items-center rounded-full border-[4px] border-[var(--sello-a)] text-[var(--sello-a)] sm:h-[176px] sm:w-[176px]`}
    >
      <div className="absolute inset-[7px] rounded-full border-[1.5px] border-current" />
      <div className={`${p.datos} flex flex-col items-center text-center leading-tight`}>
        <span className="text-[11px] font-bold tracking-[0.22em]">VALORADO</span>
        <span className="text-[38px] leading-[1.05] font-bold sm:text-[52px]">8,6</span>
        <span className="text-[10.5px] font-bold sm:text-[11.5px]">Ibérica Retail</span>
        <span className="text-[8px] tracking-wide sm:text-[9.5px] sm:tracking-wider">MADRID · 12 OCT 2026</span>
      </div>
    </div>
  );
}

function Comentario() {
  return (
    <div className={`${s.hoja} rounded-[12px] border-l-[3px] border-[var(--sello-a)] px-4 py-3`}>
      <p className="text-[13.5px] leading-snug text-[var(--tinta)]">
        «Has encontrado el punto exacto donde perdemos al cliente y lo explicas sin jerga. Lo probamos en la próxima versión.»
      </p>
      <span className={`${p.datos} mt-1.5 block text-[10px] text-[var(--tinta-2)]`}>Lucía Martín · Producto · Ibérica Retail</span>
    </div>
  );
}

/** Filtro SVG que rompe el borde del sello como tinta sobre papel. */
function FiltroTinta() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <filter id="tinta-irregular">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="ruido" />
        <feDisplacementMap in="SourceGraphic" in2="ruido" scale="1.6" />
      </filter>
    </svg>
  );
}

function Titulo({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <h2 className={`${p.display} text-[34px] text-[var(--tinta)] sm:text-[46px] lg:text-[56px]`}>
        Así se consigue un sello
      </h2>
      <p className="mt-3 max-w-[34ch] text-[15px] leading-snug text-[var(--tinta-2)] lg:text-[17px]">
        Un reto real, de la petición de la empresa al pasaporte del estudiante. La IA prepara; decide una persona.
      </p>
    </div>
  );
}

/* ───────────────────────── Versión animada ───────────────────────── */

function Animada() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const prog = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.0005 });

  const [paso, setPaso] = useState(0);
  const [sellado, setSellado] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setPaso(v < ACTO_2 ? 0 : v < ACTO_3 ? 1 : 2);
    setSellado(v >= SELLAR);
  });

  // Acto 1: la petición se escribe
  const letras = useTransform(prog, [0.02, 0.22], [0, PETICION.length]);
  const texto = useTransform(letras, (n) => PETICION.slice(0, Math.round(n)));
  const peticionOpacity = useTransform(prog, [ACTO_2 - 0.02, ACTO_2 + 0.08], [1, 0]);
  const peticionY = useTransform(prog, [ACTO_2 - 0.02, ACTO_2 + 0.1], [0, -60]);
  const peticionScale = useTransform(prog, [ACTO_2 - 0.02, ACTO_2 + 0.1], [1, 0.9]);
  const peticionBlur = useTransform(prog, [ACTO_2, ACTO_2 + 0.08], ["blur(0px)", "blur(6px)"]);

  // Acto 2: la IA barre la hoja y aparece la ficha
  const escanerTop = useTransform(prog, [ACTO_2, ACTO_2 + 0.12], ["0%", "100%"]);
  const escanerOpacity = useTransform(prog, [ACTO_2 - 0.01, ACTO_2 + 0.01, ACTO_2 + 0.11, ACTO_2 + 0.13], [0, 1, 1, 0]);
  const fichaClip = useTransform(
    prog,
    [ACTO_2, ACTO_2 + 0.12],
    ["inset(0% 0% 100% 0% round 14px)", "inset(0% 0% 0% 0% round 14px)"],
  );
  const b0 = useTransform(prog, [ACTO_2 + 0.1, ACTO_2 + 0.2], [0, 1]);
  const b1 = useTransform(prog, [ACTO_2 + 0.13, ACTO_2 + 0.23], [0, 1]);
  const b2 = useTransform(prog, [ACTO_2 + 0.16, ACTO_2 + 0.26], [0, 1]);

  // Acto 3: la ficha se retira y llega la entrega
  const fichaScale = useTransform(prog, [ACTO_3, ACTO_3 + 0.1], [1, 0.9]);
  const fichaY = useTransform(prog, [ACTO_3, ACTO_3 + 0.1], [0, -8]);
  const fichaRotate = useTransform(prog, [ACTO_3, ACTO_3 + 0.1], [0, -3]);
  const fichaFiltro = useTransform(prog, [ACTO_3, ACTO_3 + 0.1], ["brightness(1)", "brightness(0.93)"]);
  const entregaY = useTransform(prog, [ACTO_3 - 0.02, ACTO_3 + 0.1], ["140%", "0%"]);
  const entregaOpacity = useTransform(prog, [ACTO_3 - 0.03, ACTO_3], [0, 1]);
  const entregaRotate = useTransform(prog, [ACTO_3 - 0.02, ACTO_3 + 0.1], [6, 1.5]);

  // Hilo de progreso en oro
  const hilo = useTransform(prog, [0, 0.95], [0, 1]);

  return (
    <section ref={ref} className="relative h-[360vh]" aria-labelledby="sellos-titulo">
      <FiltroTinta />
      <div className={`${p.seguridad} sticky top-0 flex h-[100svh] flex-col overflow-hidden`}>
        <div className="mx-auto grid h-full w-full max-w-[1200px] grid-rows-[auto_1fr] gap-4 px-4 pt-[84px] pb-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:grid-rows-1 lg:items-center lg:gap-16 lg:py-10">
          {/* Narración */}
          <div className="flex flex-col">
            <Titulo className="hidden lg:block" />
            <h2 id="sellos-titulo" className={`${p.display} text-[28px] text-[var(--tinta)] sm:text-[38px] lg:hidden`}>
              Así se consigue un sello
            </h2>

            {/* Pasos, escritorio */}
            <ol className="relative mt-10 hidden flex-col gap-7 lg:flex">
              <div className="absolute top-4 bottom-4 left-[17px] w-[2px] bg-[var(--tinta)]/10" aria-hidden="true" />
              <motion.div
                className="absolute top-4 bottom-4 left-[17px] w-[2px] origin-top bg-[var(--oro)]"
                style={{ scaleY: hilo }}
                aria-hidden="true"
              />
              {PASOS.map((ps, i) => {
                const activo = i === paso;
                const hecho = i < paso;
                return (
                  <li key={ps.n} className="relative flex gap-5" aria-current={activo ? "step" : undefined}>
                    <span
                      className={`${p.datos} relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 text-[14px] font-bold transition-colors duration-300 ${
                        activo
                          ? "border-[var(--oro)] bg-[var(--oro)] text-[var(--tapa)]"
                          : hecho
                            ? "border-[var(--oro)] bg-[var(--papel)] text-[var(--oro)]"
                            : "border-[var(--tinta)]/20 bg-[var(--papel)] text-[var(--tinta-2)]"
                      }`}
                    >
                      {ps.n}
                    </span>
                    <div className={`flex flex-col pt-1 transition-opacity duration-300 ${activo ? "opacity-100" : "opacity-45"}`}>
                      <span className="text-[19px] font-semibold text-[var(--tinta)]">{ps.titulo}</span>
                      <motion.span
                        className="overflow-hidden text-[15px] leading-snug text-[var(--tinta-2)]"
                        initial={false}
                        animate={{ height: activo ? "auto" : 0, opacity: activo ? 1 : 0, marginTop: activo ? 6 : 0 }}
                        transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                      >
                        {ps.texto}
                      </motion.span>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* Pasos, móvil */}
            <div className="mt-4 lg:hidden">
              <ol className="relative grid grid-cols-3">
                <div className="absolute top-[13px] right-[16.6%] left-[16.6%] h-[2px] bg-[var(--tinta)]/10" aria-hidden="true" />
                <motion.div
                  className="absolute top-[13px] right-[16.6%] left-[16.6%] h-[2px] origin-left bg-[var(--oro)]"
                  style={{ scaleX: hilo }}
                  aria-hidden="true"
                />
                {PASOS.map((ps, i) => {
                  const activo = i === paso;
                  const hecho = i < paso;
                  return (
                    <li key={ps.n} className="relative flex flex-col items-center gap-1.5" aria-current={activo ? "step" : undefined}>
                      <span
                        className={`${p.datos} relative z-10 grid h-7 w-7 place-items-center rounded-full border-2 text-[12px] font-bold transition-colors duration-300 ${
                          activo
                            ? "border-[var(--oro)] bg-[var(--oro)] text-[var(--tapa)]"
                            : hecho
                              ? "border-[var(--oro)] bg-[var(--papel)] text-[var(--oro)]"
                              : "border-[var(--tinta)]/20 bg-[var(--papel)] text-[var(--tinta-2)]"
                        }`}
                      >
                        {ps.n}
                      </span>
                      <span className={`text-center text-[12px] font-semibold text-[var(--tinta)] transition-opacity duration-300 ${activo ? "opacity-100" : "opacity-45"}`}>
                        {ps.corto}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-3 text-[16px] font-semibold text-[var(--tinta)]" aria-live="polite">
                {PASOS[paso].titulo}
              </p>
            </div>
          </div>

          {/* Escenario */}
          <div className="relative mx-auto h-full max-h-[600px] min-h-0 w-full max-w-[560px] lg:h-[560px]">
            {/* Acto 1 */}
            <motion.div
              className="absolute inset-x-0 top-0 h-[70%] origin-top lg:h-[62%]"
              style={{ opacity: peticionOpacity, y: peticionY, scale: peticionScale, filter: peticionBlur }}
            >
              <Peticion
                texto={
                  <>
                    <motion.span>{texto}</motion.span>
                    <span className={s.cursor} aria-hidden="true" />
                    <span className="sr-only">{PETICION}</span>
                  </>
                }
              />
            </motion.div>

            {/* Acto 2 */}
            <motion.div
              className="absolute inset-0 origin-top"
              style={{ clipPath: fichaClip, scale: fichaScale, y: fichaY, rotate: fichaRotate, filter: fichaFiltro }}
            >
              <Ficha barras={[b0, b1, b2]} />
            </motion.div>
            <motion.div
              className="pointer-events-none absolute inset-x-[-12px] h-[3px] rounded-full bg-[var(--oro)] shadow-[0_0_24px_6px_rgba(200,150,58,0.45)]"
              style={{ top: escanerTop, opacity: escanerOpacity }}
              aria-hidden="true"
            />

            {/* Acto 3 */}
            <motion.div
              className={`${s.entregaAlto} absolute inset-x-0 bottom-0`}
              style={{ y: entregaY, rotate: entregaRotate, opacity: entregaOpacity }}
            >
              <motion.div
                className="relative h-full"
                animate={sellado ? { y: [0, 5, 0] } : { y: 0 }}
                transition={{ duration: 0.22, delay: sellado ? 0.12 : 0 }}
              >
                <Entrega />
                <motion.div
                  className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6"
                  initial={false}
                  animate={sellado ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                  transition={{ duration: 0.45, delay: sellado ? 0.45 : 0, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <Comentario />
                </motion.div>
                <motion.div
                  className={`${s.selloPos} pointer-events-none`}
                  initial={false}
                  animate={
                    sellado
                      ? { scale: 1, opacity: 0.9, rotate: -11, filter: "blur(0px)" }
                      : { scale: 2.3, opacity: 0, rotate: -24, filter: "blur(4px)" }
                  }
                  transition={
                    sellado
                      ? { type: "spring", stiffness: 520, damping: 19, mass: 0.9 }
                      : { duration: 0.2 }
                  }
                >
                  <SelloGrande />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Versión estática ───────────────────────── */

function Estatica() {
  return (
    <section className={`${p.seguridad} px-4 py-20 sm:px-8`} aria-labelledby="sellos-titulo-estatico">
      <FiltroTinta />
      <div className="mx-auto max-w-[1200px]">
        <h2 id="sellos-titulo-estatico" className={`${p.display} text-[34px] text-[var(--tinta)] sm:text-[46px]`}>
          Así se consigue un sello
        </h2>
        <p className="mt-3 max-w-[52ch] text-[16px] text-[var(--tinta-2)]">
          Un reto real, de la petición de la empresa al pasaporte del estudiante. La IA prepara; decide una persona.
        </p>
        <ol className="mt-10 grid gap-10 lg:grid-cols-3 lg:gap-6">
          {PASOS.map((ps, i) => (
            <li key={ps.n} className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className={`${p.datos} grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--oro)] text-[13px] font-bold text-[var(--tapa)]`}>
                  {ps.n}
                </span>
                <div className="flex flex-col">
                  <span className="text-[17px] font-semibold text-[var(--tinta)]">{ps.titulo}</span>
                  <span className="text-[14px] text-[var(--tinta-2)]">{ps.texto}</span>
                </div>
              </div>
              <div className="relative h-[470px]">
                {i === 0 && <Peticion texto={PETICION} />}
                {i === 1 && <Ficha />}
                {i === 2 && (
                  <>
                    <Entrega />
                    <div className="absolute inset-x-4 bottom-4">
                      <Comentario />
                    </div>
                    <div className={`${s.selloPos} opacity-90`} style={{ transform: "rotate(-11deg)" }}>
                      <SelloGrande />
                    </div>
                  </>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function SeccionSellos() {
  const reducir = useReducedMotion();
  return reducir ? <Estatica /> : <Animada />;
}
