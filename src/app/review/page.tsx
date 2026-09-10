"use client";

import Link from "next/link";
import { AppShell } from "../../components/AppShell";
import { CAUSE_LABEL, dateLabel, inrCr } from "../../lib/format";
import { usePlatform } from "../../lib/store";

export default function ReviewPage() {
  const { monitorProjects, advanceDecision } = usePlatform();
  const pack = monitorProjects
    .filter((p) => p.health === "critical" || p.decisions.some((d) => d.status !== "closed"))
    .sort((a, b) => b.delayDays - a.delayDays);

  return (
    <AppShell>
      <p className="stamp text-[var(--saffron)]">PRAGATI · Pro-Active Governance And Timely Implementation</p>
      <h1 className="font-serif text-4xl">Review board pack</h1>
      <p className="mt-2 max-w-3xl text-[var(--ink-soft)]">
        Three-tier sitting: PMO / MoSPI IPMD, line-ministry secretaries, and state chief secretaries.
        Each card is a single ask with a named owner — not a 40-slide status dump.
      </p>
      <ol className="mt-8 space-y-4">
        {pack.map((p, i) => {
          const decision = p.decisions[0];
          return (
            <li key={p.id} className="card rounded-sm p-5">
              <p className="stamp text-[var(--saffron)]">Agenda {String(i + 1).padStart(2, "0")}</p>
              <h2 className="font-serif text-2xl">
                <Link href={`/projects/${p.id}`} className="hover:underline">
                  {p.name}
                </Link>
              </h2>
              <p className="text-sm text-[var(--ink-soft)]">
                {p.ministry} · {p.state} · delay {p.delayDays}d · extra cost vs original{" "}
                {inrCr(p.revisedCostCr - p.originalCostCr)}
              </p>
              <p className="mt-3 text-sm">
                <strong>Bottleneck:</strong>{" "}
                {p.causes.length ? p.causes.map((c) => CAUSE_LABEL[c]).join(", ") : "None"}
              </p>
              <p className="mt-1 text-sm">
                <strong>Ask:</strong> {decision?.action ?? "Run Detect cycle to draft an ask."}
              </p>
              {decision ? (
                <p className="mt-1 text-sm text-[var(--ink-soft)]">
                  Owner: {decision.owner} · due {dateLabel(decision.due)} · {decision.status}
                </p>
              ) : null}
              {decision && decision.status === "accepted" ? (
                <button
                  type="button"
                  className="mt-3 rounded-sm border border-[var(--navy)] px-3 py-1.5 text-sm"
                  onClick={() => advanceDecision(p.id, decision.id, "closed")}
                >
                  Mark reviewed
                </button>
              ) : null}
            </li>
          );
        })}
      </ol>
    </AppShell>
  );
}
