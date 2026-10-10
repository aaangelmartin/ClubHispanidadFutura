# Perfil 2 · Crear retos (lado empresa)

## Tu misión
El momento "wow" de la demo: la empresa escribe su problema con sus palabras y en segundos tiene un reto completo, con rúbrica, listo para publicar. Es el uso de IA que más se ve delante del jurado.

## Tus archivos
- `src/app/empresa/nuevo/` (página, componentes y `actions.ts`)
- `src/lib/ai.ts` (los prompts y las llamadas a Claude). El perfil 3 usa `summarizeSubmission`: si cambias su firma, avísale.

**No toques:** `src/app/empresa/page.tsx` ni `src/app/empresa/retos/` (perfil 3), ni el resto de `src/lib/` (perfil 1).

## Contrato que usas
- Tabla `challenges` (`supabase/schema.sql`). Tú creas filas en estado `borrador` y las pasas a `abierto`.
- `generateChallenge(description, companyName, companyCountry)` → `GeneratedChallenge` (`src/lib/ai.ts`).
- `getSession()` debe ser `{ role: "company", id }`. Si no, redirige a `/registro?rol=empresa`.
- Ciclo de vida completo en `docs/PRD.md` §8.1. Reglas del reto en §5 (acotado en días, nunca trabajo de producción).

## Tareas, en orden

### 1. Prompt (13:15)
- [ ] Prueba `generateChallenge` con un script rápido (`npx tsx`, o una ruta temporal en tu carpeta) con 3 problemas distintos: uno de datos, uno de marketing y uno de desarrollo. Uno con plazo exagerado y otro que sea claramente trabajo de producción, para ver que salen avisos.
- [ ] Ajusta el prompt hasta que el JSON salga bien siempre: pesos de la rúbrica que suman 100, `duration_days` entre 2 y 10, español claro.
- [ ] Si la respuesta tarda más de unos 15 s, prueba a bajar `max_tokens`.

### 2. Generar y editar (13:50)
- [ ] `/empresa/nuevo`: textarea grande *"¿Qué necesitas resolver y qué perfil buscas?"* con un ejemplo de placeholder, y botón **Generar reto con IA**.
- [ ] Server Action en `actions.ts`: lee la empresa de la sesión, llama a `generateChallenge`, inserta en `challenges` con `status = 'borrador'` y `description` = el texto original, y devuelve el id.
- [ ] Muestra el reto generado en un formulario editable: título, resumen, contexto, tarea, perfil, entregable, días, premio sugerido y rúbrica (criterio, peso y descripción; se pueden editar los pesos). Los `warnings` arriba, en un aviso visible.
- [ ] **Guardar cambios** actualiza la fila.

### 3. Publicar (14:15)
- [ ] Botón **Publicar** → `status = 'abierto'` y `deadline = now() + duration_days`.
- [ ] Pantalla de confirmación: "Reto publicado", con enlace a `/retos/[id]` (lo que verán los estudiantes) y a `/empresa` (mis retos).

### 4. Pulir para la demo (14:15–15:00)
- [ ] Estado de carga mientras genera: botón desactivado y un mensaje de que la IA está montando el reto. En la demo se ve en directo, tiene que quedar bien.
- [ ] Error claro si la IA falla, con botón para reintentar.
- [ ] Si te sobra tiempo, ayuda al perfil 3.

## Hecho cuando
Con la sesión de una empresa de ejemplo (`/dev/sesion?rol=empresa&id=…&ir=/empresa/nuevo`), escribes un problema real, generas, editas un campo, publicas, y el reto aparece en `/retos` del perfil 4.
