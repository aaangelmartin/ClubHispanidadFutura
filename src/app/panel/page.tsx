// Dueño: perfil 1 (entrada y demanda). Panel público para el proyector, como un tablero de llegadas
// de aeropuerto: solo registros reales, se refresca solo cada 20 s.
import type { Metadata } from "next";
import Link from "next/link";
import s from "./panel.module.css";
import Refresco from "./Refresco";
import Digitos from "./Digitos";
import { Barras, Llegadas, RepartoPais, type Llegada } from "./Tablero";
import { getPanel, type Panel as DatosPanel } from "./queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Panel en vivo · Embarca" };

function hace(iso: string) {
  const min = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (min < 1) return "Ahora";
  if (min < 60) return `Hace ${min} min`;
  const h = Math.round(min / 60);
  return h < 24 ? `Hace ${h} h` : new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

const hora = (iso: string) =>
  new Date(iso).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" });

function Cabecera({ caido = false }: { caido?: boolean }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5 border-b border-white/10 pb-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-[0.06em] text-white md:text-4xl">LLEGADAS</h1>
        <p className="text-sm text-white/65 md:text-base">Estudiantes de España y Colombia que ya tienen su pasaporte en Embarca</p>
      </div>
      <Refresco caido={caido} />
    </header>
  );
}

function Etiqueta({ children, detalle }: { children: React.ReactNode; detalle?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h2 className={s.etiqueta}>{children}</h2>
      {detalle && <span className="hidden text-sm text-white/45 sm:inline">{detalle}</span>}
    </div>
  );
}

function Llamada() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border-2 border-[#c8963a] bg-[#c8963a]/[0.08] p-5 md:p-6">
      <span className="text-sm font-bold text-[#c8963a]">¿Eres estudiante?</span>
      <p className="text-2xl font-extrabold leading-tight text-white md:text-3xl">Saca tu pasaporte en 1 minuto</p>
      <Link
        href="/registro?rol=estudiante"
        className="w-fit rounded-md bg-[#c8963a] px-4 py-2 font-[family-name:var(--font-b612)] text-base font-bold text-[#14233d]"
      >
        → /registro
      </Link>
    </div>
  );
}

export default async function Panel() {
  let data: DatosPanel;
  try {
    data = await getPanel();
  } catch {
    return (
      <main className={`${s.tablero} min-h-screen`}>
        <div className="mx-auto flex max-w-[1600px] flex-col gap-10 px-4 py-6 sm:px-8 md:py-10">
          <Cabecera caido />
          <section className="flex flex-col gap-5 rounded-lg border border-[#f59e0b]/40 bg-white/[0.03] p-6 md:p-10" role="alert">
            <span className="w-fit rounded-[3px] bg-[#f59e0b] px-2.5 py-1 text-sm font-bold text-[#14233d]">Retrasado</span>
            <h2 className="max-w-4xl text-3xl font-extrabold leading-tight text-white md:text-5xl">El panel no puede leer los datos ahora mismo</h2>
            <p className="max-w-2xl text-lg text-white/70 md:text-xl">
              Lo vuelve a intentar solo. En cuanto la base de datos responda, aparecerán las llegadas reales.
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
  const vacio = data.estudiantes === 0;

  const secundarias = [
    { label: "Empresas", valor: data.empresas },
    { label: "Retos", valor: data.retos },
    { label: "Entregas", valor: data.entregas },
  ];

  return (
    <main className={`${s.tablero} min-h-screen`}>
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 py-6 sm:px-8 md:gap-10 md:py-10">
        <Cabecera />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
          {/* Izquierda: cifras en casillas split-flap */}
          <div className="flex min-w-0 flex-col gap-8">
            <section className="flex flex-col gap-4">
              <Etiqueta>Estudiantes con pasaporte</Etiqueta>
              <Digitos valor={data.estudiantes} minimo={3} className="font-[family-name:var(--font-b612)] text-[5.2rem] font-bold sm:text-[8rem] xl:text-[10rem]" />
              {vacio && (
                <div className="flex flex-col gap-2">
                  <p className="text-3xl font-extrabold text-white md:text-4xl">
                    Esperando la primera llegada<span className={s.cursor} aria-hidden="true" />
                  </p>
                  <p className="max-w-[48ch] text-base text-white/65 md:text-lg">
                    Cuando alguien saque su pasaporte, su nombre aparecerá aquí en menos de 20 segundos. Sin datos inventados.
                  </p>
                </div>
              )}
            </section>

            <section className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {secundarias.map((c) => (
                <div key={c.label} className="flex min-w-0 flex-col gap-3">
                  <h2 className={`${s.etiqueta} truncate`}>{c.label}</h2>
                  <Digitos valor={c.valor} minimo={3} className="font-[family-name:var(--font-b612)] text-[1.9rem] font-bold sm:text-5xl" />
                </div>
              ))}
            </section>

            {data.porPais.length > 0 && (
              <section className="flex flex-col gap-4 border-t border-white/10 pt-6">
                <Etiqueta>Por país de origen</Etiqueta>
                <RepartoPais filas={data.porPais} />
              </section>
            )}
          </div>

          {/* Derecha: últimas llegadas y universidades */}
          <div className="flex min-w-0 flex-col gap-8">
            <section className="flex flex-col gap-4">
              <Etiqueta detalle="Hora de Madrid · se actualiza solo">Últimas llegadas</Etiqueta>
              {llegadas.length === 0 ? (
                <div className="flex flex-col gap-1.5" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-14 rounded-[4px] bg-white/[0.035]" style={{ opacity: 1 - i * 0.16 }} />
                  ))}
                </div>
              ) : (
                <Llegadas filas={llegadas} />
              )}
            </section>

            {vacio ? (
              <Llamada />
            ) : (
              <section className="flex flex-col gap-4 border-t border-white/10 pt-6">
                <Etiqueta detalle="Las 8 con más pasaportes">Por universidad</Etiqueta>
                <Barras filas={data.porUniversidad} />
              </section>
            )}
          </div>
        </div>

        <p className="text-sm text-white/45">Solo registros reales. Las cuentas y los retos de ejemplo del piloto no cuentan aquí.</p>
      </div>
    </main>
  );
}
