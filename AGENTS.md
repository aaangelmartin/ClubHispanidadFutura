# AGENTS.md — Cómo trabajamos (personas y agentes de IA)

Equipo de 5 en la **Hackathon Iberoamérica 2030** del Club Hispanidad Futura (Madrid, 10/10/2026). Pitches a las **16:00**. Todo lo que hagas debe servir para la demo o el pitch de hoy.

## Lee antes de hacer nada
0. **Pregunta qué perfil es la persona (1–5) si no te lo ha dicho, y lee su ficha en `docs/perfiles/`.** Esa ficha dice qué archivos son suyos, qué no puede tocar y las tareas en orden. Trabaja solo en lo suyo.
1. `docs/PRD.md` — qué construimos, reglas de producto, alcance del MVP, prompts. **Fuente de verdad.**
2. `docs/EQUIPO.md` — quién hace qué y calendario.
3. `docs/NEGOCIO.md` — mercado, financiación, KPIs, aliados, plan 90 días.
4. `docs/PITCH.md` — guion de 3 minutos.

## Reglas para agentes
- **Idioma:** español en docs, UI y commits.
- **No amplíes el alcance.** Lo que está "Fuera del MVP" en `PRD.md` §8 no se construye hoy, aunque sea fácil.
- **Respeta las reglas de producto** de `PRD.md` §5. En especial: la IA **no** pone nota ni ordena candidatos; decide la empresa.
- **Nada de cifras inventadas.** Datos de mercado solo con fuente enlazada. En la app, los datos de ejemplo se marcan "ejemplo piloto".
- **Corta antes que retrasarte.** Si una tarea no cabe en el calendario de `EQUIPO.md`, entrega la versión más simple y avisa.
- Si tomas una decisión de producto nueva, añádela a `PRD.md` §12 (log de decisiones).

## Stack y código
- **Next.js 15 (App Router, TypeScript, Tailwind) + Supabase + API de Claude**, desplegado en Vercel. Nada de Lovable.
- `npm run dev` para trabajar; **`npm run build` tiene que pasar antes de cada push.**
- **Datos e IA solo en el servidor:** Server Components y Server Actions usando `db()` (`src/lib/supabase.ts`) y `src/lib/ai/`. Nunca importes esos archivos desde un componente `"use client"` ni pongas claves en el navegador.
- **`supabase/schema.sql` es el contrato** entre módulos, y `src/lib/types.ts` lo refleja. No lo cambies sin avisar al equipo; si hace falta, cambia los dos a la vez.
- Sin login: quién eres sale de `getSession()` (`src/lib/session.ts`), que se fija al registrarse.
- Toca solo las carpetas de tu perfil (`docs/perfiles/`). Las consultas a la base de datos van en tu propia carpeta; si necesitas algo de otra parte, cópialo antes que editar lo ajeno.
- Para probar sin registrarte: `/dev/sesion` con los IDs de `supabase/seed.sql` (tabla en `docs/perfiles/README.md`).
- **Marca: `docs/BRANDING.md`.** Es la misma del deck de mentores. Usa los tokens y las clases base de `globals.css`; no inventes colores ni fuentes.
- UI en español. Simple y legible; la demo tiene que verse bien en un proyector.

## Git
- Rama `main`, commits pequeños y frecuentes. `git pull --rebase` antes de empezar y antes de `push`.
- Cada perfil edita **sus** archivos (su ficha de `docs/perfiles/`). Para tocar el de otro, avisa.
- Mensajes de commit en español, en imperativo: `negocio: añade datos de paro juvenil`.
- Sin ramas ni PRs hoy: no hay tiempo de revisión.
