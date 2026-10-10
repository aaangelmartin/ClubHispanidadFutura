// Dueño: perfil 1. Cierra la sesión (borra la cookie) y vuelve a la portada.
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set("chf_session", "", { path: "/", maxAge: 0 });
  return res;
}
