# Perfil 1 · Entrada y demanda

## Tu parte
Todo lo que convierte a una visita en un registro y lo enseña en directo: **landing completa, registro de estudiantes y empresas, y el panel en vivo**. El reto de la hackathon pide un MVP "capaz de cualificar demanda real": tu panel con registros reales es la prueba. El perfil 5 está esperando tu enlace para moverlo por WhatsApp, así que **la prioridad es tener el registro desplegado cuanto antes**.

## Tus archivos
`src/app/page.tsx`, `src/app/registro/`, `src/app/panel/`, `src/app/dev/`, `src/components/Header.tsx` (estilo), `src/app/layout.tsx`, `src/app/globals.css`. Despliegue en Vercel.

## No dependes de nadie
Tus pantallas solo escriben en `students` y `companies` y leen recuentos. La cabecera ya enlaza todas las rutas de los demás.

## Tareas, en orden

### 1. Desplegar (lo primero)
- [ ] Vercel: importar el repo, añadir las 3 variables de `.env.example`, desplegar. Poner la URL en `README.md` (sección App).

### 2. Landing completa
- [ ] Hero: el problema en una frase y la frase del producto (*"El CV dice lo que hiciste. Aquí demuestras lo que sabes hacer."*). Textos definitivos del perfil 5; mientras tanto, usa los de `docs/PRD.md` §1–3.
- [ ] Dos llamadas claras: **Soy estudiante** → `/registro?rol=estudiante` y **Soy empresa** → `/registro?rol=empresa`.
- [ ] "Cómo funciona" en 4 pasos: la empresa describe → la IA monta el reto → el estudiante entrega → la empresa valora y queda en el pasaporte.
- [ ] Bloque "Si no ganas, no pierdes" y una línea de confianza: *"La IA prepara; decide una persona."*
- [ ] España + México (o el país que se elija) visibles: es un piloto entre dos países.
- [ ] Contador en vivo pequeño ("X estudiantes ya registrados") que enlaza a `/panel`.
- [ ] Que se vea bien en el **móvil**: la gente llegará desde WhatsApp.

### 3. Registro (desplegado y enlace al perfil 5)
- [ ] `/registro?rol=estudiante`: nombre, email, país (`COUNTRIES` de `types.ts`), universidad, áreas o competencias (separadas por comas → `skills`), GitHub y portfolio opcionales.
- [ ] **Consentimiento obligatorio:** *"Tus datos son tuyos. Solo los usamos para conectarte con retos. Cumplimos el RGPD y la ley de protección de datos de México."* → guarda `consent_at`.
- [ ] `/registro?rol=empresa`: nombre de la empresa, persona de contacto, email, país.
- [ ] `src/app/registro/actions.ts`: inserta en `students` o `companies` (si el email ya existe, reutiliza ese registro), `setSession(...)` y redirige: estudiante → `/retos`, empresa → `/empresa/nuevo`.
- [ ] Validación y errores en español. Pantalla de "¡Listo!" si hace falta.
- [ ] Desplegar y **pasar el enlace al perfil 5**.

### 4. Panel en vivo
- [ ] `/panel`, público, pensado para el proyector: cifras grandes de estudiantes registrados, empresas, retos publicados y entregas.
- [ ] Estudiantes por país y por universidad (barras sencillas), y los últimos registros (solo nombre de pila y universidad).
- [ ] **Solo datos reales:** excluye emails que terminan en `ejemplo.test` y retos con `is_example = true`.
- [ ] Que se actualice solo cada 15–30 s.

### 5. Cabecera y acabado
- [ ] Ajusta el estilo de `Header.tsx` (las rutas ya están). Pon el nombre del producto cuando el equipo lo decida.
- [ ] A partir de las 15:00: recorre el flujo completo en la URL de Vercel y avisa a cada dueño de lo que falle.

## Hecho cuando
Alguien de fuera de la sala abre el enlace en el móvil, se registra en menos de un minuto y aparece en `/panel` sin que toques nada.
