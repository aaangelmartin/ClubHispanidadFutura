"use client";
// Dueño: perfil 1. Cifra del panel de llegadas: cada dígito es una casilla split-flap que gira al cambiar.
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import s from "./panel.module.css";

function Casilla({ caracter, retraso, quieto, tenue }: { caracter: string; retraso: number; quieto: boolean; tenue: boolean }) {
  return (
    <span className={`${s.casilla} h-[1.32em] w-[0.86em] transition-colors duration-500`} style={tenue ? { color: "rgba(200,150,58,0.3)" } : undefined}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={caracter}
          className="col-start-1 row-start-1 block leading-none"
          style={{ transformOrigin: "50% 50%", backfaceVisibility: "hidden" }}
          initial={quieto ? false : { rotateX: -90, opacity: 0.2 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={quieto ? undefined : { rotateX: 90, opacity: 0.2 }}
          transition={{ duration: 0.32, delay: retraso, ease: [0.3, 0.7, 0.4, 1] }}
        >
          {caracter}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/**
 * Muestra `valor` con al menos `minimo` casillas. Al montarse gira desde ceros hasta el valor real,
 * y cada vez que el valor cambia (router.refresh) giran solo las casillas que cambian.
 */
export default function Digitos({ valor, minimo = 3, className = "" }: { valor: number; minimo?: number; className?: string }) {
  const quieto = useReducedMotion() ?? false;
  const [mostrado, setMostrado] = useState<number | null>(null);

  useEffect(() => {
    if (quieto) {
      setMostrado(valor);
      return;
    }
    const t = setTimeout(() => setMostrado(valor), 250);
    return () => clearTimeout(t);
  }, [valor, quieto]);

  const ancho = Math.max(minimo, String(valor).length);
  const texto = (mostrado === null ? "0".repeat(ancho) : String(mostrado)).padStart(ancho, "0");

  return (
    <span className={`inline-flex gap-[0.08em] tabular-nums ${className}`} aria-label={String(valor)} role="img">
      {texto.split("").map((c, i) => (
        <Casilla key={i} caracter={c} retraso={quieto ? 0 : i * 0.07} quieto={quieto} tenue={i < ancho - String(valor).length && mostrado !== null} />
      ))}
    </span>
  );
}
