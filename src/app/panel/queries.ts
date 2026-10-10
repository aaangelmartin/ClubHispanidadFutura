import "server-only";
// Dueño: perfil 1. Cifras del panel en vivo. Solo datos reales: fuera los emails @…ejemplo.test
// y los retos de ejemplo (is_example = true).
import { db } from "@/lib/supabase";

const EJEMPLO = "%ejemplo.test";

export type Panel = {
  estudiantes: number;
  empresas: number;
  retos: number;
  entregas: number;
  porPais: { nombre: string; total: number }[];
  porUniversidad: { nombre: string; total: number }[];
  ultimos: { nombre: string; universidad: string; pais: string; cuando: string }[];
};

function agrupa(valores: string[]) {
  const mapa = new Map<string, number>();
  for (const v of valores) mapa.set(v, (mapa.get(v) ?? 0) + 1);
  return [...mapa.entries()].map(([nombre, total]) => ({ nombre, total })).sort((a, b) => b.total - a.total);
}

export async function getPanel(): Promise<Panel> {
  const supabase = db();
  const [students, companies, challenges] = await Promise.all([
    supabase
      .from("students")
      .select("id, name, country, university, created_at")
      .not("email", "ilike", EJEMPLO)
      .order("created_at", { ascending: false }),
    supabase.from("companies").select("id", { count: "exact", head: true }).not("email", "ilike", EJEMPLO),
    supabase.from("challenges").select("id").eq("is_example", false).neq("status", "borrador"),
  ]);
  if (students.error) throw students.error;

  const realStudents = students.data ?? [];
  const challengeIds = (challenges.data ?? []).map((c) => c.id as string);
  const studentIds = realStudents.map((s) => s.id as string);

  let entregas = 0;
  if (challengeIds.length && studentIds.length) {
    const subs = await supabase
      .from("submissions")
      .select("id", { count: "exact", head: true })
      .in("challenge_id", challengeIds)
      .in("student_id", studentIds)
      .not("submitted_at", "is", null);
    entregas = subs.count ?? 0;
  }

  return {
    estudiantes: realStudents.length,
    empresas: companies.count ?? 0,
    retos: challengeIds.length,
    entregas,
    porPais: agrupa(realStudents.map((s) => s.country as string)),
    porUniversidad: agrupa(realStudents.map((s) => (s.university as string).trim())).slice(0, 8),
    ultimos: realStudents.slice(0, 6).map((s) => ({
      nombre: (s.name as string).split(" ")[0],
      universidad: s.university as string,
      pais: s.country as string,
      cuando: s.created_at as string,
    })),
  };
}

// Para la landing: un número pequeño que no rompe la página si la base de datos no responde.
export async function contarEstudiantes(): Promise<number | null> {
  try {
    const { count, error } = await db()
      .from("students")
      .select("id", { count: "exact", head: true })
      .not("email", "ilike", EJEMPLO);
    return error ? null : (count ?? 0);
  } catch {
    return null;
  }
}
