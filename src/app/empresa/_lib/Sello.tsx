// Dueño: perfil 4. Sello de tinta: cada valoración de una empresa es un sello en el pasaporte.
// Mismo dibujo que los sellos de la landing (perfil 1).
import p from "./pasaporte.module.css";

const TINTAS = ["var(--sello-a)", "var(--sello-b)", "var(--sello-c)"];
const GIROS = ["-12deg", "7deg", "-4deg", "10deg", "-8deg"];

export function tinta(i: number) {
  return TINTAS[i % TINTAS.length]!;
}

export function fechaSello(iso: string | null) {
  if (!iso) return "";
  return new Date(iso)
    .toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })
    .replace(".", "")
    .toUpperCase();
}

export default function Sello({
  empresa,
  lugar,
  fecha,
  nota,
  i = 0,
  forma,
  size = 112,
  animado = false,
  retraso = 0,
  className = "",
  style,
}: {
  empresa: string;
  lugar: string;
  fecha: string;
  nota: string;
  i?: number;
  forma?: "circulo" | "rect";
  size?: number;
  animado?: boolean;
  retraso?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const color = tinta(i);
  const f = forma ?? (i % 2 ? "rect" : "circulo");
  const comun = {
    color,
    borderColor: color,
    ["--r" as string]: GIROS[i % GIROS.length],
    animationDelay: `${retraso}ms`,
    ...style,
  } as React.CSSProperties;
  const cls = `${p.sello} ${animado ? p.selloAnim : ""} ${p.datos} ${className}`;
  const k = size / 112;

  if (f === "circulo") {
    return (
      <div
        className={`${cls} relative grid shrink-0 place-items-center rounded-full border-[3px] text-center`}
        style={{ ...comun, width: size, height: size }}
        aria-label={`Valorado por ${empresa}: ${nota}`}
      >
        <div className="absolute inset-[6px] rounded-full border border-current" />
        <div className="flex flex-col items-center leading-tight">
          <span className="font-bold tracking-[0.18em]" style={{ fontSize: 9 * k }}>VALORADO</span>
          <span className="mt-0.5 max-w-[80%] truncate font-bold" style={{ fontSize: 11 * k }}>{empresa}</span>
          <span className="font-bold leading-none" style={{ fontSize: 22 * k }}>{nota}</span>
          <span className="tracking-wider" style={{ fontSize: 8 * k }}>
            {lugar.toUpperCase()} · {fecha}
          </span>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`${cls} flex shrink-0 flex-col items-center gap-0.5 border-[3px] px-4 py-2.5`}
      style={comun}
      aria-label={`Reto superado en ${empresa}: ${nota}`}
    >
      <span className="font-bold tracking-[0.2em]" style={{ fontSize: 9 * k }}>RETO SUPERADO</span>
      <span className="font-bold" style={{ fontSize: 13 * k }}>{empresa}</span>
      <span className="border-y border-current px-2 font-bold leading-snug" style={{ fontSize: 24 * k }}>
        {nota}
      </span>
      <span className="tracking-wider" style={{ fontSize: 8 * k }}>
        {lugar.toUpperCase()} · {fecha}
      </span>
    </div>
  );
}
