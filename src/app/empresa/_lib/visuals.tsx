// Dueño: perfil 4. Piezas visuales del dashboard de la empresa (SVG y CSS, sin librerías).
import { initials } from "./queries";

const COUNTRY_CODE: Record<string, string> = { España: "ES", México: "MX", Colombia: "CO" };
export const countryCode = (c: string) => COUNTRY_CODE[c] ?? c.slice(0, 2).toUpperCase();

// Anillo de progreso. `tone` cambia el color del arco sobre fondo claro u oscuro.
export function ProgressRing({
  value,
  total,
  size = 132,
  tone = "dark",
  label,
}: {
  value: number;
  total: number;
  size?: number;
  tone?: "dark" | "light";
  label?: string;
}) {
  const pct = total ? value / total : 0;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const track = tone === "dark" ? "rgba(246,241,231,.15)" : "var(--line)";
  const text = tone === "dark" ? "var(--paper)" : "var(--ink)";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${Math.round(pct * 100)} %`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--gold)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${c * pct} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill={text}
        style={{ font: `700 ${size * 0.26}px var(--font-fraunces), Georgia, serif` }}
      >
        {label ?? `${Math.round(pct * 100)}%`}
      </text>
    </svg>
  );
}

// Fila de avatares con iniciales y país.
export function Avatars({ people, max = 5 }: { people: { name: string; country: string; evaluated: boolean }[]; max?: number }) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <div className="flex items-center">
      {shown.map((p, i) => (
        <div
          key={p.name + i}
          title={`${p.name} · ${p.country}`}
          className={`relative -ml-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-paper font-mono text-xs font-medium first:ml-0 ${
            p.evaluated ? "bg-ink text-paper" : "bg-gold text-paper"
          }`}
        >
          {initials(p.name)}
          <span className="absolute -bottom-1 -right-1 rounded-sm bg-paper px-0.5 font-mono text-[9px] leading-tight text-ink ring-1 ring-line">
            {countryCode(p.country)}
          </span>
        </div>
      ))}
      {rest > 0 && (
        <div className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-paper bg-bg font-mono text-xs text-ink-2">
          +{rest}
        </div>
      )}
    </div>
  );
}

// Barra segmentada: valoradas (marino) + por valorar (oro) sobre el total de entregas.
export function SegmentBar({ evaluated, submitted }: { evaluated: number; submitted: number }) {
  if (submitted === 0) return <div className="h-2.5 rounded-full bg-bg" />;
  return (
    <div className="flex h-2.5 overflow-hidden rounded-full bg-bg">
      <div className="bg-ink" style={{ width: `${(evaluated / submitted) * 100}%` }} />
      <div className="bg-gold" style={{ width: `${((submitted - evaluated) / submitted) * 100}%` }} />
    </div>
  );
}
