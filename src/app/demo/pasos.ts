// Recorrido de la demo. Cada perfil AÑADE aquí sus pantallas nuevas (regla "todo demostrable", AGENTS.md).
// `como` entra con la sesión de ejemplo indicada (IDs de supabase/seed.sql) antes de abrir la ruta.

export type Como = "empresa_es" | "empresa_mx" | "estudiante_es" | "estudiante_mx" | null;

export type Paso = {
  titulo: string;
  frase: string; // lo que se dice en la demo mientras se enseña, en una línea
  ruta: string;
  como: Como;
  perfil: 1 | 2 | 3 | 4;
};

export const SESIONES: Record<Exclude<Como, null>, { rol: "empresa" | "estudiante"; id: string; nombre: string }> = {
  empresa_es: { rol: "empresa", id: "11111111-1111-4111-8111-000000000001", nombre: "Ibérica Retail (España)" },
  empresa_mx: { rol: "empresa", id: "11111111-1111-4111-8111-000000000002", nombre: "Logística Azteca (México)" },
  estudiante_es: { rol: "estudiante", id: "22222222-2222-4222-8222-000000000001", nombre: "Lucía, Complutense (España)" },
  estudiante_mx: { rol: "estudiante", id: "22222222-2222-4222-8222-000000000002", nombre: "Diego, UNAM (México)" },
};

// El orden es el del pitch.
export const PASOS: Paso[] = [
  { perfil: 1, titulo: "Landing", frase: "El problema en una frase y dos puertas: empresa o estudiante.", ruta: "/", como: null },
  { perfil: 1, titulo: "Registro", frase: "Un estudiante se registra en un minuto, con consentimiento explícito.", ruta: "/registro?rol=estudiante", como: null },
  { perfil: 2, titulo: "Publicar un reto con IA", frase: "La empresa escribe su problema y la IA lo convierte en un reto con rúbrica.", ruta: "/empresa/nuevo", como: "empresa_es" },
  { perfil: 3, titulo: "Retos abiertos", frase: "El estudiante de México ve retos reales de empresas españolas, sin CV ni visado.", ruta: "/retos", como: "estudiante_mx" },
  { perfil: 4, titulo: "Dashboard de la empresa", frase: "La empresa ve sus retos, las entregas y lo que le falta por valorar.", ruta: "/empresa", como: "empresa_es" },
  { perfil: 4, titulo: "Valorar entregas", frase: "La IA resume cada entrega frente a la rúbrica; la nota la pone la empresa.", ruta: "/empresa/retos/33333333-3333-4333-8333-000000000003", como: "empresa_es" },
  { perfil: 4, titulo: "Candidatos", frase: "Todos los que han entregado, sin ranking automático.", ruta: "/empresa/candidatos", como: "empresa_es" },
  { perfil: 4, titulo: "Pasaporte", frase: "Gane o no, el estudiante se lleva una valoración real que vale en los dos países.", ruta: "/pasaporte/22222222-2222-4222-8222-000000000001", como: null },
  { perfil: 1, titulo: "Panel en vivo", frase: "Y esto son registros reales de hoy, de España y México.", ruta: "/panel", como: null },
];

export function enlace(paso: Pick<Paso, "ruta" | "como">) {
  if (!paso.como) return paso.ruta;
  const s = SESIONES[paso.como];
  return `/dev/sesion?rol=${s.rol}&id=${s.id}&ir=${encodeURIComponent(paso.ruta)}`;
}
