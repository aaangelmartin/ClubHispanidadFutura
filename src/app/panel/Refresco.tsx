"use client";
// Dueño: perfil 1. Vuelve a pedir los datos del panel cada 20 s sin recargar la página
// y muestra el indicador «En directo» con la cuenta atrás y la hora local.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import s from "./panel.module.css";

const hora = (d: Date) =>
  d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Europe/Madrid" });

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
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-[family-name:var(--datos)] text-sm text-white/60 md:text-base">
      {caido ? (
        <span className="inline-flex items-center gap-3 rounded-full border border-[var(--oro)]/50 bg-[var(--oro)]/10 px-4 py-1.5 font-bold tracking-[0.18em] text-[var(--oro)] uppercase">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--oro)]" aria-hidden="true" />
          Reconectando
        </span>
      ) : (
        <span className="inline-flex items-center gap-3 rounded-full border border-[#3ecf8e]/40 bg-[#3ecf8e]/10 px-4 py-1.5 font-bold tracking-[0.18em] text-[#3ecf8e] uppercase">
          <span className={s.vivo} aria-hidden="true" />
          En directo
        </span>
      )}
      <span aria-live="off">
        {caido ? "nuevo intento cada" : "se actualiza cada"} {segundos} s · <span className="tabular-nums text-white/80">{String(restan).padStart(2, "0")} s</span>
      </span>
      <span className="tabular-nums text-[var(--oro)]" suppressHydrationWarning>
        {ahora ? `${hora(ahora)} Madrid` : " "}
      </span>
    </div>
  );
}
