-- Datos de ejemplo. Ejecutar en Supabase → SQL Editor DESPUÉS de schema.sql.
-- Emails @ejemplo.test y retos con is_example = true: el panel en vivo los excluye.
-- País LatAm provisional: México. Si se elige Colombia, cambiar aquí.
--
-- IDs fijos para entrar con /dev/sesion?rol=...&id=...&ir=/ruta
--   Empresa ES  (Ibérica Retail)       11111111-1111-4111-8111-000000000001
--   Empresa MX  (Logística Azteca)     11111111-1111-4111-8111-000000000002
--   Estudiante ES (Lucía, Madrid)      22222222-2222-4222-8222-000000000001  ← tiene pasaporte con 1 valoración
--   Estudiante MX (Diego, CDMX)        22222222-2222-4222-8222-000000000002
--   Estudiante MX (Valeria, Guadalajara) 22222222-2222-4222-8222-000000000003
--   Reto abierto (Ibérica, datos)      33333333-3333-4333-8333-000000000001
--   Reto abierto (Azteca, marketing)   33333333-3333-4333-8333-000000000002
--   Reto en valoración (Ibérica, UX)   33333333-3333-4333-8333-000000000003  ← 3 entregas, 1 valorada

insert into companies (id, name, contact_name, email, country) values
('11111111-1111-4111-8111-000000000001', 'Ibérica Retail', 'Marta Gil', 'talento@iberica.ejemplo.test', 'España'),
('11111111-1111-4111-8111-000000000002', 'Logística Azteca', 'Jorge Ramírez', 'rh@azteca.ejemplo.test', 'México');

insert into students (id, name, email, country, university, skills, github, portfolio, consent_at) values
('22222222-2222-4222-8222-000000000001', 'Lucía Fernández', 'lucia@ejemplo.test', 'España', 'Universidad Complutense de Madrid', '{análisis de datos,python,ux}', 'https://github.com/ejemplo-lucia', null, now()),
('22222222-2222-4222-8222-000000000002', 'Diego Hernández', 'diego@ejemplo.test', 'México', 'UNAM', '{marketing digital,contenido,ux}', null, 'https://ejemplo.test/diego', now()),
('22222222-2222-4222-8222-000000000003', 'Valeria Ortiz', 'valeria@ejemplo.test', 'México', 'Universidad de Guadalajara', '{diseño,figma,investigación de usuarios}', null, 'https://ejemplo.test/valeria', now());

insert into challenges (id, company_id, description, title, summary, context, task, profile, deliverable, duration_days, rubric, suggested_prize, warnings, is_example, status, deadline) values
('33333333-3333-4333-8333-000000000001', '11111111-1111-4111-8111-000000000001',
 'Vendemos online en España y México y en México se abandonan muchos más carritos. Queremos entender por qué y buscamos a alguien junior de análisis de datos.',
 '¿Por qué abandonan el carrito los clientes mexicanos?',
 'Analiza un conjunto de datos de compras y propón tres hipótesis comprobables.',
 'Ibérica Retail vende moda online en España y México. En México la tasa de abandono del carrito es casi el doble que en España.',
 'Con el CSV anonimizado de 5.000 sesiones que te damos, encuentra los patrones que diferencian las compras abandonadas de las completadas en cada país y propón tres hipótesis con cómo comprobarlas.',
 'Estudiante de último curso o recién titulado con base de análisis de datos (Excel, Python o R).',
 'Un notebook o informe de máximo 5 páginas y un resumen de una página para dirección.',
 5,
 '[{"criterion":"Rigor del análisis","weight":40,"description":"Los datos se limpian y las conclusiones se apoyan en ellos"},{"criterion":"Calidad de las hipótesis","weight":30,"description":"Son concretas, accionables y comprobables"},{"criterion":"Comunicación","weight":30,"description":"Dirección lo entiende en 2 minutos"}]',
 '300 € y entrevista con el equipo de datos', '{}', true, 'abierto', now() + interval '5 days'),
('33333333-3333-4333-8333-000000000002', '11111111-1111-4111-8111-000000000002',
 'Queremos llegar a pymes españolas que exportan a México. Buscamos un perfil junior de marketing.',
 'Campaña para pymes españolas que exportan a México',
 'Diseña una campaña de captación en LinkedIn para pymes exportadoras.',
 'Logística Azteca gestiona aduanas y transporte entre España y México y quiere captar pymes españolas.',
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
