// Marca del producto: el escudo del Club Hispanidad Futura con la palabra del producto
// (Raleway ExtraBold, como «CLUB») y «Hispanidad Futura» en caligrafía (Lobster). Ver docs/BRANDING.md.
// Dueño: perfil 1. Cuando el equipo elija nombre, cambia PALABRA_ESCUDO.

export const PALABRA_ESCUDO = "RETOS";

// Escudo calcado del logo: arriba recto, laterales rectos y punta abajo. La palabra corta el trazo.
export function Escudo({ size = 40, fondo = "var(--bg)" }: { size?: number; fondo?: string }) {
  return (
    <svg width={size} height={(size * 311) / 268} viewBox="0 0 268 311" aria-hidden="true">
      <path
        d="M12 6 H256 V185 C256 245 212 282 134 305 C56 282 12 245 12 185 Z"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="12"
      />
      <rect x="0" y="92" width="268" height="70" fill={fondo} />
      <text
        x="134"
        y="146"
        textAnchor="middle"
        fill="var(--gold)"
        style={{ fontFamily: "var(--font-raleway), sans-serif", fontWeight: 800, fontSize: 64, letterSpacing: 4 }}
      >
        {PALABRA_ESCUDO}
      </text>
    </svg>
  );
}

export default function Marca({ size = 40, fondo, compacta = false }: { size?: number; fondo?: string; compacta?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <Escudo size={size} fondo={fondo} />
      <span
        className={`font-script leading-none text-ink ${compacta ? "hidden sm:inline" : ""}`}
        style={{ fontSize: size * 0.72 }}
      >
        Hispanidad Futura
      </span>
    </span>
  );
}
