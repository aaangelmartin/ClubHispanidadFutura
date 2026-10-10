# Perfil 4 · Lado estudiante

## Tu misión
Todo lo que ve el joven: encuentra un reto real, se apunta, entrega, y se lleva el resultado en su pasaporte. El pasaporte es lo que responde a "¿esto no es trabajo gratis?", así que tiene que verse sólido.

## Tus archivos
- `src/app/retos/` (listado, detalle, entrega y su `actions.ts`)
- `src/app/pasaporte/`

**No toques:** `src/app/empresa/` (perfiles 2 y 3), `src/lib/` (perfil 1).

## Contrato que usas
- Tablas `challenges` (lectura), `companies` (lectura), `submissions` (creas y actualizas), `evaluations` (lectura), `students` (lectura).
- `getSession()` debe ser `{ role: "student", id }` para apuntarse y entregar. Si no hay sesión, manda a `/registro?rol=estudiante`.
- Reglas en `docs/PRD.md` §5 y §8 (P3 y P5). Un estudiante, una entrega por reto (`unique (challenge_id, student_id)`).

## Tareas, en orden

Hasta que estén los datos de ejemplo (~13:15) puedes maquetar con datos inventados en el propio componente. Luego cámbialos por consultas reales.

### 1. Retos abiertos (13:50)
- [ ] `/retos`: tarjetas de los retos con `status = 'abierto'`: título, resumen, empresa y su país, días, plazo, perfil buscado. Etiqueta **"Ejemplo piloto"** si `is_example`.
- [ ] Filtros por país de la empresa y por texto (área o competencia). Pueden ser parámetros de la URL; no hace falta nada complejo.

### 2. Detalle, apuntarse y entregar (14:10)
- [ ] `/retos/[id]`: el reto completo (contexto, tarea, entregable, perfil, plazo, premio sugerido) y **la rúbrica visible**: el estudiante sabe cómo se le va a valorar.
- [ ] Botón **Me apunto** → crea la `submission` vacía.
- [ ] Formulario de entrega: enlace (repo, documento, Figma…) + explicación → rellena `link`, `notes` y `submitted_at`. Solo si el reto está `abierto`.
- [ ] Si ya ha entregado, muestra su entrega y el estado ("En valoración por la empresa" / "Valorada: mira tu pasaporte").
- [ ] Recordatorio visible: *"Tu entrega es tuya salvo que la empresa te contrate. Ganes o no, la valoración irá a tu pasaporte."*

### 3. Pasaporte (14:40)
- [ ] `/pasaporte/[id]`, **público** (sin sesión): nombre, país, universidad, competencias, enlaces a GitHub y portfolio.
- [ ] Una entrada por cada entrega **con valoración**: título del reto, empresa y país, fecha, nota ponderada sobre 10, nota por criterio, feedback de la empresa, enlace a la entrega y un sello **"Valorado por [empresa]"**.
- [ ] Cabecera con un resumen: número de retos completados, países de las empresas y nota media.
- [ ] Botón **Copiar enlace**. Si sobra tiempo, un QR del enlace.
- [ ] Desde la cabecera de la app, "Mi pasaporte" lleva a `/pasaporte/[id de la sesión]` (pídele al perfil 1 que añada el enlace).

## Hecho cuando
Entras como estudiante de ejemplo (`/dev/sesion?rol=estudiante&id=…&ir=/retos`), te apuntas a un reto abierto y entregas. El estudiante que ya tiene valoración en los datos de ejemplo muestra un pasaporte completo y bonito, que se puede enseñar en el proyector.
