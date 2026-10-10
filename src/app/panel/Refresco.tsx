"use client";
// Dueño: perfil 1. Vuelve a pedir los datos del panel cada 20 s sin recargar la página
// y muestra el indicador «En directo» y la hora de Madrid.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import s from "./panel.module.css";

const hora = (d: Date) => d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" });

export default function Refresco({ segundos = 20, caido = false }: { segundos?: number; caido?: boolean }) {
  const router = useRouter();
  const [restan, setRestan] = useState(segundos);
  const [ahora, setAhora] = useState<Date | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setAhora(new Date());
      setRestan((r) => {
        if (r <= 1) {
          router.refresh();
          return segundos;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [router, segundos]);

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      {caido ? (
        <span className="inline-flex items-center gap-2.5 rounded-md border border-[#f59e0b]/60 bg-[#f59e0b]/10 px-3 py-1.5 text-sm font-bold text-[#f59e0b]">
          <span className="h-2 w-2 rounded-full bg-[#f59e0b]" aria-hidden="true" />
          Reconectando · otro intento en {String(restan).padStart(2, "0")} s
        </span>
      ) : (
        <span
          className="inline-flex items-center gap-2.5 rounded-md border border-[#3fd07a]/50 bg-[#00843d]/25 px-3 py-1.5 text-sm font-bold text-[#3fd07a]"
          title={`Se actualiza cada ${segundos} s`}
        >
          <span className={s.vivo} aria-hidden="true" />
          En directo
        </span>
      )}
      <span className="flex flex-col items-end leading-none">
        <span className="font-[family-name:var(--font-b612)] text-4xl font-bold tabular-nums text-[#c8963a] md:text-5xl" suppressHydrationWarning>
          {ahora ? hora(ahora) : "--:--"}
        </span>
        <span className="mt-1.5 text-xs text-white/55">Hora de Madrid</span>
      </span>
    </div>
  );
}
