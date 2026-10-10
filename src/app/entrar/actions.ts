"use server";
// Dueño: perfil 1. Volver a entrar con el email con el que te registraste (sin contraseña, como el resto de la demo).
import { redirect } from "next/navigation";
import { db } from "@/lib/supabase";
import { setSession } from "@/lib/session";

export type EntrarState = { error: string | null; email: string };

export async function entrar(_prev: EntrarState, form: FormData): Promise<EntrarState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Escribe el email con el que te registraste.", email };

  let destino: string | null = null;
  try {
    const supabase = db();
    const est = await supabase.from("students").select("id").eq("email", email).maybeSingle();
    if (est.data) {
      await setSession({ role: "student", id: est.data.id as string });
      destino = "/estudiante";
    } else {
      const emp = await supabase.from("companies").select("id").eq("email", email).maybeSingle();
      if (emp.data) {
        await setSession({ role: "company", id: emp.data.id as string });
        destino = "/empresa";
      }
    }
  } catch {
    return { error: "No hemos podido comprobarlo ahora. Inténtalo de nuevo en un momento.", email };
  }

  if (!destino) return { error: "No hay ninguna cuenta con ese email.", email };
  redirect(destino);
}
