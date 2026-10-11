# Marca: Embarca

**Embarca** es la marca del producto, en su versión Hispanidad Futura: el marino y el oro del Club sobre blanco, con la **señalética de un aeropuerto** como lenguaje. Los retos son **tarjetas de embarque**, cada estudiante tiene un **pasaporte de talento** y cada valoración de una empresa es un **sello**.

Está montada en el código:
- `src/app/globals.css`: colores y piezas base.
- `src/app/layout.tsx`: tipografías.
- `src/components/embarca/index.tsx`: el kit (logo, estados, notas, sello, tarjeta de embarque, pasaporte).
- Diseño original en Pencil: `design/embarca.pen`. Referencias del logo del Club: `design/ref/`.

## Concepto

| Metáfora | En la app |
|---|---|
| Tarjeta de embarque | Un reto: empresa, ruta (país de la empresa → país del estudiante), plazo y estado |
| Panel de salidas | Los estados del reto: *Embarcando*, *Cierra pronto*, *Por valorar*, *Cerrado* |
| Pasaporte | El perfil del estudiante: página de identidad y banda de lectura mecánica |
| Sello de tinta | Cada valoración de una empresa, con su nota |

Frase: *"El CV dice lo que hiciste. Aquí demuestras lo que sabes hacer."*

## Colores

| Token | Hex | Uso |
|---|---|---|
| Marino | `#14233D` | Texto, paneles, portada. El color del Club |
| Oro | `#C8963A` | Camino principal, botón principal, isotipo. El otro color del Club |
| Blanco | `#FFFFFF` | Fondo de página |
| Superficie | `#F4F2EC` | Tarjetas y superficies |
| Línea | `#E2E2DE` | Bordes y separadores |
| Texto secundario | `#5F6166` | Textos de apoyo |
| Verde | `#00843D` | Estado: *embarcando*, valorado, todo bien |
| Ámbar | `#F59E0B` | Estado: *cierra pronto*, aviso |
| Rojo | `#D21034` | Estado: *cerrado*; tinta del sello |
| Azul | `#0B4EA2` | Servicios secundarios; entregada |

Los colores de estado copian un panel de salidas: verde, ámbar y rojo se leen sin explicación. El oro marca una sola cosa por pantalla: el siguiente paso.

## Tipografía

| Rol | Fuente |
|---|---|
| Títulos y texto | **Hanken Grotesk** (400–800) |
| Datos, códigos, banda del pasaporte | **B612 Mono**, la tipografía de las cabinas de avión |
| Firma del Club («Hispanidad Futura») | Lobster, solo en la marca del Club |
| Palabra del escudo | Raleway 800, solo en la marca del Club |

Fuera de las clases de Tailwind se usan las variables de next/font: `var(--font-hanken)`, `var(--font-b612)`, `var(--font-lobster)`, `var(--font-raleway)`. Las variables de `@theme inline` no existen como CSS.

## Logo

Isotipo: un cuadrado oro con una flecha de salida (↗) en marino, seguido de **Embarca** en Hanken Grotesk Bold. Versión clara para fondos marinos (`<Logo claro />`). Imagen para documentos: `docs/assets/logo.svg`.

## Piezas base

| Clase o componente | Qué es |
|---|---|
| `btn`, `btn btn-primary` | Botón secundario y principal (el principal en oro con texto marino). Uno principal por pantalla |
| `card`, `chip`, `field`, `eyebrow` | Tarjeta, etiqueta de estado, campo de formulario, antetítulo |
| `<EstadoReto />`, `<EstadoEntrega />` | Estados con los colores del panel de salidas |
| `<Nota />` | Nota de 0 a 10 con su color |
| `<Sello />` | Sello de tinta de una valoración |
| `<TarjetaEmbarque />` | Un reto como tarjeta de embarque |
| `<Pasaporte />` | El pasaporte del estudiante |

## Tono

- Claro, directo y en español. Se habla de tú al estudiante y de usted a nadie.
- Sin emojis ni gradientes. La metáfora del aeropuerto se usa con moderación: ayuda a entender, no decora.
- Datos honestos: lo que es de ejemplo se marca como *ejemplo piloto*.
