"use client";
// Dueño: perfil 1. Piezas interactivas de la landing: la IA "escribiendo" el reto y la ventana que se inclina.
import { useEffect, useRef, useState } from "react";
import t from "./tech.module.css";

// Escribe el texto carácter a carácter, espera y vuelve a empezar.
export function Escribir({ texto, velocidad = 14 }: { texto: string; velocidad?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(texto.length);
      return;
    }
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      i += 2;
      setN(Math.min(i, texto.length));
      timer = i >= texto.length ? setTimeout(() => ((i = 0), tick()), 3500) : setTimeout(tick, velocidad);
    };
    timer = setTimeout(tick, 900);
    return () => clearTimeout(timer);
  }, [texto, velocidad]);

  const visible = texto.slice(0, n);
  return (
    <pre className={`whitespace-pre-wrap break-words font-mono text-[12.5px] leading-relaxed ${t.caret}`}>
      {visible.split(/("[^"]*")/g).map((parte, i) =>
        parte.startsWith('"') ? (
          <span key={i} className={parte.endsWith('":') || /^"[a-z_]+"$/.test(parte) ? "text-[#8fb3ff]" : "text-[#f2c879]"}>
            {parte}
          </span>
        ) : (
          <span key={i} className="text-[#8a95a8]">
            {parte}
          </span>
        ),
      )}
    </pre>
  );
}

export function Inclinar({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mover = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${x * 6}deg`);
    el.style.setProperty("--rx", `${-y * 6}deg`);
  };
  const salir = () => {
    ref.current?.style.setProperty("--ry", "0deg");
    ref.current?.style.setProperty("--rx", "0deg");
  };
  return (
    <div ref={ref} onMouseMove={mover} onMouseLeave={salir} className={`${t.tilt} ${className}`}>
      {children}
    </div>
  );
}
