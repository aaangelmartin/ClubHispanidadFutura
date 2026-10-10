// Dueño: persona 1. Atajo de desarrollo para hacerse pasar por una empresa o un estudiante
// sin pasar por /registro. Ejemplo: /dev/sesion?rol=empresa&id=<uuid>&ir=/empresa
import { NextResponse, type NextRequest } from "next/server";
import { setSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const rol = req.nextUrl.searchParams.get("rol");
  const id = req.nextUrl.searchParams.get("id");
  const ir = req.nextUrl.searchParams.get("ir") ?? "/";
  if ((rol !== "empresa" && rol !== "estudiante") || !id) {
    return NextResponse.json({ error: "Usa ?rol=empresa|estudiante&id=<uuid>&ir=/ruta" }, { status: 400 });
  }
  await setSession({ role: rol === "empresa" ? "company" : "student", id });
  return NextResponse.redirect(new URL(ir.startsWith("/") ? ir : "/", req.url));
}
