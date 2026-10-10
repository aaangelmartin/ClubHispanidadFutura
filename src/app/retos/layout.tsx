// Añadido por el perfil 4, sin tocar las páginas del perfil 3: envuelve /retos con el lenguaje visual de la
// landing (pasaporte) y una barra del estudiante. Las páginas heredan el estilo por los tokens de la marca.
import Link from "next/link";
import { pasaporteFonts } from "@/app/empresa/_lib/fonts";
import p from "@/app/empresa/_lib/pasaporte.module.css";
import { db } from "@/lib/supabase";
import { getSession } from "@/lib/session";

async function estudiante() {
  const s = await getSession();
  if (s?.role !== "student") return null;
  const { data } = await db().from("students").select("id, name, university, country").eq("id", s.id).maybeSingle();
  if (!data) return null;
  const { count } = await db()
    .from("submissions")
    .select("id, evaluations!inner(id)", { count: "exact", head: true })
    .eq("student_id", s.id);
  return { ...data, sellos: count ?? 0 };
}

// Cifras reales para la prueba social. Los estudiantes de ejemplo (@ejemplo.test) no cuentan.
async function cifras() {
  const [{ data: abiertos }, { count: estudiantes }] = await Promise.all([
    db().from("challenges").select("company_id, companies(country)").eq("status", "abierto"),
    db().from("students").select("id", { count: "exact", head: true }).not("email", "like", "%ejemplo.test"),
  ]);
  const retos = abiertos ?? [];
  const paises = new Set(
    retos.map((r) => {
      const c = r.companies as { country: string } | { country: string }[] | null;
      return Array.isArray(c) ? c[0]?.country : c?.country;
    }),
  );
  return { retos: retos.length, empresas: new Set(retos.map((r) => r.company_id)).size, paises: paises.size, estudiantes: estudiantes ?? 0 };
}

export default async function RetosLayout({ children }: { children: React.ReactNode }) {
  const [yo, n] = await Promise.all([estudiante(), cifras()]);
  return (
    <div className={`${pasaporteFonts} ${p.page} ${p.seguridad} min-h-screen`}>
      <div className={p.tapa}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div className="flex flex-col">
            <span className={`${p.datos} text-[11px] tracking-[0.2em] text-[var(--oro)]`}>RETOS · ESPAÑA Y COLOMBIA</span>
            <span className="text-2xl font-extrabold [font-stretch:125%]">
              {yo ? `Hola, ${yo.name.split(" ")[0]}.` : "Demuestra lo que sabes hacer."}
            </span>
          </div>
          {yo ? (
            <Link
              href={`/pasaporte/${yo.id}`}
              className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-2.5 ring-1 ring-white/15 hover:ring-[var(--oro)]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-[var(--oro)] text-sm font-extrabold text-[var(--oro)]">
                {yo.sellos}
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-bold">Mi pasaporte</span>
                <span className="text-xs text-[#f3efe6]/70">
                  {yo.sellos === 1 ? "1 sello" : `${yo.sellos} sellos`} · {yo.university}
                </span>
              </span>
            </Link>
          ) : (
            <Link href="/registro?rol=estudiante" className={p.botonOro}>
              Crear mi pasaporte
            </Link>
          )}
        </div>
      </div>
      <div className="border-b border-black/5 bg-white/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-4 sm:px-6">
          <dl className="flex flex-wrap gap-x-8 gap-y-2">
            {[
              [n.retos, n.retos === 1 ? "reto abierto" : "retos abiertos"],
              [n.empresas, n.empresas === 1 ? "empresa" : "empresas"],
              [n.paises, n.paises === 1 ? "país" : "países"],
              [n.estudiantes, n.estudiantes === 1 ? "estudiante registrado" : "estudiantes registrados"],
            ]
              .filter(([v]) => Number(v) > 0) // un cero resta más de lo que suma
              .map(([v, l]) => (
              <div key={String(l)} className="flex items-baseline gap-2">
                <dt className="sr-only">{l}</dt>
                <dd className="text-2xl font-extrabold [font-stretch:125%]">{v}</dd>
                <span className="text-sm text-[var(--tinta-2)]">{l}</span>
              </div>
            ))}
          </dl>
          <ul className={`${p.datos} flex flex-wrap gap-x-5 gap-y-1 text-xs text-[var(--tinta-2)]`}>
            {["Gratis", "Sin CV", "En remoto", "Tu entrega es tuya"].map((x) => (
              <li key={x} className="flex items-center gap-1.5">
                <span className="text-[var(--oro)]">✓</span>
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {children}
    </div>
  );
}
