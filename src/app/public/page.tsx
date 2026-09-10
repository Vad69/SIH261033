"use client";

import Link from "next/link";
import { AppShell } from "../../components/AppShell";
import { StatCard } from "../../components/StatCard";
import { portfolioStats } from "../../lib/automation";
import { inrCr, pct } from "../../lib/format";
import { CAPITAL_THRESHOLD_CR, NIE_SECTORS } from "../../lib/metrics";
import { SEED_PROJECTS } from "../../lib/seed";

export default function PublicDashboardPage() {
  const monitor = SEED_PROJECTS.filter((p) => p.originalCostCr >= CAPITAL_THRESHOLD_CR);
  const stats = portfolioStats(monitor);
  const sectors = Object.entries(NIE_SECTORS);

  return (
    <AppShell auth="public">
      <p className="stamp text-[var(--saffron)]">Citizen view · no write access</p>
      <h1 className="font-serif text-4xl">Public infrastructure monitor</h1>
      <p className="mt-2 max-w-3xl text-[var(--ink-soft)]">
        Aggregated picture of central-sector works costing ₹{CAPITAL_THRESHOLD_CR} crore and above.
        Contractor files, RA bills, and PRAGATI asks stay behind the login firewall.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Projects on monitor" value={String(stats.count)} />
        <StatCard label="Revised capital" value={inrCr(stats.revised)} />
        <StatCard label="Expenditure" value={inrCr(stats.spent)} />
        <StatCard label="Cost overrun" value={pct(stats.overrunPct, 1)} />
      </div>
      <h2 className="mt-10 font-serif text-2xl">Sector KPIs (NIE-I style)</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {sectors.map(([sector, v]) => (
          <li key={sector} className="card rounded-sm p-3">
            <p className="font-semibold">{sector}</p>
            <p className="text-sm text-[var(--ink-soft)]">
              NIE-I {v.nie} · {v.kpi}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm">
        Authorised personnel: <Link href="/login" className="underline">sign in with an access code</Link>.
      </p>
    </AppShell>
  );
}
