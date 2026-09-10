"use client";

import Link from "next/link";
import { AppShell } from "../../components/AppShell";
import { LifecycleRail } from "../../components/LifecycleRail";
import { StatCard } from "../../components/StatCard";
import { StatusBadge } from "../../components/StatusBadge";
import { portfolioStats } from "../../lib/automation";
import { inrCr, pct } from "../../lib/format";
import { usePlatform } from "../../lib/store";

export default function DashboardPage() {
  const { state } = usePlatform();
  const stats = portfolioStats(state.projects);
  const critical = state.projects.filter((p) => p.health === "critical" || p.spi < 0.85);

  return (
    <AppShell>
      <p className="stamp text-[var(--saffron)]">Portfolio monitor · {state.role.toUpperCase()}</p>
      <h1 className="mt-1 font-serif text-4xl">Integrated project dashboard</h1>
      <p className="mt-2 max-w-3xl text-[var(--ink-soft)]">
        OCMS-style view of central-sector works: original vs revised cost, expenditure, SPI, and the
        lifecycle gate each project is actually in — not just “under implementation”.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Projects on monitor" value={String(stats.count)} hint={`${stats.delayed} with time overrun`} />
        <StatCard label="Original cost" value={inrCr(stats.original)} hint={`Revised ${inrCr(stats.revised)}`} />
        <StatCard label="Expenditure" value={inrCr(stats.spent)} hint={`${pct(stats.overrunPct, 1)} cost overrun`} />
        <StatCard label="Critical / watch" value={String(stats.critical)} hint={`Mean SPI ${stats.avgSpi.toFixed(2)}`} />
      </div>

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
      </div>
    </AppShell>
  );
}
