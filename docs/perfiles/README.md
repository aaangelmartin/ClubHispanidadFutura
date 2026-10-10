# Perfiles de trabajo

Cada persona trabaja con su propio Claude Code y le dice qué perfil es. Arranque:

```bash
git clone https://github.com/aaangelmartin/ClubHispanidadFutura.git
cd ClubHispanidadFutura && npm install
cp .env.example .env.local      # valores que pasa el perfil 1, por privado
claude
```

Y el primer mensaje a Claude:

> **Soy el perfil N. Lee AGENTS.md y docs/perfiles/N-*.md y empieza por la primera tarea.**

| Perfil | Ficha | Qué construye |
|---|---|---|
| 1 | [`1-base.md`](1-base.md) | Supabase, Vercel, landing, registro, panel en vivo, integración y demo |
| 2 | [`2-crear-retos.md`](2-crear-retos.md) | La empresa describe su problema y la IA genera el reto; editar y publicar |
| 3 | [`3-valorar-entregas.md`](3-valorar-entregas.md) | Panel de la empresa: entregas, resumen IA, valoración, contactar, cerrar. Datos de ejemplo |
| 4 | [`4-estudiante.md`](4-estudiante.md) | Retos abiertos, apuntarse, entregar, pasaporte |
| 5 | [`5-negocio.md`](5-negocio.md) | Mentores, registros reales, mercado, financiación, partners, KPIs, plan 90 días, pitch |

## Lo que comparten todos los perfiles de la app

- **Contrato:** `supabase/schema.sql` y `src/lib/types.ts`. No se cambian sin avisar en voz alta al equipo.
- **Datos e IA solo en el servidor:** `db()` de `src/lib/supabase.ts`, funciones de `src/lib/ai.ts`. Escrituras con Server Actions en un `actions.ts` dentro de **tu** carpeta.
- **Sesión:** `getSession()` devuelve `{ role: "company" | "student", id }` o `null`.
- **Probar sin depender de nadie:** con los datos de `supabase/seed.sql` cargados, entra como cualquiera con
  `/dev/sesion?rol=empresa&id=<uuid>&ir=/empresa` o `/dev/sesion?rol=estudiante&id=<uuid>&ir=/retos`.
- **Antes de cada push:** `git pull --rebase` y `npm run build` sin errores.
- **Estilo:** Tailwind, limpio y legible en un proyector. Texto en español. Si haces un componente que sirve a otros, ponlo en `src/components/` y avisa.
