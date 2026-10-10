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

export default async function RetosLayout({ children }: { children: React.ReactNode }) {
  const yo = await estudiante();
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
      {children}
    </div>
  );
}
