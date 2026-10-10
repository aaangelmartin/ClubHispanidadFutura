"use client";

import { useActionState } from "react";
import { generateDraft, type GenerateState } from "./actions";

// Dueño: perfil 2.
const PLACEHOLDER =
  "Ejemplo: Somos una tienda online de cerámica con ventas en España y Colombia. Queremos entender por qué baja la conversión en móvil. Buscamos a alguien junior con ojo para datos y UX que nos proponga mejoras concretas…";

export default function GenerateForm() {
  const [state, action, pending] = useActionState<GenerateState, FormData>(generateDraft, {});

  return (
    <form action={action} className="card flex flex-col gap-4 p-6">
      <label htmlFor="description" className="font-display text-2xl font-bold">
        ¿Qué necesitas resolver y qué perfil buscas?
      </label>
      <textarea
        id="description"
        name="description"
        required
        rows={8}
        defaultValue={state.description}
        placeholder={PLACEHOLDER}
        readOnly={pending}
        className="field text-lg"
      />
      {state.error && (
        <p role="alert" className="rounded-md border border-warn p-3 text-warn">
          {state.error}
        </p>
      )}
      <div className="flex items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Diseñando tu reto…" : state.error ? "Reintentar" : "Generar reto con IA"}
        </button>
        {pending && (
          <span className="text-ink-2" aria-live="polite">
            La IA está definiendo el reto, la entrega y la rúbrica. Tarda unos segundos.
          </span>
        )}
      </div>
    </form>
  );
}
