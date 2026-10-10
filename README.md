# Club Hispanidad Futura — Hackathon Iberoamérica 2030

**Retos reales online + Pasaporte de talento.**

> La empresa nos cuenta qué necesita. La IA lo convierte en un reto real online. Estudiantes de España y LatAm lo resuelven, y la empresa contacta al que lo demuestra. Quien no gana se lleva el proyecto valorado en su pasaporte.

*"El CV dice lo que hiciste. Aquí demuestras lo que sabes hacer."*

## Documentos
| Archivo | Qué hay |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Cómo trabajamos (personas y agentes) |
| [`docs/BRANDING.md`](docs/BRANDING.md) | Marca de la app, el deck y el pitch: colores, tipografías y piezas base |
| [`docs/PRD.md`](docs/PRD.md) | Producto: problema, reglas, MVP, IA, datos, decisiones |
| [`docs/perfiles/`](docs/perfiles/README.md) | **Una ficha por perfil: empieza aquí** |
| [`docs/EQUIPO.md`](docs/EQUIPO.md) | Reparto (4 partes de la app + negocio) y calendario |
| [`docs/PROBLEMA.md`](docs/PROBLEMA.md) | El problema a fondo, con datos y fuentes |
| [`docs/ROLEPLAY.md`](docs/ROLEPLAY.md) | Causa raíz (5 porqués) y guion de roleplay con cada actor |
| [`docs/NICHO.md`](docs/NICHO.md) | Propuesta de nicho de entrada, competidores y cómo vender a universidades |
| [`docs/NEGOCIO.md`](docs/NEGOCIO.md) | Mercado, financiación, KPIs, aliados, plan 90 días |
| [`docs/PITCH.md`](docs/PITCH.md) | Guion del pitch de 3 minutos |
| [`docs/deck-mentores.html`](docs/deck-mentores.html) | Deck para validar con mentores ([publicado](https://claude.ai/code/artifact/ca73f748-aac1-4b16-b9db-db126fd59be0)) |

## App

Demo desplegada: **[PENDIENTE: URL de Vercel]**

Next.js 15 + Supabase + API de Claude, en Vercel.

```bash
npm install
cp .env.example .env.local   # valores del paso 0 (docs/perfiles/README.md)
npm run dev                  # http://localhost:3000
```

| Ruta | Qué es | Dueño |
|---|---|---|
| `/`, `/registro`, `/panel` | Entrada y demanda | Perfil 1 |
| `/empresa/nuevo` | Publicar retos | Perfil 2 |
| `/retos`, `/retos/[id]` | Resolver retos | Perfil 3 |
| `/empresa`, `/empresa/candidatos`, `/empresa/retos/[id]`, `/pasaporte/[id]` | Valorar y pasaporte | Perfil 4 |

Base de datos: ejecutar `supabase/schema.sql` y luego `supabase/seed.sql` (datos de ejemplo) en el SQL Editor de Supabase.
