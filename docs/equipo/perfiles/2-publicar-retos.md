# Perfil 2 · Publicar retos (empresa)

## Tu parte
Todo el recorrido de la empresa hasta tener su reto publicado: **describe su problema, la IA lo convierte en un reto con rúbrica, lo edita y lo publica**. (El dashboard `/empresa` con sus retos y candidatos es del perfil 4.) Es el momento "wow" de la demo y el uso de IA que más se ve delante del jurado.

## Tus archivos
`src/app/empresa/nuevo/` (+ tus `actions.ts` / componentes dentro), `src/lib/ai/generate.ts`.

**No toques:** `src/app/empresa/page.tsx`, `src/app/empresa/candidatos/` ni `src/app/empresa/retos/` (perfil 4).

## No dependes de nadie
Entra como empresa de ejemplo: `/dev/sesion?rol=empresa&id=11111111-1111-4111-8111-000000000001&ir=/empresa/nuevo`. Lo que publiques aparece en `/retos` (perfil 3) por sí solo, porque solo pasa por la base de datos.

## Contrato
- Tabla `challenges` (`supabase/schema.sql`). Creas filas en `borrador` y las pasas a `abierto`. Ciclo de vida: `docs/producto/PRD.md` §8.1.
- `generateChallenge(description, companyName, companyCountry)` en `src/lib/ai/generate.ts` → `GeneratedChallenge`. El prompt es tuyo.
- `getSession()` tiene que ser `{ role: "company" }`. Si no, redirige a `/registro?rol=empresa`.
- Reglas del reto (`PRD.md` §5): plazo en días, nunca trabajo de producción.

## Tareas, en orden

### 1. Afinar el prompt
- [ ] Prueba `generateChallenge` con 3 problemas distintos (datos, marketing, desarrollo), uno con un plazo exagerado y otro que sea claramente trabajo de producción. Comprueba que salen los avisos.
- [ ] Ajusta `generate.ts` hasta que el JSON salga bien siempre: los pesos de la rúbrica suman 100, `duration_days` entre 2 y 10, español claro.

### 2. Generar y editar
- [ ] `/empresa/nuevo`: textarea grande *"¿Qué necesitas resolver y qué perfil buscas?"* con un ejemplo en el placeholder, y botón **Generar reto con IA**.
- [ ] Server Action: lee la empresa de la sesión, llama a `generateChallenge`, inserta en `challenges` con `status = 'borrador'` y `description` = el texto original.
- [ ] Reto generado en un formulario editable: título, resumen, contexto, tarea, perfil, entregable, días, premio y rúbrica (criterio, peso, descripción). Los `warnings`, en un aviso visible arriba.
- [ ] Estado de carga cuidado mientras genera (tarda unos segundos y se ve en directo). Si falla, error claro y botón de reintentar.

### 3. Publicar
- [ ] **Publicar** → `status = 'abierto'`, `deadline = now() + duration_days`.
- [ ] Confirmación: "Reto publicado", con enlace a `/retos/[id]` (lo que ven los estudiantes) y a `/empresa`.

### 4. Borradores
- [ ] Si la empresa tiene retos en `borrador`, enséñalos en `/empresa/nuevo` para poder seguir editándolos. (Los publicados los muestra el dashboard `/empresa` del perfil 4.)

## Hecho cuando
Como empresa de ejemplo, escribes un problema real, generas, cambias un campo, publicas y aparece en `/retos` y en el dashboard `/empresa`.
