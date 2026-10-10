import type { ChallengeStatus } from "@/lib/types";
import { STATUS_LABEL } from "./queries";

// Dueño: perfil 4.
const STYLE: Record<ChallengeStatus, string> = {
  borrador: "text-ink-3",
  abierto: "border-ink text-ink",
  en_valoracion: "border-gold bg-gold-soft text-gold",
  cerrado: "border-ok text-ok",
};

export default function StatusChip({ status }: { status: ChallengeStatus }) {
  return <span className={`chip ${STYLE[status]}`}>{STATUS_LABEL[status]}</span>;
}
