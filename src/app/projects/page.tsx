"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "../../components/AppShell";
import { StatusBadge } from "../../components/StatusBadge";
import { days, inrCr } from "../../lib/format";
import { STAGE_META } from "../../lib/lifecycle";
import { usePlatform } from "../../lib/store";
import { LIFECYCLE_STAGES, type LifecycleStage } from "../../lib/types";

export default function ProjectsPage() {
  const { state } = usePlatform();
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<LifecycleStage | "ALL">("ALL");

  const rows = useMemo(() => {
    return state.projects.filter((p) => {
      const text = `${p.name} ${p.ministry} ${p.sector} ${p.state} ${p.code}`.toLowerCase();
      const okQ = text.includes(q.toLowerCase());
      const okS = stage === "ALL" || p.stage === stage;
      return okQ && okS;
    });
  }, [state.projects, q, stage]);

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="stamp text-[var(--saffron)]">File of record</p>
          <h1 className="font-serif text-4xl">Projects</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search ministry, state, project…"
            className="rounded-sm border border-[var(--line)] bg-white px-3 py-2 text-sm"
          />
          <select
            className="rounded-sm border border-[var(--line)] bg-white px-3 py-2 text-sm"
            value={stage}
            onChange={(e) => setStage(e.target.value as LifecycleStage | "ALL")}
          >
            <option value="ALL">All stages</option>
            {LIFECYCLE_STAGES.map((s) => (
              <option key={s} value={s}>
                {STAGE_META[s].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="stamp text-[var(--ink-soft)]">
            <tr className="border-b border-[var(--line)]">
              <th className="py-2">Project</th>
              <th>Sector</th>
              <th>Stage</th>
              <th>Health</th>
              <th className="text-right">Revised</th>
              <th className="text-right">Spent</th>
              <th className="text-right">SPI</th>
              <th>Delay</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-[var(--line)]">
                <td className="py-3">
                  <Link href={`/projects/${p.id}`} className="font-semibold hover:underline">
                    {p.name}
                  </Link>
                  <p className="text-xs text-[var(--ink-soft)]">{p.code}</p>
                </td>
                <td>{p.sector}</td>
                <td>{STAGE_META[p.stage].label}</td>
                <td>
                  <StatusBadge health={p.health} />
                </td>
                <td className="text-right">{inrCr(p.revisedCostCr)}</td>
                <td className="text-right">{inrCr(p.expenditureCr)}</td>
                <td className="text-right">{p.spi.toFixed(2)}</td>
                <td>{days(p.delayDays)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
