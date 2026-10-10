// Cabecera con todas las rutas de la app ya enlazadas, para que ningún perfil dependa de otro.
// Dueño: perfil 1 (puede cambiar el estilo; las rutas no se cambian sin avisar).
import Link from "next/link";
import { getSession } from "@/lib/session";

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
    <header className="border-b border-line bg-paper">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-lg font-bold text-ink">
          Retos reales
        </Link>
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="text-sm text-ink-2 hover:text-ink">
            {l.label}
          </Link>
        ))}
        <Link href="/panel" className="ml-auto text-sm text-ink-2 hover:text-ink">
          Panel en vivo
        </Link>
      </nav>
    </header>
  );
}
