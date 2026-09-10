"use client";

import Link from "next/link";
import { AppShell } from "../../components/AppShell";
import { AutomationLoop } from "../../components/AutomationLoop";
import { canRunAutomation } from "../../lib/auth";
import { usePlatform } from "../../lib/store";

export default function AutomationPage() {
  const { monitorProjects, runCycle, state } = usePlatform();
  const queue = monitorProjects.filter((p) => p.health !== "on-track" && p.health !== "completed");
  const canRun = state.session ? canRunAutomation(state.session.role) : false;

  return (
    <AppShell>
      <p className="stamp text-[var(--saffron)]">Smart automation</p>
      <h1 className="font-serif text-4xl">Detect across the portfolio</h1>
      <p className="mt-2 max-w-3xl text-[var(--ink-soft)]">
        The engine sits on the One-Entry feed: Detect (SPI/CPI, stalled progress, stale API, pre-construction
        slips), Explain (bottleneck tags), Simulate (idle vs recovery cost), Decide, Record, Review into
        the PRAGATI pack.
      </p>
      <div className="mt-6">
        <AutomationLoop highlight="DETECT" />
      </div>
      <h2 className="mt-10 font-serif text-2xl">Watch queue</h2>
      <ul className="mt-3 grid gap-3">
        {queue.map((p) => (
          <li key={p.id} className="card flex flex-wrap items-center justify-between gap-3 rounded-sm p-4">
            <div>
              <Link href={`/projects/${p.id}`} className="font-serif text-xl hover:underline">
                {p.name}
              </Link>
              <p className="text-sm text-[var(--ink-soft)]">
                SPI {p.spi.toFixed(2)} · {p.findings[0]?.title}
              </p>
            </div>
            {canRun ? (
            <button
              type="button"
              onClick={() => runCycle(p.id)}
              className="rounded-sm bg-[var(--navy)] px-3 py-2 text-sm text-[#f4efe4]"
            >
              Run cycle
            </button>
            ) : null}
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
