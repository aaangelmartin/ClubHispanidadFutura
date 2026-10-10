// Accesos directos de la demo: /empresa/* entra como la empresa de ejemplo y /estudiante como el estudiante
// de ejemplo, si no hay ya una sesión de ese rol.
// Solo con DEMO_MODE=true; sin él no hace nada (la app pide registro como siempre).
import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "chf_session";
const EMPRESA_DEMO = { role: "company", id: "11111111-1111-4111-8111-000000000001" }; // Ibérica Retail (seed)
const ESTUDIANTE_DEMO = { role: "student", id: "22222222-2222-4222-8222-000000000002" }; // Andrés Rojas (seed)

export function middleware(req: NextRequest) {
  if (process.env.DEMO_MODE !== "true") return NextResponse.next();

  let rol: string | undefined;
  try {
    rol = JSON.parse(req.cookies.get(COOKIE)?.value ?? "null")?.role;
  } catch {
    rol = undefined;
  }
  const demo = req.nextUrl.pathname.startsWith("/estudiante") ? ESTUDIANTE_DEMO : EMPRESA_DEMO;
  if (rol === demo.role) return NextResponse.next();

  const valor = JSON.stringify(demo);
  req.cookies.set(COOKIE, valor); // para esta misma petición
  const res = NextResponse.next({ request: { headers: req.headers } });
  res.cookies.set(COOKIE, valor, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return res;
}

export const config = { matcher: ["/empresa", "/empresa/:path*", "/estudiante"] };
