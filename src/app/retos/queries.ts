import "server-only";
import { db } from "@/lib/supabase";
import type { Challenge, Submission } from "@/lib/types";
export type Reto = Challenge & { companies: { name: string; country: string } };
export type Entrega = Submission & { evaluations: { id: string }[] };
function normalize<T extends { evaluations: unknown }>(row: T) {
  const value = row.evaluations;
  return {
    ...row,
    evaluations: (Array.isArray(value) ? value : value ? [value] : []) as {
      id: string;
    }[],
  };
}
export const validId = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
export const aceptaEntregas = (r: Pick<Challenge, "status" | "deadline">) =>
  r.status === "abierto" &&
  (!r.deadline || Date.parse(r.deadline) > Date.now());
export function estado(r: Reto, e: Entrega) {
  if (e.evaluations.length) return "Valorado: míralo en tu pasaporte";
  if (e.submitted_at)
    return aceptaEntregas(r) ? "Entregado" : "En valoración por la empresa";
  return aceptaEntregas(r)
    ? "Apuntado · pendiente de entrega"
    : "Plazo finalizado · sin entrega";
}
export function plazo(r: Reto) {
  if (!r.deadline) return "Sin fecha de cierre";
  const d = Math.ceil((Date.parse(r.deadline) - Date.now()) / 86400000);
  return d > 0 ? `Quedan ${d} ${d === 1 ? "día" : "días"}` : "Plazo finalizado";
}
export async function retosAbiertos() {
  const { data, error } = await db()
    .from("challenges")
    .select("*, companies(name, country)")
    .eq("status", "abierto")
    .order("deadline");
  if (error) throw error;
  return (data as Reto[]).filter(aceptaEntregas);
}
export async function misRetos(studentId: string) {
  const { data, error } = await db()
    .from("submissions")
    .select("*, evaluations(id), challenges(*, companies(name, country))")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(normalize) as (Entrega & { challenges: Reto })[];
}
export async function detalle(id: string) {
  const { data, error } = await db()
    .from("challenges")
    .select("*, companies(name, country)")
    .eq("id", id)
    .neq("status", "borrador")
    .maybeSingle();
  if (error) throw error;
  return data as Reto | null;
}
export async function miEntrega(id: string, studentId: string) {
  const { data, error } = await db()
    .from("submissions")
    .select("*, evaluations(id)")
    .eq("challenge_id", id)
    .eq("student_id", studentId)
    .maybeSingle();
  if (error) throw error;
  return data ? (normalize(data) as Entrega) : null;
}
