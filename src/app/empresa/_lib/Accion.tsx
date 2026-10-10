"use client";
// Dueño: perfil 4. Botón de una función aún no conectada: responde como si funcionara (aviso de confirmación).
import { useState } from "react";

export function Toast({ texto }: { texto: string | null }) {
  if (!texto) return null;
  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-[#14233d] px-5 py-3 text-sm font-semibold text-[#f3efe6] shadow-2xl ring-1 ring-[#c8963a]"
    >
      <span className="mr-2 text-[#c8963a]">✓</span>
      {texto}
    </div>
  );
}

export default function Accion({
  children,
  hecho,
  className = "btn",
  label,
}: {
  children: React.ReactNode;
  hecho: string;
  className?: string;
  label?: string;
}) {
  const [toast, setToast] = useState<string | null>(null);
  return (
    <>
      <button
        type="button"
        aria-label={label}
        title={label}
        className={className}
        onClick={() => {
          setToast(hecho);
          setTimeout(() => setToast(null), 2600);
        }}
      >
        {children}
      </button>
      <Toast texto={toast} />
    </>
  );
}
