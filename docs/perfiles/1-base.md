# Perfil 1 · Base e integración (líder técnico)

## Tu misión
Que exista la app: base de datos, despliegue, la puerta de entrada (landing y registro) y el panel en vivo que demuestra demanda real. Después, que los cuatro módulos funcionen juntos de punta a punta y que la demo no falle.

## Tus archivos
- `src/app/page.tsx` (landing), `src/app/layout.tsx` (cabecera y navegación)
- `src/app/registro/`, `src/app/panel/`, `src/app/dev/`
- `src/lib/` **salvo `ai.ts`** (`supabase.ts`, `session.ts`, `types.ts`)
- `supabase/schema.sql`, `.env.example`, `README.md`

**No toques:** `src/app/empresa/` (perfiles 2 y 3), `src/app/retos/` y `src/app/pasaporte/` (perfil 4), `src/lib/ai.ts` (perfil 2).

## Tareas, en orden

### 1. Infraestructura (13:10–13:15). Bloquea a todo el equipo: va primero
- [ ] Crear el proyecto en Supabase. SQL Editor → pegar y ejecutar `supabase/schema.sql`.
- [ ] Crear la clave de la API de Claude (console.anthropic.com).
- [ ] Rellenar `.env.local` (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`) y pasárselo a los perfiles 2, 3 y 4 **por privado**.
- [ ] Vercel: importar el repo, poner las 3 variables, desplegar. URL en `README.md` (sección App).
- [ ] Cuando el perfil 3 tenga `supabase/seed.sql`, ejecutarlo en el SQL Editor y avisar.

### 2. Landing + registro (13:30). El perfil 5 está esperando el enlace
- [ ] `/`: el problema en una frase, la frase del producto y dos botones "Soy empresa" / "Soy estudiante". Textos: los pasa el perfil 5; mientras tanto, usa los de `PRD.md` §1.
- [ ] `/registro?rol=estudiante`: nombre, email, país (`COUNTRIES` de `types.ts`), universidad, áreas o competencias (texto separado por comas → `skills`), GitHub y portfolio opcionales, **casilla de consentimiento obligatoria**: *"Tus datos son tuyos. Los usamos solo para conectarte con retos. RGPD y ley de protección de datos de [país]."* → guarda `consent_at`.
- [ ] `/registro?rol=empresa`: nombre de la empresa, persona de contacto, email, país.
- [ ] Server Action en `src/app/registro/actions.ts`: inserta en `students` o `companies` (si el email ya existe, reutiliza ese registro), llama a `setSession` y redirige: estudiante → `/retos`, empresa → `/empresa/nuevo`.
- [ ] Desplegar y pasar el enlace al perfil 5.

### 3. Panel en vivo (13:50)
- [ ] `/panel`, público. Cifras grandes: estudiantes registrados, empresas, retos publicados, entregas. Desglose de estudiantes por país y por universidad (barras sencillas).
- [ ] **Solo datos reales:** excluye los retos con `is_example = true` y las entregas o estudiantes que solo existan por los datos de ejemplo (el perfil 3 usará emails `@ejemplo.test`; exclúyelos).
- [ ] Que se refresque solo cada 15–30 s (por ejemplo `export const revalidate` o un `router.refresh()` en un intervalo) para enseñarlo en directo.

### 4. Navegación e integración (14:00–15:00)
- [ ] Cabecera en `layout.tsx` con el nombre del producto y enlaces según la sesión: empresa → "Publicar reto", "Mis retos"; estudiante → "Retos", "Mi pasaporte"; siempre "Panel".
- [ ] Recorrer el flujo completo de la demo en producción: registrar empresa → publicar reto → registrar estudiante → entregar → valorar → ver pasaporte → ver el panel. Apuntar lo que falla y pasárselo a su dueño.
- [ ] **15:00 se congela la app.** Grabar el vídeo de reserva (~40 s) del flujo.

## Hecho cuando
Alguien de fuera de la sala abre el enlace en el móvil, se registra y aparece en el panel, y el flujo de la demo funciona en la URL de Vercel sin tocar nada a mano.
