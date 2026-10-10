# Reparto del equipo (5 personas)

**4 personas en la app, cada una con una parte completa e independiente, y 1 en negocio.** Las fichas con las tareas, los archivos y cómo probar están en [`docs/perfiles/`](perfiles/README.md). A Claude se le dice: *"Soy el perfil N. Lee AGENTS.md y docs/perfiles/N-*.md y empieza por la primera tarea."*

| # | Perfil | Quién | Parte completa |
|---|---|---|---|
| 1 | **Entrada y demanda** | | Landing, registro (estudiante y empresa), panel en vivo, despliegue |
| 2 | **Publicar retos** | | La empresa describe su problema → la IA genera el reto → edita → publica → mis retos |
| 3 | **Resolver retos** | | El estudiante ve los retos, se apunta y entrega |
| 4 | **Valorar y pasaporte** | | La empresa valora con resumen IA → cierra el reto → el pasaporte público |
| 5 | **Negocio** | | Mentores, registros reales, mercado, financiación, partners, KPIs, plan 90 días, pitch |

## Por qué nadie espera a nadie
- Cada parte se comunica con las demás **solo a través de la base de datos**: lo que publica el 2 aparece en el 3; lo que entrega el 3 le aparece al 4.
- **Los datos de ejemplo (`supabase/seed.sql`) ya están hechos**: empresas, estudiantes, retos abiertos, un reto en valoración con entregas y un pasaporte. Cada parte se prueba sola desde el minuto uno.
- **Sin login:** `/dev/sesion` deja entrar como cualquier empresa o estudiante de ejemplo.
- **La cabecera ya enlaza todas las rutas**, y la IA está separada en dos archivos (`generate.ts` del 2, `summarize.ts` del 4).
- Lo único compartido es el **paso 0** (5 minutos: Supabase + clave de Claude), y lo hace quien llegue antes.

## Calendario

| Hora | Hito |
|---|---|
| Ya | Paso 0 hecho y `.env.local` repartido |
| ~13:30 | Perfil 1: registro desplegado y enlace al perfil 5 |
| 14:00 | Puesta en común (5 min): qué han dicho los mentores, registros, qué va retrasado |
| 14:45 | Las cuatro partes funcionando por separado |
| 15:00 | **App congelada**: solo arreglos. El perfil 1 recorre el flujo completo y graba el vídeo de reserva (~40 s) |
| 15:15 | Guion del pitch cerrado (perfil 5) |
| 15:15–15:50 | Dos ensayos cronometrados con todo el equipo |
| 15:55 | Captura del panel en vivo |
| 16:00 | Pitches. El perfil 5 presenta y el perfil 1 hace la demo |

**Regla: cortar antes que retrasarse.** Si una tarea no cabe, se entrega la versión más simple y se avisa.
