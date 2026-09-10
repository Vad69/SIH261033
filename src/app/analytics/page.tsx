"use client";

import Link from "next/link";
import { AppShell } from "../../components/AppShell";
import { CAUSE_LABEL } from "../../lib/format";
import { isPreConstruction } from "../../lib/lifecycle";
import { NIE_SECTORS } from "../../lib/metrics";
import { modelOverrun } from "../../lib/overrun";
import { usePlatform } from "../../lib/store";

export default function AnalyticsPage() {
  const { monitorProjects } = usePlatform();
  const tagged = monitorProjects.filter((p) => p.causes.length > 0 || p.delayDays > 0);
  const pre = monitorProjects.filter((p) => isPreConstruction(p.stage));

  return (
    <AppShell>
      <p className="stamp text-[var(--saffron)]">Time &amp; cost analytics</p>
      <h1 className="font-serif text-4xl">Overrun model &amp; bottlenecks</h1>
      <p className="mt-2 max-w-3xl text-[var(--ink-soft)]">
        Isolates why a project left its original cost and timeline: bottleneck tags (land, forest,
        environment, funding), idle-cost estimate, and a dedicated pre-construction log for tendering
        and clearances.
      </p>

      <h2 className="mt-8 font-serif text-2xl">Pre-construction register</h2>
      <ul className="mt-3 grid gap-2">
        {pre.map((p) => (
          <li key={p.id} className="card rounded-sm p-3 text-sm">
            <Link href={`/projects/${p.id}`} className="font-semibold hover:underline">
              {p.name}
            </Link>
            <p className="text-[var(--ink-soft)]">
              Gate: {p.stage.replaceAll("_", " ")} · milestones {p.milestones.map((m) => `${m.name} (${m.status})`).join(" · ")}
            </p>
          </li>
        ))}
        {pre.length === 0 ? <li className="text-sm text-[var(--ink-soft)]">No projects currently in pre-construction gates.</li> : null}
      </ul>

      <h2 className="mt-10 font-serif text-2xl">Deviation ledger</h2>
      <div className="mt-3 grid gap-3">
        {tagged.map((p) => {
          const model = modelOverrun(p);
          return (
            <article key={p.id} className="card rounded-sm p-4">
              <Link href={`/projects/${p.id}`} className="font-serif text-xl hover:underline">
                {p.name}
              </Link>
              <p className="mt-2 text-sm">{model.narrative}</p>
              <p className="mt-1 text-xs text-[var(--ink-soft)]">
                Pre-construction share of delay risk ~{model.preConstructionSharePct}%
              </p>
              {model.attribution.length ? (
                <ul className="mt-3 flex flex-wrap gap-2 text-xs">
                  {model.attribution.map((a) => (
                    <li key={a.cause} className="rounded-sm bg-[#fff1d6] px-2 py-1">
                      {CAUSE_LABEL[a.cause]} · {Math.round(a.sharePct)}% · ₹{a.costCr} Cr
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        })}
      </div>

      <h2 className="mt-10 font-serif text-2xl">Sector KPIs vs NIE-I</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {Object.entries(NIE_SECTORS).map(([sector, v]) => (
          <li key={sector} className="flex justify-between border-t border-[var(--line)] py-2 text-sm">
            <span>
              {sector}
              <span className="block text-xs text-[var(--ink-soft)]">{v.kpi}</span>
            </span>
            <span>NIE-I {v.nie}</span>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
