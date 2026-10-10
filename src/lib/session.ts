import "server-only";
import { cookies } from "next/headers";

// Sin login: al registrarse se guarda en una cookie quién eres. Suficiente para la demo.
export type Session = { role: "student" | "company"; id: string };

const COOKIE = "chf_session";

export async function getSession(): Promise<Session | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

// Solo desde Server Actions o Route Handlers.
export async function setSession(session: Session) {
  (await cookies()).set(COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}
