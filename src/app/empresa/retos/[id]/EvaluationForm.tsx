"use client";
// Dueño: perfil 4. Valoración con deslizadores por criterio + feedback. La nota la pone la empresa.
import { useActionState, useMemo, useState } from "react";
import type { Evaluation, RubricItem } from "@/lib/types";
import { saveEvaluation, type EvalState } from "./actions";

export default function EvaluationForm({
  submissionId,
  rubric,
  existing,
}: {
  submissionId: string;
  rubric: RubricItem[];
  existing: Evaluation | null;
}) {
  const [state, action, pending] = useActionState<EvalState, FormData>(saveEvaluation, {});
  const [scores, setScores] = useState<number[]>(
    rubric.map((r) => existing?.scores.find((x) => x.criterion === r.criterion)?.score ?? 5),
  );

  const weighted = useMemo(() => {
    const w = rubric.reduce((n, r) => n + r.weight, 0);
    return w ? rubric.reduce((n, r, i) => n + scores[i]! * r.weight, 0) / w : 0;
  }, [rubric, scores]);

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="submission_id" value={submissionId} />

      <div className="flex items-end justify-between gap-3 border-b border-line pb-4">
        <div className="flex flex-col">
          <span className="eyebrow">Tu valoración</span>
          <span className="text-sm text-ink-3">Nota ponderada con la rúbrica</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-display text-5xl font-bold text-ink tabular">{weighted.toFixed(1)}</span>
          <span className="font-mono text-sm text-ink-3">/10</span>
        </div>
      </div>

      {rubric.map((r, i) => (
        <label key={r.criterion} htmlFor={`score_${submissionId}_${i}`} className="flex flex-col gap-2">
          <span className="flex items-baseline justify-between gap-2">
            <span className="font-semibold">
              {r.criterion} <span className="font-mono text-xs font-normal text-ink-3">{r.weight}%</span>
            </span>
            <span className="font-display text-2xl font-bold text-gold tabular">{scores[i]}</span>
          </span>
          <input
            id={`score_${submissionId}_${i}`}
            name={`score_${i}`}
            type="range"
            min={0}
            max={10}
            step={0.5}
            value={scores[i]}
            onChange={(e) => setScores((prev) => prev.map((v, k) => (k === i ? Number(e.target.value) : v)))}
            className="w-full accent-[var(--gold)]"
          />
          <span className="text-xs text-ink-3">{r.description}</span>
        </label>
      ))}

      <label htmlFor={`feedback_${submissionId}`} className="flex flex-col gap-1">
        <span className="font-semibold">
          Feedback <span className="text-sm font-normal text-ink-3">· lo verá en su pasaporte</span>
        </span>
        <textarea
          id={`feedback_${submissionId}`}
          name="feedback"
          required
          rows={3}
          defaultValue={existing?.feedback ?? ""}
          placeholder="Qué ha hecho bien y qué le faltó."
          className="field"
        />
      </label>

      <button type="submit" className="btn btn-primary w-full py-3 text-base" disabled={pending}>
        {pending ? "Sellando…" : existing ? "Actualizar el sello" : "Sellar valoración"}
      </button>
      {state.error && <p className="text-sm text-warn">{state.error}</p>}
      {state.ok && !pending && <p className="text-sm text-ok">Sellado. Ya está en su pasaporte.</p>}
    </form>
  );
}
