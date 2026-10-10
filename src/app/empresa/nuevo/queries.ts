import "server-only";
import { redirect } from "next/navigation";
import { db } from "@/lib/supabase";
import { getSession } from "@/lib/session";
import type { Challenge, Company } from "@/lib/types";

// Dueño: perfil 2. Consultas de publicar retos.

export async function requireCompany(): Promise<Company> {
  const session = await getSession();
  if (session?.role !== "company") redirect("/registro?rol=empresa");
  const { data, error } = await db().from("companies").select("*").eq("id", session.id).single();
  if (error || !data) redirect("/registro?rol=empresa");
  return data as Company;
}

export async function getDrafts(companyId: string) {
  const { data, error } = await db()
    .from("challenges")
    .select("id, title, created_at")
    .eq("company_id", companyId)
    .eq("status", "borrador")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Pick<Challenge, "id" | "title" | "created_at">[];
}

export async function getDraft(companyId: string, id: string) {
  const { data } = await db().from("challenges").select("*").eq("id", id).eq("company_id", companyId).maybeSingle();
  return (data as Challenge | null) ?? null;
}
