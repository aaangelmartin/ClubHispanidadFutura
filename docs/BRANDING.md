# Branding

**La app, el deck de mentores y las diapositivas del pitch usan la misma marca:** la del deck de validación (`docs/deck-mentores.html`), que sale de la guía del Club Hispanidad Futura. Crema, azul marino y oro, con títulos en serif.

Ya está montada en el código: `src/app/globals.css` (colores y piezas base) y `src/app/layout.tsx` (tipografías). **No hay que definir colores ni fuentes nuevas**: usa las clases de abajo.

## Colores

| Token | Hex | Uso | Clase Tailwind |
|---|---|---|---|
| `bg` | `#EAE3D6` | Fondo de página (crema) | `bg-bg` |
| `paper` | `#F6F1E7` | Tarjetas y superficies | `bg-paper` |
| `ink` | `#14233D` | Texto principal, botón principal (azul marino) | `text-ink`, `bg-ink` |
| `ink-2` | `#4A5568` | Texto secundario | `text-ink-2` |
| `ink-3` | `#7A8496` | Etiquetas y ayudas | `text-ink-3` |
| `line` | marino al 14 % | Bordes y separadores | `border-line` |
| `gold` | `#A9781F` | **Único acento**: lo importante, lo recomendado, el sello del pasaporte | `text-gold`, `border-gold`, `bg-gold` |
| `gold-soft` | oro al 12 % | Fondo de lo destacado | `bg-gold-soft` |
| `ok` | `#2F6B4F` | Estado: valorado, completado | `text-ok` |
| `warn` | `#9A5B13` | Estado: falta algo | `text-warn` |

**Regla:** el oro solo para una cosa por pantalla (lo que importa). Todo lo demás, marino y grises.

## Tipografía

| Rol | Fuente | Clase |
|---|---|---|
| Títulos | Fraunces (serif) | `font-display` (los `h1`–`h3` ya la llevan) |
| Texto | Source Sans 3 | por defecto |
| Etiquetas, cifras, código | IBM Plex Mono | `font-mono` |
| Marca: «Hispanidad Futura» | Lobster | `font-script` (solo la marca) |
| Marca: palabra del escudo | Raleway 800 | `font-escudo` (solo la marca) |

El escudo del Club con la palabra del producto está en `src/components/Marca.tsx` (`<Marca />` y `<Escudo />`).

**Ojo:** las variables de `@theme inline` no existen como CSS. Fuera de las clases de Tailwind usa las de next/font: `var(--font-fraunces)`, `var(--font-source-sans)`, `var(--font-plex-mono)`, `var(--font-lobster)`, `var(--font-raleway)`.

Cifras alineadas en columnas: clase `tabular`.

## Piezas base (en `globals.css`)

| Clase | Qué es |
|---|---|
| `card` | Tarjeta: fondo `paper`, borde `line`, radio 6 px |
| `eyebrow` | Etiqueta pequeña en mayúsculas, mono, en oro, encima de un título |
| `btn` | Botón secundario |
| `btn btn-primary` | Botón principal (marino). Uno por pantalla |
| `chip` | Etiqueta de estado redondeada |
| `field` | Input, textarea o select |

## Tono
- Sobrio e institucional: lo va a ver un jurado de banca, medios y escuelas de negocio, y se proyecta.
- Nada de gradientes, emojis ni sombras grandes. Radios pequeños (6 px).
- Textos en español, cortos y claros.
- Tema claro único.
