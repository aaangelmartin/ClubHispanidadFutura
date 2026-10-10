"use client";
// Dueño: perfil 4. Valoración con deslizadores por criterio + comentario. La nota la pone la empresa.
import { useActionState, useMemo, useState } from "react";
import type { Evaluation, RubricItem } from "@/lib/types";
import { C, Nota, colorNota } from "@/components/embarca";
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
  const tono = colorNota(weighted);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="submission_id" value={submissionId} />

      <div className="flex flex-col">
        <span className="text-lg font-bold" style={{ color: C.marino }}>
          Tu valoración
        </span>
        <span className="text-sm" style={{ color: C.texto2 }}>
          De 0 a 10 por criterio. Llega a su pasaporte.
        </span>
      </div>

      {rubric.map((r, i) => (
        <label key={r.criterion} htmlFor={`score_${submissionId}_${i}`} className="flex flex-col gap-1.5">
          <span className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 flex-col">
              <span className="text-sm font-bold" style={{ color: C.marino }}>
                {r.criterion}
              </span>
              <span className="text-xs" style={{ color: C.texto2 }}>
                Peso {r.weight} %
              </span>
            </span>
            <Nota valor={scores[i]!} size="sm" />
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
            className="w-full accent-[#14233d]"
          />
        </label>
      ))}

      <div
        className="flex items-center justify-between gap-3 rounded-lg px-4 py-3"
        style={{ background: `${tono.bg}1f`, boxShadow: `inset 0 0 0 1.5px ${tono.bg}` }}
      >
        <span className="flex flex-col">
          <span className="text-sm font-bold" style={{ color: C.marino }}>
            Nota final ponderada
          </span>
          <span className="text-xs" style={{ color: C.texto2 }}>
            Calculada con los pesos de la rúbrica
          </span>
        </span>
        <Nota valor={Math.round(weighted * 10) / 10} />
      </div>

      <label htmlFor={`feedback_${submissionId}`} className="flex flex-col gap-1">
        <span className="text-sm font-bold" style={{ color: C.marino }}>
          Comentario para el estudiante
        </span>
        <textarea
          id={`feedback_${submissionId}`}
          name="feedback"
          required
          rows={4}
          defaultValue={existing?.feedback ?? ""}
          placeholder="Qué ha hecho bien y qué le faltó."
          className="field"
        />
      </label>

      <button type="submit" className="btn btn-primary w-full py-3 text-base font-bold" disabled={pending}>
        {pending ? "Guardando…" : existing ? "Actualizar valoración" : "Guardar valoración"}
      </button>
      {state.error && (
        <p className="text-sm" style={{ color: C.rojo }}>
          {state.error}
        </p>
      )}
      {state.ok && !pending && (
        <p className="text-sm font-semibold" style={{ color: C.verde }}>
          Guardada. El estudiante la verá en su pasaporte.
        </p>
      )}
    </form>
  );
}
