"use client";

import { useActionState } from "react";
import { generateDraft, type GenerateState } from "./actions";

// Dueño: perfil 2.
const PLACEHOLDER =
  "Ejemplo: Somos una tienda online de cerámica con ventas en España y Colombia. Queremos entender por qué baja la conversión en móvil. Buscamos a alguien junior con ojo para datos y UX que nos proponga mejoras concretas…";

export default function GenerateForm() {
  const [state, action, pending] = useActionState<GenerateState, FormData>(generateDraft, {});

  return (
    <form action={action} className="flex flex-col gap-4 rounded-xl bg-white p-5 ring-1 ring-[#e2e2de] sm:p-6">
      <label htmlFor="description" className="text-xl font-bold text-[#14233d]">
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
        <p role="alert" className="rounded-lg p-3 text-[#d21034] ring-1 ring-[#d21034]">
          {state.error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary px-5 py-3 font-bold" disabled={pending}>
          {pending ? "Diseñando tu reto…" : state.error ? "Reintentar" : "Generar reto con IA"}
        </button>
        {pending && (
          <span className="text-sm text-[#5f6166]" aria-live="polite">
            La IA está definiendo el reto, la entrega y la rúbrica. Tarda unos segundos.
          </span>
        )}
      </div>
      <p className="text-sm text-[#5f6166]">La IA prepara un borrador: título, entrega y rúbrica. Tú lo revisas y decides si se publica.</p>
    </form>
  );
}
