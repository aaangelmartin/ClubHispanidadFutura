"use client";
// Dueño: perfil 1. Formularios de registro de Embarca; la lógica está en actions.ts (servidor).
// Formulario corto a la izquierda y, a la derecha, la vista previa que se rellena mientras se escribe:
// el pasaporte (estudiante) o la tarjeta de embarque de su primer reto (empresa).
import { startTransition, useActionState, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { COUNTRIES } from "@/lib/types";
import { Pasaporte, TarjetaEmbarque, C } from "@/components/embarca";
import r from "./registro.module.css";
import { registerCompany, registerStudent, type FormState } from "./actions";

const initial: FormState = { error: null };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODIGO: Record<string, string> = { España: "ESP", México: "MEX", Colombia: "COL" };
const CIUDAD: Record<string, string> = { España: "MAD", México: "MEX", Colombia: "BOG" };
const SUGERENCIAS = ["Python", "SQL", "React", "Análisis de datos", "Machine learning", "Node.js", "Power BI"];

type Errores = Record<string, string | undefined>;

function listaSkills(s: string) {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

/* ---------- Piezas del formulario ---------- */

function MensajeCampo({ id, error, ayuda }: { id: string; error?: string; ayuda?: string }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence initial={false} mode="wait">
      {error ? (
        <motion.p
          key="error"
          id={id}
          className="text-sm font-semibold text-[var(--red)]"
          initial={reduce ? false : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {error}
        </motion.p>
      ) : ayuda ? (
        <p key="ayuda" id={id} className="text-sm text-[var(--ink-2)]">
          {ayuda}
        </p>
      ) : null}
    </AnimatePresence>
  );
}

function Campo({
  label,
  name,
  ayuda,
  error,
  ...input
}: { label: string; name: string; ayuda?: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const idAyuda = useId();
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={name} className={r.etiqueta}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        className={r.input}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || ayuda ? idAyuda : undefined}
        {...input}
      />
      <MensajeCampo id={idAyuda} error={error} ayuda={ayuda} />
    </div>
  );
}

function Pais({ label, valor, onChange, error }: { label: string; valor: string; onChange: (v: string) => void; error?: string }) {
  return (
    <fieldset className="flex flex-col gap-1.5" aria-invalid={error ? true : undefined}>
      <legend className={`${r.etiqueta} mb-1.5`}>{label}</legend>
      <div className="grid grid-cols-3 gap-2">
        {COUNTRIES.map((c, i) => (
          <label key={c} className={r.pais}>
            <input
              type="radio"
              id={i === 0 ? "country" : undefined}
              name="country"
              value={c}
              required
              checked={valor === c}
              onChange={() => onChange(c)}
            />
            <span>{c}</span>
            <span className={`${r.codigo} hidden sm:inline`}>{CODIGO[c]}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-sm font-semibold text-[var(--red)]">{error}</p>}
    </fieldset>
  );
}

function Consentimiento({ error }: { error?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className={`flex cursor-pointer items-start gap-3 rounded-md border bg-[var(--paper)] p-4 ${error ? "border-[var(--red)]" : "border-[var(--line)]"}`}
      >
        <input id="consent" name="consent" type="checkbox" required className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--ink)]" />
        <span className="text-[15px] leading-snug text-[var(--ink-2)]">
          <strong className="text-[var(--ink)]">Tus datos son tuyos.</strong> Solo los usamos para conectarte con retos.
          Cumplimos el RGPD y la ley de protección de datos de Colombia (Ley 1581 de 2012).
        </span>
      </label>
      {error && <p className="text-sm font-semibold text-[var(--red)]">{error}</p>}
    </div>
  );
}

function Enviar({ pending, enviando, children }: { pending: boolean; enviando: string; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="submit"
      disabled={pending}
      aria-busy={pending || undefined}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      className="btn btn-primary min-h-12 w-full px-6 text-base font-bold sm:w-auto"
    >
      {pending ? enviando : children}
    </motion.button>
  );
}

function AvisoServidor({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <p role="alert" className="rounded-md border border-[var(--red)]/30 bg-[var(--red)]/[0.06] px-4 py-3 text-[15px] font-semibold text-[var(--red)]">
      {error}
    </p>
  );
}

/* Columna derecha: superficie de papel con la vista previa en vivo */
function Vista({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <aside className="flex min-w-0 flex-col gap-6 rounded-xl border border-[var(--line)] bg-[var(--paper)] p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-bold text-[var(--ink)]">{titulo}</h2>
        <span className="hidden shrink-0 items-center gap-2 text-sm text-[var(--ink-2)] sm:inline-flex">
          <span className="h-2 w-2 rounded-full bg-[var(--ok)]" aria-hidden="true" />
          Se actualiza mientras escribes
        </span>
      </div>
      {children}
    </aside>
  );
}

function Pasos({ titulo, pasos }: { titulo: string; pasos: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[15px] font-bold text-[var(--ink)]">{titulo}</h3>
      <ol className="flex flex-col gap-2.5">
        {pasos.map((p, i) => (
          <li key={p} className="flex items-start gap-3 text-[15px] leading-snug text-[var(--ink-2)]">
            <span
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold"
              style={{ background: C.marino, color: "#fff" }}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            {p}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Cabecera({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-[2rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-[var(--ink)] sm:text-[2.6rem]">{titulo}</h1>
      <p className="max-w-[46ch] text-base leading-relaxed text-[var(--ink-2)] sm:text-[17px]">{texto}</p>
    </div>
  );
}

/* En el móvil el pasaporte abierto no cabe: una tira con la tapa oro y los datos que se van rellenando */
function PasaporteMovil({ nombre, universidad, pais }: { nombre: string; universidad: string; pais: string }) {
  return (
    <div className="rounded-xl p-1.5 shadow-[0_14px_30px_-16px_rgba(20,35,61,0.45)]" style={{ background: C.oro }}>
      <div className="flex items-center gap-3 rounded-lg p-3" style={{ background: C.papel }}>
        <div className="grid h-14 w-11 shrink-0 place-items-center rounded bg-[#dadce0] text-base font-bold text-[#9aa0a6]">
          {nombre
            .split(/\s+/)
            .slice(0, 2)
            .map((x) => x[0])
            .join("")
            .toUpperCase()}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs font-bold" style={{ color: C.texto2 }}>
            Tu pasaporte Embarca
          </span>
          <span className="truncate text-[15px] font-bold" style={{ color: C.marino }}>
            {nombre}
          </span>
          <span className="truncate text-[13px]" style={{ color: C.texto2 }}>
            {universidad}
            {pais ? ` · ${pais}` : ""}
          </span>
        </div>
        <span className="shrink-0 text-right text-xs leading-tight" style={{ color: C.texto2 }}>
          0<br />sellos
        </span>
      </div>
    </div>
  );
}

function enfocarPrimero(form: HTMLFormElement, errores: Errores) {
  const primero = Object.keys(errores).find((k) => errores[k]);
  if (!primero) return;
  const el = form.querySelector<HTMLElement>(`[name="${primero}"]`);
  el?.focus();
  el?.scrollIntoView({ block: "center", behavior: "smooth" });
}

/* ---------- Estudiante ---------- */

export function FormEstudiante({ selector }: { selector: React.ReactNode }) {
  const [state, action, pending] = useActionState(registerStudent, initial);
  const [nombre, setNombre] = useState("");
  const [universidad, setUniversidad] = useState("");
  const [pais, setPais] = useState("");
  const [skills, setSkills] = useState("");
  const [errores, setErrores] = useState<Errores>({});

  const lista = listaSkills(skills);
  const limpiar = (k: string) => errores[k] && setErrores((e) => ({ ...e, [k]: undefined }));

  function alternar(s: string) {
    setSkills((prev) => {
      const actual = listaSkills(prev);
      const existe = actual.some((x) => x.toLowerCase() === s.toLowerCase());
      return (existe ? actual.filter((x) => x.toLowerCase() !== s.toLowerCase()) : [...actual, s]).join(", ");
    });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "").trim();
    const nuevos: Errores = {
      name: nombre.trim() ? undefined : "Escribe tu nombre y apellidos.",
      email: !email ? "Escribe tu email." : EMAIL.test(email) ? undefined : "Ese email no parece válido. Revísalo.",
      country: pais ? undefined : "Elige tu país.",
      university: universidad.trim() ? undefined : "Escribe tu universidad.",
      consent: fd.get("consent") === "on" ? undefined : "Marca la casilla para aceptar el uso de tus datos.",
    };
    setErrores(nuevos);
    if (Object.values(nuevos).some(Boolean)) {
      enfocarPrimero(form, nuevos);
      return;
    }
    startTransition(() => action(fd));
  }

  const datos = {
    nombre: nombre.trim() || "Tu nombre",
    universidad: universidad.trim() || "Tu universidad",
    pais: pais || "—",
    retos: 0,
    sellos: [],
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-14">
      <div className="flex min-w-0 flex-col gap-6">
        {selector}
        <Cabecera titulo="Crea tu pasaporte" texto="Un minuto y lo tienes. Cada reto que resuelvas para una empresa de España o Colombia es un sello más." />

        <div className="min-w-0 lg:hidden" aria-hidden="true">
          <PasaporteMovil nombre={datos.nombre} universidad={datos.universidad} pais={pais} />
        </div>

        <form action={action} onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
          <Campo
            label="Nombre y apellidos"
            name="name"
            required
            autoComplete="name"
            autoCapitalize="words"
            placeholder="Lucía Fernández Ortega"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              limpiar("name");
            }}
            error={errores.name}
          />
          <Campo
            label="Email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="tu@email.com"
            onChange={() => limpiar("email")}
            error={errores.email}
          />
          <Pais
            label="País donde estudias"
            valor={pais}
            onChange={(v) => {
              setPais(v);
              limpiar("country");
            }}
            error={errores.country}
          />
          <Campo
            label="Universidad"
            name="university"
            required
            placeholder="Ej.: Complutense, Nacional de Colombia…"
            value={universidad}
            onChange={(e) => {
              setUniversidad(e.target.value);
              limpiar("university");
            }}
            error={errores.university}
          />
          <div className="flex flex-col gap-2.5">
            <Campo
              label="Qué sabes hacer"
              name="skills"
              placeholder="python, react, análisis de datos"
              ayuda="Sepáralas con comas o toca las que encajen."
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {SUGERENCIAS.map((s) => {
                const activa = lista.some((x) => x.toLowerCase() === s.toLowerCase());
                return (
                  <button key={s} type="button" className={r.chip} aria-pressed={activa} onClick={() => alternar(s)}>
                    <span aria-hidden="true">{activa ? "✓" : "+"}</span>
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Campo label="GitHub (opcional)" name="github" placeholder="github.com/tu-usuario" autoCapitalize="none" spellCheck={false} />
            <Campo label="Portfolio (opcional)" name="portfolio" placeholder="tu-web.com" autoCapitalize="none" spellCheck={false} inputMode="url" />
          </div>

          <Consentimiento error={errores.consent} />
          {!pending && <AvisoServidor error={state.error} />}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Enviar pending={pending} enviando="Creando tu pasaporte…">
              Crear mi pasaporte
            </Enviar>
            <span className="text-sm text-[var(--ink-2)]">Para el estudiante es gratis. Siempre.</span>
          </div>
        </form>
      </div>

      <div className="hidden min-w-0 lg:sticky lg:block lg:self-start" style={{ top: 80 }}>
        <Vista titulo="Tu pasaporte">
          <Pasaporte d={datos} />
          {lista.length > 0 && (
            <div className="flex flex-wrap gap-1.5" aria-label="Lo que sabes hacer">
              {lista.slice(0, 8).map((s) => (
                <span key={s.toLowerCase()} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[var(--ink)] ring-1 ring-[var(--line)]">
                  {s}
                </span>
              ))}
            </div>
          )}
          <Pasos
            titulo="Qué pasa después"
            pasos={[
              "Te apuntas a un reto real de una empresa de España o Colombia.",
              "Entregas tu trabajo antes de que cierre el embarque.",
              "La empresa lo valora y tu pasaporte recibe su sello con la nota.",
            ]}
          />
        </Vista>
      </div>
    </div>
  );
}

/* ---------- Empresa ---------- */

export function FormEmpresa({ selector }: { selector: React.ReactNode }) {
  const [state, action, pending] = useActionState(registerCompany, initial);
  const [empresa, setEmpresa] = useState("");
  const [contacto, setContacto] = useState("");
  const [pais, setPais] = useState("");
  const [errores, setErrores] = useState<Errores>({});
  const limpiar = (k: string) => errores[k] && setErrores((e) => ({ ...e, [k]: undefined }));

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "").trim();
    const nuevos: Errores = {
      name: empresa.trim() ? undefined : "Escribe el nombre de la empresa.",
      contact_name: contacto.trim() ? undefined : "Escribe quién será la persona de contacto.",
      email: !email ? "Escribe un email de trabajo." : EMAIL.test(email) ? undefined : "Ese email no parece válido. Revísalo.",
      country: pais ? undefined : "Elige el país de la empresa.",
    };
    setErrores(nuevos);
    if (Object.values(nuevos).some(Boolean)) {
      enfocarPrimero(form, nuevos);
      return;
    }
    startTransition(() => action(fd));
  }

  const origen = CIUDAD[pais] ?? "———";
  const destino = pais === "Colombia" ? "MAD" : pais ? "BOG" : "———";
  const tarjeta = {
    empresa: empresa.trim() || "Tu empresa",
    origen,
    destino,
    titulo: "Describe qué necesitas y la IA preparará aquí tu reto",
    datos: [
      { etiqueta: "Duración", valor: "—" },
      { etiqueta: "Perfil", valor: "—" },
      { etiqueta: "Cierra", valor: "—" },
    ],
    puerta: "—",
    estado: "borrador" as const,
    pie: contacto.trim() ? (
      <p className="text-sm text-[var(--ink-2)]">
        Contacto: <strong className="text-[var(--ink)]">{contacto.trim()}</strong>
      </p>
    ) : undefined,
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-14">
      <div className="flex min-w-0 flex-col gap-6">
        {selector}
        <Cabecera
          titulo="Da de alta tu empresa"
          texto="Un minuto para registrar tu empresa. Después la IA te ayuda a convertir tu necesidad en un reto real."
        />

        <form action={action} onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
          <Campo
            label="Empresa"
            name="name"
            required
            autoComplete="organization"
            placeholder="Andina Pagos"
            value={empresa}
            onChange={(e) => {
              setEmpresa(e.target.value);
              limpiar("name");
            }}
            error={errores.name}
          />
          <Campo
            label="Persona de contacto"
            name="contact_name"
            required
            autoComplete="name"
            autoCapitalize="words"
            placeholder="Laura Gómez"
            value={contacto}
            onChange={(e) => {
              setContacto(e.target.value);
              limpiar("contact_name");
            }}
            error={errores.contact_name}
          />
          <Campo
            label="Email de trabajo"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="laura@empresa.com"
            ayuda="Lo usamos para avisarte cuando lleguen entregas a tu reto."
            onChange={() => limpiar("email")}
            error={errores.email}
          />
          <Pais
            label="País de la empresa"
            valor={pais}
            onChange={(v) => {
              setPais(v);
              limpiar("country");
            }}
            error={errores.country}
          />
          {!pending && <AvisoServidor error={state.error} />}
          <div className="flex flex-col gap-3">
            <Enviar pending={pending} enviando="Creando tu cuenta…">
              Crear cuenta y preparar mi primer reto
            </Enviar>
            <span className="text-sm text-[var(--ink-2)]">El piloto es gratuito para las empresas.</span>
          </div>
        </form>
      </div>

      <div className="min-w-0 lg:sticky lg:self-start" style={{ top: 80 }}>
        <Vista titulo="Así verán los estudiantes tu primer reto">
          <TarjetaEmbarque t={tarjeta} />
          <p className="text-sm leading-snug text-[var(--ink-2)]">
            Esta es la tarjeta de embarque de tu reto. Cuando la publiques, la verán estudiantes de España y Colombia.
          </p>
          <Pasos
            titulo="Qué pasa después"
            pasos={[
              "Cuentas tu problema con tus palabras.",
              "La IA lo convierte en reto: tareas, entregable y criterios.",
              "Valoras las entregas y cada nota sella el pasaporte del estudiante.",
            ]}
          />
        </Vista>
      </div>
    </div>
  );
}
