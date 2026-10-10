// Dueño: perfil 4. Ajustes de la empresa: perfil, equipo, plan e integraciones (maqueta de producto).
import { C } from "@/components/embarca";
import e from "@/app/empresa/_lib/empresa.module.css";
import Accion from "../_lib/Accion";
import { requireCompany } from "../_lib/queries";

export const dynamic = "force-dynamic";

const INTEGRACIONES = [
  { n: "LinkedIn", d: "Publica tus retos en tu página de empresa." },
  { n: "Greenhouse", d: "Envía a tu ATS los candidatos que contactes." },
  { n: "Workday", d: "Sincroniza candidatos y ofertas." },
  { n: "Slack", d: "Avisos de nuevas entregas en tu canal." },
];

function Bloque({ titulo, children, desc }: { titulo: string; desc: string; children: React.ReactNode }) {
  return (
    <section className={`${e.panel} grid gap-5 p-5 sm:p-7 md:grid-cols-[240px_minmax(0,1fr)] md:gap-8`}>
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold" style={{ color: C.marino }}>
          {titulo}
        </h2>
        <p className="text-sm" style={{ color: C.texto2 }}>
          {desc}
        </p>
      </div>
      <div className="flex min-w-0 flex-col gap-4">{children}</div>
    </section>
  );
}

export default async function Ajustes() {
  const company = await requireCompany();
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-col gap-1">
        <span className="text-sm font-semibold" style={{ color: C.texto2 }}>
          {company.name} · {company.country}
        </span>
        <h1 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl" style={{ color: C.marino }}>
          Ajustes y plan
        </h1>
      </header>

      <Bloque titulo="Perfil de empresa" desc="Lo que ven los estudiantes en cada reto.">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="aj-nombre">
            Nombre
            <input id="aj-nombre" className="field font-normal" defaultValue={company.name} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="aj-pais">
            País
            <input id="aj-pais" className="field font-normal" defaultValue={company.country} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="aj-contacto">
            Persona de contacto
            <input id="aj-contacto" className="field font-normal" defaultValue={company.contact_name} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="aj-email">
            Email
            <input id="aj-email" className="field font-normal" defaultValue={company.email} />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="aj-desc">
          Sobre la empresa
          <textarea
            id="aj-desc"
            rows={3}
            className="field font-normal"
            defaultValue={`${company.name} opera en España y Latinoamérica y busca talento joven que resuelva problemas reales.`}
          />
        </label>
        <div>
          <Accion hecho="Perfil guardado" className="btn btn-primary">
            Guardar cambios
          </Accion>
        </div>
      </Bloque>

      <Bloque titulo="Equipo" desc="Quién publica retos y valora entregas.">
        <ul className="flex flex-col divide-y divide-[#e2e2de]">
          {[
            { n: company.contact_name, e: company.email, r: "Administradora" },
            { n: "Equipo de producto", e: "producto@" + company.email.split("@")[1], r: "Revisor" },
          ].map((m) => (
            <li key={m.e} className="flex items-center justify-between gap-3 py-3">
              <span className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#14233d] text-xs font-bold text-white">
                  {m.n
                    .split(" ")
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")}
                </span>
                <span className="flex min-w-0 flex-col">
                <span className="truncate font-semibold">{m.n}</span>
                <span className="truncate text-xs text-[#5f6166]">{m.e}</span>
                </span>
              </span>
              <span className="shrink-0 rounded px-2 py-1 text-xs font-bold" style={{ background: C.superficie, color: C.marino }}>
                {m.r}
              </span>
            </li>
          ))}
        </ul>
        <div>
          <Accion hecho="Invitación enviada">+ Invitar a alguien del equipo</Accion>
        </div>
      </Bloque>

      <Bloque titulo="Plan" desc="Durante el piloto de 90 días, publicar retos es gratis.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col rounded-xl p-5 ring-2 ring-[#c8963a]" style={{ background: "#fdf8ee" }}>
            <span className="self-start rounded px-2 py-1 text-xs font-bold" style={{ background: C.oro, color: C.marino }}>
              Plan actual
            </span>
            <p className="mt-3 text-lg font-bold">Piloto</p>
            <p className="text-4xl font-bold tracking-[-0.02em]">0 €</p>
            <p className="mt-2 text-sm text-[#5f6166]">Retos ilimitados, valoración con ayuda de IA y mensajes con candidatos. Termina el día 90.</p>
          </div>
          <div className="flex flex-col rounded-xl p-5 ring-1 ring-[#e2e2de]">
            <span className="self-start rounded px-2 py-1 text-xs font-bold" style={{ background: C.superficie, color: C.texto2 }}>
              Después del piloto
            </span>
            <p className="mt-3 text-lg font-bold">Empresa</p>
            <p className="text-lg font-bold leading-snug">Pago por reto publicado + comisión si contratas</p>
            <p className="mt-2 text-sm text-[#5f6166]">Siempre por debajo de lo que cuesta una agencia de selección.</p>
          </div>
        </div>
        <p className="text-sm text-[#5f6166]">Facturas: no hay facturas durante el piloto.</p>
      </Bloque>

      <Bloque titulo="Integraciones" desc="Conecta la plataforma con las herramientas que ya usas.">
        <ul className="grid gap-3 sm:grid-cols-2">
          {INTEGRACIONES.map((i) => (
            <li key={i.n} className="flex items-center justify-between gap-3 rounded-xl p-4 ring-1 ring-[#e2e2de]">
              <span className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-bold text-white" style={{ background: C.azul }}>
                  {i.n[0]}
                </span>
                <span className="flex min-w-0 flex-col">
                <span className="font-semibold">{i.n}</span>
                <span className="text-xs text-[#5f6166]">{i.d}</span>
                </span>
              </span>
              <Accion hecho={`${i.n} conectado`}>Conectar</Accion>
            </li>
          ))}
        </ul>
      </Bloque>
    </main>
  );
}
