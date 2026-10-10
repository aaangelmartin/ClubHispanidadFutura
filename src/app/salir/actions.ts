"use server";
// Dueño: perfil 1. Cerrar sesión desde un botón. Al ser una Server Action, Next vacía la caché
// del navegador y la cabecera deja de enseñar la cuenta (con un <Link> a /salir no pasaba).
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function salir() {
  const c = await cookies();
  c.delete("chf_session");
  // Marca que ha salido: el atajo de demo de src/middleware.ts ya no le vuelve a meter solo.
  c.set("chf_salir", "1", { path: "/", httpOnly: true, sameSite: "lax" });
  redirect("/");
}
