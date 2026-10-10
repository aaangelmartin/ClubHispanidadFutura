// Dueño: perfil 1. Atajos para entrar a los paneles con las cuentas de ejemplo. Solo con DEMO_MODE.
import { DEMO_MODE } from "@/lib/demo";

const CUENTAS = [
  {
    href: "/dev/sesion?rol=estudiante&id=22222222-2222-4222-8222-000000000002&ir=/estudiante",
    label: "Panel del estudiante",
    quien: "Andrés · Colombia",
  },
  {
    href: "/dev/sesion?rol=empresa&id=11111111-1111-4111-8111-000000000001&ir=/empresa",
    label: "Terminal de la empresa",
    quien: "Ibérica Retail · España",
  },
];

export default function EntrarDemo({ fila = false }: { fila?: boolean }) {
  if (!DEMO_MODE) return null;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-ink">O entra a la demo</p>
      <div className={fila ? "grid gap-2 sm:grid-cols-2" : "flex flex-col gap-2"}>
        {CUENTAS.map((c) => (
          <a key={c.href} href={c.href} className="btn !flex-col !items-start !gap-0 !py-2.5 text-left">
            {c.label} <span className="text-sm font-normal text-ink-2">{c.quien}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
