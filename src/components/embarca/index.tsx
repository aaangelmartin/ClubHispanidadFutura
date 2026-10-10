// Kit visual de Embarca (versión Hispanidad Futura). Lo comparten todas las pantallas:
// marca, estados, notas con su color, sello, tarjeta de embarque (los retos) y pasaporte (los estudiantes).
// Colores: marino y oro del Club; verde, ámbar y rojo para estados, como en un panel de salidas; azul para servicios.
// Dueño: perfil 1. Si necesitas otra variante, añádela aquí con props en vez de copiarla.
import type { ReactNode } from "react";

export const C = {
  marino: "#14233d",
  oro: "#c8963a",
  verde: "#00843d",
  verdeClaro: "#3fa34d",
  ambar: "#f59e0b",
  rojo: "#d21034",
  azul: "#0b4ea2",
  papel: "#f7f6f2",
  superficie: "#f4f2ec",
  linea: "#e2e2de",
  texto2: "#5f6166",
};

const MONO = "var(--font-b612), ui-monospace, monospace";

/* ── Marca ───────────────────────────────────────────── */

export function Isotipo({ size = 28 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-grid shrink-0 place-items-center rounded-md font-extrabold"
      style={{ width: size, height: size, background: C.oro, color: C.marino, fontSize: size * 0.62, lineHeight: 1 }}
    >
      ↗
    </span>
  );
}

export function Logo({ claro = false, size = 28 }: { claro?: boolean; size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Isotipo size={size} />
      <span className="font-bold tracking-[-0.03em]" style={{ fontSize: size * 0.8, color: claro ? "#fff" : C.marino }}>
        Embarca
      </span>
    </span>
  );
}

/* ── Estados y notas ─────────────────────────────────── */

type Pastilla = { bg: string; fg: string; borde?: string; texto: string };

function Chip({ p, grande = false }: { p: Pastilla; grande?: boolean }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded font-bold ${grande ? "px-3 py-1.5 text-sm" : "px-2 py-1 text-xs"}`}
      style={{ background: p.bg, color: p.fg, boxShadow: p.borde ? `inset 0 0 0 1.5px ${p.borde}` : undefined }}
    >
      {p.texto}
    </span>
  );
}

export type EstadoRetoValor = "borrador" | "abierto" | "cierra_pronto" | "en_valoracion" | "cerrado";
const RETO: Record<EstadoRetoValor, Pastilla> = {
  borrador: { bg: C.superficie, fg: C.marino, texto: "Borrador" },
  abierto: { bg: C.verde, fg: "#fff", texto: "Embarcando" },
  cierra_pronto: { bg: C.ambar, fg: C.marino, texto: "Cierra pronto" },
  en_valoracion: { bg: C.oro, fg: C.marino, texto: "Por valorar" },
  cerrado: { bg: C.rojo, fg: "#fff", texto: "Cerrado" },
};
export function EstadoReto({ estado, grande }: { estado: EstadoRetoValor; grande?: boolean }) {
  return <Chip p={RETO[estado]} grande={grande} />;
}

export type EstadoEntregaValor = "inscrito" | "entregada" | "por_valorar" | "valorada" | "no_entregada";
const ENTREGA: Record<EstadoEntregaValor, Pastilla> = {
  inscrito: { bg: "#eeeeec", fg: C.texto2, texto: "Inscrito · sin entregar" },
  entregada: { bg: C.azul, fg: "#fff", texto: "Entregada" },
  por_valorar: { bg: C.oro, fg: C.marino, texto: "Por valorar" },
  valorada: { bg: C.verde, fg: "#fff", texto: "Valorada" },
  no_entregada: { bg: "#fff", fg: C.rojo, borde: C.rojo, texto: "No entregada" },
};
export function EstadoEntrega({ estado, grande }: { estado: EstadoEntregaValor; grande?: boolean }) {
  return <Chip p={ENTREGA[estado]} grande={grande} />;
}

/** Color de una nota 0–10: 9–10 excelente, 7–8,9 buena, 5–6,9 suficiente, <5 insuficiente. */
export function colorNota(n: number) {
  if (n >= 9) return { bg: C.verde, fg: "#fff", nivel: "Excelente" };
  if (n >= 7) return { bg: C.verdeClaro, fg: "#fff", nivel: "Buena" };
  if (n >= 5) return { bg: C.ambar, fg: C.marino, nivel: "Suficiente" };
  return { bg: C.rojo, fg: "#fff", nivel: "Insuficiente" };
}

export function Nota({ valor, size = "md", nivel = false }: { valor: number; size?: "sm" | "md" | "lg"; nivel?: boolean }) {
  const c = colorNota(valor);
  const dims = size === "lg" ? "min-w-[72px] px-3 py-2 text-3xl" : size === "sm" ? "min-w-[40px] px-1.5 py-0.5 text-sm" : "min-w-[52px] px-2 py-1 text-lg";
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`inline-flex justify-center rounded-md font-extrabold tabular-nums ${dims}`} style={{ background: c.bg, color: c.fg }}>
        {valor.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
      </span>
      {nivel && <span className="text-sm font-semibold" style={{ color: c.bg === C.ambar ? "#8a5a00" : c.bg }}>{c.nivel}</span>}
    </span>
  );
}

/* ── Sello ───────────────────────────────────────────── */

export function Sello({
  nota,
  empresa,
  color,
  giro = -8,
  size = 104,
  className = "",
  style,
}: {
  nota: number;
  empresa: string;
  color?: string;
  giro?: number;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const tinta = color ?? colorNota(nota).bg;
  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center rounded-full text-center ${className}`}
      style={{ width: size, height: size, border: `3.5px solid ${tinta}`, color: tinta, transform: `rotate(${giro}deg)`, opacity: 0.92, mixBlendMode: "multiply", ...style }}
    >
      <span className="absolute inset-[6px] rounded-full" style={{ border: `1px solid ${tinta}` }} />
      <span className="flex flex-col items-center leading-none" style={{ fontFamily: MONO }}>
        <span className="font-bold" style={{ fontSize: size * 0.08, letterSpacing: "0.15em" }}>VALORADO</span>
        <span className="font-sans font-extrabold" style={{ fontSize: size * 0.28 }}>
          {nota.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
        </span>
        <span className="max-w-[80%] truncate font-bold" style={{ fontSize: size * 0.07, letterSpacing: "0.08em" }}>
          {empresa.toUpperCase()}
        </span>
      </span>
    </span>
  );
}

/* ── Tarjeta de embarque (un reto) ───────────────────── */

export type Tarjeta = {
  empresa: string;
  origen: string; // código de 3 letras: MAD, BOG, BCN, MDE…
  destino: string;
  titulo: string;
  datos: { etiqueta: string; valor: string }[]; // Duración, Perfil, Cierra, Premio…
  puerta?: string;
  estado?: EstadoRetoValor;
  pie?: ReactNode;
};

export function TarjetaEmbarque({ t, compacta = false, className = "" }: { t: Tarjeta; compacta?: boolean; className?: string }) {
  return (
    <article
      className={`flex overflow-hidden rounded-xl bg-white shadow-[0_12px_30px_-12px_rgba(20,35,61,0.25)] ring-1 ring-[#e2e2de] ${className}`}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-3 px-5 py-2.5" style={{ background: C.marino }}>
          <span className="text-[13px] font-bold" style={{ color: C.oro }}>
            Embarca · tarjeta de embarque
          </span>
          <span className="truncate text-[13px] font-semibold text-white">{t.empresa}</span>
        </div>
        <div className={`flex flex-col ${compacta ? "gap-2 p-4" : "gap-3.5 p-5"}`}>
          <div className="flex items-center gap-3" style={{ fontFamily: MONO }}>
            <span className={`font-bold ${compacta ? "text-xl" : "text-3xl"}`} style={{ color: C.marino }}>{t.origen}</span>
            <span className="text-xl" style={{ color: C.azul }} aria-hidden="true">✈</span>
            <span className={`font-bold ${compacta ? "text-xl" : "text-3xl"}`} style={{ color: C.marino }}>{t.destino}</span>
          </div>
          <h3 className={`font-bold leading-tight ${compacta ? "text-lg" : "text-[22px]"}`} style={{ color: C.marino }}>
            {t.titulo}
          </h3>
          {t.datos.length > 0 && (
            <dl className="flex flex-wrap gap-x-7 gap-y-2">
              {t.datos.map((d) => (
                <div key={d.etiqueta} className="flex flex-col">
                  <dt className="text-xs" style={{ color: C.texto2 }}>{d.etiqueta}</dt>
                  <dd className="text-[15px] font-bold" style={{ color: C.marino }}>{d.valor}</dd>
                </div>
              ))}
            </dl>
          )}
          {t.pie}
        </div>
      </div>
      <div className="hidden w-[132px] shrink-0 flex-col justify-between border-l-2 border-dashed p-4 sm:flex" style={{ background: C.superficie, borderColor: C.linea }}>
        <div className="flex flex-col">
          <span className="text-xs" style={{ color: C.texto2 }}>Puerta</span>
          <span className="text-2xl font-bold" style={{ fontFamily: MONO, color: C.marino }}>{t.puerta ?? "B12"}</span>
        </div>
        {t.estado && <EstadoReto estado={t.estado} />}
        <span className="flex h-8 gap-[2px]" aria-hidden="true">
          {[2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 2, 3].map((w, i) => (
            <span key={i} className="h-full" style={{ width: w, background: C.marino }} />
          ))}
        </span>
      </div>
    </article>
  );
}

/* ── Pasaporte (un estudiante), abierto en horizontal ── */

export type DatosPasaporte = {
  nombre: string;
  universidad: string;
  pais: string;
  retos: number;
  numero?: string;
  sellos: { nota: number; empresa: string }[];
};

const CODIGO_PAIS: Record<string, string> = { España: "ESP", Colombia: "COL", México: "MEX" };

export function mrz(d: DatosPasaporte) {
  const [nombre, ...ap] = d.nombre
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .split(/\s+/);
  const pais = CODIGO_PAIS[d.pais] ?? "XXX";
  const l1 = `P<${pais}${ap.join("<") || "TITULAR"}<<${nombre}`.padEnd(44, "<").slice(0, 44);
  const l2 = `${(d.numero ?? "EMB000000").padEnd(9, "<")}${pais}${String(d.retos).padStart(2, "0")}<<<<<<<<<<<<<<<<<<<<<<<<<<06`.slice(0, 44);
  return [l1, l2];
}

export function Pasaporte({ d, className = "", compacto = false }: { d: DatosPasaporte; className?: string; compacto?: boolean }) {
  const [l1, l2] = mrz(d);
  const iniciales = d.nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  return (
    <div
      className={`flex rounded-2xl p-2 shadow-[0_24px_50px_-20px_rgba(20,35,61,0.45)] ${className}`}
      style={{ background: C.oro, aspectRatio: compacto ? undefined : "1.62 / 1" }}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-3 rounded-l-lg rounded-r-sm p-4" style={{ background: C.papel }}>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-bold" style={{ color: C.marino }}>Pasaporte Embarca</span>
          <span className="text-[10px]" style={{ fontFamily: MONO, color: C.texto2 }}>Nº {d.numero ?? "EMB000000"}</span>
        </div>
        <div className="flex gap-3">
          <div className="grid h-24 w-[76px] shrink-0 place-items-center rounded-md bg-[#dadce0] text-2xl font-bold text-[#9aa0a6]">
            {iniciales}
          </div>
          <dl className="flex min-w-0 flex-col gap-1.5">
            {[
              ["Nombre", d.nombre],
              ["Universidad", d.universidad],
              ["País", d.pais],
              ["Retos valorados", String(d.retos)],
            ].map(([k, v]) => (
              <div key={k} className="min-w-0">
                <dt className="text-[10px]" style={{ color: C.texto2 }}>{k}</dt>
                <dd className="truncate text-[13px] font-bold" style={{ color: C.marino }}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-auto overflow-hidden text-[9.5px] leading-snug sm:text-[10.5px]" style={{ fontFamily: MONO, color: C.marino }}>
          <div className="truncate">{l1}</div>
          <div className="truncate">{l2}</div>
        </div>
      </div>
      <div className="w-1 shrink-0 bg-black/15" aria-hidden="true" />
      <div className="relative min-w-0 flex-1 rounded-l-sm rounded-r-lg p-4" style={{ background: C.papel }}>
        <span className="text-sm font-bold" style={{ color: C.marino }}>Sellos</span>
        {d.sellos.length === 0 ? (
          <p className="mt-6 max-w-[16ch] text-xs leading-snug" style={{ color: C.texto2 }}>
            Tu primer sello llega cuando una empresa valore tu primera entrega.
          </p>
        ) : (
          d.sellos.slice(0, 3).map((s, i) => (
            <Sello
              key={i}
              nota={s.nota}
              empresa={s.empresa}
              size={compacto ? 70 : 92}
              giro={[-8, 10, -3][i]}
              className="absolute"
              style={[{ left: "12%", top: "22%" }, { right: "8%", top: "46%" }, { left: "22%", bottom: "6%" }][i]}
            />
          ))
        )}
      </div>
    </div>
  );
}
