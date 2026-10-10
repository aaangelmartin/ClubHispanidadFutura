# Reparto del equipo (5 personas)

**4 personas en la app** (un módulo cada una) y **1 en negocio** (todo lo que no es código). Cada persona es dueña de su módulo y de sus archivos. Si algo te bloquea, avisa en voz alta; no esperes.

| # | Rol | Quién | Qué construye / entrega | Archivos |
|---|---|---|---|---|
| 1 | **Base e integración** (líder técnico) | | Supabase, Vercel, landing, registro, panel en vivo. Integra a los demás y prepara la demo | `src/app/page.tsx`, `src/app/registro/`, `src/app/panel/`, `src/lib/` (salvo `ai.ts`), `supabase/schema.sql` |
| 2 | **Crear retos** (empresa) | | La empresa describe su problema, la IA genera el reto, la empresa lo edita y lo publica | `src/app/empresa/nuevo/`, `src/lib/ai.ts` |
| 3 | **Valorar entregas** (empresa) | | Mis retos, entregas con resumen IA, nota por rúbrica, feedback, contactar, cerrar reto. Datos de ejemplo | `src/app/empresa/page.tsx`, `src/app/empresa/retos/`, `supabase/seed.sql` |
| 4 | **Lado estudiante** | | Retos abiertos, apuntarse, entregar, pasaporte público | `src/app/retos/`, `src/app/pasaporte/` |
| 5 | **Negocio** | | Validación con mentores, registros reales, mercado, financiación, partners, KPIs, plan de 90 días y pitch | `docs/NEGOCIO.md`, `docs/PITCH.md`, `docs/deck-mentores.html` |

---

## Cómo se trabaja en paralelo en la app

Todos con **Claude Code sobre este repo**. Stack: **Next.js 15 + Supabase + API de Claude**, despliegue en **Vercel**. Reglas completas en `AGENTS.md`.

1. **`supabase/schema.sql` es el contrato** entre módulos (y `src/lib/types.ts` lo refleja). Nadie lo cambia sin avisar.
2. Cada persona toca **solo sus archivos** (tabla de arriba). `src/lib/` es de la persona 1, salvo `ai.ts`, que es de la persona 2. La 3 usa `summarizeSubmission` de `ai.ts` pero no lo edita sin avisar.
3. `git pull --rebase` antes de empezar y antes de cada `push`. `npm run build` tiene que pasar antes de subir.
4. Mientras la persona 1 crea Supabase y Vercel (hasta las 13:15), nadie espera: 2 prueba el prompt, 3 escribe los datos de ejemplo y 4 maqueta con datos inventados.

### Cómo encajan los módulos (el flujo de la demo)

```
Empresa se registra (1) → describe su problema y publica el reto (2)
  → estudiante lo ve, se apunta y entrega (4)
  → empresa ve la entrega con el resumen IA, la valora y la contacta (3)
  → la valoración aparece en el pasaporte del estudiante (4)
  → el panel en vivo lo cuenta todo (1)
```
Cada flecha cruza de un módulo a otro **solo a través de la base de datos**. Si tu pantalla necesita datos de otro módulo que aún no existen, usa los de `supabase/seed.sql`.

---

## Fase 1 · Construir (13:00–15:00)

**Primeros 5 minutos, los cinco juntos:** asignar roles, elegir el país de LatAm (México o Colombia) y un nombre provisional. Si no hay acuerdo en 5 minutos, decide la persona 1.

### 1 · Base e integración
- [ ] **13:10** Proyecto de Supabase creado y `supabase/schema.sql` ejecutado. Pasar `.env.local` a los otros 3 (por privado, nunca al repo).
- [ ] **13:15** Vercel conectado al repo con las 3 variables. URL en el `README`.
- [ ] **13:30** Landing (textos de la persona 5) + `/registro` (estudiante / empresa, con consentimiento) que guarda en la base y fija la sesión. Desplegado → enlace a la persona 5.
- [ ] **13:50** `/panel`: registros por país y universidad, retos publicados y entregas. Solo datos reales; los de ejemplo no cuentan.
- [ ] **14:00–15:00** Navegación entre módulos, integrar, recorrer el flujo completo de la demo de punta a punta y arreglar lo que se rompa.

### 2 · Crear retos (empresa)
- [ ] **13:15** Prompt de generar reto (`PRD.md` §10.1) probado con 3 problemas reales hasta que el JSON salga bien siempre.
- [ ] **13:50** `/empresa/nuevo`: texto libre → Server Action con `generateChallenge` → reto guardado como `borrador` y mostrado en un formulario editable (incluidos los avisos de la IA).
- [ ] **14:15** Botón **Publicar** → estado `abierto` con `deadline`. Pantalla de "reto publicado" con enlace al reto.
- [ ] **14:15–15:00** Pulir: estado de carga mientras la IA genera (tarda unos segundos; en la demo tiene que quedar bien) y ayudar a la persona 3 si va retrasada.

### 3 · Valorar entregas (empresa)
- [ ] **13:15** `supabase/seed.sql`: 2 empresas (una de cada país), 3 retos `is_example = true` (uno en `en_valoracion`), 3 estudiantes, 3 entregas y 1 valoración. Pasarlo a la 1 para cargarlo.
- [ ] **13:50** `/empresa`: retos de la empresa con su estado y número de entregas.
- [ ] **14:20** `/empresa/retos/[id]`: entregas con el resumen de la IA (`summarizeSubmission`), nota por criterio de la rúbrica + feedback, botón **Contactar**.
- [ ] **14:40** Cambio de estado a `en_valoracion` a mano y **Cerrar reto** (solo si todas las entregas están valoradas). Ciclo de vida en `PRD.md` §8.1.

### 4 · Lado estudiante
- [ ] **13:50** `/retos`: listado de retos `abiertos` con filtro por país y área, etiqueta "ejemplo piloto".
- [ ] **14:10** `/retos/[id]`: detalle del reto, **Me apunto** y formulario de entrega (enlace + explicación). Si no hay sesión de estudiante, mandar a `/registro`.
- [ ] **14:40** `/pasaporte/[id]`: página pública con datos del estudiante y cada reto con empresa, país, nota, feedback y sello "valorado por la empresa".

### 5 · Negocio
Detalle en `NEGOCIO.md` y `PITCH.md`.
- [ ] **13:10** Textos de la landing a la persona 1: el problema en una frase, la frase del producto y los dos botones.
- [ ] **13:15** Mensaje de WhatsApp listo y lista de grupos y contactos universitarios de los dos países. **Enviar el enlace de registro en cuanto llegue (~13:30).**
- [ ] **13:45** Mentores: recorrerlos con el deck, apuntar sus respuestas a las 5 preguntas y pedirles **un problema real de su empresa** (se lo pasa a la persona 3 para los datos de ejemplo).
- [ ] **14:15** Mercado: 3 datos con fuente (paro juvenil en los dos países, ofertas junior que piden experiencia, coste de una agencia) + tabla de competidores.
- [ ] **14:45** Financiación y precios, partners con nombre, KPIs con número y plan de 90 días.
- [ ] **15:00** Guion del pitch y diapositivas.

**14:00 · Puesta en común (5 min):** qué han dicho los mentores, si cambia algo del alcance, cuántos registros hay y qué módulo va retrasado. Lo que se decida va a `PRD.md` §12.

---

## Fase 2 · Cerrar y ensayar (15:00–16:00)

| Quién | Qué |
|---|---|
| 1 | **15:00 se congela la app**: solo arreglos. Graba el vídeo de reserva de la demo (~40 s) |
| 2, 3 y 4 | Arreglos que pida la 1. Preparar en la app la empresa, el reto y la entrega de la demo |
| 5 | Cerrar el guion y las diapositivas. Preguntar a la organización: ¿3 o 10 minutos? ¿Proyector? |
| Todos | **15:15** guion cerrado · **15:15–15:50** dos ensayos cronometrados · **15:55** captura del panel en vivo · **16:00** pitches |

Quién presenta: la persona 5 lleva el pitch y la 1 hace la demo. Si hay alguien latinoamericano en el equipo, que copresente.

**Regla de la app: cortar antes que retrasarse.** Orden de corte: pasaporte sin sello ni filtros → valoración sin resumen IA → listado sin filtros.
