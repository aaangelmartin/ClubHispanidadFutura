# Perfil 4 · Valorar y pasaporte (Álvaro)

## Tu parte
Todo lo que la empresa recibe después de publicar, y lo que el estudiante se lleva: **el dashboard de la empresa (sus retos y sus candidatos), la valoración de cada entrega con ayuda de la IA, y el pasaporte público que ve todo el mundo**. Es el segundo uso de IA, la respuesta a "¿esto no es trabajo gratis?" y la pantalla final de la demo.

## Tus archivos
- `src/app/empresa/page.tsx` (dashboard) y `src/app/empresa/_lib/` (consultas y utilidades)
- `src/app/empresa/candidatos/`
- `src/app/empresa/retos/` (valorar)
- `src/app/pasaporte/`
- `src/lib/ai/summarize.ts`

**No toques:** `src/app/empresa/nuevo/` (perfil 2).

## No dependes de nadie
Los datos de ejemplo ya traen un reto en valoración con 3 entregas (1 valorada) y un pasaporte con una valoración:
- Dashboard como la empresa española: `/dev/sesion?rol=empresa&id=11111111-1111-4111-8111-000000000001&ir=/empresa`
- Reto en valoración: `/empresa/retos/33333333-3333-4333-8333-000000000003`
- Pasaporte: `/pasaporte/22222222-2222-4222-8222-000000000001`

## Contrato
- Lees `challenges`, `submissions`, `students` y `companies`. Escribes `submissions.ai_summary`, `evaluations` y `challenges.status` (`supabase/schema.sql`).
- `summarizeSubmission(challenge, { link, notes })` en `src/lib/ai/summarize.ts` → `AiSummary`. El prompt es tuyo.
- Reglas (`docs/producto/PRD.md` §5): **la IA no pone nota ni ordena; decide la empresa**. Se valoran **todas** las entregas. Solo la empresa dueña del reto ve sus entregas.
- Ciclo de vida: `PRD.md` §8.1.

## Tareas, en orden

### 1. Dashboard de la empresa (`/empresa`)
- [ ] Cifras arriba: retos activos, entregas recibidas, entregas por valorar, candidatos contactados.
- [ ] Lista de sus retos con chip de estado (borrador, abierto, en valoración, cerrado), plazo y "N entregas · M valoradas". Cada uno enlaza a `/empresa/retos/[id]`.
- [ ] Aviso destacado si hay entregas sin valorar.
- [ ] Botón **Publicar un reto nuevo** → `/empresa/nuevo` (perfil 2).

### 2. Valorar entregas (`/empresa/retos/[id]`)
- [ ] Cabecera con el reto, su estado y la rúbrica.
- [ ] Una tarjeta por entrega: enlace y explicación del estudiante, y el **resumen IA** (qué hace, observaciones por criterio, puntos fuertes, preguntas para quien revisa). Si `ai_summary` está vacío, se genera con `summarizeSubmission` y se guarda.
- [ ] Valoración: nota de 0 a 10 por criterio + feedback obligatorio → `evaluations`. Nota ponderada como referencia.
- [ ] Botón **Contactar** → `contact_requested = true` y muestra el email.
- [ ] Texto visible: *"La IA resume, tú decides."*
- [ ] **Cerrar entregas** (`abierto` → `en_valoracion`) y **Cerrar reto** (`en_valoracion` → `cerrado`), este último desactivado hasta que todas las entregas estén valoradas, con el motivo visible.

### 3. Candidatos (`/empresa/candidatos`)
- [ ] Todas las personas que han entregado a cualquier reto de la empresa: nombre, universidad, país, reto, estado (por valorar / valorado / contactado) y nota ponderada si la hay.
- [ ] Filtro por estado. Enlace a su pasaporte y a la entrega.
- [ ] Sin ranking automático: el orden es por fecha de entrega, no por nota de la IA.

### 4. Pasaporte (`/pasaporte/[id]`)
- [ ] **Público**, sin sesión: nombre, país, universidad, competencias, GitHub y portfolio.
- [ ] Resumen arriba: retos valorados, países de las empresas y nota media.
- [ ] Una entrada por cada entrega **valorada**: reto, empresa y país, fecha, nota ponderada sobre 10, nota por criterio, feedback y sello **"Valorado por [empresa]"**.
- [ ] Retos en curso o pendientes de valorar, aparte y sin nota.
- [ ] Botón **Copiar enlace**. Si sobra tiempo, QR.
- [ ] Muy cuidado visualmente: es la última pantalla de la demo.

## Hecho cuando
Como la empresa de ejemplo ves el dashboard, entras al reto en valoración, valoras las dos entregas que faltan, cierras el reto, ves a los tres en candidatos, y las valoraciones aparecen en sus pasaportes.
