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
      <nav className="mx-auto flex max-w-6xl items-center gap-x-4 px-4 py-[var(--hpad,12px)] sm:gap-x-6 sm:px-6">
        <Link
          href="/"
          aria-label="Inicio · Retos Hispanidad Futura"
          className="shrink-0 origin-left [transform:scale(var(--hescala,1))]"
        >
          <Marca size={34} fondo="var(--marca-fondo, var(--paper))" compacta />
        </Link>
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="whitespace-nowrap text-sm text-ink-2 hover:text-ink">
            {l.label}
          </Link>
        ))}
        <span className="ml-auto" aria-hidden="true" />
        <Link
          href="/panel"
          className="hf-panel inline-flex items-center gap-2 whitespace-nowrap text-sm text-ink-2 hover:text-ink"
        >
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inset-0 animate-ping rounded-full bg-ok opacity-60 motion-reduce:hidden" />
            <span className="relative h-2 w-2 rounded-full bg-ok" />
          </span>
          <span>
            Panel<span className="hidden sm:inline"> en vivo</span>
          </span>
        </Link>
        <Link href="/demo" className="chip shrink-0 border-gold text-gold hover:bg-gold-soft">
          Demo
        </Link>
      </nav>
    </HeaderShell>
  );
}
