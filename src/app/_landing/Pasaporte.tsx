"use client";
// Dueño: perfil 1. El pasaporte de talento a tamaño real (página 125 × 88): llega cerrado, la tapa
// gira sobre el lomo y revela las páginas, se escribe la zona de lectura mecánica y caen los sellos.
// Datos de ejemplo piloto.
import { useEffect, useId, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import h from "./hero.module.css";

const EASE = [0.2, 0.7, 0.2, 1] as const;

const MRZ_1 = "P<COLROJAS<VILLA<<ANDRES".padEnd(44, "<");
const MRZ_2 = "HF26041207COL0410105M3010109".padEnd(42, "<") + "06";
const MRZ_TOTAL = MRZ_1.length + MRZ_2.length;

type Sello = {
  empresa: string;
  ciudad: string;
  fecha: string;
  nota: string;
  titulo: string;
  color: string;
  forma: "circulo" | "rect";
  pos: React.CSSProperties;
  giro: number;
  semilla: number;
};

const SELLOS: Sello[] = [
  { empresa: "IBÉRICA RETAIL", ciudad: "MADRID", fecha: "12 OCT 2026", nota: "8,6", titulo: "VALORADO", color: "var(--sello-a)", forma: "circulo", pos: { left: "5cqw", top: "14cqw" }, giro: -11, semilla: 4 },
  { empresa: "ANDINA PAGOS", ciudad: "BOGOTÁ", fecha: "03 NOV 2026", nota: "7,9", titulo: "ENTREGA VALORADA", color: "var(--sello-b)", forma: "rect", pos: { left: "37cqw", top: "40cqw" }, giro: 6, semilla: 9 },
  { empresa: "RUTAS CARIBE", ciudad: "MEDELLÍN", fecha: "21 NOV 2026", nota: "9,1", titulo: "VALORADO", color: "var(--sello-c)", forma: "circulo", pos: { right: "5cqw", top: "7cqw" }, giro: 8, semilla: 2 },
];

// Momentos de la secuencia (segundos desde que se monta)
const T_ABRIR = 0.55;
const T_MRZ = 1.45;
const T_SELLOS = [2.35, 2.75, 3.15];

function Escudo({ className = "", grosor = 12 }: { className?: string; grosor?: number }) {
  return (
    <svg viewBox="0 0 268 311" className={className} aria-hidden="true">
      <path d="M12 6 H256 V185 C256 245 212 282 134 305 C56 282 12 245 12 185 Z" fill="none" stroke="currentColor" strokeWidth={grosor} />
    </svg>
  );
}

// Símbolo de documento con chip, como en los pasaportes electrónicos
function Chip({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 26" className={className} aria-hidden="true">
      <rect x="1.5" y="1.5" width="37" height="23" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="20" cy="13" r="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M1.5 13 H14.5 M25.5 13 H38.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/* Filtro de tinta: borde irregular y carga de tinta desigual, como un sello de goma de verdad */
function FiltroTinta({ id, semilla }: { id: string; semilla: number }) {
  return (
    <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={semilla} result="grano" />
      <feDisplacementMap in="SourceGraphic" in2="grano" scale="1.3" xChannelSelector="R" yChannelSelector="G" result="borde" />
      <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed={semilla + 7} result="carga" />
      <feColorMatrix in="carga" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.7 1.8" result="cargaA" />
      <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed={semilla + 3} result="poro" />
      <feColorMatrix in="poro" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 2.2" result="poroA" />
      <feComposite in="borde" in2="cargaA" operator="in" result="b1" />
      <feComposite in="b1" in2="poroA" operator="in" />
    </filter>
  );
}

function SelloTinta({ s, sellado, filtro, quieto }: { s: Sello; sellado: boolean; filtro: string; quieto: boolean }) {
  const estilo: React.CSSProperties = { color: s.color, filter: `url(#${filtro})`, ...s.pos };
  const final = { opacity: 0.86, scale: 1, rotate: s.giro, y: 0 };
  const contenido =
    s.forma === "circulo" ? (
      <div className={h.selloTexto}>
        <span className={h.selloMini}>{s.titulo}</span>
        <span className={h.selloEmpresa}>{s.empresa}</span>
        <span className={h.selloNota}>{s.nota}</span>
        <span className={h.selloPie}>
          {s.ciudad} {s.fecha}
        </span>
      </div>
    ) : (
      <div className={h.selloTexto}>
        <span className={h.selloMini}>{s.titulo}</span>
        <span className={h.selloEmpresa}>{s.empresa}</span>
        <span className={h.selloNotaRect}>{s.nota}</span>
        <span className={h.selloPie}>
          {s.ciudad} {s.fecha}
        </span>
      </div>
    );

  return (
    <motion.div
      className={`${h.sello} ${s.forma === "circulo" ? h.selloCirculo : h.selloRect}`}
      style={estilo}
      initial={quieto ? final : { opacity: 0, scale: 1.75, rotate: s.giro - 9, y: -14 }}
      animate={sellado || quieto ? final : undefined}
      transition={{ type: "spring", stiffness: 620, damping: 24, mass: 0.7, opacity: { duration: 0.08 } }}
    >
      {contenido}
    </motion.div>
  );
}

function Campo({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="min-w-0">
      <span className={h.etiqueta}>{etiqueta}</span>
      <span className={h.valor}>{valor}</span>
    </div>
  );
}

export default function Pasaporte() {
  const quieto = useReducedMotion() ?? false;
  const base = useId().replace(/:/g, "");

  // -180: cerrado (la tapa cubre la página de identidad); 0: abierto
  const giro = useMotionValue(quieto ? 0 : -180);
  const llegada = useMotionValue(quieto ? 1 : 0);
  const golpe = useMotionValue(0);
  const [letras, setLetras] = useState(quieto ? MRZ_TOTAL : 0);
  const [sellados, setSellados] = useState(quieto ? SELLOS.length : 0);

  // Cerrado, el libro se centra en su hueco; al abrirse baja a su sitio
  const centrado = useTransform(giro, [-180, 0], ["-25%", "0%"]);
  const llegadaY = useTransform(llegada, [0, 1], [70, 0]);
  const llegadaO = useTransform(llegada, [0, 0.4], [0, 1]);
  const llegadaR = useTransform(llegada, [0, 1], [-14, 0]);
  const luzFrente = useTransform(giro, [-180, -100, -60, 0], [0.9, 0.55, 0.25, 0]);
  const luzTapa = useTransform(giro, [-180, -120, -90], [0, 0.35, 0.7]);
  const sombraBio = useTransform(giro, [-180, -150, -70, 0], [0, 0.4, 0.15, 0]);

  useEffect(() => {
    if (quieto) return;
    const controles = [
      animate(llegada, 1, { duration: 0.75, ease: EASE }),
      animate(giro, 0, { type: "spring", stiffness: 70, damping: 13, mass: 1.1, delay: T_ABRIR }),
      animate(0, MRZ_TOTAL, {
        duration: 1.05,
        ease: "linear",
        delay: T_MRZ,
        onUpdate: (v) => setLetras(Math.round(v)),
      }),
    ];
    const relojes = T_SELLOS.map((t, i) =>
      window.setTimeout(() => {
        setSellados(i + 1);
        window.setTimeout(() => {
          animate(golpe, [0, 4, -1, 0], { duration: 0.26, ease: "easeOut" });
        }, 70);
      }, t * 1000),
    );
    return () => {
      controles.forEach((c) => c.stop());
      relojes.forEach((r) => window.clearTimeout(r));
    };
  }, [quieto, giro, llegada, golpe]);

  const l1 = Math.min(letras, MRZ_1.length);
  const l2 = Math.max(0, letras - MRZ_1.length);
  const escribiendo = letras > 0 && letras < MRZ_TOTAL;

  return (
    <div className={h.libro} role="img" aria-label="Pasaporte de talento de ejemplo: datos del estudiante y tres sellos de empresas que han valorado sus entregas">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          {SELLOS.map((s, i) => (
            <FiltroTinta key={s.empresa} id={`${base}-tinta-${i}`} semilla={s.semilla} />
          ))}
        </defs>
      </svg>

      <motion.div className={h.cuerpo} style={{ y: centrado }}>
        <motion.div className={h.cuerpo} style={{ y: llegadaY, opacity: llegadaO, rotateX: llegadaR }}>
          <motion.div className={h.cuerpo} style={{ y: golpe }}>
            <div className={h.sombra} />

            {/* Página de identidad (fija) */}
            <div className={`${h.hoja} ${h.hojaAbajo}`}>
              <div className={`${h.cara} ${h.caraAbajo}`}>
                <div className={`${h.papel} ${h.papelAbajo} ${h.pliegueAbajo}`}>
                  <div className={h.bio}>
                    <div className={h.bioCabecera}>
                      <div>
                        <div className={h.rotulo}>PASAPORTE DE TALENTO</div>
                        <div className={h.subrotulo}>TALENT PASSPORT  CLUB HISPANIDAD FUTURA</div>
                      </div>
                      <Escudo className="h-[6cqw] w-[5.2cqw] shrink-0 text-[var(--oro)]" grosor={16} />
                    </div>
                    <div className={h.bioCuerpo}>
                      <div className={h.foto}>
                        <svg viewBox="0 0 92 118" className="absolute inset-0 h-full w-full text-[#9ba7b3]" aria-hidden="true">
                          <circle cx="46" cy="47" r="19" fill="currentColor" />
                          <path d="M8 118 C12 88 28 76 46 76 C64 76 80 88 84 118 Z" fill="currentColor" />
                        </svg>
                        <Escudo className="absolute -bottom-[1.6cqw] -right-[1.4cqw] h-[11cqw] w-[9.5cqw] text-[var(--oro)] opacity-40" grosor={10} />
                      </div>
                      <div className={h.campos}>
                        <Campo etiqueta="Apellidos" valor="ROJAS VILLA" />
                        <Campo etiqueta="Nombre" valor="ANDRÉS" />
                        <Campo etiqueta="Nacionalidad" valor="COLOMBIANA" />
                        <Campo etiqueta="Universidad" valor="UNAL BOGOTÁ" />
                        <Campo etiqueta="Especialidad" valor="DATOS" />
                        <Campo etiqueta="Retos valorados" valor="3" />
                        <Campo etiqueta="Emisión" valor="12 OCT 2026" />
                        <Campo etiqueta="Pasaporte n.º" valor="HF260412" />
                      </div>
                    </div>
                    <div className={h.mrz} aria-hidden="true">
                      <span className={h.mrzLinea}>
                        {MRZ_1.slice(0, l1)}
                        {escribiendo && letras <= MRZ_1.length && <span className={h.cursor} />}
                        <span className={h.mrzResto}>{MRZ_1.slice(l1)}</span>
                      </span>
                      <span className={h.mrzLinea}>
                        {MRZ_2.slice(0, l2)}
                        {escribiendo && letras > MRZ_1.length && <span className={h.cursor} />}
                        <span className={h.mrzResto}>{MRZ_2.slice(l2)}</span>
                      </span>
                    </div>
                  </div>
                  <motion.div className={h.luz} style={{ opacity: sombraBio }} />
                </div>
              </div>
            </div>

            {/* Hoja que gira sobre el lomo: delante la página de sellos, detrás la tapa */}
            <motion.div className={`${h.hoja} ${h.hojaArriba}`} style={{ rotateX: giro }}>
              <div className={`${h.cara} ${h.caraArriba}`}>
                <div className={`${h.papel} ${h.papelArriba} ${h.pliegueArriba}`}>
                  <div className={h.cabeceraSellos}>
                    <div className={h.rotulo}>SELLOS</div>
                    <div className={h.subrotulo}>RETOS VALORADOS</div>
                  </div>
                  {SELLOS.map((s, i) => (
                    <SelloTinta key={s.empresa} s={s} sellado={sellados > i} filtro={`${base}-tinta-${i}`} quieto={quieto} />
                  ))}
                  <span className={h.pie} style={{ left: "4cqw" }}>Ejemplo piloto</span>
                  <span className={h.pie} style={{ right: "4cqw" }}>07</span>
                  <motion.div className={h.luz} style={{ opacity: luzFrente }} />
                </div>
              </div>
              <div className={`${h.cara} ${h.tapa}`}>
                <div className={h.tapaMarco} />
                <span className={h.tapaTitulo}>PASAPORTE DE TALENTO</span>
                <Escudo className="h-[16cqw] w-[14cqw]" grosor={10} />
                <span className={h.tapaMarca}>Club Hispanidad Futura</span>
                <Chip className={h.tapaChip} />
                <motion.div className={h.luz} style={{ opacity: luzTapa }} />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
