// Accesos directos de la demo: /empresa/* entra como la empresa de ejemplo si no hay sesión de empresa.
// Solo con DEMO_MODE=true; sin él no hace nada (la app pide registro como siempre).
import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "chf_session";
const EMPRESA_DEMO = { role: "company", id: "11111111-1111-4111-8111-000000000001" }; // Ibérica Retail (seed)

export function middleware(req: NextRequest) {
  if (process.env.DEMO_MODE !== "true") return NextResponse.next();

  let rol: string | undefined;
  try {
    rol = JSON.parse(req.cookies.get(COOKIE)?.value ?? "null")?.role;
  } catch {
    rol = undefined;
  }
  if (rol === "company") return NextResponse.next();

  const valor = JSON.stringify(EMPRESA_DEMO);
  req.cookies.set(COOKIE, valor); // para esta misma petición
  const res = NextResponse.next({ request: { headers: req.headers } });
  res.cookies.set(COOKIE, valor, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return res;
}

export const config = { matcher: ["/empresa", "/empresa/:path*"] };
