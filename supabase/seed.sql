-- Datos de ejemplo. Ejecutar en Supabase → SQL Editor DESPUÉS de schema.sql.
-- Emails @ejemplo.test y retos con is_example = true: el panel en vivo los excluye.
-- País LatAm del piloto: Colombia (issue #8).
--
-- IDs fijos para entrar con /dev/sesion?rol=...&id=...&ir=/ruta
--   Empresa ES  (Ibérica Retail)       11111111-1111-4111-8111-000000000001
--   Empresa CO  (Andina Pagos)        11111111-1111-4111-8111-000000000002
--   Estudiante ES (Lucía, Madrid)      22222222-2222-4222-8222-000000000001  ← tiene pasaporte con 1 valoración
--   Estudiante CO (Andrés, Bogotá)     22222222-2222-4222-8222-000000000002
--   Estudiante CO (Valeria, Medellín) 22222222-2222-4222-8222-000000000003
--   Reto abierto (Ibérica, datos)      33333333-3333-4333-8333-000000000001
--   Reto abierto (Andina, marketing)   33333333-3333-4333-8333-000000000002
--   Reto en valoración (Ibérica, UX)   33333333-3333-4333-8333-000000000003  ← 3 entregas, 1 valorada

insert into companies (id, name, contact_name, email, country) values
('11111111-1111-4111-8111-000000000001', 'Ibérica Retail', 'Marta Gil', 'talento@iberica.ejemplo.test', 'España'),
('11111111-1111-4111-8111-000000000002', 'Andina Pagos', 'Camila Restrepo', 'talento@andina.ejemplo.test', 'Colombia');

insert into students (id, name, email, country, university, skills, github, portfolio, consent_at) values
('22222222-2222-4222-8222-000000000001', 'Lucía Fernández', 'lucia@ejemplo.test', 'España', 'Universidad Complutense de Madrid', '{análisis de datos,python,ux}', 'https://github.com/ejemplo-lucia', null, now()),
('22222222-2222-4222-8222-000000000002', 'Andrés Rojas', 'andres@ejemplo.test', 'Colombia', 'Universidad Nacional de Colombia', '{marketing digital,contenido,ux}', null, 'https://ejemplo.test/diego', now()),
('22222222-2222-4222-8222-000000000003', 'Valeria Ortiz', 'valeria@ejemplo.test', 'Colombia', 'Universidad de Antioquia', '{diseño,figma,investigación de usuarios}', null, 'https://ejemplo.test/valeria', now());

insert into challenges (id, company_id, description, title, summary, context, task, profile, deliverable, duration_days, rubric, suggested_prize, warnings, is_example, status, deadline) values
('33333333-3333-4333-8333-000000000001', '11111111-1111-4111-8111-000000000001',
 'Vendemos online en España y Colombia y en Colombia se abandonan muchos más carritos. Queremos entender por qué y buscamos a alguien junior de análisis de datos.',
 '¿Por qué abandonan el carrito los clientes colombianos?',
 'Analiza un conjunto de datos de compras y propón tres hipótesis comprobables.',
 'Ibérica Retail vende moda online en España y Colombia. En Colombia la tasa de abandono del carrito es casi el doble que en España.',
 'Con el CSV anonimizado de 5.000 sesiones que te damos, encuentra los patrones que diferencian las compras abandonadas de las completadas en cada país y propón tres hipótesis con cómo comprobarlas.',
 'Estudiante de último curso o recién titulado con base de análisis de datos (Excel, Python o R).',
 'Un notebook o informe de máximo 5 páginas y un resumen de una página para dirección.',
 5,
 '[{"criterion":"Rigor del análisis","weight":40,"description":"Los datos se limpian y las conclusiones se apoyan en ellos"},{"criterion":"Calidad de las hipótesis","weight":30,"description":"Son concretas, accionables y comprobables"},{"criterion":"Comunicación","weight":30,"description":"Dirección lo entiende en 2 minutos"}]',
 '300 € y entrevista con el equipo de datos', '{}', true, 'abierto', now() + interval '5 days'),
('33333333-3333-4333-8333-000000000002', '11111111-1111-4111-8111-000000000002',
 'Queremos llegar a pymes españolas que exportan a Colombia. Buscamos un perfil junior de marketing.',
 'Campaña para pymes españolas que venden en Colombia',
 'Diseña una campaña de captación en LinkedIn para pymes exportadoras.',
 'Andina Pagos ofrece cobros y pagos entre España y Colombia y quiere captar pymes españolas que venden allí.',
 'Define público, mensaje y tres piezas de LinkedIn, con el presupuesto y las métricas para un mes de prueba.',
 'Estudiante de marketing, comunicación o ADE.',
 'Presentación de máximo 10 diapositivas con las tres piezas.',
 4,
 '[{"criterion":"Entendimiento del cliente","weight":35,"description":"Conoce el problema real de la pyme exportadora"},{"criterion":"Creatividad del mensaje","weight":35,"description":"Las piezas destacan y son coherentes"},{"criterion":"Medición","weight":30,"description":"Métricas y presupuesto realistas"}]',
 '250 € y prácticas remuneradas de 3 meses', '{}', true, 'abierto', now() + interval '4 days'),
('33333333-3333-4333-8333-000000000003', '11111111-1111-4111-8111-000000000001',
 'Nuestra app de devoluciones tiene muchas quejas. Queremos un perfil junior de UX que proponga mejoras.',
 'Rediseño del flujo de devoluciones',
 'Encuentra los tres mayores problemas del flujo de devoluciones y propón cómo resolverlos.',
 'El 22% de las llamadas al servicio de atención de Ibérica Retail son por dudas con las devoluciones.',
 'Revisa el flujo actual (capturas incluidas) y las 50 quejas anonimizadas, identifica los tres problemas principales y propón un rediseño en wireframes.',
 'Estudiante de diseño, UX o ingeniería con interés en producto.',
 'Enlace a Figma con wireframes y un documento de una página con el razonamiento.',
 5,
 '[{"criterion":"Diagnóstico","weight":40,"description":"Los problemas elegidos salen de las quejas reales"},{"criterion":"Solución","weight":40,"description":"El rediseño los resuelve y es viable"},{"criterion":"Presentación","weight":20,"description":"Claro y fácil de revisar"}]',
 '300 € y entrevista con producto', '{}', true, 'en_valoracion', now() - interval '1 day');

insert into submissions (id, challenge_id, student_id, link, notes, submitted_at) values
('44444444-4444-4444-8444-000000000001', '33333333-3333-4333-8333-000000000003', '22222222-2222-4222-8222-000000000001',
 'https://figma.com/ejemplo/lucia-devoluciones',
 'Agrupé las 50 quejas en 6 temas: el 60% son sobre no saber el estado de la devolución. Propongo una pantalla de seguimiento con estados claros, un aviso al recibir el paquete y mover el botón de devolver al pedido.', now() - interval '2 days'),
('44444444-4444-4444-8444-000000000002', '33333333-3333-4333-8333-000000000003', '22222222-2222-4222-8222-000000000002',
 'https://figma.com/ejemplo/diego-devoluciones',
 'El problema principal es que el formulario pide demasiados datos. Lo reduje de 9 campos a 4 y añadí la opción de devolver en tienda.', now() - interval '2 days'),
('44444444-4444-4444-8444-000000000003', '33333333-3333-4333-8333-000000000003', '22222222-2222-4222-8222-000000000003',
 'https://figma.com/ejemplo/valeria-devoluciones',
 'Hice 5 entrevistas cortas además de leer las quejas. Los tres problemas: no se entiende el plazo, no hay seguimiento y el reembolso tarda. Wireframes de las tres pantallas nuevas.', now() - interval '1 day');

insert into evaluations (id, submission_id, scores, feedback, contact_requested) values
('55555555-5555-4555-8555-000000000001', '44444444-4444-4444-8444-000000000001',
 '[{"criterion":"Diagnóstico","score":9},{"criterion":"Solución","score":8},{"criterion":"Presentación","score":8}]',
 'Muy buen trabajo agrupando las quejas: el dato del 60% es justo lo que necesitábamos. La pantalla de seguimiento es viable. Faltó pensar en devoluciones parciales.', true);

-- Resúmenes de IA de ejemplo, escritos a mano, para que la demo enseñe qué hace la IA sin llamarla.
update submissions set ai_summary = '{"what_it_does":"Agrupa las 50 quejas en 6 temas y detecta que el 60% son sobre no saber en qué estado está la devolución. Propone una pantalla de seguimiento, un aviso al recibir el paquete y mover el botón de devolver dentro del pedido.","by_criterion":[{"criterion":"Diagnóstico","observations":"Cuantifica los problemas a partir de las quejas reales; el dato del 60% está bien sustentado."},{"criterion":"Solución","observations":"Las tres propuestas atacan el problema principal y son viables con la app actual."},{"criterion":"Presentación","observations":"Wireframes claros; el razonamiento cabe en una página."}],"strengths":["Prioriza con datos","Propuesta concreta y viable"],"questions_for_reviewer":["¿Cubre las devoluciones parciales?"]}'
where id = '44444444-4444-4444-8444-000000000001';
update submissions set ai_summary = '{"what_it_does":"Identifica como problema principal el exceso de campos del formulario y lo reduce de 9 a 4. Añade la opción de devolver en tienda física.","by_criterion":[{"criterion":"Diagnóstico","observations":"Elige un problema que aparece en las quejas, pero no explica por qué es el principal ni lo cuantifica."},{"criterion":"Solución","observations":"Simplificar el formulario es viable y rápido; devolver en tienda depende de la logística de la empresa."},{"criterion":"Presentación","observations":"Breve y directa; faltan los wireframes del resto del flujo."}],"strengths":["Solución rápida de implementar","Piensa en el canal físico"],"questions_for_reviewer":["¿El formulario es de verdad el problema más frecuente?","¿Es viable devolver en tienda en todas las ciudades?"]}'
where id = '44444444-4444-4444-8444-000000000002';
update submissions set ai_summary = '{"what_it_does":"Combina 5 entrevistas cortas con la lectura de las quejas y concluye que los tres problemas son el plazo poco claro, la falta de seguimiento y el reembolso lento. Entrega wireframes de tres pantallas nuevas.","by_criterion":[{"criterion":"Diagnóstico","observations":"Es la única entrega que contrasta las quejas con entrevistas propias; los tres problemas coinciden con los datos."},{"criterion":"Solución","observations":"Cubre los tres problemas; el reembolso más rápido depende de procesos internos, no solo de diseño."},{"criterion":"Presentación","observations":"Tres pantallas bien explicadas."}],"strengths":["Investigación propia con usuarios","Visión completa del flujo"],"questions_for_reviewer":["¿Cómo se acortaría el reembolso en la práctica?"]}'
where id = '44444444-4444-4444-8444-000000000003';

-- Retos de la plataforma: los publica el propio Club (autor «Hispanidad Futura»). Se muestran en el feed como «Reto de la plataforma».
insert into companies (id, name, contact_name, email, country) values
('11111111-1111-4111-8111-000000000003', 'Hispanidad Futura', 'Equipo del Club', 'retos@hispanidadfutura.ejemplo.test', 'España')
on conflict (id) do nothing;

insert into challenges (id, company_id, description, title, summary, context, task, profile, deliverable, duration_days, rubric, suggested_prize, warnings, is_example, status, deadline) values
('33333333-3333-4333-8333-000000000004', '11111111-1111-4111-8111-000000000003',
 'Reto semanal del Club para practicar diseño con impacto social.',
 'Reto semanal: rediseña la web de una ONG de Medellín',
 'Propón una web más clara para una ONG que forma a jóvenes en programación.',
 'Una ONG de Medellín forma cada año a 300 jóvenes en programación, pero su web no explica bien cómo apuntarse.',
 'Rediseña la página principal y el formulario de inscripción para que un joven entienda en 30 segundos qué ofrecen y cómo apuntarse.',
 'Cualquier estudiante con interés en diseño, UX o comunicación.',
 'Enlace a Figma con la página principal y el formulario, y una explicación de media página.',
 7,
 '[{"criterion":"Claridad","weight":40,"description":"Se entiende en 30 segundos qué ofrecen y cómo apuntarse"},{"criterion":"Diseño","weight":35,"description":"Atractivo, accesible y coherente"},{"criterion":"Explicación","weight":25,"description":"Las decisiones están justificadas"}]',
 'Sello del Club y sesión de mentoría', '{}', true, 'abierto', now() + interval '7 days'),
('33333333-3333-4333-8333-000000000005', '11111111-1111-4111-8111-000000000003',
 'Reto de datos del Club con datos abiertos.',
 'Reto de datos: ¿dónde estudian los jóvenes iberoamericanos?',
 'Con datos abiertos de la UNESCO, cuenta en un gráfico cómo se mueven los estudiantes entre España y Latinoamérica.',
 'La movilidad de estudiantes entre España y Latinoamérica crece, pero casi nadie la cuenta de forma clara.',
 'Usa los datos abiertos de movilidad estudiantil de la UNESCO y crea una visualización que explique los flujos entre España y Latinoamérica, con tres conclusiones.',
 'Estudiantes de datos, economía, periodismo o cualquier grado con ganas de aprender.',
 'Un gráfico o notebook publicado y un texto de 300 palabras con tus conclusiones.',
 5,
 '[{"criterion":"Rigor","weight":40,"description":"Los datos se usan bien y se citan"},{"criterion":"Visualización","weight":35,"description":"El gráfico se entiende solo"},{"criterion":"Conclusiones","weight":25,"description":"Aportan algo que no era obvio"}]',
 'Sello del Club y publicación en el blog', '{}', true, 'abierto', now() + interval '5 days')
on conflict (id) do nothing;
