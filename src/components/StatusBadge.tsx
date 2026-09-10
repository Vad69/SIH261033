import { HEALTH_LABEL } from "../lib/format";
import type { Health } from "../lib/types";

export function StatusBadge({ health }: { health: Health }) {
  return (
    <span className={`stamp rounded-sm px-2 py-0.5 health-${health}`}>{HEALTH_LABEL[health]}</span>
  );
}
