# Guion de la demo

Producción: **https://club-hispanidad-futura.vercel.app** · La IA va en modo simulado (no llama a Claude).
Probado de punta a punta el 10/10: publicar → feed → entregar → valorar → sello en el pasaporte.

## Preparación (antes de salir)

**Dos ventanas, para que las sesiones no se pisen** (la sesión es una por navegador):
- **Ventana normal = EMPRESA.** Pestañas, en este orden:
  1. https://club-hispanidad-futura.vercel.app/empresa/nuevo (con el texto de abajo **ya pegado**, sin pulsar)
  2. https://club-hispanidad-futura.vercel.app/empresa
  3. https://club-hispanidad-futura.vercel.app/registro?rol=empresa (solo si dan 90 s)
- **Ventana privada (u otro navegador) = ESTUDIANTE.** Pestañas:
  1. https://club-hispanidad-futura.vercel.app/estudiante
  2. https://club-hispanidad-futura.vercel.app/estudiante/pasaporte

Texto para pegar en «Publicar reto»:
> Somos una fintech con clientes en España y Colombia. Queremos entender por qué los jóvenes no terminan el alta en la app y buscamos a alguien junior de datos.

Zoom del navegador al 110–125 % para el proyector. Vídeo de reserva grabado por si falla la red.

---

## Versión 30 segundos (la del pitch)

| Seg. | Pantalla | Qué haces | Qué dices |
|---|---|---|---|
| 0–6 | Estudiante · `/estudiante` | Bajar un poco el feed | «Andrés estudia en Bogotá. Aquí ve retos reales de empresas españolas y del Club, sin CV y en remoto.» |
| 6–10 | Estudiante · clic en un reto | Señalar la rúbrica | «Antes de empezar ya sabe cómo le van a valorar.» |
| 10–17 | Empresa · `/empresa/nuevo` | **Generar reto con IA** → (3 s) → **Publicar reto** | «Una empresa escribe su problema con sus palabras y la IA lo convierte en un reto con rúbrica. Publicado.» |
| 17–24 | Empresa · `/empresa` → **Valorar ahora** | Señalar el resumen de la IA y los deslizadores | «La empresa recibe entregas de dos países. La IA resume cada una; la nota la pone una persona.» |
| 24–30 | Estudiante · `/estudiante/pasaporte` | Señalar los sellos | «Gane o no, Andrés se lleva el sello de una empresa real en su pasaporte. El CV dice lo que hiciste; esto demuestra lo que sabes hacer.» |

## Versión 90 segundos (si hay tiempo o preguntas)

1. **Registro** (`/registro?rol=empresa` o `?rol=estudiante`): «Un minuto: es una solicitud de pasaporte.» No hace falta enviarlo.
2. **Empresa publica** (`/empresa/nuevo`): Generar → enseñar avisos y rúbrica editable → Publicar → «Ver el reto como estudiante».
3. **Estudiante** (`/estudiante`): el reto recién publicado sale arriba del feed → Me apunto → enlace + explicación → Entregar.
4. **Empresa valora** (`/empresa` → el reto nuevo): «Cerrar entregas» → resumen de la IA → deslizadores + feedback → **Guardar valoración** → «Quiero contactar».
5. **Pasaporte** (`/estudiante/pasaporte`): el sello nuevo aparece con la nota y el feedback.
6. **Cierre**: `/empresa/candidatos` (todos, sin ranking automático) o `/empresa/mensajes`.

## Frases de apoyo

- **Problema:** «En España los jóvenes no entran; en Colombia entran mal. La causa es la misma: no pueden demostrar lo que saben.»
- **IA:** «La IA prepara; decide una persona. Ley de IA de la UE.»
- **Trabajo gratis:** «Si no ganas, no pierdes: te llevas un proyecto real valorado por una empresa real.»

## Si algo falla

- **La IA tarda o falla:** el reto ya publicado de Ibérica sirve igual. Ve directo al dashboard.
- **Sale una pantalla de otro usuario:** entra por `/empresa` o `/estudiante` (cada una te pone en su lado).
- **Sin red:** vídeo de reserva.
- **Ojo con el panel en vivo (`/panel`):** solo cuenta registros reales. No lo enseñes si está a cero.
