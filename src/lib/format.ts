import type { CauseCode, Health, Role } from "./types";

export function inrCr(n: number, digits = 0) {
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: digits })} Cr`;
}

export function pct(n: number, digits = 0) {
  return `${n.toFixed(digits)}%`;
}

export function days(n: number) {
  if (n <= 0) return "On schedule";
  return `${n} days late`;
}

export function dateLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const HEALTH_LABEL: Record<Health, string> = {
  "on-track": "On track",
  watch: "Watch",
  critical: "Critical",
  completed: "Completed",
};

export const ROLE_LABEL: Record<Role, string> = {
  ipmd: "MoSPI / IPMD",
  ministry: "Line ministry",
  agency: "Implementing agency",
  board: "PRAGATI board",
  niti: "NITI Aayog",
  cabinet: "Cabinet Secretariat",
};

export const CAUSE_LABEL: Record<CauseCode, string> = {
  LAND_ACQUISITION: "Land acquisition",
  FOREST_CLEARANCE: "Forest clearance",
  ENVIRONMENT_CLEARANCE: "Environment clearance",
  UTILITY_SHIFTING: "Utility shifting",
  FUNDING_CONSTRAINT: "Funding constraint",
  CONTRACTOR_CAPACITY: "Contractor capacity",
  DESIGN_CHANGE: "Design / scope change",
  LAW_AND_ORDER: "Law and order",
  GEOTECH_SURPRISE: "Geotech surprise",
  MONSOON_WEATHER: "Monsoon / weather",
  STATUTORY_APPROVAL: "Statutory approval",
  MATERIAL_SHORTAGE: "Material shortage",
};
