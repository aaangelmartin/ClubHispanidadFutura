"use client";
import { useActionState } from "react";
import { participar, type Resultado } from "./actions";
export default function Participar({
  id,
  apuntado,
}: {
  id: string;
  apuntado: boolean;
}) {
  const [state, action, pending] = useActionState(
    participar.bind(null, id),
    {} as Resultado,
  );
  return (
    <form action={action} className="mt-4 space-y-4">
      <input
        type="hidden"
        name="modo"
        value={apuntado ? "entregar" : "apuntarse"}
      />
      {apuntado && (
        <>
          <label className="block">
            Enlace a tu solución
            <input
              className="field mt-1"
              type="url"
              name="link"
              placeholder="https://github.com/tu-proyecto"
              maxLength={2048}
              required
              disabled={pending}
            />
            <span className="mt-1 block text-sm text-ink-2">
              Repositorio, documento o Figma. Comprueba que la empresa pueda
              abrirlo.
            </span>
          </label>
          <label className="block">
            ¿Qué has hecho?
            <textarea
              className="field mt-1"
              name="notes"
              rows={5}
              maxLength={10000}
              required
              disabled={pending}
              placeholder="Explica tu solución y cómo responde a la rúbrica."
            />
          </label>
          <p className="text-sm text-ink-2">
            Revisa el enlace: la entrega se envía una sola vez.
          </p>
        </>
      )}
      {state.error && (
        <p role="alert" className="text-warn">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p role="status" className="text-ok">
          {state.ok}
        </p>
      )}
      <button className="btn btn-primary w-full sm:w-auto" disabled={pending}>
        {pending ? "Guardando…" : apuntado ? "Enviar entrega" : "Me apunto"}
      </button>
    </form>
  );
}
