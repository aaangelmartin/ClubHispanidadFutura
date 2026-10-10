// Presentación de los retos como tarjetas de embarque. Solo deriva datos de lo que ya existe
// (país de la empresa, plazo, estado): no guarda ni inventa nada.
import { rutaReto, type EstadoEntregaValor, type EstadoRetoValor } from "@/components/embarca";

const CODIGO: Record<string, string> = { España: "MAD", Colombia: "BOG", México: "MEX" };

/** Código de ruta del país de la empresa (España→MAD, Colombia→BOG, México→MEX). */
export const codigoPais = (pais: string) =>
  CODIGO[pais] ??
  pais
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 3);

/** Ruta real del reto: sale de la ciudad de la empresa y llega al país del estudiante (o «En remoto»). */
export const ruta = (pais: string, paisEstudiante?: string | null) => rutaReto(pais, paisEstudiante);

/** Puerta estable a partir del id del reto (decorativa). */
export const puerta = (id: string) => {
  const h = [...id].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return `${"ABCD"[h % 4]}${String((h % 29) + 2).padStart(2, "0")}`;
};

const dias = (deadline: string | null) =>
  deadline ? Math.ceil((Date.parse(deadline) - Date.now()) / 86400000) : null;

export function estadoReto(r: { status: string; deadline: string | null }): EstadoRetoValor {
  if (r.status === "borrador") return "borrador";
  if (r.status === "cerrado") return "cerrado";
  if (r.status === "en_valoracion") return "en_valoracion";
  const d = dias(r.deadline);
  if (d !== null && d <= 0) return "cerrado";
  if (d !== null && d <= 3) return "cierra_pronto";
  return "abierto";
}

export const cierre = (deadline: string | null) =>
  deadline
    ? new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", timeZone: "Europe/Madrid" }).format(new Date(deadline))
    : "Sin fecha";

export function estadoEntrega(
  e: { submitted_at: string | null; evaluada: boolean },
  abierto: boolean,
): EstadoEntregaValor {
  if (e.evaluada) return "valorada";
  if (e.submitted_at) return abierto ? "entregada" : "por_valorar";
  return abierto ? "inscrito" : "no_entregada";
}
