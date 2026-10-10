// Dueño: perfil 1 (entrada y demanda). Panel público para el proyector, como un panel de llegadas
// de aeropuerto: solo registros reales, se refresca solo cada 20 s.
import type { Metadata } from "next";
import Link from "next/link";
import p from "../_landing/pasaporte.module.css";
import s from "./panel.module.css";
import Refresco from "./Refresco";
import Digitos from "./Digitos";
import { Barras, Llegadas, type Llegada } from "./Tablero";
import { getPanel, type Panel as DatosPanel } from "./queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Panel en vivo · Retos Hispanidad Futura" };

function hace(iso: string) {
  const min = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  return h < 24 ? `hace ${h} h` : new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

const hora = (iso: string) =>
  new Date(iso).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" });

function Avion({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M2.5 19h19v2h-19v-2Zm7.18-5.73 4.35 1.16 5.31 1.42a1.5 1.5 0 0 0 .78-2.9l-5.31-1.42-2.76-9.02-1.93-.52v8.28L5.15 7.95l-.93-2.32-1.45-.39v5.17l1.66.45 5.25 1.41Z" />
    </svg>
  );
}

function Marco({ titulo, detalle, children, ras = false }: { titulo: string; detalle?: string; children: React.ReactNode; ras?: boolean }) {
  return (
    <section className={`${s.marco} flex flex-col gap-5 rounded-2xl py-5 md:py-7 ${ras ? "" : "px-5 md:px-7"}`}>
      <header className={`flex items-baseline justify-between gap-4 ${ras ? "px-5 md:px-7" : ""}`}>
        <h2 className={`${p.display} text-xl text-[#f3efe6] md:text-2xl`}>{titulo}</h2>
        {detalle && <span className={`${p.datos} hidden text-xs sm:inline tracking-[0.2em] text-white/40 uppercase md:text-sm`}>{detalle}</span>}
      </header>
      {children}
    </section>
  );
}

function Cabecera({ caido = false }: { caido?: boolean }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="flex items-center gap-5">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-[var(--oro)] text-[var(--tapa)] md:h-20 md:w-20">
          <Avion className="h-9 w-9 md:h-11 md:w-11" />
        </span>
        <div className="flex flex-col gap-2">
          <span className={`${p.datos} text-xs tracking-[0.3em] text-[var(--oro)] uppercase md:text-sm`}>Retos · Hispanidad Futura</span>
          <h1 className={`${p.display} text-5xl text-[#f3efe6] md:text-7xl`}>Llegadas</h1>
        </div>
      </div>
      <Refresco caido={caido} />
    </div>
  );
}

function Vacio({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-white/15 px-5 py-8">
      <span className={`${p.datos} text-sm tracking-[0.2em] text-[var(--oro)] uppercase`}>En espera</span>
      <p className="text-xl text-white/75 md:text-2xl">{children}</p>
    </div>
  );
}

export default async function Panel() {
  let data: DatosPanel;
  try {
    data = await getPanel();
  } catch {
    return (
      <main className={`${p.page} ${p.tapa} min-h-screen`}>
        <div className="mx-auto flex max-w-[1600px] flex-col gap-10 px-4 py-8 sm:px-8 md:py-12">
          <Cabecera caido />
          <section className={`${s.marco} flex flex-col gap-6 rounded-2xl p-6 md:p-10`} role="alert">
            <div className="flex flex-wrap items-center gap-4">
              <span className={`${p.datos} rounded-[4px] bg-[var(--oro)] px-3 py-1 text-sm font-bold tracking-[0.2em] text-[var(--tapa)] uppercase md:text-base`}>
                Retrasado
              </span>
              <span className={`${p.datos} text-sm tracking-[0.2em] text-white/50 uppercase md:text-base`}>Sin conexión con la base de datos</span>
            </div>
            <h2 className={`${p.display} max-w-4xl text-4xl text-[#f3efe6] md:text-6xl`}>El panel no puede leer los datos ahora mismo</h2>
            <p className="max-w-2xl text-lg text-white/70 md:text-xl">
              El panel lo vuelve a intentar solo. En cuanto la base de datos responda, aparecerán las llegadas reales.
            </p>
          </section>
        </div>
      </main>
    );
  }

  const llegadas: Llegada[] = data.ultimos.map((u) => ({
    id: `${u.cuando}-${u.nombre}`,
    nombre: u.nombre,
    universidad: u.universidad,
    pais: u.pais,
    hora: hora(u.cuando),
    hace: hace(u.cuando),
  }));

  const secundarias = [
    { label: "Empresas", valor: data.empresas },
    { label: "Retos publicados", valor: data.retos },
    { label: "Entregas", valor: data.entregas },
  ];

  return (
    <main className={`${p.page} ${p.tapa} min-h-screen`}>
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 py-8 sm:px-8 md:gap-10 md:py-12">
        <Cabecera />

        {/* Cifras: casillas split-flap */}
        <div className="grid gap-4 md:gap-5 lg:grid-cols-[1.25fr_2fr]">
          <div className={`${s.marco} flex flex-col justify-between gap-5 rounded-2xl border-[var(--oro)]/40 p-5 md:p-7`}>
            <span className={`${p.datos} text-sm tracking-[0.2em] text-[var(--oro)] uppercase md:text-base`}>Estudiantes registrados</span>
            <Digitos valor={data.estudiantes} minimo={3} className={`${p.datos} text-[5.5rem] font-bold text-[#f3efe6] md:text-[8.5rem]`} />
            <span className="text-base text-white/60 md:text-lg">Con su pasaporte de talento abierto en España y Colombia</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
            {secundarias.map((c) => (
              <div key={c.label} className={`${s.marco} flex flex-col justify-between gap-5 rounded-2xl p-5 md:p-7`}>
                <span className={`${p.datos} text-sm tracking-[0.2em] text-white/55 uppercase md:text-base`}>{c.label}</span>
                <Digitos valor={c.valor} minimo={2} className={`${p.datos} text-6xl font-bold text-[#f3efe6] md:text-[5.5rem] xl:text-[7rem]`} />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:gap-5 xl:grid-cols-[1.7fr_1fr] xl:items-start">
          <Marco titulo="Últimos registros" detalle="Hora de Madrid" ras>
            {llegadas.length === 0 ? (
              <div className="px-5 md:px-7">
                <Vacio>
                  Aparecerá en cuanto se registre el primer estudiante.{" "}
                  <Link href="/registro" className="text-[var(--oro)] underline underline-offset-4">
                    Regístrate
                  </Link>
                </Vacio>
              </div>
            ) : (
              <Llegadas filas={llegadas} />
            )}
          </Marco>

          <div className="grid gap-4 md:gap-5 md:grid-cols-2 xl:grid-cols-1">
            <Marco titulo="Por país" detalle="Procedencia">
              {data.porPais.length === 0 ? (
                <Vacio>Aparecerá en cuanto se registre el primer estudiante.</Vacio>
              ) : (
                <Barras filas={data.porPais} codigo />
              )}
            </Marco>
            <Marco titulo="Por universidad" detalle="Top 8">
              {data.porUniversidad.length === 0 ? (
                <Vacio>Aparecerá en cuanto se registre el primer estudiante.</Vacio>
              ) : (
                <Barras filas={data.porUniversidad} />
              )}
            </Marco>
          </div>
        </div>

        <p className={`${p.datos} text-sm text-white/40 md:text-base`}>
          Solo registros reales. Las cuentas y los retos de ejemplo del piloto no cuentan aquí.
        </p>
      </div>
    </main>
  );
}
