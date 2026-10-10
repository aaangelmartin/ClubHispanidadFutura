"use client";
// Dueño: perfil 1. Portada: titular, llamadas a la acción y el pasaporte de talento como protagonista.
// El pasaporte se inclina con el ratón y, al bajar, sube más despacio, se endereza y crece un poco.
import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import Pasaporte from "./Pasaporte";
import p from "./pasaporte.module.css";
import h from "./hero.module.css";

const EASE = [0.2, 0.7, 0.2, 1] as const;
const MUELLE = { stiffness: 260, damping: 26 };

const LINEAS = [
  { texto: "El CV dice lo que hiciste.", suave: true },
  { texto: "Aquí demuestras", suave: false },
  { texto: "lo que sabes hacer.", suave: false },
];

export default function Hero({ registrados }: { registrados?: number | null }) {
  const quieto = useReducedMotion() ?? false;
  const seccion = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: seccion, offset: ["start start", "end start"] });
  const libroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const libroGiro = useTransform(scrollYProgress, [0, 0.6], [-4, 0]);
  const libroEscala = useTransform(scrollYProgress, [0, 0.6], [1, 1.06]);
  const libroTumbado = useTransform(scrollYProgress, [0, 0.6], [7, 0]);
  const textoY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  // Inclinación con el ratón
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, MUELLE);
  const sy = useSpring(my, MUELLE);
  const inclinaY = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const inclinaX = useTransform(sy, [-0.5, 0.5], [7, -7]);
  const rotaX = useTransform(() => libroTumbado.get() + inclinaX.get());

  function mover(e: React.PointerEvent<HTMLElement>) {
    if (quieto || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function soltar() {
    mx.set(0);
    my.set(0);
  }

  const hay = typeof registrados === "number" && registrados > 0;

  const aparece = (retraso: number) =>
    quieto
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: EASE, delay: retraso },
        };

  return (
    <section
      ref={seccion}
      onPointerMove={mover}
      onPointerLeave={soltar}
      className={`${p.tapa} relative isolate overflow-hidden`}
    >
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 pb-20 pt-10 sm:px-8 lg:min-h-[calc(100svh-60px)] lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16 lg:py-14">
        <motion.div style={quieto ? undefined : { y: textoY }} className="max-w-[640px]">
          <h1 className={h.titular}>
            {LINEAS.map((l, i) => (
              <span key={l.texto} className={h.mascara}>
                <motion.span
                  className={`${h.linea} ${l.suave ? h.titularSuave : ""}`}
                  initial={quieto ? false : { y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.15 + i * 0.12 }}
                >
                  {i === 2 ? (
                    <>
                      lo que <span className="text-[var(--oro)]">sabes hacer.</span>
                    </>
                  ) : (
                    l.texto
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p {...aparece(0.6)} className="mt-7 max-w-[34rem] text-[17px] leading-relaxed text-[#f3efe6]/75 sm:text-lg">
            Empresas de España y Colombia publican retos reales. Los resuelves en pocos días, la empresa valora tu entrega y
            esa valoración queda sellada en tu pasaporte de talento, ganes o no. La IA prepara el reto; decide una persona.
          </motion.p>

          <motion.div {...aparece(0.75)} className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/registro?rol=estudiante"
              className={`${p.boton} inline-flex items-center rounded-full bg-[var(--oro)] px-5 sm:px-7 py-3.5 text-[15px] font-semibold text-[var(--tapa)] shadow-[0_10px_30px_-10px_rgba(200,150,58,0.7)] hover:bg-[#d6a548]`}
            >
              Crear mi pasaporte
            </Link>
            <Link
              href="/registro?rol=empresa"
              className={`${p.boton} inline-flex items-center rounded-full px-5 sm:px-7 py-3.5 text-[15px] font-semibold text-[#f3efe6] ring-1 ring-inset ring-white/25 hover:bg-white/5 hover:ring-white/45`}
            >
              Publicar un reto
            </Link>
          </motion.div>

          <motion.p {...aparece(0.9)} className={`${p.datos} mt-6 text-[12.5px] leading-relaxed text-[#f3efe6]/60`}>
            {hay ? (
              <Link href="/panel" className="underline decoration-[var(--oro)]/60 underline-offset-4 transition-colors hover:text-[#f3efe6]">
                {registrados} {registrados === 1 ? "estudiante ya tiene" : "estudiantes ya tienen"} su pasaporte
              </Link>
            ) : (
              "Gratis para estudiantes. Piloto de 90 días entre España y Colombia."
            )}
          </motion.p>
        </motion.div>

        <div className={`${h.huecoLibro} ${h.escena} mx-auto`}>
          <motion.div
            style={
              quieto
                ? { rotate: -3 }
                : { y: libroY, rotate: libroGiro, scale: libroEscala, rotateX: rotaX, rotateY: inclinaY, transformStyle: "preserve-3d" }
            }
          >
            <Pasaporte />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
