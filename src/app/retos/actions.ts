"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { db } from "@/lib/supabase";
import { aceptaEntregas, detalle, validId } from "./queries";
export type Resultado = { error?: string; ok?: string };
export async function participar(
  id: string,
  _prev: Resultado,
  form: FormData,
): Promise<Resultado> {
  const session = await getSession();
  if (!session || session.role !== "student")
    redirect("/registro?rol=estudiante");
  if (!validId(id)) return { error: "El reto no es válido." };
  const modo = form.get("modo");
  try {
    const reto = await detalle(id);
    if (!reto || !aceptaEntregas(reto))
      return {
        error:
          "El plazo ha terminado. Ya no se aceptan inscripciones ni entregas.",
      };
    const client = db();
    if (modo === "apuntarse") {
      const { error } = await client
        .from("submissions")
        .upsert(
          { challenge_id: id, student_id: session.id },
          { onConflict: "challenge_id,student_id", ignoreDuplicates: true },
        );
      if (error) throw error;
    } else if (modo === "entregar") {
      const link = String(form.get("link") ?? "").trim();
      const notes = String(form.get("notes") ?? "").trim();
      let url: URL;
      try {
        url = new URL(link);
      } catch {
        return {
          error: "Introduce un enlace completo, empezando por https://.",
        };
      }
      if (
        !["https:", "http:"].includes(url.protocol) ||
        url.username ||
        url.password ||
        link.length > 2048
      )
        return { error: "Usa un enlace web válido, sin credenciales." };
      if (!notes || notes.length > 10000)
        return { error: "Explica tu solución (hasta 10.000 caracteres)." };
      const { data, error } = await client
        .from("submissions")
        .update({ link, notes, submitted_at: new Date().toISOString() })
        .eq("challenge_id", id)
        .eq("student_id", session.id)
        .is("submitted_at", null)
        .select("id");
      if (error) throw error;
      if (!data?.length)
        return {
          error:
            "Debes apuntarte primero o ya has enviado tu entrega. Recarga para ver el estado.",
        };
    } else return { error: "Acción no válida." };
    revalidatePath("/retos");
    revalidatePath(`/retos/${id}`);
    return {
      ok:
        modo === "apuntarse"
          ? "Ya estás apuntado. Puedes preparar tu entrega."
          : "Entrega enviada. La empresa la valorará con la rúbrica.",
    };
  } catch {
    return { error: "No se pudo guardar. Vuelve a intentarlo." };
  }
}
