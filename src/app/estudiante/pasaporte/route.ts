// /estudiante/pasaporte → el pasaporte del estudiante con sesión (o el de ejemplo en modo demo).
import { NextResponse, type NextRequest } from "next/server";
import { DEMO_MODE } from "@/lib/demo";
import { getSession, setSession } from "@/lib/session";

const ESTUDIANTE_DEMO = "22222222-2222-4222-8222-000000000002";

export async function GET(req: NextRequest) {
  const s = await getSession();
  if (s?.role === "student") return NextResponse.redirect(new URL(`/pasaporte/${s.id}`, req.url));
  if (!DEMO_MODE) return NextResponse.redirect(new URL("/registro?rol=estudiante", req.url));
  await setSession({ role: "student", id: ESTUDIANTE_DEMO });
  return NextResponse.redirect(new URL(`/pasaporte/${ESTUDIANTE_DEMO}`, req.url));
}
