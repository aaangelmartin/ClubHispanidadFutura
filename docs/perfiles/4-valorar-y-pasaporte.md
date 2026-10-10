# Perfil 4 · Valorar y pasaporte

## Tu parte
El cierre del ciclo y lo que responde a "¿esto no es trabajo gratis?": **la empresa valora cada entrega con ayuda de la IA, y el resultado queda en el pasaporte público del estudiante**. Es el segundo uso de IA y la pantalla final de la demo.

## Tus archivos
`src/app/empresa/retos/` (valorar), `src/app/pasaporte/`, `src/lib/ai/summarize.ts`, y tus `actions.ts` / componentes dentro de esas carpetas.

**No toques:** `src/app/empresa/page.tsx` ni `src/app/empresa/nuevo/` (perfil 2).

## No dependes de nadie
Los datos de ejemplo ya traen un reto en valoración con 3 entregas (1 valorada) y un pasaporte con una valoración:
- Entra como la empresa: `/dev/sesion?rol=empresa&id=11111111-1111-4111-8111-000000000001&ir=/empresa/retos/33333333-3333-4333-8333-000000000003`
- Pasaporte: `/pasaporte/22222222-2222-4222-8222-000000000001`

## Contrato
- Lees `challenges`, `submissions`, `students` y `companies`. Escribes `submissions.ai_summary`, `evaluations` y `challenges.status` (`supabase/schema.sql`).
- `summarizeSubmission(challenge, { link, notes })` en `src/lib/ai/summarize.ts` → `AiSummary`. El prompt es tuyo.
- Reglas (`docs/PRD.md` §5): **la IA no pone nota ni ordena; decide la empresa**. Se valoran **todas** las entregas. Solo la empresa dueña del reto lo ve.
- Ciclo de vida: `PRD.md` §8.1.

## Tareas, en orden

### 1. Valorar entregas
- [ ] `/empresa/retos/[id]`: cabecera con el reto, su estado y la rúbrica. Debajo, una tarjeta por entrega.
- [ ] En cada tarjeta: enlace y explicación del estudiante, y el **resumen IA** (qué hace, observaciones por criterio, puntos fuertes, preguntas para quien revisa). Si `ai_summary` está vacío, genéralo con `summarizeSubmission`, guárdalo y muestra "Resumiendo…" mientras tanto.
- [ ] Formulario de valoración: nota de 0 a 10 por cada criterio + feedback obligatorio → inserta en `evaluations`. Muestra la nota ponderada como referencia.
- [ ] Botón **Contactar** → `contact_requested = true` y muestra el email del estudiante.
- [ ] Texto visible: *"La IA resume, tú decides."*

### 2. Estados del reto
- [ ] **Cerrar entregas** (`abierto` → `en_valoracion`), para la demo sin esperar al plazo.
- [ ] **Cerrar reto** (`en_valoracion` → `cerrado`), **desactivado hasta que todas las entregas estén valoradas**, con el motivo visible ("Faltan 2 entregas por valorar").

### 3. Pasaporte
- [ ] `/pasaporte/[id]`, **público** (sin sesión): nombre, país, universidad, competencias, GitHub y portfolio.
- [ ] Resumen arriba: retos completados, países de las empresas y nota media.
- [ ] Una entrada por cada entrega **valorada**: reto, empresa y país, fecha, nota ponderada sobre 10, nota por criterio, feedback, enlace a la entrega y sello **"Valorado por [empresa]"**.
- [ ] Botón **Copiar enlace**. Si sobra tiempo, QR del enlace.
- [ ] Que se vea muy bien en el proyector: es la última pantalla de la demo.

## Hecho cuando
Como la empresa de ejemplo, abres el reto en valoración, ves los resúmenes, valoras las dos entregas que faltan, cierras el reto, y las valoraciones aparecen en los pasaportes de esos estudiantes.
