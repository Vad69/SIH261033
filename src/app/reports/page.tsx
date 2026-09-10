"use client";

import { AppShell } from "../../components/AppShell";
import { portfolioStats } from "../../lib/automation";
import { inrCr, pct } from "../../lib/format";
import { STAGE_META } from "../../lib/lifecycle";
import { usePlatform } from "../../lib/store";
import { LIFECYCLE_STAGES } from "../../lib/types";

export default function ReportsPage() {
  const { monitorProjects } = usePlatform();
  const stats = portfolioStats(monitorProjects);
  const byStage = LIFECYCLE_STAGES.map((stage) => ({
    stage,
    n: monitorProjects.filter((p) => p.stage === stage).length,
  }));
  const bySector = Object.entries(
    monitorProjects.reduce<Record<string, number>>((acc, p) => {
      acc[p.sector] = (acc[p.sector] ?? 0) + 1;
      return acc;
    }, {}),
  );

  return (
    <AppShell>
      <p className="stamp text-[var(--saffron)]">MoSPI IPMD · monthly flash (demo)</p>
      <h1 className="font-serif text-4xl">Flash report</h1>
      <p className="mt-2 max-w-3xl text-[var(--ink-soft)]">
        Web-generated monthly flash for stakeholders. Figures use standardised units (₹ crore, calendar
        days, % physical, SPI/CPI) so PMO PRAGATI can pull the same pack via <code>GET /api/pragati</code>.
        Demo corpus, not official statistics.
      </p>
      <div className="card mt-6 rounded-sm p-5">
        <h2 className="font-serif text-2xl">Headline</h2>
        <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <li>Projects on monitor: {stats.count}</li>
          <li>Original cost: {inrCr(stats.original)}</li>
          <li>Latest revised cost: {inrCr(stats.revised)}</li>
          <li>Cumulative expenditure: {inrCr(stats.spent)}</li>
          <li>Cost overrun vs original: {pct(stats.overrunPct, 1)}</li>
          <li>Projects with time overrun: {stats.delayed}</li>
        </ul>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="card rounded-sm p-4">
          <h2 className="font-serif text-xl">By lifecycle gate</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {byStage.map((s) => (
              <li key={s.stage} className="flex justify-between border-t border-[var(--line)] pt-2">
                <span>{STAGE_META[s.stage].label}</span>
                <span>{s.n}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="card rounded-sm p-4">
          <h2 className="font-serif text-xl">By sector</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {bySector.map(([k, n]) => (
              <li key={k} className="flex justify-between border-t border-[var(--line)] pt-2">
                <span>{k}</span>
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
      <div className="card mt-6 overflow-x-auto rounded-sm p-4">
        <h2 className="font-serif text-xl">Project annex</h2>
        <table className="mt-3 w-full min-w-[700px] text-left text-sm">
          <thead className="stamp text-[var(--ink-soft)]">
            <tr>
              <th className="py-2">Project</th>
              <th>Ministry</th>
              <th className="text-right">Original</th>
              <th className="text-right">Revised</th>
              <th className="text-right">Spent</th>
              <th className="text-right">Delay</th>
            </tr>
          </thead>
          <tbody>
            {monitorProjects.map((p) => (
              <tr key={p.id} className="border-t border-[var(--line)]">
                <td className="py-2">{p.name}</td>
                <td>{p.ministry}</td>
                <td className="text-right">{inrCr(p.originalCostCr)}</td>
                <td className="text-right">{inrCr(p.revisedCostCr)}</td>
                <td className="text-right">{inrCr(p.expenditureCr)}</td>
                <td className="text-right">{p.delayDays}d</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
