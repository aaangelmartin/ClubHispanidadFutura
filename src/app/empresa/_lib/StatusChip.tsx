import type { Challenge } from "@/lib/types";
import { EstadoReto } from "@/components/embarca";
import { estadoReto } from "./embarca";

// Dueño: perfil 4. Estado de un reto con los colores del panel de salidas de Embarca.
export default function StatusChip({ status, deadline = null }: { status: Challenge["status"]; deadline?: string | null }) {
  return <EstadoReto estado={estadoReto({ status, deadline })} />;
}
