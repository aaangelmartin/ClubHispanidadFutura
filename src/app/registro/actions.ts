"use server";
// Dueño: perfil 1. Registro de estudiantes y empresas: inserta (o reutiliza por email), fija la sesión y redirige.
import { redirect } from "next/navigation";
import { db } from "@/lib/supabase";
import { setSession } from "@/lib/session";
import { COUNTRIES } from "@/lib/types";

export type FormState = { error: string | null };

function text(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

function url(value: string) {
  if (!value) return null;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Busca por email; si no existe, inserta. Devuelve el id o un mensaje de error.
async function upsertByEmail(table: "students" | "companies", row: Record<string, unknown>) {
  try {
    return await guardar(table, row);
  } catch {
    return { error: "No hemos podido guardar tus datos. Inténtalo de nuevo en un momento." };
  }
}

async function guardar(table: "students" | "companies", row: Record<string, unknown>) {
  const supabase = db();
  const email = row.email as string;
  const found = await supabase.from(table).select("id").eq("email", email).maybeSingle();
  if (found.error) return { error: "No hemos podido guardar tus datos. Inténtalo de nuevo en un momento." };
  if (found.data) return { id: found.data.id as string };

  const inserted = await supabase.from(table).insert(row).select("id").single();
  if (inserted.error) return { error: "No hemos podido guardar tus datos. Inténtalo de nuevo en un momento." };
  return { id: inserted.data.id as string };
}

export async function registerStudent(_prev: FormState, form: FormData): Promise<FormState> {
  const name = text(form, "name");
  const email = text(form, "email").toLowerCase();
  const country = text(form, "country");
  const university = text(form, "university");
  const skills = text(form, "skills")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!name || !email || !country || !university) return { error: "Rellena nombre, email, país y universidad." };
  if (!EMAIL.test(email)) return { error: "Ese email no parece válido. Revísalo." };
  if (!(COUNTRIES as readonly string[]).includes(country)) return { error: "Elige un país de la lista." };
  if (form.get("consent") !== "on") return { error: "Para registrarte tienes que aceptar el uso de tus datos." };

  const result = await upsertByEmail("students", {
    name,
    email,
    country,
    university,
    skills,
    github: url(text(form, "github")),
    portfolio: url(text(form, "portfolio")),
    consent_at: new Date().toISOString(),
  });
  if ("error" in result) return { error: result.error ?? null };

  await setSession({ role: "student", id: result.id });
  redirect("/estudiante");
}

export async function registerCompany(_prev: FormState, form: FormData): Promise<FormState> {
  const name = text(form, "name");
  const contact_name = text(form, "contact_name");
  const email = text(form, "email").toLowerCase();
  const country = text(form, "country");

  if (!name || !contact_name || !email || !country) return { error: "Rellena todos los campos." };
  if (!EMAIL.test(email)) return { error: "Ese email no parece válido. Revísalo." };
  if (!(COUNTRIES as readonly string[]).includes(country)) return { error: "Elige un país de la lista." };

  const result = await upsertByEmail("companies", { name, contact_name, email, country });
  if ("error" in result) return { error: result.error ?? null };

  await setSession({ role: "company", id: result.id });
  redirect("/empresa/nuevo");
}
