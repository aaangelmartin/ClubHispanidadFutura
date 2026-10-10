// Entrada directa del joven talento: /estudiante → sus retos.
// Con DEMO_MODE entra como el estudiante de ejemplo si no hay sesión de estudiante; sin él, pide registro.
import { NextResponse, type NextRequest } from "next/server";
import { DEMO_MODE } from "@/lib/demo";
import { getSession, setSession } from "@/lib/session";

const ESTUDIANTE_DEMO = "22222222-2222-4222-8222-000000000002"; // Andrés Rojas, U. Nacional (seed)

export async function GET(req: NextRequest) {
  const s = await getSession();
  if (s?.role !== "student") {
    if (!DEMO_MODE) return NextResponse.redirect(new URL("/registro?rol=estudiante", req.url));
    await setSession({ role: "student", id: ESTUDIANTE_DEMO });
  }
  return NextResponse.redirect(new URL("/retos", req.url));
}
