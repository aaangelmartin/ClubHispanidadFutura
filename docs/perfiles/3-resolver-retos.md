# Perfil 3 · Resolver retos (estudiante)

## Tu parte
Todo el recorrido del estudiante hasta entregar: **encuentra un reto real, entiende cómo se le va a valorar, se apunta y entrega**. Es la cara del producto para el 25% de impacto en el talento joven: tiene que dar ganas de participar.

## Tus archivos
`src/app/retos/` (listado, detalle, entrega y tus `actions.ts` / componentes).

## No dependes de nadie
Los datos de ejemplo ya traen dos retos abiertos. Entra como estudiante: `/dev/sesion?rol=estudiante&id=22222222-2222-4222-8222-000000000002&ir=/retos`. Lo que entregues le aparece al perfil 4 por sí solo, porque solo pasa por la base de datos.

## Contrato
- Lees `challenges` (con su `companies`) y creas y actualizas `submissions` (`supabase/schema.sql`). Un estudiante, una entrega por reto (`unique`).
- `getSession()` tiene que ser `{ role: "student" }` para apuntarse. Si no hay sesión, manda a `/registro?rol=estudiante`.
- Reglas: `docs/PRD.md` §5 (la entrega es del estudiante; gane o no, va a su pasaporte).

## Tareas, en orden

### 1. Retos abiertos
- [ ] `/retos`: tarjetas de los retos con `status = 'abierto'`: título, resumen, empresa y bandera o país, días de duración, días que quedan, premio y perfil buscado.
- [ ] Etiqueta **"Ejemplo piloto"** si `is_example`.
- [ ] Filtros sencillos por parámetros de URL: país de la empresa y búsqueda por texto.
- [ ] Mensaje de cabecera: *"Retos reales de empresas de España y México. Sin CV. Ganes o no, te llevas la valoración a tu pasaporte."*

### 2. Detalle del reto
- [ ] `/retos/[id]`: contexto, tarea, entregable, perfil, plazo, premio y **la rúbrica visible** con los pesos: el estudiante sabe cómo se le va a valorar.
- [ ] Empresa y país destacados (se trabaja para una empresa de otro país sin visado).

### 3. Apuntarse y entregar
- [ ] **Me apunto** → crea la `submission` vacía (si no hay sesión, a `/registro?rol=estudiante`).
- [ ] Formulario de entrega: enlace (repo, documento, Figma…) + explicación de lo que has hecho → `link`, `notes` y `submitted_at`. Solo si el reto está `abierto`.
- [ ] Si ya entregó: ver su entrega y su estado ("Entregado", "En valoración por la empresa", "Valorado: míralo en tu pasaporte" → `/pasaporte/[id de la sesión]`).
- [ ] Aviso visible: *"Tu entrega es tuya salvo que la empresa te contrate."*

### 4. "Mis retos" del estudiante
- [ ] En `/retos`, si hay sesión de estudiante, una sección arriba con los retos en los que está apuntado y su estado.

## Hecho cuando
Como estudiante de ejemplo, filtras, abres un reto, te apuntas, entregas y ves el estado actualizado, y en el móvil se ve bien.
