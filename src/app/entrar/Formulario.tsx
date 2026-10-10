"use client";
// Dueño: perfil 1. Formulario de «Entrar».
import Link from "next/link";
import { useActionState } from "react";
import { entrar, type EntrarState } from "./actions";

// `compacto`: email y botón en una fila, para la barra de arriba del registro.
export default function Formulario({ compacto = false }: { compacto?: boolean }) {
  const [state, action, pending] = useActionState<EntrarState, FormData>(entrar, { error: null, email: "" });
  return (
    <form action={action} className={compacto ? "flex flex-col gap-2" : "flex flex-col gap-4"}>
      <div className={compacto ? "flex flex-col gap-2 sm:flex-row" : "contents"}>
      <label className={compacto ? "flex min-w-0 flex-1 flex-col" : "flex flex-col gap-1.5"}>
        <span className={compacto ? "sr-only" : "text-sm font-semibold text-ink"}>Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          defaultValue={state.email}
          placeholder="tu@email.com"
          className={compacto ? "field !py-2.5" : "field !py-3 !text-base"}
        />
      </label>
      {compacto && (
        <button type="submit" disabled={pending} className="btn btn-primary !py-2.5">
          {pending ? "Entrando…" : "Entrar"}
        </button>
      )}
      </div>
      {state.error && (
        <p role="alert" className="rounded-md bg-red/10 px-3 py-2 text-sm font-medium text-red">
          {state.error}{" "}
          {state.error.startsWith("No hay") && (
            <>
              <Link href="/registro?rol=estudiante" className="underline">Crear mi pasaporte</Link> o{" "}
              <Link href="/registro?rol=empresa" className="underline">dar de alta mi empresa</Link>.
            </>
          )}
        </p>
      )}
      {!compacto && (
        <button type="submit" disabled={pending} className="btn btn-primary !py-3 !text-base">
          {pending ? "Entrando…" : "Entrar"}
        </button>
      )}
    </form>
  );
}
