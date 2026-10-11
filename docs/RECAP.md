# Recap: Hackathon Iberoamérica 2030 (Club Hispanidad Futura)

> Base para el post de LinkedIn y el artículo del blog. Recoge todo lo hablado y hecho el 10/10/2026.
> Pendiente de completar: cómo fue el pitch y el resultado (ver el final).

## Contexto

- **Evento:** Hackathon Iberoamérica 2030, del Club Hispanidad Futura. Sábado 10 de octubre de 2026, de 09:30 a 19:00, en el Instituto de Emprendimiento Avanzado (C. del Turia 7, Madrid).
- **Patrocinadores:** Lovable, Culpass, AI Founders y Startup Grind.
- **Formato:** 5 equipos con el mismo reto.
- **Reto:** *"Iberoamérica 2030: convertir la comunidad iberoamericana en una plataforma tecnológica de oportunidades para el talento joven"*. Una solución piloteable en 90 días entre al menos dos países iberoamericanos y un MVP *"capaz de cualificar demanda real"*.
- **Cinco dimensiones obligatorias:** talento y educación, tecnología e IA, financiación, impacto social y relaciones institucionales.
- **Jurado:** directivos de banca, medios y escuelas de negocio.
- **Criterios:**

  | Criterio | Peso |
  |---|---|
  | Impacto en el talento joven | 25 % |
  | Innovación y uso de la IA | 20 % |
  | Viabilidad en 90 días | 20 % |
  | Escalabilidad | 15 % |
  | Sostenibilidad económica | 10 % |
  | Pitch | 10 % |

- **Premio:** programa de mentoring con Ricardo Laiseca (ex-BBVA) o Giuseppe Tringali (ex-Mediaset, IE). Las propuestas ganadoras se llevan a la Cumbre Iberoamericana de noviembre, a la SEGIB y al podcast Horizonte Hispano.
- **Equipo (5):**

  | Persona | Rol |
  |---|---|
  | Álvaro Carpintero | Valorar y pasaporte, dashboard de empresa, infraestructura y despliegue |
  | Ángel Martín (`aaangelmartin`) | Landing, registro, panel en vivo y marca |
  | Alex Serrano (`alexSerranoR`) | Publicar retos con IA |
  | `adricervantesm` | Resolver retos, lado del estudiante |
  | Thameur Triki | Negocio y pitch |

  Cada persona trabajaba con su propio Claude.

---

## Cronología

### Antes de la hackathon
- Se preparó un plan de equipo (`plan-hackathon.html`): 12 ideas puntuadas con los criterios del jurado, planes B, C y D, agenda, demo y pitch.
- **Apuesta inicial:** *"Retos binacionales, con el pasaporte como resultado, no como producto"*.

### ~12:10 · La idea completa y el primer recorte
- **La idea con la que se llegó:** una plataforma de **retos bidireccionales**. Retos del Club, de la propia plataforma y de empresas que buscan cubrir un puesto. La IA crea el reto y un sistema de matching conecta a los mejores con las empresas. Encima, un **pasaporte de talento** (retos, GitHub, LinkedIn) y **entrada por voz** con un chatbot.
- **Crítica y recorte para el MVP:**
  - Fuera la voz, LinkedIn y el matching automático.
  - Lo que se describía como "matching" era en realidad ordenar entregas por nota.
  - "Bidireccional" había que concretarlo en dos países, porque el reto lo exigía.
  - La objeción segura del jurado iba a ser **"esto es trabajo gratis"**.

### ~12:20 · Decisiones de producto
- **"No es un hackathon: son retos reales online."** La empresa pone un problema real para encontrar a alguien. Nada presencial. La palabra "hackathon" sale del pitch para no confundir al jurado, que estaba en uno presencial.
- **El pasaporte pasa a ser el núcleo.** El joven quiere experiencia demostrable antes de que le paguen. Si no gana, el reto queda **valorado en su pasaporte**. Condición: la empresa valora **todas** las entregas, no solo la ganadora.
- **La IA no decide.** Monta el reto y resume las entregas; la nota la pone una persona. Evaluar candidatos con IA es de alto riesgo en la Ley de IA de la UE, y se convirtió en argumento.
- **Países:** España más uno de Latinoamérica (primero México, al final **Colombia**). A los jóvenes se llega a través de las **universidades**.
- **Frase del pitch:** *"El CV dice lo que hiciste. Aquí demuestras lo que sabes hacer."*

### ~12:40 · El repo como cerebro compartido
- Repo `aaangelmartin/ClubHispanidadFutura`.
- Documentación completa para personas y agentes:
  - PRD con problema, reglas de producto, alcance del MVP, prompts de la IA y registro de decisiones;
  - reparto del equipo, negocio, pitch, marca;
  - `AGENTS.md` con las reglas para todos los agentes.

### ~12:50 · Validación con los mentores
- Se preparó un **deck de validación** de 10 diapositivas (publicado como artifact) con cinco preguntas:
  1. ¿Pagaría una empresa por publicar un reto?
  2. ¿Se verá como trabajo gratis?
  3. ¿Sirven las universidades como canal en 90 días?
  4. ¿México o Colombia para el piloto?
  5. ¿Valoraría otra empresa un pasaporte así?
- **Feedback de los mentores:**
  1. **La idea es escalable pero demasiado grande: hace falta un nicho.** Pusieron el ejemplo de Airbnb, que empezó alquilando colchones hinchables a asistentes de una conferencia. Propuesta resultante: retos dentro de **asignaturas compartidas entre una universidad española y una colombiana**, con un solo perfil (tecnología junior). El "colchón hinchable": las empresas del Encuentro Empresarial de la Cumbre Iberoamericana.
  2. **Diferenciarse de la competencia (HackerRank y similares).** *"HackerRank filtra a quien ya busca trabajo. Nosotros le damos la primera experiencia real a quien todavía no la tiene."*
  3. **Hacer roleplay con todos los actores:** universidad, plataforma, competencia, empresa, estudiante y financiador. Se preparó un guion con lo que quiere, lo que teme y las preguntas trampa de cada uno.
  4. **Ir a la causa raíz del problema.**

### La causa raíz (los 5 porqués)
1. ¿Por qué no contratan a jóvenes? Porque piden experiencia.
2. ¿Por qué piden experiencia? Porque contratar junior es un riesgo.
3. ¿Por qué es un riesgo? Porque el título y el CV no dicen lo que sabes hacer.
4. ¿Por qué no hay otra forma de saberlo? Porque la única prueba creíble es haber trabajado con una empresa real, y esas oportunidades son pocas y van por contactos.
5. ¿Por qué son pocas? Porque montarlas cuesta tiempo y coordinación, y nadie asume ese coste.

**Causa raíz:** *no existe una prueba creíble de lo que un joven sabe hacer, y conseguirla es caro y escaso. Entre países, peor: el título no viaja; una valoración de una empresa real, sí.*

**Datos (con fuente):**
- Paro juvenil en España: **22,7 %** (Eurostat, agosto de 2026).
- Paro juvenil en Colombia: **14,1 %** (DANE).
- El **78 %** de las tecnológicas españolas no cubre sus vacantes (ManpowerGroup).
- Más de **800 empresas españolas** en Colombia.
- Otra línea que se trabajó: *"en España los jóvenes no entran; en Latinoamérica entran mal"* (paro frente a informalidad).

### ~13:00 · Lovable o código propio
- La organización proponía Lovable y el equipo tenía créditos.
- **Decisión:** construir con Claude sobre GitHub, porque Lovable no aloja el stack que necesitábamos.
- **Stack:** Next.js + Supabase + Vercel.
- La API de Claude quedó **bloqueada a propósito**, con un interruptor para activarla. Para la demo se hizo una **IA simulada**, que construye un reto y un resumen creíbles a partir del texto real sin llamar a ningún modelo.

### ~13:00–14:30 · Construir en paralelo: cinco personas, cinco IAs
- **La app en cuatro partes verticales e independientes** (pantallas, lógica y datos de cada una): entrada y registro, publicar retos, resolver retos, y valorar y pasaporte. Más negocio y pitch.
- **Una ficha por perfil.** Cada persona le decía a su Claude *"Soy el perfil N, lee AGENTS.md y tu ficha"*.
- **Los agentes se comunicaban por GitHub Issues:** etiquetas por perfil, `bloqueo`, `contrato` (cambios en lo compartido, como el esquema o los estilos) y un issue de seguimiento por perfil. Nadie esperaba a nadie y nadie pisaba a nadie.
- **Datos de ejemplo desde el minuto uno** y un acceso para entrar como cualquier usuario sin login. Cada parte se probaba sola.
- **Infraestructura:**
  - Supabase en local con Docker para desarrollar;
  - Supabase en la nube creado desde el Marketplace de Vercel;
  - despliegue en Vercel (Frankfurt).

### ~14:30–16:30 · Diseño, "todo demostrable" y pulido
- **Marca:** se empezó con la del Club (crema, azul marino, oro y serif). Ángel la llevó al concepto **pasaporte**: sellos de tinta, banda de lectura mecánica y papel de seguridad. Al final, rebrand completo a **"Embarca"**.
- **Principio "todo demostrable":** es la app real, pero todo está a un clic desde `/demo`, se entiende en 30 segundos y nunca aparece vacío. Las funciones aún no conectadas responden como si funcionaran: mensajes, invitar a entrevista, exportar, integraciones, descargar el pasaporte en PDF.
- **Empresa y joven talento, separados.** El estudiante vive en el pasaporte (sellos, papel de seguridad). La empresa tiene una mesa de control B2B: fondo limpio, cifras y "Guardar valoración" en lugar de "Sellar".
- **Feed del estudiante** como página principal, rediseñado pensando primero en el móvil. Retos de empresas y del Club, actividad ("Lucía ha conseguido un sello de Ibérica Retail"), filtros y "Cierran pronto".
- **Entradas directas:** `/empresa` y `/estudiante`.
- **Demo poblada:** 7 empresas, 25 estudiantes de universidades reales de los dos países, 10 retos, 73 entregas y 16 valoraciones, todo marcado como ejemplo.
- **Mejoras de conversión:** bloque de confianza en el pasaporte y llamada a la acción para empresas (cada pasaporte compartido es una puerta de entrada), y prueba social real en los retos.

### Los fallos que casi rompen la demo
- **Tras fusionar, la web salió sin estilos en producción.** La caché de compilación de Vercel generaba el CSS incompleto. Se arregló con un despliegue limpio.
- **En la página de la demo, al pulsar "empresa" acababas en la pantalla de un estudiante.** Next.js precargaba los enlaces y cada precarga iniciaba sesión con un usuario distinto.
- **En Safari, "Publicar reto" guardaba un borrador en lugar de publicar.** Se encontró probando la demo de punta a punta antes de enseñarla.
- **Una línea que no se cruzó:** el **panel en vivo solo cuenta registros reales**, aunque estuviera a cero. El reto pedía "cualificar demanda real", y un número inflado ahí lo habría hundido todo.

### ~16:00–17:00 · Negocio, lanzamiento y pitch
- **Modelo de negocio (Thameur):** el estudiante y la universidad no pagan nunca, y publicar un reto es gratis. La empresa paga **250 € por cada contacto** de quien ha resuelto su reto, o **1.900 € por un plan premium** (reto diseñado con el equipo y 10 contactos). Sin comisión por contratación, porque no se puede comprobar.
- **Llegar al mercado:** convertir ofertas de empleo ya publicadas en retos y llegar a la empresa con el reto ya resuelto.
- **Lo que se decidió priorizar sobre el dinero: el huevo y la gallina.** Un mercado de dos lados muere si espera a las empresas.
  1. Los primeros retos los pone el Club, o se inspiran en ofertas reales.
  2. Los estudiantes llegan en bloque, a través de sus profesores y en clase.
  3. A la empresa se va con resultados: *"estos estudiantes ya han resuelto tu oferta"*.
  4. Mientras la empresa no entra, valoran los mentores del Club ("Validado por el Club").
- **Por qué entra cada actor:**

  | Actor | Su problema | Qué gana |
  |---|---|---|
  | Estudiante | Le piden experiencia que no puede tener | Un proyecto real valorado en su pasaporte; si se usa en clase, cuenta para la nota |
  | Empresa | Contratar junior es caro, lento y a ciegas | Ve trabajar a los candidatos antes de contratar, en dos países |
  | Universidad | La miden por empleabilidad e internacionalización | Retos listos para clase, experiencia internacional sin viajes y datos de empleabilidad |

- **Piloto de 90 días:**
  - **Mes 1:** 1 universidad en España y 1 en Colombia (por los profesores, no por el rectorado), y 3 empresas buscadas en la Cumbre Iberoamericana (4 y 5 de noviembre).
  - **Mes 2:** 3 retos y unos 100 estudiantes.
  - **Mes 3:** todas las entregas valoradas, los primeros contactos y un informe.
  - **KPI clave:** al menos el 90 % de las entregas valoradas.
- **Recomendaciones para el pitch:**
  - decir "**prototipo funcional, podéis probarlo en este enlace**", no "100 % funcional";
  - "la empresa **desbloquea** el contacto con consentimiento", no "vendemos el contacto";
  - decir el nombre del producto.
- **Demo de 30 segundos:**
  1. Feed de Andrés, estudiante en Bogotá.
  2. Un reto con su rúbrica.
  3. La empresa publica con IA.
  4. Dashboard y valoración.
  5. El sello en el pasaporte.
- **Preparación:** dos ventanas (la sesión es una por navegador) y un vídeo de reserva.
- **~17:00:** se fusionó todo (los PRs de Ángel con el rediseño Embarca). Se probó el ciclo completo de punta a punta (publicar → feed → entregar → valorar → sello en el pasaporte) y se desplegó en producción.

---

## En cifras

| | |
|---|---|
| Commits | 89, entre las 12:27 y las 17:06 (unas 5 horas) |
| Autores | 6 cuentas, 5 personas |
| Issues / PRs | 12 / 3 |
| Código | Unas 7.400 líneas (TypeScript/React) |
| Pantallas | Landing, registro, entrar, QR, panel en vivo, feed, retos, detalle del reto, pasaporte, dashboard de empresa, publicar con IA, valorar, candidatos, mensajes, ajustes, demo |
| Producción | https://club-hispanidad-futura.vercel.app |

## Aprendizajes (para el post)

1. **Recortar es la habilidad.** Llegamos con cinco módulos. Ganó el que respondía a la objeción más dura ("¿esto no es trabajo gratis?"): el pasaporte.
2. **El feedback de los mentores hay que aplicarlo, no solo escucharlo.** Nicho, causa raíz y diferenciación cambiaron el pitch en dos horas.
3. **El problema de verdad no es el precio: es el huevo y la gallina.** Antes de hablar de dinero, hay que saber por qué entra cada actor y en qué orden.
4. **Cinco personas, cinco IAs, un repo.** Las fichas por perfil y GitHub Issues como canal entre agentes permitieron trabajar en paralelo sin pisarse.
5. **Probar la demo de punta a punta antes de enseñarla.** Encontró el fallo de Safari que habría roto el momento clave en directo.
6. **Honestidad con los datos.** El panel a cero antes que un número inflado.
7. **La frase:** *"El CV dice lo que hiciste. Aquí demuestras lo que sabes hacer."*

## Pendiente de completar

- [ ] Cómo fue el pitch: duración, quién presentó, qué preguntó el jurado.
- [ ] Resultado: ¿premio o mención? ¿Pasa a la Cumbre Iberoamericana?
- [ ] ¿Se usó al final el nombre "Embarca"? ¿Se decidió lo de los dos sellos ("Validado por el Club" y "Valorado por la empresa")?
- [ ] Permiso para nombrar a los compañeros, y sus perfiles de LinkedIn.
- [ ] Fotos del evento y capturas de la app (feed, pasaporte, dashboard).
