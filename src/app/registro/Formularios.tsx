"use client";
// Dueño: perfil 1. Formularios de registro; la lógica está en actions.ts (servidor).
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registerCompany, registerStudent, type FormState } from "./actions";

const COUNTRIES = ["España", "México", "Colombia"];
const initial: FormState = { error: null };

function Campo({
  label,
  name,
  ayuda,
  ...input
}: { label: string; name: string; ayuda?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold">{label}</span>
      <input id={name} name={name} className="field" {...input} />
      {ayuda && <span className="text-sm text-ink-3">{ayuda}</span>}
    </label>
  );
}

function Pais() {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold">País</span>
      <select id="country" name="country" className="field" required defaultValue="">
        <option value="" disabled>
          Elige tu país
        </option>
        {COUNTRIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </label>
  );
}

function Enviar({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary w-full py-3 text-base sm:w-auto" disabled={pending}>
      {pending ? "Guardando…" : children}
    </button>
  );
}

function Aviso({ state }: { state: FormState }) {
  if (!state.error) return null;
  return (
    <p role="alert" className="rounded-md border border-warn/40 bg-warn/10 px-3 py-2 text-sm text-warn">
      {state.error}
    </p>
  );
}

export function FormEstudiante() {
  const [state, action] = useActionState(registerStudent, initial);
  return (
    <form action={action} className="flex flex-col gap-5">
      <Campo label="Nombre y apellidos" name="name" required autoComplete="name" />
      <Campo label="Email" name="email" type="email" required autoComplete="email" inputMode="email" />
      <div className="grid gap-5 sm:grid-cols-2">
        <Pais />
        <Campo label="Universidad" name="university" required placeholder="Ej.: UNAM, Complutense…" />
      </div>
      <Campo
        label="Qué sabes hacer"
        name="skills"
        placeholder="python, react, análisis de datos"
        ayuda="Separa las competencias con comas."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo label="GitHub (opcional)" name="github" placeholder="github.com/tu-usuario" />
        <Campo label="Portfolio (opcional)" name="portfolio" placeholder="tu-web.com" />
      </div>
      <label className="flex items-start gap-3 rounded-md border border-line bg-bg p-4">
        <input id="consent" name="consent" type="checkbox" required className="mt-1 h-4 w-4 accent-[var(--ink)]" />
        <span className="text-sm text-ink-2">
          <strong className="text-ink">Tus datos son tuyos.</strong> Solo los usamos para conectarte con retos.
          Cumplimos el RGPD y la ley de protección de datos de México.
        </span>
      </label>
      <Aviso state={state} />
      <Enviar>Crear mi pasaporte</Enviar>
    </form>
  );
}

export function FormEmpresa() {
  const [state, action] = useActionState(registerCompany, initial);
  return (
    <form action={action} className="flex flex-col gap-5">
      <Campo label="Empresa" name="name" required autoComplete="organization" />
      <Campo label="Persona de contacto" name="contact_name" required autoComplete="name" />
      <Campo label="Email de trabajo" name="email" type="email" required autoComplete="email" inputMode="email" />
      <Pais />
      <Aviso state={state} />
      <Enviar>Publicar mi primer reto</Enviar>
    </form>
  );
}
