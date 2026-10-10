// Cabecera con todas las rutas de la app ya enlazadas, para que ningún perfil dependa de otro.
// Dueño: perfil 1 (puede cambiar el estilo; las rutas no se cambian sin avisar).
import Link from "next/link";
import { getSession } from "@/lib/session";
import Marca from "@/components/Marca";
import HeaderShell from "@/components/HeaderShell";

export default async function Header() {
  const session = await getSession();
  const links =
    session?.role === "company"
      ? [
          { href: "/empresa/nuevo", label: "Publicar reto" },
          { href: "/empresa", label: "Mis retos" },
          { href: "/empresa/candidatos", label: "Candidatos" },
        ]
      : session?.role === "student"
        ? [
            { href: "/retos", label: "Retos" },
            { href: `/pasaporte/${session.id}`, label: "Mi pasaporte" },
          ]
        : [
            { href: "/retos", label: "Retos" },
            { href: "/registro", label: "Registrarse" },
          ];

  return (
    <HeaderShell>
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" aria-label="Inicio · Retos Hispanidad Futura">
          <Marca size={34} fondo="var(--marca-fondo, var(--paper))" compacta />
        </Link>
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="text-sm text-ink-2 hover:text-ink">
            {l.label}
          </Link>
        ))}
        <Link href="/panel" className="ml-auto inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink">
          <span className="h-2 w-2 rounded-full bg-ok" aria-hidden="true" />
          Panel en vivo
        </Link>
        <Link href="/demo" className="chip border-gold text-gold hover:bg-gold-soft">
          Demo
        </Link>
      </nav>
    </HeaderShell>
  );
}
