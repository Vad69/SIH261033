"use client";

import Link from "next/link";
import { AppShell } from "../../components/AppShell";
import { LifecycleRail } from "../../components/LifecycleRail";
import { StatCard } from "../../components/StatCard";
import { StatusBadge } from "../../components/StatusBadge";
import { portfolioStats } from "../../lib/automation";
import { inrCr, pct, ROLE_LABEL } from "../../lib/format";
import { CAPITAL_THRESHOLD_CR, NIE_SECTORS } from "../../lib/metrics";
import { usePlatform } from "../../lib/store";

export default function DashboardPage() {
  const { state, monitorProjects } = usePlatform();
  const stats = portfolioStats(monitorProjects);
  const critical = monitorProjects.filter((p) => p.health === "critical" || p.spi < 0.85);
  const role = state.session?.role;
  const executive = role === "niti" || role === "cabinet" || role === "board";

  return (
    <AppShell>
      <p className="stamp text-[var(--saffron)]">
        {state.session ? ROLE_LABEL[state.session.role] : "Portfolio"} · ₹{CAPITAL_THRESHOLD_CR} Cr+ monitor
      </p>
      <h1 className="mt-1 font-serif text-4xl">
        {executive ? "Executive control centre" : "Integrated project dashboard"}
      </h1>
      <p className="mt-2 max-w-3xl text-[var(--ink-soft)]">
        {role === "agency"
          ? "Agency ledger including works below the central threshold where you are the nodal writer."
          : `Central-sector filter: original or revised cost ≥ ₹${CAPITAL_THRESHOLD_CR} crore. Metrics in ₹ crore, calendar days, % physical, SPI and CPI.`}
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Projects on this desk" value={String(stats.count)} hint={`${stats.delayed} with time overrun`} />
        <StatCard label="Original cost" value={inrCr(stats.original)} hint={`Revised ${inrCr(stats.revised)}`} />
        <StatCard label="Expenditure" value={inrCr(stats.spent)} hint={`${pct(stats.overrunPct, 1)} cost overrun`} />
        <StatCard label="Critical" value={String(stats.critical)} hint={`Mean SPI ${stats.avgSpi.toFixed(2)}`} />
      </div>

      {executive ? (
        <section className="mt-8">
          <h2 className="font-serif text-2xl">NIE-I sector snapshot</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(NIE_SECTORS).map(([sector, v]) => (
              <li key={sector} className="card rounded-sm p-3">
                <p className="text-sm font-semibold">{sector}</p>
                <p className="font-serif text-2xl">{v.nie}</p>
                <p className="text-xs text-[var(--ink-soft)]">{v.kpi}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <h2 className="mt-10 font-serif text-2xl">Escalate first</h2>
      <div className="mt-3 grid gap-3">
        {critical.map((p) => (
          <Link key={p.id} href={`/projects/${p.id}`} className="card block rounded-sm p-4 hover:bg-[#fff8ee]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="stamp text-[var(--ink-soft)]">{p.code}</p>
                <h3 className="font-serif text-2xl">{p.name}</h3>
                <p className="text-sm text-[var(--ink-soft)]">
                  {p.ministry} · {p.state} · SPI {p.spi.toFixed(2)} · {p.delayDays}d
                </p>
              </div>
              <StatusBadge health={p.health} />
            </div>
            <div className="mt-3">
              <LifecycleRail current={p.stage} compact />
            </div>
          </Link>
        ))}
        {critical.length === 0 ? <p className="text-sm text-[var(--ink-soft)]">No critical projects on this desk.</p> : null}
      </div>
    </AppShell>
  );
}
