"use client";
// Dueño: perfil 1. Piezas con movimiento de la landing: aparición al hacer scroll, recorrido fijo
// por escenas, texto que se ilumina con el scroll y contador que sube.
import { useEffect, useRef, useState } from "react";
import s from "./landing.module.css";

function useEnPantalla<T extends Element>(umbral = 0.2) {
  const ref = useRef<T>(null);
  const [visto, setVisto] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisto(true);
          io.disconnect();
        }
      },
      { threshold: umbral },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [umbral]);
  return [ref, visto] as const;
}

export function Revelar({
  children,
  retraso = 0,
  className = "",
}: {
  children: React.ReactNode;
  retraso?: number;
  className?: string;
}) {
  const [ref, visto] = useEnPantalla<HTMLDivElement>(0.15);
  return (
    <div
      ref={ref}
      className={`${s.reveal} ${visto ? s.in : ""} ${className}`}
      style={{ transitionDelay: `${retraso}ms` }}
    >
      {children}
    </div>
  );
}

// Contenedor que marca .in al entrar en pantalla (para animaciones CSS internas, como el arco).
export function AlVer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [ref, visto] = useEnPantalla<HTMLDivElement>(0.35);
  return (
    <div ref={ref} className={`${visto ? s.in : ""} ${className}`}>
      {children}
    </div>
  );
}

export function Contador({ hasta }: { hasta: number }) {
  const [ref, visto] = useEnPantalla<HTMLSpanElement>(0.5);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!visto) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(hasta);
      return;
    }
    const inicio = performance.now();
    let raf = 0;
    const paso = (t: number) => {
      const p = Math.min(1, (t - inicio) / 1400);
      setN(Math.round(hasta * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [visto, hasta]);
  return (
    <span ref={ref} className="tabular">
      {n}
    </span>
  );
}

// Progreso 0→1 de un elemento mientras atraviesa la pantalla.
function useProgreso<T extends HTMLElement>(inicio = 0.85, fin = 0.25) {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const calc = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height + vh * (inicio - fin);
      setP(Math.min(1, Math.max(0, (vh * inicio - r.top) / total)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [inicio, fin]);
  return [ref, p] as const;
}

// Las palabras se iluminan una a una al bajar.
export function TextoScroll({ texto, destacadas = [] }: { texto: string; destacadas?: string[] }) {
  const [ref, p] = useProgreso<HTMLParagraphElement>(0.9, 0.35);
  const palabras = texto.split(" ");
  return (
    <p ref={ref} className="font-display text-3xl font-bold leading-tight sm:text-5xl">
      {palabras.map((w, i) => {
        const on = p * palabras.length > i;
        const oro = destacadas.includes(w.replace(/[.,]/g, ""));
        return (
          <span
            key={i}
            className={`transition-colors duration-300 ${on ? (oro ? "text-gold" : "text-paper") : "text-paper/20"}`}
          >
            {w}{" "}
          </span>
        );
      })}
    </p>
  );
}

export type Paso = { quien: string; titulo: string; texto: string };

// Sección alta con un panel fijo: según el scroll cambia la escena de la derecha.
export function Recorrido({ pasos, escenas }: { pasos: Paso[]; escenas: React.ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const calc = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const recorrido = r.height - window.innerHeight;
      const prog = Math.min(1, Math.max(0, -r.top / recorrido));
      setP(prog);
      setActivo(Math.min(pasos.length - 1, Math.floor(prog * pasos.length)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pasos.length]);

  return (
    <div ref={ref} style={{ height: `${pasos.length * 85 + 40}vh` }} className="relative">
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 sm:px-6 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col gap-6">
            <span className="eyebrow">Cómo funciona</span>
            <ol className="flex flex-col gap-1">
              {pasos.map((paso, i) => (
                <li
                  key={i}
                  className={`border-l-2 py-3 pl-5 transition-all duration-500 ${
                    i === activo ? "border-gold opacity-100" : "border-line opacity-35"
                  }`}
                >
                  <span className="font-mono text-xs uppercase tracking-widest text-ink-3">
                    {String(i + 1).padStart(2, "0")} · {paso.quien}
                  </span>
                  <h3 className={`font-bold transition-all duration-500 ${i === activo ? "text-2xl sm:text-3xl" : "text-lg"}`}>
                    {paso.titulo}
                  </h3>
                  <div
                    className={`grid transition-all duration-500 ${i === activo ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <p className="overflow-hidden text-ink-2">{paso.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="h-1 w-full overflow-hidden rounded-full bg-line">
              <div className="h-full bg-gold transition-[width] duration-150" style={{ width: `${p * 100}%` }} />
            </div>
          </div>
          <div className="relative hidden min-h-[420px] md:block">
            <div key={activo} className={`${s.scene} absolute inset-0 flex items-center justify-center`}>
              {escenas[activo]}
            </div>
            <span className="chip absolute bottom-0 left-1/2 -translate-x-1/2">Ejemplo piloto</span>
          </div>
        </div>
      </div>
    </div>
  );
}
