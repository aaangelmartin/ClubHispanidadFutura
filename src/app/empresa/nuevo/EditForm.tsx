"use client";

import { useActionState, useState } from "react";
import { saveDraft, type EditState } from "./actions";
import type { Challenge } from "@/lib/types";

// Dueño: perfil 2. Formulario editable del reto generado.
export default function EditForm({ challenge, saved }: { challenge: Challenge; saved: boolean }) {
  const [state, action, pending] = useActionState<EditState, FormData>(saveDraft, {});
  const [weights, setWeights] = useState(challenge.rubric.map((r) => r.weight));
  const total = weights.reduce((n, w) => n + (Number(w) || 0), 0);

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="id" value={challenge.id} />

      {challenge.warnings.length > 0 && (
        <div role="note" className="card border-gold bg-gold-soft p-5">
          <p className="eyebrow">Avisos de la IA</p>
          <ul className="mt-2 list-disc pl-5">
            {challenge.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}
      {saved && <p className="text-ok">Borrador guardado.</p>}

      <div className="card flex flex-col gap-4 p-6">
        <Field label="Título" name="title" value={challenge.title} />
        <Field label="Resumen" name="summary" value={challenge.summary} />
        <Field label="Contexto" name="context" value={challenge.context} rows={3} />
        <Field label="Qué hay que hacer" name="task" value={challenge.task} rows={5} />
        <Field label="Perfil buscado" name="profile" value={challenge.profile} rows={2} />
        <Field label="Qué se entrega" name="deliverable" value={challenge.deliverable} rows={2} />
        <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
          <label className="flex flex-col gap-1">
            <span className="eyebrow">Plazo (días)</span>
            <input type="number" name="duration_days" min={2} max={10} defaultValue={challenge.duration_days} className="field" />
          </label>
          <Field label="Premio sugerido" name="suggested_prize" value={challenge.suggested_prize ?? ""} />
        </div>
      </div>

      <div className="card flex flex-col gap-4 p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold">Rúbrica</h2>
          <span className={`tabular font-semibold ${total === 100 ? "text-ok" : "text-warn"}`}>Suma {total} / 100</span>
        </div>
        <p className="text-ink-2">Con estos criterios valorarás todas las entregas. La IA no pone nota: la pones tú.</p>
        {challenge.rubric.map((r, i) => (
          <div key={i} className="grid gap-3 border-t border-line pt-4 sm:grid-cols-[1fr_100px]">
            <Field label="Criterio" name={`rubric_${i}_criterion`} value={r.criterion} />
            <label className="flex flex-col gap-1">
              <span className="eyebrow">Peso</span>
              <input
                type="number"
                name={`rubric_${i}_weight`}
                min={0}
                max={100}
                defaultValue={r.weight}
                className="field"
                onChange={(e) => setWeights((w) => w.map((x, j) => (j === i ? Number(e.target.value) : x)))}
              />
            </label>
            <div className="sm:col-span-2">
              <Field label="Qué se mira" name={`rubric_${i}_description`} value={r.description} rows={2} />
            </div>
          </div>
        ))}
      </div>

      {state.error && (
        <p role="alert" className="rounded-md border border-warn p-3 text-warn">
          {state.error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button type="submit" name="intent" value="publicar" className="btn btn-primary" disabled={pending}>
          {pending ? "Guardando…" : "Publicar reto"}
        </button>
        <button type="submit" name="intent" value="guardar" className="btn" disabled={pending}>
          Guardar borrador
        </button>
      </div>
    </form>
  );
}

function Field({ label, name, value, rows }: { label: string; name: string; value: string; rows?: number }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="eyebrow">{label}</span>
      {rows ? (
        <textarea name={name} defaultValue={value} rows={rows} className="field" />
      ) : (
        <input name={name} defaultValue={value} className="field" />
      )}
    </label>
  );
}
