"use client";
// Dueño: perfil 1. Formulario de «Entrar».
import Link from "next/link";
import { useActionState } from "react";
import { entrar, type EntrarState } from "./actions";

export default function Formulario() {
  const [state, action, pending] = useActionState<EntrarState, FormData>(entrar, { error: null, email: "" });
  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-ink">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          defaultValue={state.email}
          placeholder="tu@email.com"
          className="field !py-3 !text-base"
        />
      </label>
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
      <button type="submit" disabled={pending} className="btn btn-primary !py-3 !text-base">
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
