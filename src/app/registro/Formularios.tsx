"use client";
// Dueño: perfil 1. Formularios de registro como solicitud de pasaporte de talento; la lógica está en actions.ts (servidor).
// El formulario valida en el cliente con mensajes en español, rellena en vivo la vista previa del pasaporte
// y, al enviar, deja caer un sello de «solicitud recibida» mientras el servidor guarda y redirige.
import { startTransition, useActionState, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { COUNTRIES } from "@/lib/types";
import p from "../_landing/pasaporte.module.css";
import r from "./registro.module.css";
import { registerCompany, registerStudent, type FormState } from "./actions";

const initial: FormState = { error: null };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODIGO: Record<string, string> = { España: "ESP", México: "MEX", Colombia: "COL" };
const SUGERENCIAS = ["Python", "SQL", "React", "Análisis de datos", "Machine learning", "Node.js", "Power BI"];

type Errores = Record<string, string | undefined>;

function sinAcentos(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
}

function listaSkills(s: string) {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

/* ---------- Piezas del formulario ---------- */

function Campo({
  n,
  label,
  name,
  ayuda,
  error,
  ...input
}: { n?: string; label: string; name: string; ayuda?: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const reduce = useReducedMotion();
  const [foco, setFoco] = useState(false);
  const idAyuda = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className={`${r.etiqueta} flex items-baseline gap-2`}>
        {n && <span className="text-[var(--tinta-2)]/60">{n}</span>}
        <span className={foco ? "text-[var(--tinta)]" : undefined}>{label}</span>
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          className={r.input}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || ayuda ? idAyuda : undefined}
          onFocus={() => setFoco(true)}
          onBlur={() => setFoco(false)}
          {...input}
        />
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[2.5px] origin-left bg-[var(--oro)]"
          initial={false}
          animate={{ scaleX: foco ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
        />
      </div>
      <AnimatePresence initial={false} mode="wait">
        {error ? (
          <motion.p
            key="error"
            id={idAyuda}
            className="text-sm font-semibold text-[var(--sello-a)]"
            initial={reduce ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {error}
          </motion.p>
        ) : ayuda ? (
          <p key="ayuda" id={idAyuda} className="text-sm text-[var(--tinta-2)]">
            {ayuda}
          </p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Pais({ n, valor, onChange, error }: { n?: string; valor: string; onChange: (v: string) => void; error?: string }) {
  return (
    <fieldset className="flex flex-col gap-1.5" aria-invalid={error ? true : undefined}>
      <legend className={`${r.etiqueta} mb-1.5 flex items-baseline gap-2`}>
        {n && <span className="text-[var(--tinta-2)]/60">{n}</span>}
        <span>País</span>
      </legend>
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
            <span className={`${p.datos} text-[11px] opacity-60`}>{CODIGO[c]}</span>
            <span>{c}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-sm font-semibold text-[var(--sello-a)]">{error}</p>}
    </fieldset>
  );
}

function Consentimiento({ error }: { error?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className={`flex cursor-pointer items-start gap-3 rounded-lg bg-white/55 p-4 ring-1 ${error ? "ring-[var(--sello-a)]" : "ring-[var(--tinta)]/15"}`}
      >
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--tinta)]"
        />
        <span className="text-[15px] leading-snug text-[var(--tinta-2)]">
          <strong className="text-[var(--tinta)]">Tus datos son tuyos.</strong> Solo los usamos para conectarte con retos.
          Cumplimos el RGPD y la ley de protección de datos de Colombia (Ley 1581 de 2012).
        </span>
      </label>
      {error && <p className="text-sm font-semibold text-[var(--sello-a)]">{error}</p>}
    </div>
  );
}

function Enviar({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="submit"
      disabled={pending}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      className={`${r.oro} ${p.boton} w-full rounded-full px-7 py-4 text-[17px] font-bold sm:w-auto`}
    >
      {pending ? "Sellando tu solicitud…" : children}
    </motion.button>
  );
}

function AvisoServidor({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <p
      role="alert"
      className="rounded-lg bg-[var(--sello-a)]/10 px-4 py-3 text-[15px] font-semibold text-[var(--sello-a)] ring-1 ring-[var(--sello-a)]/30"
    >
      {error}
    </p>
  );
}

/* El sello de tinta que cae sobre la hoja al enviar */
function SelloRecibido({ visible, texto }: { visible: boolean; texto: string }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 z-10 flex items-center justify-center"
          style={{ bottom: 96, height: 200 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          aria-hidden="true"
        >
          <motion.div
            className={`${p.datos} flex flex-col items-center gap-1 rounded-md border-[4px] border-[var(--sello-a)] px-4 py-3 text-[var(--sello-a)] sm:px-6`}
            style={{
              backgroundColor: "rgba(238, 241, 238, 0.92)",
              boxShadow: "inset 0 0 0 3px var(--papel), inset 0 0 0 5px var(--sello-a), 0 6px 18px -8px rgba(20, 35, 61, 0.35)",
            }}
            initial={reduce ? { rotate: -9, opacity: 0.9 } : { scale: 2.3, rotate: -2, opacity: 0, filter: "blur(4px)" }}
            animate={{ scale: 1, rotate: -9, opacity: 0.9, filter: "blur(0px)" }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 22, mass: 0.8 }}
          >
            <span className="whitespace-nowrap text-[23px] font-bold leading-none tracking-[0.05em] sm:text-[32px]">{texto}</span>
            <span className="whitespace-nowrap text-[10px] tracking-[0.18em] sm:text-[11px]">
              HISPANIDAD FUTURA · {new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Escudo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 268 311" className={className} aria-hidden="true">
      <path d="M12 6 H256 V185 C256 245 212 282 134 305 C56 282 12 245 12 185 Z" fill="none" stroke="currentColor" strokeWidth="14" />
    </svg>
  );
}

/* ---------- Vista previa del pasaporte (estudiante) ---------- */

function Dato({ etiqueta, valor, vacio }: { etiqueta: string; valor: string; vacio: string }) {
  return (
    <div className="flex min-w-0 flex-col">
      <span className={`${p.datos} text-[9px] tracking-wider text-[var(--tinta-2)]`}>{etiqueta}</span>
      <span
        className={`${p.datos} truncate text-[13px] font-bold ${valor ? "text-[var(--tinta)]" : "text-[var(--tinta-2)]/40"}`}
      >
        {valor ? sinAcentos(valor) : vacio}
      </span>
    </div>
  );
}

function VistaPasaporte({
  nombre,
  universidad,
  pais,
  skills,
  compacto = false,
}: {
  nombre: string;
  universidad: string;
  pais: string;
  skills: string[];
  compacto?: boolean;
}) {
  const reduce = useReducedMotion();
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  // Doble apellido hispano: con tres palabras o más, las dos últimas son los apellidos.
  const corte = partes.length >= 3 ? partes.length - 2 : 1;
  const pila = partes.slice(0, corte).join(" ");
  const apellidos = partes.slice(corte).join(" ");
  const codigo = CODIGO[pais] ?? "";
  const iniciales = (partes[0]?.[0] ?? "") + (apellidos[0] ?? "");

  const mrz1 = `P<${codigo || "<<<"}${sinAcentos(apellidos || pila).replace(/[^A-Z]+/g, "<")}<<${sinAcentos(apellidos ? pila : "").replace(/[^A-Z]+/g, "<")}`
    .padEnd(44, "<")
    .slice(0, 44);
  const mrz2 = `RETOS0000<${codigo || "<<<"}${sinAcentos(universidad).replace(/[^A-Z0-9]+/g, "<")}`.padEnd(44, "<").slice(0, 44);

  if (compacto) {
    return (
      <div className={`${p.seguridad} ${r.hoja} flex items-center gap-3 rounded-xl p-3`} aria-hidden="true">
        <div className="relative grid h-14 w-11 shrink-0 place-items-center overflow-hidden rounded bg-[#d9dfe2] ring-1 ring-black/10">
          <span className={`${p.datos} text-sm font-bold text-[var(--tinta)]`}>{sinAcentos(iniciales) || "?"}</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className={`${p.datos} text-[9px] tracking-[0.14em] text-[var(--tinta-2)]`}>PASAPORTE DE TALENTO · {codigo || "—"}</span>
          <span className={`${p.datos} truncate text-[14px] font-bold ${nombre ? "text-[var(--tinta)]" : "text-[var(--tinta-2)]/45"}`}>
            {nombre ? sinAcentos(nombre) : "TU NOMBRE AQUÍ"}
          </span>
          <span className={`${p.datos} truncate text-[11px] text-[var(--tinta-2)]`}>
            {universidad ? sinAcentos(universidad) : "Universidad"}
          </span>
        </div>
        <Escudo className="h-8 w-7 shrink-0 self-start text-[var(--oro)]" />
      </div>
    );
  }

  return (
    <div className={`${p.seguridad} ${r.hoja} relative flex flex-col gap-4 overflow-hidden rounded-[14px] p-5`} aria-hidden="true">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <span className={`${p.datos} text-[10px] font-bold tracking-[0.16em] text-[var(--tinta)]`}>PASAPORTE DE TALENTO</span>
          <span className={`${p.datos} text-[9px] tracking-[0.12em] text-[var(--tinta-2)]`}>IBEROAMÉRICA</span>
        </div>
        <Escudo className="h-8 w-7 shrink-0 text-[var(--oro)]" />
      </div>

      <div className="flex gap-4">
        <div className="relative grid h-[118px] w-[92px] shrink-0 place-items-center overflow-hidden rounded-md bg-[#d9dfe2] ring-1 ring-black/10">
          <svg viewBox="0 0 92 118" className="absolute inset-0 h-full w-full text-[#9aa6b2]" aria-hidden="true">
            <circle cx="46" cy="46" r="20" fill="currentColor" />
            <path d="M10 118 C14 86 30 76 46 76 C62 76 78 86 82 118 Z" fill="currentColor" />
          </svg>
          <AnimatePresence>
            {iniciales && (
              <motion.span
                key="ini"
                className={`${p.datos} relative rounded bg-[var(--tinta)] px-1.5 py-0.5 text-[13px] font-bold text-[#f3efe6]`}
                initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                {sinAcentos(iniciales)}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="grid min-w-0 flex-1 grid-cols-1 gap-2">
          <Dato etiqueta="Apellidos" valor={apellidos} vacio="—" />
          <Dato etiqueta="Nombre" valor={pila} vacio="TU NOMBRE" />
          <Dato etiqueta="Universidad" valor={universidad} vacio="—" />
          <div className="grid grid-cols-2 gap-2">
            <Dato etiqueta="Nacionalidad" valor={codigo} vacio="—" />
            <Dato etiqueta="Sellos" valor="0" vacio="0" />
          </div>
        </div>
      </div>

      <div className="flex min-h-[58px] flex-col gap-1.5">
        <span className={`${p.datos} text-[9px] tracking-wider text-[var(--tinta-2)]`}>Competencias</span>
        <div className="flex flex-wrap gap-1.5">
          <AnimatePresence initial={false}>
            {skills.length === 0 && (
              <motion.span key="vacio" className={`${p.datos} text-[12px] text-[var(--tinta-2)]/45`} exit={{ opacity: 0 }}>
                Las que escribas aparecerán aquí
              </motion.span>
            )}
            {skills.slice(0, 8).map((s) => (
              <motion.span
                key={s.toLowerCase()}
                layout={!reduce}
                className={`${p.datos} rounded-full bg-[var(--sello-b)] px-2.5 py-1 text-[11px] font-bold text-white`}
                initial={reduce ? false : { opacity: 0, scale: 0.5, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 500, damping: 26 }}
              >
                {s}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className={`${p.datos} flex flex-col gap-0.5 overflow-hidden rounded-sm bg-white/55 px-2 py-2 text-[9.5px] leading-snug tracking-[0.06em] text-[var(--tinta)]`}>
        <span className="whitespace-pre">{mrz1}</span>
        <span className="whitespace-pre">{mrz2}</span>
      </div>
    </div>
  );
}

/* ---------- Vista previa del sello de entidad (empresa) ---------- */

function SelloEntidad({ empresa, contacto, pais, compacto = false }: { empresa: string; contacto: string; pais: string; compacto?: boolean }) {
  const reduce = useReducedMotion();
  const codigo = CODIGO[pais] ?? "";
  const tam = compacto ? 96 : 230;
  const sello = (
    <motion.svg
      viewBox="0 0 200 200"
      width={tam}
      height={tam}
      className="shrink-0 text-[var(--sello-b)]"
      initial={reduce ? false : { rotate: -12, scale: 0.9, opacity: 0 }}
      animate={{ rotate: -8, scale: 1, opacity: 0.92 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      aria-hidden="true"
      style={{ mixBlendMode: "multiply" }}
    >
      <defs>
        <path id="arco-sup" d="M 30 100 A 70 70 0 0 1 170 100" />
        <path id="arco-inf" d="M 36 104 A 64 64 0 0 0 164 104" />
      </defs>
      <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="5" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="54" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text fill="currentColor" style={{ fontFamily: "var(--datos)", fontSize: 13, fontWeight: 700, letterSpacing: 3 }}>
        <textPath href="#arco-sup" startOffset="50%" textAnchor="middle">
          ENTIDAD COLABORADORA
        </textPath>
      </text>
      <text fill="currentColor" style={{ fontFamily: "var(--datos)", fontSize: 11, letterSpacing: 3 }}>
        <textPath href="#arco-inf" startOffset="50%" textAnchor="middle">
          {`RETOS · HISPANIDAD FUTURA${codigo ? ` · ${codigo}` : ""}`}
        </textPath>
      </text>
      <foreignObject x="50" y="62" width="100" height="76">
        <div
          className="flex h-full w-full flex-col items-center justify-center text-center"
          style={{ fontFamily: "var(--datos)", color: "var(--sello-b)" }}
        >
          <span style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.05, wordBreak: "break-word" }}>
            {empresa ? sinAcentos(empresa).slice(0, 28) : "TU EMPRESA"}
          </span>
          <span style={{ fontSize: 8.5, marginTop: 4, letterSpacing: 1 }}>{new Date().getFullYear()}</span>
        </div>
      </foreignObject>
    </motion.svg>
  );

  if (compacto) {
    return (
      <div className={`${p.seguridad} ${r.hoja} flex items-center gap-3 rounded-xl p-3 pr-4`} aria-hidden="true">
        {sello}
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className={`${p.datos} text-[9px] tracking-[0.14em] text-[var(--tinta-2)]`}>SELLO DE ENTIDAD</span>
          <span className={`${p.datos} truncate text-[14px] font-bold ${empresa ? "text-[var(--tinta)]" : "text-[var(--tinta-2)]/45"}`}>
            {empresa ? sinAcentos(empresa) : "TU EMPRESA"}
          </span>
          <span className={`${p.datos} truncate text-[11px] text-[var(--tinta-2)]`}>
            {contacto ? `Contacto: ${contacto}` : "Lo verán los estudiantes en cada reto"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${p.seguridad} ${r.hoja} flex flex-col items-center gap-5 rounded-[14px] px-6 py-8`} aria-hidden="true">
      <span className={`${p.datos} self-start text-[10px] font-bold tracking-[0.16em] text-[var(--tinta)]`}>SELLO DE ENTIDAD</span>
      {sello}
      <div className="flex w-full flex-col gap-2 border-t border-[var(--tinta)]/10 pt-4">
        <Dato etiqueta="Entidad" valor={empresa} vacio="—" />
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <Dato etiqueta="Persona de contacto" valor={contacto} vacio="—" />
          <Dato etiqueta="País" valor={codigo} vacio="—" />
        </div>
      </div>
      <p className="text-center text-sm leading-snug text-[var(--tinta-2)]">
        Tu sello aparecerá en el pasaporte de cada estudiante cuyo trabajo valores.
      </p>
    </div>
  );
}

/* ---------- Hoja: el marco de papel donde va el formulario ---------- */

function Hoja({ serie, titulo, children, sello, selloTexto }: { serie: string; titulo: string; children: React.ReactNode; sello: boolean; selloTexto: string }) {
  return (
    <div className={`${p.seguridad} ${r.hoja} relative overflow-hidden rounded-[18px] px-4 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-7`}>
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-dashed border-[var(--tinta)]/20 pb-3">
        <span className={`${p.datos} text-[11px] font-bold tracking-[0.12em] text-[var(--tinta)]`}>{titulo}</span>
        <span className={`${r.serie} text-[11px]`}>{serie}</span>
      </div>
      {children}
      <SelloRecibido visible={sello} texto={selloTexto} />
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

export function FormEstudiante() {
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

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
      <div className="min-w-0 lg:hidden">
        <VistaPasaporte nombre={nombre} universidad={universidad} pais={pais} skills={lista} compacto />
      </div>

      <Hoja serie="Nº HF-2026" titulo="Solicitud de pasaporte" sello={pending} selloTexto="SOLICITUD RECIBIDA">
        <form action={action} onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
          <Campo
            n="01"
            label="Nombre y apellidos"
            name="name"
            required
            autoComplete="name"
            autoCapitalize="words"
            placeholder="Andrés Rojas"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              limpiar("name");
            }}
            error={errores.name}
          />
          <Campo
            n="02"
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
            n="03"
            valor={pais}
            onChange={(v) => {
              setPais(v);
              limpiar("country");
            }}
            error={errores.country}
          />
          <Campo
            n="04"
            label="Universidad"
            name="university"
            required
            placeholder="Ej.: UNAM, Complutense…"
            value={universidad}
            onChange={(e) => {
              setUniversidad(e.target.value);
              limpiar("university");
            }}
            error={errores.university}
          />
          <div className="flex flex-col gap-2.5">
            <Campo
              n="05"
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
                    {activa ? "✓ " : "+ "}
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <details className="group rounded-lg bg-white/40 ring-1 ring-[var(--tinta)]/12 open:bg-white/30">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[15px] font-semibold text-[var(--tinta)] [&::-webkit-details-marker]:hidden">
              Añadir GitHub o portfolio
              <span className={`${p.datos} text-xs font-normal text-[var(--tinta-2)]`}>
                Opcional <span className="inline-block transition-transform group-open:rotate-45">+</span>
              </span>
            </summary>
            <div className="grid gap-5 px-4 pb-4 pt-1 sm:grid-cols-2">
              <Campo label="GitHub (opcional)" name="github" placeholder="github.com/tu-usuario" autoCapitalize="none" spellCheck={false} />
              <Campo label="Portfolio (opcional)" name="portfolio" placeholder="tu-web.com" autoCapitalize="none" spellCheck={false} inputMode="url" />
            </div>
          </details>

          <Consentimiento error={errores.consent} />
          {!pending && <AvisoServidor error={state.error} />}
          <Enviar pending={pending}>Solicitar mi pasaporte</Enviar>
        </form>
      </Hoja>

      <aside className="hidden lg:sticky lg:top-24 lg:flex lg:flex-col lg:gap-3">
        <VistaPasaporte nombre={nombre} universidad={universidad} pais={pais} skills={lista} />
        <p className="px-1 text-sm text-[#f3efe6]/60">Así se verá tu pasaporte. El primer sello llega con tu primer reto valorado.</p>
      </aside>
    </div>
  );
}

/* ---------- Empresa ---------- */

export function FormEmpresa() {
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

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
      <div className="min-w-0 lg:hidden">
        <SelloEntidad empresa={empresa} contacto={contacto} pais={pais} compacto />
      </div>

      <Hoja serie="Nº ENT-2026" titulo="Registro de entidad" sello={pending} selloTexto="ENTIDAD REGISTRADA">
        <form action={action} onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
          <Campo
            n="01"
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
            n="02"
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
            n="03"
            label="Email de trabajo"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="laura@empresa.com"
            onChange={() => limpiar("email")}
            error={errores.email}
          />
          <Pais
            n="04"
            valor={pais}
            onChange={(v) => {
              setPais(v);
              limpiar("country");
            }}
            error={errores.country}
          />
          {!pending && <AvisoServidor error={state.error} />}
          <Enviar pending={pending}>Publicar mi primer reto</Enviar>
        </form>
      </Hoja>

      <aside className="hidden lg:sticky lg:top-24 lg:block">
        <SelloEntidad empresa={empresa} contacto={contacto} pais={pais} />
      </aside>
    </div>
  );
}
