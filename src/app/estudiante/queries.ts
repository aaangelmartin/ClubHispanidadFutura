import "server-only";
import { db } from "@/lib/supabase";
import type { Challenge, Company, Evaluation, Student } from "@/lib/types";

// Dueño: perfil 4. Datos del feed del joven talento: retos abiertos (de empresas y de la plataforma) y actividad.

export const PLATAFORMA_ID = "11111111-1111-4111-8111-000000000003"; // autor «Hispanidad Futura» (seed)

function one<T>(x: T | T[] | null | undefined): T | null {
  if (Array.isArray(x)) return x[0] ?? null;
  return x ?? null;
}

export type RetoFeed = Challenge & {
  company: Pick<Company, "id" | "name" | "country">;
  apuntados: number;
  entregas: number;
  yoApuntado: boolean;
};

export type Actividad = {
  id: string;
  fecha: string;
  estudiante: Pick<Student, "id" | "name" | "university" | "country">;
  reto: string;
  empresa: string;
  nota: number | null;
};

export async function getEstudiante(id: string) {
  const { data } = await db().from("students").select("*").eq("id", id).maybeSingle();
  if (!data) return null;
  const { data: subs } = await db().from("submissions").select("id, submitted_at, evaluations(id)").eq("student_id", id);
  const lista = subs ?? [];
  return {
    ...(data as Student),
    apuntado: lista.length,
    entregados: lista.filter((s) => s.submitted_at).length,
    sellos: lista.filter((s) => one(s.evaluations as unknown[] | null)).length,
  };
}

export async function getFeed(estudianteId: string | null): Promise<RetoFeed[]> {
  const { data, error } = await db()
    .from("challenges")
    .select("*, companies(id, name, country), submissions(student_id, submitted_at)")
    .eq("status", "abierto")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(({ companies, submissions, ...c }) => {
    const subs = (submissions ?? []) as { student_id: string; submitted_at: string | null }[];
    return {
      ...(c as Challenge),
      company: one(companies) as RetoFeed["company"],
      apuntados: subs.length,
      entregas: subs.filter((s) => s.submitted_at).length,
      yoApuntado: !!estudianteId && subs.some((s) => s.student_id === estudianteId),
    };
  });
}

export async function getActividad(): Promise<Actividad[]> {
  const { data, error } = await db()
    .from("evaluations")
    .select("id, created_at, scores, submissions(students(id, name, university, country), challenges(title, rubric, companies(name)))")
    .order("created_at", { ascending: false })
    .limit(6);
  if (error) throw new Error(error.message);
  return (data ?? []).flatMap((e) => {
    const sub = one(e.submissions as unknown[] | null) as { students: unknown; challenges: unknown } | null;
    const st = one(sub?.students as Student[] | null);
    const ch = one(sub?.challenges as { title: string; rubric: Challenge["rubric"]; companies: unknown }[] | null);
    if (!st || !ch) return [];
    const scores = e.scores as Evaluation["scores"];
    let t = 0;
    let w = 0;
    for (const r of ch.rubric) {
      const s = scores.find((x) => x.criterion === r.criterion);
      if (s) {
        t += s.score * r.weight;
        w += r.weight;
      }
    }
    return [
      {
        id: e.id as string,
        fecha: e.created_at as string,
        estudiante: st,
        reto: ch.title,
        empresa: (one(ch.companies as { name: string }[] | null)?.name ?? "") as string,
        nota: w ? Math.round((t / w) * 10) / 10 : null,
      },
    ];
  });
}

export function hace(iso: string) {
  const min = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? "hace 1 día" : `hace ${d} días`;
}

export function quedan(deadline: string | null) {
  if (!deadline) return null;
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000);
}

const AREAS: [RegExp, string][] = [
  [/dato|analí|python|sql|gráfico|visualiz/i, "Datos"],
  [/diseñ|ux|figma|web|wireframe/i, "Diseño y UX"],
  [/marketing|campaña|linkedin|comunicaci/i, "Marketing"],
  [/desarroll|program|código|software/i, "Desarrollo"],
];
export function area(c: Pick<Challenge, "title" | "profile" | "deliverable">) {
  const t = `${c.title} ${c.profile} ${c.deliverable}`;
  return AREAS.find(([r]) => r.test(t))?.[1] ?? "General";
}
