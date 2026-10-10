"use client";
// Dueño: perfil 4. Resumen de la IA de una entrega. Si no existe, lo pide al servidor al montarse.
import { useEffect, useState } from "react";
import type { AiSummary } from "@/lib/types";
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
    <div className="flex flex-col gap-3 rounded-md border border-line bg-bg p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow">Resumen de la IA</span>
        <span className="text-xs text-ink-3">La IA resume, tú decides.</span>
      </div>

      {!summary && !error && <p className="animate-pulse text-sm text-ink-2">Resumiendo la entrega frente a la rúbrica…</p>}
      {error && (
        <div className="flex items-center gap-3 text-sm text-warn">
          No se ha podido generar el resumen.
          <button type="button" className="btn" onClick={() => setAttempt((a) => a + 1)}>
            Reintentar
          </button>
        </div>
      )}

      {summary && (
        <>
          <p className="text-ink">{summary.what_it_does}</p>
          <ul className="flex flex-col gap-2">
            {summary.by_criterion.map((c) => (
              <li key={c.criterion} className="text-sm">
                <b className="text-ink">{c.criterion}:</b> <span className="text-ink-2">{c.observations}</span>
              </li>
            ))}
          </ul>
          <div className="grid gap-4 sm:grid-cols-2">
            {summary.strengths.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-3">Puntos fuertes</span>
                <ul className="list-disc pl-5 text-sm text-ink-2">
                  {summary.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {summary.questions_for_reviewer.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-3">Para revisar tú</span>
                <ul className="list-disc pl-5 text-sm text-ink-2">
                  {summary.questions_for_reviewer.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
