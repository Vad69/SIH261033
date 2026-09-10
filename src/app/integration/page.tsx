"use client";

import { useState } from "react";
import { AppShell } from "../../components/AppShell";
import { canIngest, SOURCE_LABEL } from "../../lib/auth";
import { dateLabel } from "../../lib/format";
import { CAPITAL_THRESHOLD_CR, STANDARD_METRICS } from "../../lib/metrics";
import { usePlatform } from "../../lib/store";

export default function IntegrationPage() {
  const { state, monitorProjects, ingestUpdate } = usePlatform();
  const [message, setMessage] = useState("");
  const role = state.session?.role;
  const writable = monitorProjects.filter((p) =>
    role === "ipmd"
      ? true
      : role === "ministry"
        ? p.ministry === state.session?.ministry
        : p.agency === state.session?.agency,
  );

  return (
    <AppShell>
      <p className="stamp text-[var(--saffron)]">Data collection · systems integration</p>
      <h1 className="font-serif text-4xl">One Data, One Entry</h1>
      <p className="mt-2 max-w-3xl text-[var(--ink-soft)]">
        Nodal capture is DPIIT IIG–PMG. Line ministries and implementing agencies push live updates
        through APIs. The same project key is reused — a second manual form is refused. Central
        tracking applies at ₹{CAPITAL_THRESHOLD_CR} crore and above.
      </p>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <article className="card rounded-sm p-4">
          <h2 className="font-serif text-xl">Nodal entry</h2>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">DPIIT IIG–PMG is the single write for identity, cost, and schedule baseline.</p>
        </article>
        <article className="card rounded-sm p-4">
          <h2 className="font-serif text-xl">API pipelines</h2>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            <code className="text-xs">POST /api/ingest</code> and <code className="text-xs">GET /api/projects?minCost=150</code>
          </p>
        </article>
        <article className="card rounded-sm p-4">
          <h2 className="font-serif text-xl">Standard units</h2>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            {Object.values(STANDARD_METRICS)
              .map((m) => m.label)
              .join(" · ")}
          </p>
        </article>
      </div>

      <h2 className="mt-10 font-serif text-2xl">Push a live update</h2>
      {!role || !canIngest(role) ? (
        <p className="mt-2 text-sm text-[var(--ink-soft)]">Your role is read-only on the ingest pipe.</p>
      ) : (
        <ul className="mt-3 grid gap-2">
          {writable.map((p) => (
            <li key={p.id} className="card flex flex-wrap items-center justify-between gap-3 rounded-sm p-3">
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-[var(--ink-soft)]">
                  {SOURCE_LABEL[p.source]} · last ingest {dateLabel(p.lastIngestAt)}
                </p>
              </div>
              <button
                type="button"
                className="rounded-sm bg-[var(--navy)] px-3 py-1.5 text-sm text-[#f4efe4]"
                onClick={() => setMessage(ingestUpdate(p.id).message)}
              >
                Push API update
              </button>
            </li>
          ))}
        </ul>
      )}
      {message ? <p className="mt-3 text-sm">{message}</p> : null}

      <h2 className="mt-10 font-serif text-2xl">Ingest log</h2>
      {state.ingestLog.length === 0 ? (
        <p className="mt-2 text-sm text-[var(--ink-soft)]">No pushes this session.</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm">
          {state.ingestLog.map((e) => (
            <li key={e.id} className="border-t border-[var(--line)] pt-2">
              {dateLabel(e.at)} · {e.actor} · {e.summary} {e.duplicateBlocked ? "· duplicate blocked" : ""}
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
