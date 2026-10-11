// Recorrido de la demo. Cada perfil AÑADE aquí sus pantallas nuevas (regla "todo demostrable", AGENTS.md).
// `como` fija la sesión con la que se abre la ruta (IDs de supabase/seed.sql). Cada paso la declara explícitamente:
// el atajo de src/middleware.ts nunca cambia una sesión por otra, así que un paso de empresa sin `como` abierto
// después de uno de estudiante acabaría en /estudiante.
//   - una sesión de SESIONES: entra como esa cuenta antes de abrir la ruta.
//   - "visitante": cierra la sesión antes de abrir la ruta (landing y registro se ven como alguien nuevo).
//   - null: página pública que no depende de la sesión (se abre tal cual).

export type Sesion = "empresa_es" | "empresa_co" | "estudiante_es" | "estudiante_co";
export type Como = Sesion | "visitante" | null;

export type Acto = "entrada" | "publica" | "resuelve" | "decide" | "impacto";

export type Paso = {
  titulo: string;
  frase: string; // lo que se dice en la demo mientras se enseña, en una línea
  ruta: string;
  como: Como;
  acto: Acto;
  perfil: 1 | 2 | 3 | 4;
};

export const SESIONES: Record<Sesion, { rol: "empresa" | "estudiante"; id: string; nombre: string }> = {
  empresa_es: { rol: "empresa", id: "11111111-1111-4111-8111-000000000001", nombre: "Ibérica Retail (España)" },
  empresa_co: { rol: "empresa", id: "11111111-1111-4111-8111-000000000002", nombre: "Andina Pagos (Colombia)" },
  estudiante_es: { rol: "estudiante", id: "22222222-2222-4222-8222-000000000001", nombre: "Lucía, Complutense (España)" },
  estudiante_co: { rol: "estudiante", id: "22222222-2222-4222-8222-000000000002", nombre: "Andrés, U. Nacional (Colombia)" },
};

// Los actos del pitch, en orden. Los pasos se agrupan por acto en /demo.
export const ACTOS: { k: Acto; titulo: string; quien: string }[] = [
  { k: "entrada", titulo: "La puerta de entrada", quien: "Visitante" },
  { k: "publica", titulo: "La empresa publica un reto", quien: "Ibérica Retail" },
  { k: "resuelve", titulo: "El estudiante lo resuelve", quien: "Andrés, Colombia" },
  { k: "decide", titulo: "La empresa valora y decide", quien: "Ibérica Retail" },
  { k: "impacto", titulo: "Lo que queda", quien: "Público" },
];

// El orden es el del pitch.
export const PASOS: Paso[] = [
  { perfil: 1, acto: "entrada", titulo: "Landing", frase: "El problema en una frase y dos puertas: empresa o estudiante.", ruta: "/", como: "visitante" },
  { perfil: 1, acto: "entrada", titulo: "Registro", frase: "Un estudiante se registra en un minuto, con consentimiento explícito.", ruta: "/registro?rol=estudiante", como: "visitante" },
  { perfil: 2, acto: "publica", titulo: "Publicar un reto con IA", frase: "La empresa escribe su problema y la IA lo convierte en un reto con rúbrica.", ruta: "/empresa/nuevo", como: "empresa_es" },
  { perfil: 4, acto: "resuelve", titulo: "Inicio del estudiante (feed)", frase: "El estudiante de Colombia ve en su feed retos reales de empresas y del Club, y lo que consiguen otros.", ruta: "/estudiante", como: "estudiante_co" },
  { perfil: 3, acto: "resuelve", titulo: "Retos abiertos", frase: "Y puede buscar con filtros por país y perfil.", ruta: "/retos", como: "estudiante_co" },
  { perfil: 3, acto: "resuelve", titulo: "Resolver y entregar", frase: "El estudiante conoce la rúbrica, se apunta y entrega su solución. Su trabajo sigue siendo suyo.", ruta: "/retos/33333333-3333-4333-8333-000000000001", como: "estudiante_co" },
  { perfil: 4, acto: "decide", titulo: "Dashboard de la empresa", frase: "La empresa ve sus retos, las entregas y lo que le falta por valorar.", ruta: "/empresa", como: "empresa_es" },
  { perfil: 4, acto: "decide", titulo: "Valorar entregas", frase: "La IA resume cada entrega frente a la rúbrica; la nota la pone la empresa.", ruta: "/empresa/retos/33333333-3333-4333-8333-000000000003", como: "empresa_es" },
  { perfil: 4, acto: "decide", titulo: "Candidatos", frase: "Todos los que han entregado, sin ranking automático.", ruta: "/empresa/candidatos", como: "empresa_es" },
  { perfil: 4, acto: "decide", titulo: "Mensajes", frase: "La empresa habla con el candidato que le interesa sin salir de la plataforma.", ruta: "/empresa/mensajes", como: "empresa_es" },
  { perfil: 4, acto: "decide", titulo: "Ajustes y plan", frase: "Piloto gratis 90 días; después, pago por reto y comisión si contrata.", ruta: "/empresa/ajustes", como: "empresa_es" },
  // Lucía tiene la entrega valorada del seed: su pasaporte es el que enseña un sello real.
  { perfil: 4, acto: "impacto", titulo: "Pasaporte", frase: "Gane o no, el estudiante se lleva una valoración real que vale en los dos países.", ruta: "/pasaporte/22222222-2222-4222-8222-000000000001", como: null },
  { perfil: 1, acto: "impacto", titulo: "Panel en vivo", frase: "Y esto son registros reales de hoy, de España y Colombia.", ruta: "/panel", como: null },
];

export function enlace(paso: Pick<Paso, "ruta" | "como">) {
  if (!paso.como) return paso.ruta;
  if (paso.como === "visitante") return `/salir?ir=${encodeURIComponent(paso.ruta)}`;
  const s = SESIONES[paso.como];
  return `/dev/sesion?rol=${s.rol}&id=${s.id}&ir=${encodeURIComponent(paso.ruta)}`;
}

// Texto del chip de cada paso.
export function etiqueta(como: Como) {
  if (!como) return "Pública";
  if (como === "visitante") return "Sin sesión";
  return SESIONES[como].nombre;
}
