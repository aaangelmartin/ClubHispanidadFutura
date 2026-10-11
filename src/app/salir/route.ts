// Dueño: perfil 1. Cierra la sesión (borra la cookie) y vuelve a la portada, o a `?ir=/ruta` (lo usa /demo).
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const ir = req.nextUrl.searchParams.get("ir") ?? "/";
  // Solo rutas internas: "//otro.sitio" sería una redirección abierta.
  const destino = ir.startsWith("/") && !ir.startsWith("//") ? ir : "/";
  const res = NextResponse.redirect(new URL(destino, req.url));
  res.cookies.set("chf_session", "", { path: "/", maxAge: 0 });
  // Marca que ha salido: el atajo de demo de src/middleware.ts ya no le vuelve a meter solo.
  res.cookies.set("chf_salir", "1", { path: "/", httpOnly: true, sameSite: "lax" });
  return res;
}
