import type { DataSource, Role, Session } from "./types";

export const DEMO_PASSWORD = "pragati";

export const DEMO_USERS: Array<Session & { password: string }> = [
  {
    accessCode: "IPMD-001",
    password: DEMO_PASSWORD,
    role: "ipmd",
    name: "A. Rao",
    org: "MoSPI / Infrastructure Projects Monitoring Division",
  },
  {
    accessCode: "MORTH-014",
    password: DEMO_PASSWORD,
    role: "ministry",
    name: "K. Sharma",
    org: "Ministry of Road Transport & Highways",
    ministry: "Ministry of Road Transport & Highways",
  },
  {
    accessCode: "NHAI-PIU-VAD",
    password: DEMO_PASSWORD,
    role: "agency",
    name: "Site nodal, PIU Vadodara",
    org: "NHAI PIU Vadodara",
    agency: "NHAI PIU Vadodara",
  },
  {
    accessCode: "PMO-PRAGATI",
    password: DEMO_PASSWORD,
    role: "board",
    name: "PRAGATI secretariat",
    org: "PMO / PRAGATI",
  },
  {
    accessCode: "NITI-NIE",
    password: DEMO_PASSWORD,
    role: "niti",
    name: "NIE-I desk",
    org: "NITI Aayog",
  },
  {
    accessCode: "CABSEC-01",
    password: DEMO_PASSWORD,
    role: "cabinet",
    name: "Cabinet Secretariat desk",
    org: "Cabinet Secretariat",
  },
];

export function authenticate(accessCode: string, password: string): Session | null {
  const row = DEMO_USERS.find(
    (u) => u.accessCode.toLowerCase() === accessCode.trim().toLowerCase() && u.password === password,
  );
  if (!row) return null;
  return {
    accessCode: row.accessCode,
    name: row.name,
    org: row.org,
    role: row.role,
    ministry: row.ministry,
    agency: row.agency,
  };
}

export function canWriteProject(session: Session | null, projectAgency: string, projectMinistry: string) {
  if (!session) return false;
  if (session.role === "ipmd") return true;
  if (session.role === "ministry") return session.ministry === projectMinistry;
  if (session.role === "agency") return session.agency === projectAgency;
  return false;
}

export function canRunAutomation(role: Role) {
  return role === "ipmd" || role === "niti" || role === "cabinet" || role === "board";
}

export function canReview(role: Role) {
  return role === "board" || role === "ipmd" || role === "cabinet" || role === "niti";
}

export function canIngest(role: Role) {
  return role === "agency" || role === "ministry" || role === "ipmd";
}

export const SOURCE_LABEL: Record<DataSource, string> = {
  DPIIT_IIG_PMG: "DPIIT IIG–PMG (nodal entry)",
  LINE_MINISTRY_API: "Line ministry API",
  AGENCY_OCMS: "Implementing agency OCMS push",
};
