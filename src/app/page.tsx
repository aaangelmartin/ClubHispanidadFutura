// Dueño: perfil 1 (entrada y demanda). Landing de Embarca (diseño «Landing v2 · Hispanidad Futura», marino y oro).
// Las piezas animadas viven en _landing/. Ver docs/PRD.md §1–3 y §8 P1.
import Link from "next/link";
import { contarEstudiantes } from "./panel/queries";
import { Logo } from "@/components/embarca";
import {
  Aparece,
  Contador,
  EmpresaEscribe,
  IADecides,
  LeyendaNotas,
  PanelSalidas,
  PasaporteEstudiante,
  PortadaAnimada,
} from "./_landing/animados";
import { LLEGADAS } from "./_landing/datos";

export const dynamic = "force-dynamic";

const ENVOLTURA = "mx-auto w-full max-w-[1312px] px-5 sm:px-8 lg:px-16";
const H2 = "text-[34px] font-bold leading-[1.05] tracking-[-0.035em] sm:text-[48px]";

function Punto({ children, claro = false }: { children: React.ReactNode; claro?: boolean }) {
  return (
    <li className="flex gap-3.5">
      <span aria-hidden="true" className="mt-[9px] h-2.5 w-2.5 shrink-0 rounded-[2px] bg-gold" />
      <span className={`text-[17px] leading-[1.45] ${claro ? "text-[#dfe3ea]" : "text-ink"}`}>{children}</span>
    </li>
  );
}

function Ejemplo({ claro = false }: { claro?: boolean }) {
  return <span className={`text-xs ${claro ? "text-[#b9bcc2]" : "text-ink-2"}`}>Ejemplo</span>;
}

export default async function Home() {
  const registrados = await contarEstudiantes();
  const hayCifra = typeof registrados === "number" && registrados > 0;

  return (
    <main className="overflow-x-clip">
      {/* 1 · Banda de señales */}
      <nav aria-label="Señales" className="bg-gold">
        <div className={`${ENVOLTURA} flex flex-wrap items-center gap-x-8 gap-y-1 py-2.5 text-[14px] font-semibold text-ink`}>
          <Link href="/retos" className="hover:underline">→ Retos abiertos</Link>
          <span>✈ España ↔ Colombia</span>
          <Link href="/panel" className="hover:underline">↗ Panel de llegadas en directo</Link>
        </div>
      </nav>

      {/* 2 · Portada */}
      <section className="bg-ink text-white">
        <div className={`${ENVOLTURA} grid items-center gap-14 py-16 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:py-24`}>
          <div className="flex flex-col gap-6">
            <h1 className="text-[44px] font-bold leading-[1.02] tracking-[-0.04em] sm:text-[64px] lg:text-[72px]">El talento se demuestra.</h1>
            <p className="max-w-[34ch] text-[19px] leading-[1.5] text-[#c9cfda]">
              Empresas de España y Colombia publican retos reales. Estudiantes los resuelven en días. Cada entrega valorada queda en su pasaporte.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/registro?rol=empresa" className="btn btn-primary !px-5 !py-3 !text-base">Soy empresa</Link>
              <Link href="/registro?rol=estudiante" className="btn !border-white !bg-transparent !px-5 !py-3 !text-base !text-white hover:!bg-white/10">
                Soy estudiante
              </Link>
            </div>
            <p className="text-sm text-[#b9bcc2]">Piloto de 90 días entre España y Colombia. Gratis para estudiantes.</p>
          </div>
          <PortadaAnimada />
        </div>
      </section>

      {/* 3 · Para empresas */}
      <section className="bg-paper">
        <div className={`${ENVOLTURA} grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-[72px] lg:py-24`}>
          <Aparece className="flex flex-col gap-6">
            <span className="text-base font-bold text-blue">Para empresas</span>
            <h2 className={H2}>Ve el trabajo antes de contratar.</h2>
            <ul className="flex max-w-[460px] flex-col gap-4">
              <Punto>Cuenta qué necesitas en dos frases. La IA lo convierte en un reto con plazo, entregable y rúbrica.</Punto>
              <Punto>Recibes soluciones de estudiantes de dos países, sin CV ni procesos de selección.</Punto>
              <Punto>Valoras cada entrega y contactas a quien te interese.</Punto>
            </ul>
            <div>
              <Link href="/registro?rol=empresa" className="btn btn-primary !px-5 !py-3 !text-base">Soy empresa</Link>
            </div>
          </Aparece>
          <EmpresaEscribe />
        </div>
      </section>

      {/* 4 · Para estudiantes */}
      <section className="bg-ink text-white">
        <div className={`${ENVOLTURA} grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-[72px] lg:py-24`}>
          <div className="order-2 lg:order-1">
            <PasaporteEstudiante />
          </div>
          <Aparece className="order-1 flex flex-col gap-6 lg:order-2">
            <span className="text-base font-bold text-gold">Para estudiantes</span>
            <h2 className={H2}>Embarca en tu primera experiencia real.</h2>
            <ul className="flex max-w-[460px] flex-col gap-4">
              <Punto claro>Elige un reto de una empresa de España o Colombia y resuélvelo en remoto, en días.</Punto>
              <Punto claro>Cada entrega valorada suma un sello a tu pasaporte, aunque no ganes.</Punto>
              <Punto claro>Gratis. Siempre.</Punto>
            </ul>
            <div>
              <Link href="/registro?rol=estudiante" className="btn btn-primary !px-5 !py-3 !text-base">Crear mi pasaporte</Link>
            </div>
          </Aparece>
        </div>
      </section>

      {/* 5 · Nadie se queda en tierra */}
      <section className="bg-white">
        <div className={`${ENVOLTURA} flex flex-col gap-10 py-20 lg:py-24`}>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <Aparece className="flex max-w-[640px] flex-col gap-4">
              <h2 className={H2}>Nadie se queda en tierra.</h2>
              <p className="text-[19px] leading-[1.5] text-ink-2">
                La empresa valora todas las entregas, también las que no ganan. Cada nota lleva su color para ver de un vistazo cómo ha ido.
              </p>
            </Aparece>
            <LeyendaNotas />
          </div>
          <div className="flex flex-col gap-2">
            <PanelSalidas />
            <Ejemplo />
          </div>
        </div>
      </section>

      {/* 6 · La IA prepara. Tú decides. */}
      <section className="bg-paper">
        <div className={`${ENVOLTURA} grid items-center gap-12 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-[72px] lg:py-24`}>
          <Aparece className="flex flex-col gap-5">
            <h2 className={H2}>La IA prepara. Tú decides.</h2>
            <p className="text-[19px] leading-[1.5] text-ink-2">
              La IA monta el reto y resume cada entrega para que la leas en un minuto. No pone notas ni ordena candidatos: eso lo hace una persona, como pide la Ley de IA de la UE.
            </p>
          </Aparece>
          <IADecides />
        </div>
      </section>

      {/* 7 · Llegadas de hoy */}
      <section className="bg-ink text-white">
        <div className={`${ENVOLTURA} flex flex-col gap-7 py-16 lg:py-20`}>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="flex flex-col gap-3">
              <span className="flex items-center gap-2 text-[15px] font-semibold">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#3fa34d]" />
                </span>
                En directo
              </span>
              <h2 className={H2}>Llegadas de hoy</h2>
            </div>
            {hayCifra && (
              <div className="flex flex-col sm:items-end">
                <span className="font-mono text-[56px] font-bold leading-none text-gold sm:text-[64px]">
                  <Contador valor={registrados} />
                </span>
                <span className="mt-1 text-sm text-[#b9bcc2]">estudiantes con pasaporte</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <ul className="overflow-hidden rounded-xl border border-white/10">
              {LLEGADAS.map((l, i) => (
                <li key={l.nombre}>
                  <Aparece retraso={i * 0.15} className="flex flex-wrap items-center gap-x-5 gap-y-1 border-b border-white/10 bg-white/[0.04] px-4 py-3.5 sm:px-6">
                    <span className="font-mono text-base font-bold text-gold">{l.hora}</span>
                    <span className="font-semibold">{l.nombre}</span>
                    <span className="text-[#c9cfda]">{l.uni}</span>
                    <span className="ml-auto flex items-center gap-3">
                      <span className={`rounded px-1.5 py-0.5 font-mono text-xs font-bold text-white ${l.pais === "ESP" ? "bg-red" : "bg-blue"}`}>{l.pais}</span>
                      <span className="text-sm font-semibold text-gold">Pasaporte emitido</span>
                    </span>
                  </Aparece>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between gap-4">
              <Ejemplo claro />
              <Link href="/panel" className="text-sm font-semibold text-gold hover:underline">Ver el panel en directo →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8 · Cierre */}
      <section className="bg-gold">
        <div className={`${ENVOLTURA} flex flex-col justify-between gap-8 py-16 md:flex-row md:items-center lg:py-[88px]`}>
          <h2 className={`${H2} max-w-[16ch] text-ink`}>Tu próximo junior está a punto de embarcar.</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/registro?rol=empresa" className="btn !border-ink !bg-ink !px-5 !py-3 !text-base !text-white hover:!bg-[#0d1829]">Soy empresa</Link>
            <Link href="/registro?rol=estudiante" className="btn !border-ink !bg-transparent !px-5 !py-3 !text-base !text-ink hover:!bg-white/20">Soy estudiante</Link>
          </div>
        </div>
      </section>

      {/* 9 · Pie */}
      <footer className="border-t border-line bg-white">
        <div className={`${ENVOLTURA} flex flex-col justify-between gap-4 py-8 md:flex-row md:items-center`}>
          <div className="flex flex-wrap items-center gap-3 text-sm text-ink-2">
            <Logo size={22} />
            <span>Una iniciativa del Club Hispanidad Futura · Hackathon Iberoamérica 2030</span>
          </div>
          <nav aria-label="Pie" className="flex flex-wrap gap-5 text-sm font-semibold text-ink">
            <Link href="/retos" className="hover:text-blue">Retos</Link>
            <Link href="/panel" className="hover:text-blue">Panel en directo</Link>
            <Link href="/registro?rol=empresa" className="hover:text-blue">Empresas</Link>
            <Link href="/registro?rol=estudiante" className="hover:text-blue">Estudiantes</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
