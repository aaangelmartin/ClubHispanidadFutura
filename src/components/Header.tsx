// Cabecera con todas las rutas de la app ya enlazadas, para que ningún perfil dependa de otro.
// Dueño: perfil 1 (puede cambiar el estilo; las rutas no se cambian sin avisar).
import Link from "next/link";
import { getSession } from "@/lib/session";
import { Isotipo } from "@/components/embarca";
import HeaderShell from "@/components/HeaderShell";
import { DEMO_MODE } from "@/lib/demo";

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
      <nav className="mx-auto flex max-w-[1312px] items-center gap-x-3 px-5 py-3 sm:gap-x-6 sm:px-8 lg:px-16">
        <Link href="/" aria-label="Embarca, inicio" className="inline-flex shrink-0 items-center gap-2.5">
          <Isotipo size={28} />
          <span className="hf-logo-texto hidden text-[22px] font-bold tracking-[-0.03em] text-ink sm:inline">Embarca</span>
        </Link>
        {/* En móvil los enlaces se desplazan dentro de su franja en vez de ensanchar la página. */}
        <div className="flex min-w-0 flex-1 items-center gap-x-4 overflow-x-auto [scrollbar-width:none] sm:gap-x-6 [&::-webkit-scrollbar]:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="whitespace-nowrap text-[15px] font-medium text-ink-2 hover:text-ink">
              {l.label}
            </Link>
          ))}
        </div>
        <Link
          href="/panel"
          className="hf-panel inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-sm text-ink-2 hover:text-ink"
        >
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inset-0 animate-ping rounded-full bg-ok opacity-60 motion-reduce:hidden" />
            <span className="relative h-2 w-2 rounded-full bg-ok" />
          </span>
          <span>
            Panel<span className="hidden sm:inline"> en vivo</span>
          </span>
        </Link>
        {DEMO_MODE && (
          <Link href="/demo" className="hidden shrink-0 rounded-md bg-gold px-3 py-1.5 text-sm font-bold text-ink hover:brightness-95 sm:inline-flex">
            Demo
          </Link>
        )}
      </nav>
    </HeaderShell>
  );
}
