"use client";
// Dueño: perfil 4. Resumen de la IA de una entrega. Si no existe, lo pide al servidor al montarse.
// La IA solo resume: no pone nota ni ordena.
import { useEffect, useState } from "react";
import type { AiSummary } from "@/lib/types";
import { C } from "@/components/embarca";
import { summarizeAction } from "./actions";

export default function AiSummaryBlock({ submissionId, initial }: { submissionId: string; initial: AiSummary | null }) {
  const [summary, setSummary] = useState<AiSummary | null>(initial);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (summary) return;
    let cancelled = false;
    setError(false);
    summarizeAction(submissionId)
      .then((s) => !cancelled && setSummary(s))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [submissionId, summary, attempt]);

  return (
    <div className="flex flex-col gap-3 rounded-xl p-5" style={{ background: "#eef3fa", boxShadow: `inset 0 0 0 1px #c9d8ee` }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-bold" style={{ color: C.azul }}>
          Resumen de la IA
        </span>
        <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold" style={{ color: C.azul, boxShadow: `inset 0 0 0 1px #c9d8ee` }}>
          Sin nota · sin orden
        </span>
      </div>

      {!summary && !error && (
        <p className="animate-pulse text-sm" style={{ color: C.texto2 }}>
          Resumiendo la entrega frente a la rúbrica…
        </p>
      )}
      {error && (
        <div className="flex flex-wrap items-center gap-3 text-sm" style={{ color: C.rojo }}>
          El resumen de la IA no está disponible ahora.
          <button type="button" className="btn" onClick={() => setAttempt((a) => a + 1)}>
            Reintentar
          </button>
        </div>
      )}

      {summary && (
        <>
          <p className="text-[15px] leading-relaxed" style={{ color: C.marino }}>
            {summary.what_it_does}
          </p>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold" style={{ color: C.marino }}>
              Por criterio
            </span>
            <ul className="flex flex-col gap-1.5">
              {summary.by_criterion.map((c) => (
                <li key={c.criterion} className="text-sm leading-snug">
                  <b style={{ color: C.marino }}>{c.criterion}:</b> <span style={{ color: C.texto2 }}>{c.observations}</span>
                </li>
              ))}
            </ul>
          </div>
          {summary.strengths.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold" style={{ color: C.marino }}>
                Puntos fuertes
              </span>
              <ul className="list-disc pl-5 text-sm leading-snug" style={{ color: C.texto2 }}>
                {summary.strengths.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {summary.questions_for_reviewer.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold" style={{ color: C.marino }}>
                Para revisar tú
              </span>
              <ul className="list-disc pl-5 text-sm leading-snug" style={{ color: C.texto2 }}>
                {summary.questions_for_reviewer.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-xs" style={{ color: C.texto2 }}>
            La IA resume para ayudarte a leer. La nota la pones tú.
          </p>
        </>
      )}
    </div>
  );
}
