// Cabecera de Embarca: los enlaces cambian según quién eres (visitante, estudiante o empresa).
// Dueño: perfil 1 (puede cambiar el estilo; las rutas no se cambian sin avisar).
import { getSession } from "@/lib/session";
import { db } from "@/lib/supabase";
import { DEMO_MODE } from "@/lib/demo";
import HeaderShell from "@/components/HeaderShell";
import NavEmbarca, { type AccionNav, type EnlaceNav } from "@/components/NavEmbarca";

// Nombre de quien tiene la sesión, para enseñarlo en la barra. Si la base de datos falla, no se muestra.
async function nombreDe(role: "student" | "company", id: string): Promise<string | undefined> {
  try {
    const tabla = role === "student" ? "students" : "companies";
    const { data } = await db().from(tabla).select("name").eq("id", id).maybeSingle();
    return (data?.name as string | undefined) ?? undefined;
  } catch {
    return undefined;
  }
}

export default async function Header() {
  const session = await getSession();
  const demo: AccionNav[] = DEMO_MODE ? [{ href: "/demo", label: "Demo", tipo: "texto" }] : [];

  let enlaces: EnlaceNav[];
  let acciones: AccionNav[];
  let quien: string | undefined;
  const rol = session?.role === "student" ? "estudiante" : session?.role === "company" ? "empresa" : undefined;

  if (session?.role === "company") {
    quien = await nombreDe("company", session.id);
    enlaces = [
      { href: "/empresa", label: "Terminal" },
      { href: "/empresa/nuevo", label: "Publicar reto" },
      { href: "/empresa/candidatos", label: "Candidatos" },
      { href: "/panel", label: "Panel en vivo" },
    ];
    acciones = [...demo, { href: "/salir", label: "Salir", tipo: "secundaria" }];
  } else if (session?.role === "student") {
    quien = await nombreDe("student", session.id);
    enlaces = [
      { href: "/estudiante", label: "Inicio" },
      { href: "/retos", label: "Retos abiertos" },
      { href: `/pasaporte/${session.id}`, label: "Mi pasaporte" },
      { href: "/panel", label: "Panel en vivo" },
    ];
    acciones = [...demo, { href: "/salir", label: "Salir", tipo: "secundaria" }];
  } else {
    enlaces = [
      { href: "/retos", label: "Retos" },
      { href: "/#empresas", label: "Para empresas" },
      { href: "/#estudiantes", label: "Para estudiantes" },
      { href: "/panel", label: "Panel en vivo" },
    ];
    acciones = [
      ...demo,
      { href: "/entrar", label: "Entrar", tipo: "texto" },
      { href: "/registro?rol=estudiante", label: "Soy estudiante", tipo: "secundaria" },
      { href: "/registro?rol=empresa", label: "Soy empresa", tipo: "principal" },
    ];
  }

  return (
    <HeaderShell>
      <NavEmbarca enlaces={enlaces} acciones={acciones} quien={quien} rol={rol} />
    </HeaderShell>
  );
}
