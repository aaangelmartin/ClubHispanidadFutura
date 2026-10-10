// Dueño: perfil 1. El pasaporte de talento abierto: identidad y zona de lectura mecánica a la izquierda,
// sellos de las empresas a la derecha. Datos de ejemplo piloto.
import p from "./pasaporte.module.css";

type Sello = {
  empresa: string;
  ciudad: string;
  fecha: string;
  nota: string;
  color: string;
  forma: "circulo" | "rect";
  pos: React.CSSProperties;
  giro: string;
  retraso: number;
};

const SELLOS: Sello[] = [
  { empresa: "Ibérica Retail", ciudad: "Madrid", fecha: "12 OCT 2026", nota: "8,6", color: "var(--sello-a)", forma: "circulo", pos: { left: "5%", top: "11%" }, giro: "-12deg", retraso: 1700 },
  { empresa: "Andina Pagos", ciudad: "Bogotá", fecha: "03 NOV 2026", nota: "7,9", color: "var(--sello-b)", forma: "rect", pos: { right: "4%", top: "40%" }, giro: "7deg", retraso: 2300 },
  { empresa: "Rutas Caribe", ciudad: "Medellín", fecha: "21 NOV 2026", nota: "9,1", color: "var(--sello-c)", forma: "circulo", pos: { left: "8%", bottom: "5%" }, giro: "-4deg", retraso: 2900 },
];

function Escudo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 268 311" className={className} aria-hidden="true">
      <path d="M12 6 H256 V185 C256 245 212 282 134 305 C56 282 12 245 12 185 Z" fill="none" stroke="currentColor" strokeWidth="12" />
    </svg>
  );
}

function SelloTinta({ s }: { s: Sello }) {
  const comun = {
    color: s.color,
    borderColor: s.color,
    ["--r" as string]: s.giro,
    animationDelay: `${s.retraso}ms`,
    ...s.pos,
  } as React.CSSProperties;

  if (s.forma === "circulo") {
    return (
      <div
        className={`${p.sello} grid h-[112px] w-[112px] place-items-center rounded-full border-[3px] text-center`}
        style={comun}
      >
        <div className="absolute inset-[6px] rounded-full border border-current" />
        <div className={`${p.datos} flex flex-col items-center leading-tight`}>
          <span className="text-[9px] font-bold tracking-[0.18em]">VALORADO</span>
          <span className="mt-0.5 text-[11px] font-bold">{s.empresa}</span>
          <span className="text-[22px] font-bold leading-none">{s.nota}</span>
          <span className="text-[9px] tracking-wider">{s.ciudad.toUpperCase()} · {s.fecha}</span>
        </div>
      </div>
    );
  }
  return (
    <div className={`${p.sello} flex flex-col items-center gap-0.5 border-[3px] px-4 py-2.5`} style={comun}>
      <span className={`${p.datos} text-[9px] font-bold tracking-[0.2em]`}>RETO SUPERADO</span>
      <span className={`${p.datos} text-sm font-bold`}>{s.empresa}</span>
      <span className={`${p.datos} border-y border-current px-2 text-2xl font-bold leading-snug`}>{s.nota}</span>
      <span className={`${p.datos} text-[9px] tracking-wider`}>{s.ciudad.toUpperCase()} · {s.fecha}</span>
    </div>
  );
}

function Campo({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex flex-col">
      <span className={`${p.datos} text-[8.5px] tracking-wider text-[var(--tinta-2)]`}>{etiqueta}</span>
      <span className={`${p.datos} text-[12.5px] font-bold text-[var(--tinta)]`}>{valor}</span>
    </div>
  );
}

export default function Pasaporte() {
  return (
    <div className={`${p.libro} relative mx-auto w-full max-w-[760px]`}>
      <div className="grid grid-cols-2 overflow-hidden rounded-[14px] ring-1 ring-black/10">
        {/* Página de identidad */}
        <div className={`${p.seguridad} relative flex flex-col gap-4 p-5 sm:p-6`}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <span className={`${p.datos} text-[10px] font-bold tracking-[0.16em] text-[var(--tinta)]`}>PASAPORTE DE TALENTO</span>
              <span className={`${p.datos} text-[9px] tracking-[0.12em] text-[var(--tinta-2)]`}>IBEROAMÉRICA</span>
            </div>
            <Escudo className="h-8 w-7 shrink-0 text-[var(--oro)]" />
          </div>
          <div className="flex gap-4">
            <div className="relative grid h-[90px] w-[70px] shrink-0 sm:h-[118px] sm:w-[92px] place-items-center overflow-hidden rounded-md bg-[#d9dfe2] ring-1 ring-black/10">
              <svg viewBox="0 0 92 118" className="absolute inset-0 h-full w-full text-[#9aa6b2]" aria-hidden="true">
                <circle cx="46" cy="46" r="20" fill="currentColor" />
                <path d="M10 118 C14 86 30 76 46 76 C62 76 78 86 82 118 Z" fill="currentColor" />
              </svg>
              <Escudo className="absolute -bottom-3 -right-3 h-12 w-10 text-[var(--oro)] opacity-50" />
            </div>
            <div className="grid min-w-0 flex-1 grid-cols-1 gap-2">
              <Campo etiqueta="Apellidos" valor="ROJAS" />
              <Campo etiqueta="Nombre" valor="ANDRÉS" />
              <Campo etiqueta="Universidad" valor="U. NACIONAL" />
              <Campo etiqueta="Retos valorados" valor="3" />
            </div>
          </div>
          <div className={`${p.datos} mt-auto flex flex-col gap-0.5 rounded-sm bg-white/50 px-2 py-2 text-[8.5px] text-[var(--tinta)] sm:text-[9.5px]`}>
            <span className={p.mrz} style={{ animationDelay: "500ms" }}>P&lt;COLROJAS&lt;&lt;ANDRES&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</span>
            <span className={p.mrz} style={{ animationDelay: "900ms" }}>RETOS0003&lt;COL0410105M3010109&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;06</span>
          </div>
        </div>

        {/* Página de sellos */}
        <div className={`${p.seguridad} relative min-h-[330px] border-l border-black/5`}>
          <span className={`${p.datos} absolute right-5 top-4 text-[9px] tracking-[0.16em] text-[var(--tinta-2)]`}>SELLOS · STAMPS</span>
          {SELLOS.map((s) => (
            <SelloTinta key={s.empresa} s={s} />
          ))}
          <span className={`${p.datos} absolute bottom-3 right-5 text-[9px] tracking-wider text-[var(--tinta-2)]`}>Ejemplo piloto</span>
        </div>
      </div>
      <div className={`${p.lomo} pointer-events-none absolute inset-y-0 left-1/2 w-10 -translate-x-1/2`} aria-hidden="true" />
    </div>
  );
}
