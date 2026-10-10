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

## Coordinación entre agentes: GitHub Issues
Cada persona trabaja con su propio Claude y **los agentes no se ven entre sí**. Se comunican por issues del repo (`aaangelmartin/ClubHispanidadFutura`) con el CLI `gh`. Es obligatorio, no opcional.

**Etiquetas:** `perfil-1` … `perfil-5` (destinatario o dueño), `bloqueo` (alguien está parado esperando esto), `contrato` (cambio en algo compartido), `seguimiento` (issue de seguimiento de un perfil).

**Issues de seguimiento** (uno por perfil, con su lista de tareas): #1 entrada y demanda · #2 publicar retos · #3 resolver retos · #4 valorar y pasaporte · #5 negocio. Paso 0 (Supabase y claves): #6.

**Al empezar la sesión y antes de cada push, revisa lo que te afecta:**
```bash
gh issue list --label perfil-N --state open      # lo que te piden a ti (N = tu perfil)
gh issue list --label bloqueo --state open       # quién está parado
gh issue list --label contrato --state open      # cambios en lo compartido
```
Si hay un issue `bloqueo` para tu perfil, va antes que tu siguiente tarea.

**Cuándo abrir un issue:**
- **Necesitas algo de otro perfil** (un dato, un enlace, un cambio en su pantalla): issue con la etiqueta **del perfil destinatario**, y `bloqueo` si te para. Título: `[P2 → P4] Qué necesitas`. Cuerpo: qué, por qué y cómo sabrás que está hecho.
- **Vas a cambiar algo compartido** (`supabase/schema.sql`, `src/lib/types.ts`, `src/lib/supabase.ts`, `src/lib/session.ts`, `src/lib/ai/client.ts`, `src/components/Header.tsx`, `globals.css`): **antes de tocarlo**, issue con la etiqueta `contrato`, el cambio exacto (el SQL si es de la base de datos) y a qué perfiles afecta. Avisa también en voz alta.
- **Encuentras un fallo en la parte de otro:** issue con su etiqueta. No lo arregles tú en su carpeta.

**Al trabajar:**
- Marca las tareas de tu issue de seguimiento al terminarlas (`gh issue edit` o un comentario) y comenta cualquier cambio de alcance.
- Referencia el issue en el commit: `perfil 4: añade cierre de reto (#4)`. Usa `closes #N` cuando un commit resuelva un issue de petición.
- Al resolver un issue que te pidieron, ciérralo con un comentario de qué has hecho y cómo probarlo.
- **Nunca** pongas claves, contraseñas ni `.env.local` en un issue: el repo es público.

## Git
- Rama `main`, commits pequeños y frecuentes. `git pull --rebase` antes de empezar y antes de `push`.
- Cada perfil edita **sus** archivos (su ficha de `docs/perfiles/`). Para tocar el de otro, abre un issue (ver arriba).
- Mensajes de commit en español, en imperativo, con el issue: `negocio: añade datos de paro juvenil (#5)`.
- Sin ramas ni PRs hoy: no hay tiempo de revisión.
