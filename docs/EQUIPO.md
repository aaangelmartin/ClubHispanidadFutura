# Reparto del equipo (5 personas)

Cada persona es dueña de su módulo y de sus archivos. Si algo te bloquea, avisa en voz alta; no esperes.

**3 personas en la app** (cada una un módulo) y **2 fuera** (negocio + demanda, y validación + contenido). El pitch empieza a las 14:30, no antes.

| # | Rol | Quién | Módulo / entrega | Archivos |
|---|---|---|---|---|
| 1 | **Base y datos** (líder técnico) | | Proyecto, base de datos, landing, registro, panel en vivo. Integra a los demás | `src/pages/landing`, `src/pages/panel`, `src/lib`, `supabase/` |
| 2 | **Motor de retos** (lado empresa) | | Generar reto con IA, publicar, gestionar estados, valorar entregas | `src/pages/empresa`, `supabase/functions` |
| 3 | **Lado estudiante** | | Retos abiertos, apuntarse, entregar, pasaporte | `src/pages/estudiante`, `src/pages/pasaporte` |
| 4 | **Negocio y demanda** | | Registros reales entrando, datos de mercado con fuente, financiación, KPIs | `docs/NEGOCIO.md` |
| 5 | **Validación y contenido** | | Mentores, retos reales, textos de la app, datos de ejemplo, guion de la demo | `docs/DEMO.md`, `supabase/seed.sql` |

---

## Cómo se trabaja en paralelo en la app

Lovable no deja a tres personas escribir prompts a la vez en el mismo proyecto sin pisarse. Por eso:

1. **La persona 1 crea el proyecto en Lovable con Supabase y lo conecta a GitHub** (este repo o el que cree Lovable; se pone el enlace en el `README`).
2. **La persona 1 crea las tablas** de `PRD.md` §9 tal cual. **Ese esquema es el contrato**: las personas 2 y 3 programan contra él y nadie lo cambia sin avisar.
3. Las personas 2 y 3 trabajan **en el repo con su agente** (Claude Code o similar), cada una en sus carpetas, con `git pull --rebase` y `push` frecuentes. Lovable recoge los cambios desde GitHub.
4. Solo la persona 1 escribe prompts en Lovable, para la base y los arreglos de integración.

Mientras la persona 1 monta la base (hasta las 13:15), las personas 2 y 3 no esperan: la 2 afina los prompts y la 3 maqueta sus pantallas con datos inventados.

---

## Fase 1 · Arranque (12:55–14:30)

**Primeros 5 minutos, los cinco juntos:** asignar roles, elegir el país de LatAm (México o Colombia) y un nombre provisional. Si no hay acuerdo en 5 minutos, decide la persona 1.

### 1 · Base y datos
- [ ] **13:05** Proyecto Lovable + Supabase creado y conectado a GitHub. Enlace en el `README`.
- [ ] **13:15** Tablas de `PRD.md` §9 creadas. Avisar a 2 y 3.
- [ ] **13:20** Landing + registro (estudiante / empresa) + panel en vivo desplegados. Enlace a la persona 4.
- [ ] Después: navegación entre módulos, integrar lo de 2 y 3, revisar que el flujo completo funciona de punta a punta.

### 2 · Motor de retos (lado empresa)
Ciclo de vida completo en `PRD.md` §8.1.
- [ ] **13:15** Prompt de "generar reto" (`PRD.md` §10.1) probado con 3 problemas reales hasta que el JSON salga bien siempre.
- [ ] **13:45** Pantalla "Publicar reto": texto libre → función que llama a la IA → reto editable → **Publicar**.
- [ ] **14:15** Panel de la empresa: sus retos con estado, entregas de cada reto, resumen IA (prompt §10.2), valoración por rúbrica + feedback, botón **Contactar**, **Cerrar reto** (solo si todas las entregas están valoradas).

### 3 · Lado estudiante
- [ ] **13:45** Retos abiertos: listado con filtro por país y área, etiqueta "ejemplo piloto", detalle del reto.
- [ ] **14:00** Apuntarse + formulario de entrega (enlace + explicación).
- [ ] **14:20** Pasaporte público: URL por estudiante con sus retos, nota, feedback y sello "valorado por la empresa".

### 4 · Negocio y demanda
- [ ] **13:10** Mensaje de WhatsApp listo + lista de grupos y contactos universitarios de los dos países.
- [ ] **13:25** Enlace enviado. Seguir moviéndolo.
- [ ] **14:15** `NEGOCIO.md` §1: 3 datos con fuente (paro juvenil en los dos países, ofertas junior que piden experiencia, coste de una agencia) + competidores.

### 5 · Validación y contenido
- [ ] **13:05** Textos de la landing a la persona 1: problema en una frase, frase del producto, botones.
- [ ] **13:45** Recorrer a los mentores con el deck y apuntar las respuestas a las 5 preguntas. Pedirles **un problema real de su empresa**.
- [ ] **14:00** Datos de ejemplo para la persona 1: 2 empresas (una de cada país), 3 retos "ejemplo piloto", 1 entrega buena con su valoración. Mejor si uno de los retos es el real de un mentor.

**14:00 · Puesta en común (5 min):** qué han dicho los mentores, si cambia algo del alcance, cuántos registros hay y qué módulo va retrasado. Lo que se decida va a `PRD.md` §12.

---

## Fase 2 · Pitch y cierre (14:30–16:00)

| Quién | Qué |
|---|---|
| 1, 2 y 3 | Terminar e integrar la app. **15:00 se congela**: solo arreglos. La 2 graba el vídeo de reserva (~40 s) |
| 4 | Financiación y precios, KPIs con número, aliados con nombre, plan de 90 días (`NEGOCIO.md` §2–5) |
| 5 | Guion del pitch (`PITCH.md`) y diapositivas; decide quién presenta. Pregunta a la organización si son 3 o 10 minutos |
| Todos | **15:15** guion cerrado · **15:15–15:50** dos ensayos cronometrados · **15:55** captura del panel en vivo · **16:00** pitches |

Regla de la app: **cortar antes que retrasarse.** Orden de corte: pasaporte estático → panel de empresa sin resumen IA → listado sin filtros.

Cómo trabajamos con el repo: ver `AGENTS.md`.
