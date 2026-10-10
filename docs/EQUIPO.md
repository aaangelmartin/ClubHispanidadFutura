# Reparto del equipo (5 personas)

Cada persona es dueña de su módulo y de sus archivos. Si algo te bloquea, avisa en voz alta; no esperes.

**3 personas en la app** (cada una un módulo) y **2 fuera** (negocio + demanda, y validación + contenido). El pitch empieza a las 14:30, no antes.

| # | Rol | Quién | Módulo / entrega | Archivos |
|---|---|---|---|---|
| 1 | **Base y datos** (líder técnico) | | Supabase, Vercel, landing, registro, panel en vivo. Integra a los demás | `src/app/page.tsx`, `src/app/registro`, `src/app/panel`, `src/lib/` (salvo `ai.ts`), `supabase/schema.sql` |
| 2 | **Motor de retos** (lado empresa) | | Generar reto con IA, publicar, gestionar estados, valorar entregas | `src/app/empresa/`, `src/lib/ai.ts` |
| 3 | **Lado estudiante** | | Retos abiertos, apuntarse, entregar, pasaporte | `src/app/retos/`, `src/app/pasaporte/` |
| 4 | **Negocio y demanda** | | Registros reales entrando, datos de mercado con fuente, financiación, KPIs | `docs/NEGOCIO.md` |
| 5 | **Validación y contenido** | | Mentores, retos reales, textos de la app, datos de ejemplo, guion de la demo | `docs/DEMO.md`, `supabase/seed.sql` |

---

## Cómo se trabaja en paralelo en la app

Todos trabajamos **con Claude Code sobre este repo**. Nada de Lovable.

1. Stack: **Next.js 15 (App Router) + Supabase + API de Claude**, despliegue en **Vercel**. La base ya está montada: `npm install && npm run dev`.
2. **El esquema `supabase/schema.sql` es el contrato** entre módulos. Las personas 2 y 3 programan contra él; nadie lo cambia sin avisar.
3. Cada persona toca **solo sus carpetas** (tabla de arriba). Lo compartido (`src/lib/`) es de la persona 1: si necesitas algo ahí, pídelo o avisa antes.
4. `git pull --rebase` antes de empezar y antes de cada `push`. Commits pequeños y frecuentes a `main`.
5. Mientras la persona 1 crea Supabase y Vercel (hasta las 13:15), las personas 2 y 3 no esperan: la 2 prueba los prompts y la 3 maqueta sus pantallas con datos inventados.

## Fase 1 · Arranque (12:55–14:30)

**Primeros 5 minutos, los cinco juntos:** asignar roles, elegir el país de LatAm (México o Colombia) y un nombre provisional. Si no hay acuerdo en 5 minutos, decide la persona 1.

### 1 · Base y datos
- [ ] **13:05** Proyecto de Supabase creado, `supabase/schema.sql` ejecutado en el SQL Editor. Pasar `.env.local` a todo el equipo (por privado, nunca al repo).
- [ ] **13:15** Proyecto de Vercel conectado al repo, con las 3 variables de entorno. URL en el `README`.
- [ ] **13:20** Landing + registro (estudiante / empresa) + panel en vivo desplegados. Enlace a la persona 4.
- [ ] Después: navegación entre módulos, integrar lo de 2 y 3, revisar que el flujo completo funciona de punta a punta.

### 2 · Motor de retos (lado empresa)
Ciclo de vida completo en `PRD.md` §8.1.
- [ ] **13:15** Prompt de "generar reto" (`PRD.md` §10.1) probado con 3 problemas reales hasta que el JSON salga bien siempre.
- [ ] **13:45** `/empresa/nuevo`: texto libre → Server Action que llama a `generateChallenge` (`src/lib/ai.ts`) → reto editable guardado como `borrador` → **Publicar**.
- [ ] **14:15** `/empresa` y `/empresa/retos/[id]`: sus retos con estado, entregas de cada reto, resumen IA (prompt §10.2), valoración por rúbrica + feedback, botón **Contactar**, **Cerrar reto** (solo si todas las entregas están valoradas).

### 3 · Lado estudiante
- [ ] **13:45** `/retos`: listado con filtro por país y área, etiqueta "ejemplo piloto", detalle del reto.
- [ ] **14:00** `/retos/[id]`: apuntarse + formulario de entrega (enlace + explicación).
- [ ] **14:20** `/pasaporte/[id]`: página pública con sus retos, nota, feedback y sello "valorado por la empresa".

### 4 · Negocio y demanda
- [ ] **13:10** Mensaje de WhatsApp listo + lista de grupos y contactos universitarios de los dos países.
- [ ] **13:25** Enlace enviado. Seguir moviéndolo.
- [ ] **14:15** `NEGOCIO.md` §1: 3 datos con fuente (paro juvenil en los dos países, ofertas junior que piden experiencia, coste de una agencia) + competidores.

### 5 · Validación y contenido
- [ ] **13:05** Textos de la landing a la persona 1: problema en una frase, frase del producto, botones.
- [ ] **13:45** Recorrer a los mentores con el deck y apuntar las respuestas a las 5 preguntas. Pedirles **un problema real de su empresa**.
- [ ] **14:00** Datos de ejemplo para la persona 1: 2 empresas (una de cada país), 3 retos "ejemplo piloto", 1 entrega buena con su valoración. Mejor si uno de los retos es el real de un mentor.

**14:00 · Puesta en común (5 min):** qué han dicho los mentores, si cambia algo del alcance, cuántos registros hay y qué módulo va retrasado. Lo que se decida va a `PRD.md` §12.

---

## Fase 2 · Pitch y cierre (14:30–16:00)

| Quién | Qué |
|---|---|
| 1, 2 y 3 | Terminar e integrar la app. **15:00 se congela**: solo arreglos. La 2 graba el vídeo de reserva (~40 s) |
| 4 | Financiación y precios, KPIs con número, aliados con nombre, plan de 90 días (`NEGOCIO.md` §2–5) |
| 5 | Guion del pitch (`PITCH.md`) y diapositivas; decide quién presenta. Pregunta a la organización si son 3 o 10 minutos |
| Todos | **15:15** guion cerrado · **15:15–15:50** dos ensayos cronometrados · **15:55** captura del panel en vivo · **16:00** pitches |

Regla de la app: **cortar antes que retrasarse.** Orden de corte: pasaporte estático → panel de empresa sin resumen IA → listado sin filtros.

Cómo trabajamos con el repo: ver `AGENTS.md`.
