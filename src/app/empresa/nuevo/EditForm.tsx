"use client";

import { useActionState, useState } from "react";
import { saveDraft, type EditState } from "./actions";
import type { Challenge } from "@/lib/types";

// Dueño: perfil 2. Formulario editable del reto generado.
export default function EditForm({ challenge, saved }: { challenge: Challenge; saved: boolean }) {
  const [state, action, pending] = useActionState<EditState, FormData>(saveDraft, {});
  const [weights, setWeights] = useState(challenge.rubric.map((r) => r.weight));
  // Safari no envía el name/value del botón pulsado en una acción de React: se guarda aquí en un campo oculto.
  const [intent, setIntent] = useState("publicar");
  const total = weights.reduce((n, w) => n + (Number(w) || 0), 0);

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="id" value={challenge.id} />
      <input type="hidden" name="intent" value={intent} />

      {challenge.warnings.length > 0 && (
        <div role="note" className="rounded-xl p-5" style={{ background: "#fdf3dc", boxShadow: "inset 0 0 0 1.5px #f59e0b", color: "#14233d" }}>
          <p className="font-bold">Revisa antes de publicar</p>
          <ul className="mt-2 list-disc pl-5 text-[15px]">
            {challenge.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}
      {saved && <p className="font-semibold text-[#00843d]">Borrador guardado.</p>}

      <div className="overflow-hidden rounded-xl bg-white shadow-[0_12px_30px_-12px_rgba(20,35,61,0.25)] ring-1 ring-[#e2e2de]">
        <div className="flex items-center justify-between gap-3 bg-[#14233d] px-5 py-2.5">
          <span className="text-[13px] font-bold text-[#c8963a]">Embarca · tarjeta de embarque</span>
          <span className="rounded bg-[#f4f2ec] px-2 py-0.5 text-xs font-bold text-[#14233d]">Borrador</span>
        </div>
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <Field label="Título" name="title" value={challenge.title} />
        <Field label="Resumen" name="summary" value={challenge.summary} />
        <Field label="Contexto" name="context" value={challenge.context} rows={3} />
        <Field label="Qué hay que hacer" name="task" value={challenge.task} rows={5} />
        <Field label="Perfil buscado" name="profile" value={challenge.profile} rows={2} />
        <Field label="Qué se entrega" name="deliverable" value={challenge.deliverable} rows={2} />
        <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-bold text-[#14233d]">Plazo (días)</span>
            <input type="number" name="duration_days" min={2} max={10} defaultValue={challenge.duration_days} className="field" />
          </label>
          <Field label="Premio sugerido" name="suggested_prize" value={challenge.suggested_prize ?? ""} />
        </div>
      </div>
      </div>

      <div className="flex flex-col gap-4 rounded-xl bg-white p-5 ring-1 ring-[#e2e2de] sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-bold text-[#14233d]">Rúbrica con pesos</h2>
          <span className={`tabular-nums text-sm font-bold ${total === 100 ? "text-[#00843d]" : "text-[#8a5a00]"}`}>Suma {total} / 100</span>
        </div>
        <div className="flex h-2.5 overflow-hidden rounded-full bg-[#eeeeec]" aria-hidden="true">
          {weights.map((w, i) => (
            <span key={i} style={{ width: `${Math.max(0, Number(w) || 0)}%`, background: ["#14233d", "#c8963a", "#0b4ea2", "#3fa34d", "#5f6166"][i % 5] }} />
          ))}
        </div>
        <p className="text-[15px] text-[#5f6166]">Con estos criterios valorarás todas las entregas. La IA no pone nota: la pones tú.</p>
        {challenge.rubric.map((r, i) => (
          <div key={i} className="grid gap-3 border-t border-[#e2e2de] pt-4 sm:grid-cols-[1fr_100px]">
            <Field label="Criterio" name={`rubric_${i}_criterion`} value={r.criterion} />
            <label className="flex flex-col gap-1">
              <span className="text-sm font-bold text-[#14233d]">Peso (%)</span>
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
        <p role="alert" className="rounded-lg p-3 text-[#d21034] ring-1 ring-[#d21034]">
          {state.error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button type="submit" onClick={() => setIntent("publicar")} className="btn btn-primary px-6 py-3 text-base font-bold" disabled={pending}>
          {pending ? "Guardando…" : "Publicar reto"}
        </button>
        <button type="submit" onClick={() => setIntent("guardar")} className="btn px-5 py-3" disabled={pending}>
          Guardar borrador
        </button>
      </div>
    </form>
  );
}

function Field({ label, name, value, rows }: { label: string; name: string; value: string; rows?: number }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-bold text-[#14233d]">{label}</span>
      {rows ? (
        <textarea name={name} defaultValue={value} rows={rows} className="field" />
      ) : (
        <input name={name} defaultValue={value} className="field" />
      )}
    </label>
  );
}
