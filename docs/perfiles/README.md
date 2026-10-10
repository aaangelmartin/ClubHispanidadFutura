# Perfiles de trabajo

La app está dividida en **4 partes completas e independientes**. Cada una tiene sus pantallas, su lógica y su acceso a datos, de principio a fin. **Nadie espera a nadie**: cada parte se prueba sola con los datos de ejemplo.

| Perfil | Ficha | Parte completa | Rutas |
|---|---|---|---|
| 1 | [`1-entrada-y-demanda.md`](1-entrada-y-demanda.md) | Landing, registro de estudiantes y empresas, panel en vivo | `/`, `/registro`, `/panel` |
| 2 | [`2-publicar-retos.md`](2-publicar-retos.md) | La empresa describe su problema, la IA genera el reto, lo edita y lo publica | `/empresa/nuevo` |
| 3 | [`3-resolver-retos.md`](3-resolver-retos.md) | El estudiante busca retos, se apunta y entrega | `/retos`, `/retos/[id]` |
| 4 | [`4-valorar-y-pasaporte.md`](4-valorar-y-pasaporte.md) | Dashboard de la empresa (sus retos y candidatos), valoración con ayuda de la IA y pasaporte público | `/empresa`, `/empresa/candidatos`, `/empresa/retos/[id]`, `/pasaporte/[id]` |
| 5 | [`5-negocio.md`](5-negocio.md) | Mentores, registros reales, mercado, financiación, partners, KPIs, plan 90 días, pitch | `docs/` |

## Arranque

**Paso 0 (una sola vez, 5 minutos, lo hace quien llegue antes):**
1. Crear un proyecto en Supabase. SQL Editor → ejecutar `supabase/schema.sql` y después `supabase/seed.sql`.
2. Crear una clave de la API de Claude en console.anthropic.com.
3. Compartir con los otros cuatro, **por privado**, los tres valores de `.env.example`.

**Cada persona:**
```bash
git clone https://github.com/aaangelmartin/ClubHispanidadFutura.git
cd ClubHispanidadFutura && npm install
cp .env.example .env.local      # pegar los tres valores
claude
```
Y el primer mensaje a Claude:
> **Soy el perfil N. Lee AGENTS.md y docs/perfiles/N-*.md y empieza por la primera tarea.**

## Cómo se prueba cada parte sin depender de nadie

Los datos de ejemplo (`supabase/seed.sql`) ya traen empresas, estudiantes, retos abiertos, un reto en valoración con entregas y un pasaporte con una valoración. Para entrar como cualquiera sin registrarse:

| Entrar como | Enlace |
|---|---|
| Empresa española | `/dev/sesion?rol=empresa&id=11111111-1111-4111-8111-000000000001&ir=/empresa` |
| Empresa mexicana | `/dev/sesion?rol=empresa&id=11111111-1111-4111-8111-000000000002&ir=/empresa` |
| Estudiante española (con pasaporte) | `/dev/sesion?rol=estudiante&id=22222222-2222-4222-8222-000000000001&ir=/retos` |
| Estudiante mexicano | `/dev/sesion?rol=estudiante&id=22222222-2222-4222-8222-000000000002&ir=/retos` |

Reto en valoración con 3 entregas (1 valorada): `/empresa/retos/33333333-3333-4333-8333-000000000003` (como la empresa española).
Pasaporte con una valoración: `/pasaporte/22222222-2222-4222-8222-000000000001`.

## Reglas para no pisarse

- **Cada perfil escribe solo en sus carpetas.** Las consultas a la base de datos van en tu propia carpeta (`actions.ts` o `queries.ts`). Si te hace falta una función que ya existe en otra parte, cópiala: hoy duplicar es más barato que coordinar.
- **No se cambian sin avisar en voz alta:** `supabase/schema.sql`, `src/lib/types.ts`, `src/lib/supabase.ts`, `src/lib/session.ts`, `src/lib/ai/client.ts`, `src/components/Header.tsx`.
- **Si necesitas un campo nuevo en la base de datos**, avisa, añádelo a `schema.sql` y a `types.ts` con `alter table … add column` y pásale la línea SQL a quien gestione Supabase.
- `git pull --rebase` antes de empezar y antes de cada `push`. `npm run build` sin errores antes de subir.
- **Marca: `docs/BRANDING.md`** (la misma del deck de mentores). Usa las clases `card`, `btn`, `btn-primary`, `chip`, `field`, `eyebrow` y los colores `bg-paper`, `text-ink`, `text-gold`… No definas colores ni fuentes nuevas.
- Todo en español y legible en un proyector.
