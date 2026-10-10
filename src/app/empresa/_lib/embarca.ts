// Dueño: perfil 4. Traduce los datos de la empresa al kit visual de Embarca (tarjeta de embarque, estados).
// Solo presentación: no consulta ni guarda nada.
import type { Challenge } from "@/lib/types";
import type { EstadoEntregaValor, EstadoRetoValor, Tarjeta } from "@/components/embarca";
import { daysLeft, formatDate } from "./queries";

const IATA: Record<string, string> = { España: "MAD", Colombia: "BOG", México: "MEX" };
export const codigoCiudad = (pais: string) => IATA[pais] ?? (pais.slice(0, 3).toUpperCase() || "MAD");

/** Estado del reto con «Cierra pronto» si quedan 3 días o menos. */
export function estadoReto(c: Pick<Challenge, "status" | "deadline">): EstadoRetoValor {
  if (c.status === "abierto") {
    const d = daysLeft(c.deadline);
    if (d !== null && d <= 3) return "cierra_pronto";
  }
  return c.status;
}

/** Estado de una entrega según si se entregó, si está valorada y el momento del reto. */
export function estadoEntrega(
  s: { submitted_at: string | null; evaluation: unknown },
  status: Challenge["status"],
): EstadoEntregaValor {
  if (s.evaluation) return "valorada";
  if (!s.submitted_at) return status === "abierto" || status === "borrador" ? "inscrito" : "no_entregada";
  return status === "en_valoracion" || status === "cerrado" ? "por_valorar" : "entregada";
}

/** Puerta estable a partir del id del reto (decorativa). */
export function puerta(id: string) {
  const n = [...id].reduce((a, ch) => a + ch.charCodeAt(0), 0);
  return `${"ABC"[n % 3]}${(n % 20) + 1}`;
}

export function tarjetaDeReto(c: Challenge, empresa: string, pais: string): Tarjeta {
  const origen = codigoCiudad(pais);
  const destino = origen === "BOG" ? "MAD" : "BOG";
  const datos = [{ etiqueta: "Duración", valor: `${c.duration_days} días` }];
  if (c.profile) datos.push({ etiqueta: "Perfil", valor: c.profile.length > 28 ? `${c.profile.slice(0, 26)}…` : c.profile });
  if (c.deadline) datos.push({ etiqueta: "Cierra", valor: formatDate(c.deadline) });
  if (c.suggested_prize) datos.push({ etiqueta: "Premio", valor: c.suggested_prize });
  return { empresa, origen, destino, titulo: c.title, datos, puerta: puerta(c.id), estado: estadoReto(c) };
}
