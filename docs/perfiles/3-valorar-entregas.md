# Perfil 3 · Valorar entregas (lado empresa) + datos de ejemplo

## Tu misión
Cerrar el ciclo del lado de la empresa: ve las entregas, la IA le resume cada una frente a la rúbrica, y **la empresa** pone la nota y el feedback. Sin tu parte, el pasaporte está vacío. Además preparas los datos de ejemplo con los que prueba todo el equipo.

## Tus archivos
- `src/app/empresa/page.tsx` (mis retos) y `src/app/empresa/retos/` (entregas de un reto, con su `actions.ts`)
- `supabase/seed.sql`

**No toques:** `src/app/empresa/nuevo/` (perfil 2), `src/lib/` (perfil 1; `ai.ts` es del perfil 2: usas `summarizeSubmission` sin editarlo).

## Contrato que usas
- Tablas `challenges`, `submissions`, `evaluations` (`supabase/schema.sql`).
- `summarizeSubmission(challenge, { link, notes })` → `AiSummary`. Guarda el resultado en `submissions.ai_summary`.
- `getSession()` debe ser `{ role: "company", id }`. Una empresa solo ve sus retos.
- Ciclo de vida en `docs/PRD.md` §8.1. Regla clave (§5): **la IA no pone nota ni ordena; decide la empresa**, y se valoran **todas** las entregas.

## Tareas, en orden

### 1. Datos de ejemplo (13:15). Los usan los perfiles 2 y 4 para probar
- [ ] `supabase/seed.sql` con **UUIDs fijos** escritos a mano (para poder usarlos en `/dev/sesion`) y emails `@ejemplo.test` (el panel los excluye):
  - 2 empresas: una española y una del país LatAm elegido.
  - 3 retos con `is_example = true`: dos `abierto` y uno `en_valoracion`, con rúbricas realistas de 3–4 criterios. Si el perfil 5 consigue un problema real de un mentor, úsalo en uno.
  - 3 estudiantes de los dos países.
  - 3 entregas al reto `en_valoracion` (enlaces y explicaciones creíbles) y 1 valoración ya hecha.
- [ ] Al principio del archivo, un comentario con los UUIDs y su significado ("empresa ES", "estudiante MX", etc.).
- [ ] Pásaselo al perfil 1 para que lo ejecute y publica los UUIDs en la ficha del equipo (`docs/perfiles/README.md`, al final).

### 2. Mis retos (13:50)
- [ ] `/empresa`: retos de la empresa de la sesión, con estado (chip de color por estado), plazo, número de entregas y número de entregas valoradas ("2 de 3 valoradas").
- [ ] Enlace a `/empresa/nuevo` (perfil 2) para publicar otro.

### 3. Valorar (14:20)
- [ ] `/empresa/retos/[id]`: cabecera con el reto y su rúbrica; debajo, una tarjeta por entrega.
- [ ] En cada tarjeta: enlace y explicación del estudiante, y el **resumen IA** (qué hace, observaciones por criterio, puntos fuertes, preguntas para quien revisa). Si `ai_summary` está vacío, genéralo con `summarizeSubmission` y guárdalo; muestra "Resumiendo…" mientras tanto.
- [ ] Formulario de valoración: nota de 0 a 10 por cada criterio de la rúbrica + feedback (obligatorio) → inserta en `evaluations`. Muestra la nota ponderada como referencia.
- [ ] Botón **Contactar** → `contact_requested = true` y muestra el email del estudiante.
- [ ] Texto visible: *"La IA resume, tú decides."*

### 4. Estados (14:40)
- [ ] Botón **Cerrar entregas** (`abierto` → `en_valoracion`) para la demo, sin esperar al plazo.
- [ ] Botón **Cerrar reto** (`en_valoracion` → `cerrado`), **desactivado hasta que todas las entregas estén valoradas**, con el motivo visible ("Faltan 2 entregas por valorar").

## Hecho cuando
Entras como la empresa de ejemplo, abres el reto en valoración, ves los resúmenes, valoras las entregas que faltan, cierras el reto, y la valoración aparece en `/pasaporte/[id]` del perfil 4.
