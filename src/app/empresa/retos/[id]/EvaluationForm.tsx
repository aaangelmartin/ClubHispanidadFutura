"use client";
// Dueño: perfil 4. Formulario de valoración: nota por criterio + feedback. La nota la pone la empresa.
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
  const [scores, setScores] = useState<string[]>(
    rubric.map((r) => {
      const s = existing?.scores.find((x) => x.criterion === r.criterion);
      return s ? String(s.score) : "";
    }),
  );

  const weighted = useMemo(() => {
    let total = 0;
    let weights = 0;
    rubric.forEach((r, i) => {
      const n = Number(scores[i]);
      if (scores[i] === "" || Number.isNaN(n)) return;
      total += n * r.weight;
      weights += r.weight;
    });
    return weights ? (total / weights).toFixed(1) : null;
  }, [rubric, scores]);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="submission_id" value={submissionId} />
      <div className="grid gap-3 sm:grid-cols-2">
        {rubric.map((r, i) => (
          <label key={r.criterion} htmlFor={`score_${submissionId}_${i}`} className="flex flex-col gap-1">
            <span className="flex items-baseline justify-between gap-2 text-sm">
              <b>{r.criterion}</b>
              <span className="font-mono text-xs text-ink-3">{r.weight}%</span>
            </span>
            <span className="text-xs text-ink-3">{r.description}</span>
            <input
              id={`score_${submissionId}_${i}`}
              name={`score_${i}`}
              type="number"
              min={0}
              max={10}
              step={0.5}
              required
              placeholder="0–10"
              className="field tabular"
              value={scores[i]}
              onChange={(e) => setScores((prev) => prev.map((v, k) => (k === i ? e.target.value : v)))}
            />
          </label>
        ))}
      </div>
      <label htmlFor={`feedback_${submissionId}`} className="flex flex-col gap-1">
        <span className="text-sm">
          <b>Feedback para el estudiante</b> <span className="text-ink-3">(lo verá en su pasaporte)</span>
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
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Guardando…" : existing ? "Actualizar valoración" : "Guardar valoración"}
        </button>
        {weighted && (
          <span className="font-mono text-sm text-ink-2 tabular">
            Nota ponderada: <b className="text-ink">{weighted}</b> / 10
          </span>
        )}
        {state.error && <span className="text-sm text-warn">{state.error}</span>}
        {state.ok && !pending && <span className="text-sm text-ok">Guardada. Ya está en su pasaporte.</span>}
      </div>
    </form>
  );
}
