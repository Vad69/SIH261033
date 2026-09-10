"use client";

import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { AppShell } from "../../../components/AppShell";
import { AutomationLoop } from "../../../components/AutomationLoop";
import { LifecycleRail } from "../../../components/LifecycleRail";
import { SCurve } from "../../../components/SCurve";
import { StatCard } from "../../../components/StatCard";
import { StatusBadge } from "../../../components/StatusBadge";
import { WbsTree } from "../../../components/WbsTree";
import { SOURCE_LABEL, canRunAutomation, canWriteProject, canReview } from "../../../lib/auth";
import { CAUSE_LABEL, dateLabel, inrCr, pct } from "../../../lib/format";
import { isPreConstruction, STAGE_META } from "../../../lib/lifecycle";
import { CAPITAL_THRESHOLD_CR, onCentralMonitor } from "../../../lib/metrics";
import { modelOverrun } from "../../../lib/overrun";
import { usePlatform } from "../../../lib/store";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { state, runCycle, recordDecision, advanceDecision } = usePlatform();
  const project = state.projects.find((p) => p.id === id);
  const session = state.session;
  const [owner, setOwner] = useState("");
  const [action, setAction] = useState("");
  const [due, setDue] = useState("");

  if (!project) {
    return (
      <AppShell>
        <p>Project not found.</p>
      </AppShell>
    );
  }

  const projectId = project.id;
  const writable = canWriteProject(session, project.agency, project.ministry);
  const runner = session ? canRunAutomation(session.role) : false;
  const reviewer = session ? canReview(session.role) : false;
  const model = modelOverrun(project);
  const onMonitor = onCentralMonitor(project.originalCostCr) || onCentralMonitor(project.revisedCostCr);

  function onRecord(e: FormEvent) {
    e.preventDefault();
    if (!owner || !action || !due || !writable) return;
    recordDecision(projectId, { owner, action, due, status: "accepted", notes: "Recorded from project file." });
    setOwner("");
    setAction("");
    setDue("");
  }

  return (
    <AppShell>
      <p className="stamp text-[var(--saffron)]">
        {project.code} · {SOURCE_LABEL[project.source]} · {onMonitor ? `₹${CAPITAL_THRESHOLD_CR} Cr+ monitor` : "below central threshold"}
      </p>
      <div className="mt-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">{project.name}</h1>
          <p className="mt-1 text-[var(--ink-soft)]">
            {project.ministry} · {project.agency} · {project.state}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge health={project.health} />
          {runner ? (
            <button
              type="button"
              onClick={() => runCycle(project.id)}
              className="rounded-sm bg-[var(--navy)] px-4 py-2 text-sm text-[#f4efe4]"
            >
              Run Detect → Decide cycle
            </button>
          ) : null}
        </div>
      </div>

      <p className="mt-4 max-w-3xl text-sm text-[var(--ink-soft)]">{project.description}</p>
      <p className="mt-2 text-sm">{model.narrative}</p>

      <div className="mt-6">
        <p className="stamp mb-2 text-[var(--ink-soft)]">Lifecycle gate — {STAGE_META[project.stage].label}</p>
        <LifecycleRail current={project.stage} />
        <p className="mt-2 text-sm text-[var(--ink-soft)]">{STAGE_META[project.stage].intent}</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Original cost" value={inrCr(project.originalCostCr)} hint={`Overrun ${pct(model.costOverrunPct, 1)}`} />
        <StatCard label="Revised cost" value={inrCr(project.revisedCostCr)} hint={`Spent ${inrCr(project.expenditureCr)}`} />
        <StatCard label="Physical progress" value={pct(project.physicalPct)} hint={`SPI ${project.spi.toFixed(2)} · CPI ${project.cpi.toFixed(2)}`} />
        <StatCard
          label="Anticipated completion"
          value={dateLabel(project.anticipatedCompletion)}
          hint={`${project.delayDays} days vs original`}
        />
      </div>

      <section className="card mt-8 rounded-sm p-4">
        <h2 className="font-serif text-2xl">Contract file</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="stamp text-[var(--ink-soft)]">Work order</dt>
            <dd>{project.workOrderNo}</dd>
          </div>
          <div>
            <dt className="stamp text-[var(--ink-soft)]">Contractor</dt>
            <dd>{project.contractor}</dd>
          </div>
          <div>
            <dt className="stamp text-[var(--ink-soft)]">Original start</dt>
            <dd>{dateLabel(project.originalStart)}</dd>
          </div>
          <div>
            <dt className="stamp text-[var(--ink-soft)]">Cause codes</dt>
            <dd>{project.causes.length ? project.causes.map((c) => CAUSE_LABEL[c]).join(" · ") : "None on file"}</dd>
          </div>
          <div>
            <dt className="stamp text-[var(--ink-soft)]">Tender ref</dt>
            <dd>{project.tenderRef}</dd>
          </div>
        </dl>
      </section>

      <section className="card mt-6 rounded-sm p-4">
        <h2 className="font-serif text-2xl">Scheduling / WBS</h2>
        <WbsTree nodes={project.wbs} />
      </section>

      <section className="card mt-6 rounded-sm p-4">
        <h2 className="font-serif text-2xl">
          {isPreConstruction(project.stage) ? "Pre-construction milestones" : "Execution + expenditure"}
        </h2>
        <SCurve series={project.expenditure} />
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {project.milestones.map((m) => (
            <li key={m.id} className="flex justify-between border-t border-[var(--line)] py-2 text-sm">
              <span>{m.name}</span>
              <span className="text-[var(--ink-soft)]">
                {dateLabel(m.due)} · {m.status}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-2xl">Smart automation on this project</h2>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          The loop is the same at every lifecycle gate. Run a cycle to refresh Detect, Explain, Simulate
          and a draft Decide.
        </p>
        <div className="mt-4">
          <AutomationLoop />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <article className="card rounded-sm p-4">
            <h3 className="font-serif text-xl">Detect + Explain</h3>
            <ul className="mt-3 space-y-3">
              {project.findings.map((f) => (
                <li key={f.id} className="border-t border-[var(--line)] pt-3">
                  <p className="stamp text-[var(--saffron)]">
                    {f.step} · {f.severity}
                  </p>
                  <p className="font-semibold">{f.title}</p>
                  <p className="text-sm text-[var(--ink-soft)]">{f.detail}</p>
                </li>
              ))}
            </ul>
          </article>
          <article className="card rounded-sm p-4">
            <h3 className="font-serif text-xl">Simulate</h3>
            {project.simulations.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--ink-soft)]">Run a cycle to generate recovery paths.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {project.simulations.map((s) => (
                  <li key={s.id} className="border-t border-[var(--line)] pt-3">
                    <p className="font-semibold">{s.assumption}</p>
                    <p className="text-sm text-[var(--ink-soft)]">
                      Extra delay {s.delayDays}d · extra cost {inrCr(s.extraCostCr)} · commissioning{" "}
                      {dateLabel(s.revisedCommissioning)} · SPI if acted {s.spiIfActed.toFixed(2)}
                    </p>
                    <p className="mt-1 text-sm">{s.recommendation}</p>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>
      </section>

      <section className="card mt-6 rounded-sm p-4">
        <h2 className="font-serif text-2xl">Decide · Record · Review</h2>
        {writable ? (
        <form onSubmit={onRecord} className="mt-4 grid gap-2 sm:grid-cols-3">
          <input
            className="rounded-sm border border-[var(--line)] px-3 py-2 text-sm"
            placeholder="Named owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />
          <input
            className="rounded-sm border border-[var(--line)] px-3 py-2 text-sm sm:col-span-2"
            placeholder="Decision / action"
            value={action}
            onChange={(e) => setAction(e.target.value)}
          />
          <input
            type="date"
            className="rounded-sm border border-[var(--line)] px-3 py-2 text-sm"
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />
          <button type="submit" className="rounded-sm bg-[var(--saffron)] px-4 py-2 text-sm text-white sm:col-span-2">
            Record decision
          </button>
        </form>
        ) : (
          <p className="mt-3 text-sm text-[var(--ink-soft)]">
            Read-only on this file. Only the nodal ministry/agency or IPMD may write (One Data, One Entry).
          </p>
        )}
        <ul className="mt-4 space-y-3">
          {project.decisions.map((d) => (
            <li key={d.id} className="border-t border-[var(--line)] pt-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">{d.action}</p>
                <span className="stamp">{d.status}</span>
              </div>
              <p className="text-[var(--ink-soft)]">
                {d.owner} · due {dateLabel(d.due)}
              </p>
              <div className="mt-2 flex gap-2">
                {d.status === "proposed" && writable ? (
                  <button
                    type="button"
                    className="underline"
                    onClick={() => advanceDecision(project.id, d.id, "accepted")}
                  >
                    Accept into record
                  </button>
                ) : null}
                {d.status === "accepted" && reviewer ? (
                  <button
                    type="button"
                    className="underline"
                    onClick={() => advanceDecision(project.id, d.id, "closed")}
                  >
                    Close after review
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
