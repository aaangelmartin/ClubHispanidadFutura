# Club Hispanidad Futura — Hackathon Iberoamérica 2030

**Retos reales online + Pasaporte de talento.**

> La empresa nos cuenta qué necesita. La IA lo convierte en un reto real online. Estudiantes de España y LatAm lo resuelven, y la empresa contacta al que lo demuestra. Quien no gana se lleva el proyecto valorado en su pasaporte.

*"El CV dice lo que hiciste. Aquí demuestras lo que sabes hacer."*

## Documentos
| Archivo | Qué hay |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Cómo trabajamos (personas y agentes) |
| [`docs/PRD.md`](docs/PRD.md) | Producto: problema, reglas, MVP, IA, datos, decisiones |
| [`docs/EQUIPO.md`](docs/EQUIPO.md) | Reparto de los 5 roles y calendario del día |
| [`docs/NEGOCIO.md`](docs/NEGOCIO.md) | Mercado, financiación, KPIs, aliados, plan 90 días |
| [`docs/PITCH.md`](docs/PITCH.md) | Guion del pitch de 3 minutos |
| [`docs/deck-mentores.html`](docs/deck-mentores.html) | Deck para validar con mentores ([publicado](https://claude.ai/code/artifact/ca73f748-aac1-4b16-b9db-db126fd59be0)) |

## App

Demo desplegada: **[PENDIENTE: URL de Vercel]**

Next.js 15 + Supabase + API de Claude, en Vercel.

```bash
npm install
cp .env.example .env.local   # pide los valores a la persona 1
npm run dev                  # http://localhost:3000
```

| Ruta | Qué es | Dueño |
|---|---|---|
| `/` | Landing | Persona 1 |
| `/registro` | Registro estudiante / empresa | Persona 1 |
| `/panel` | Panel en vivo | Persona 1 |
| `/empresa`, `/empresa/nuevo`, `/empresa/retos/[id]` | Motor de retos (lado empresa) | Persona 2 |
| `/retos`, `/retos/[id]`, `/pasaporte/[id]` | Lado estudiante | Persona 3 |

Esquema de la base de datos: `supabase/schema.sql` (ejecutar una vez en el SQL Editor de Supabase).
