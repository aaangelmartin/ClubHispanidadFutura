"use client";
// Dueño: perfil 4. Campana de notificaciones de la empresa (contenido de ejemplo).
import Link from "next/link";
import { useState } from "react";

const AVISOS = [
  { t: "Valeria Ortiz ha entregado en «Rediseño del flujo de devoluciones»", h: "hace 2 h", href: "/empresa/retos/33333333-3333-4333-8333-000000000003", nuevo: true },
  { t: "Diego Hernández ha entregado en «Rediseño del flujo de devoluciones»", h: "hace 1 día", href: "/empresa/retos/33333333-3333-4333-8333-000000000003", nuevo: true },
  { t: "Lucía Fernández ha respondido a tu mensaje", h: "hace 1 día", href: "/empresa/mensajes", nuevo: false },
  { t: "Tu reto «¿Por qué abandonan el carrito…?» ya está publicado", h: "hace 3 días", href: "/empresa", nuevo: false },
];

export default function Notificaciones() {
  const [abierto, setAbierto] = useState(false);
  const [leidas, setLeidas] = useState(false);
  const nuevas = leidas ? 0 : AVISOS.filter((a) => a.nuevo).length;
  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`Notificaciones${nuevas ? `, ${nuevas} nuevas` : ""}`}
        onClick={() => setAbierto((v) => !v)}
        className="relative grid h-10 w-10 place-items-center rounded-full bg-white/70 ring-1 ring-black/10 hover:ring-[#c8963a]"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {nuevas > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-[#b23a48] text-[10px] font-bold text-white">
            {nuevas}
          </span>
        )}
      </button>
      {abierto && (
        <div className="absolute right-0 z-50 mt-2 w-[340px] overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/10">
          <div className="flex items-center justify-between border-b border-black/5 px-4 py-3">
            <span className="font-bold">Notificaciones</span>
            <button type="button" className="text-xs text-[#4f5d73] hover:text-[#14233d]" onClick={() => setLeidas(true)}>
              Marcar todo como leído
            </button>
          </div>
          <ul>
            {AVISOS.map((a) => (
              <li key={a.t}>
                <Link href={a.href} onClick={() => setAbierto(false)} className="flex gap-3 px-4 py-3 hover:bg-[#eef1ee]">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.nuevo && !leidas ? "bg-[#c8963a]" : "bg-transparent"}`} />
                  <span className="flex flex-col">
                    <span className="text-sm">{a.t}</span>
                    <span className="text-xs text-[#4f5d73]">{a.h}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
