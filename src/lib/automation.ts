import { isPreConstruction, LIFECYCLE_STAGES } from "./lifecycle";
import type { Finding, Project, Simulation, WbsNode } from "./types";

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function addMonths(iso: string, months: number) {
  const d = new Date(iso);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

export function detect(project: Project): Finding[] {
  const out: Finding[] = [];
  if (project.spi < 0.85) {
    out.push({
      id: uid("det"),
      step: "DETECT",
      severity: "critical",
      title: `Schedule performance critical (SPI ${project.spi.toFixed(2)})`,
      detail: `${project.name} is ${project.delayDays} days behind the original completion of ${project.originalCompletion}.`,
      metric: `SPI ${project.spi.toFixed(2)}`,
    });
  } else if (project.spi < 0.95) {
    out.push({
      id: uid("det"),
      step: "DETECT",
      severity: "watch",
      title: `Schedule performance on watch (SPI ${project.spi.toFixed(2)})`,
      detail: "Slippage is recoverable if the critical-path constraint is removed this quarter.",
      metric: `SPI ${project.spi.toFixed(2)}`,
    });
  }

  if (project.cpi < 0.9) {
    out.push({
      id: uid("det"),
      step: "DETECT",
      severity: "critical",
      title: `Cost performance critical (CPI ${project.cpi.toFixed(2)})`,
      detail: `Revised cost ${project.revisedCostCr} Cr vs original ${project.originalCostCr} Cr. Expenditure ${project.expenditureCr} Cr.`,
      metric: `CPI ${project.cpi.toFixed(2)}`,
    });
  }

  const overrun = project.revisedCostCr - project.originalCostCr;
  if (overrun > project.originalCostCr * 0.1) {
    out.push({
      id: uid("det"),
      step: "DETECT",
      severity: "watch",
      title: `Cost overrun ${Math.round((overrun / project.originalCostCr) * 100)}%`,
      detail: "Crosses the MoSPI watch threshold used in Flash Report commentary.",
    });
  }

  const last = project.expenditure.at(-1);
  const prev = project.expenditure.at(-2);
  if (last && prev && last.physicalPct - prev.physicalPct < 1 && project.stage === "EXECUTION_EXPENDITURE") {
    out.push({
      id: uid("det"),
      step: "DETECT",
      severity: "critical",
      title: "Physical progress stalled (<1 pp in last period)",
      detail: "Expenditure may still be booking while the site is idle — classic idle-cost pattern.",
    });
  }

  const lagging = flattenWbs(project).filter((n) => n.plannedPct - n.actualPct >= 15);
  if (lagging[0]) {
    out.push({
      id: uid("det"),
      step: "DETECT",
      severity: "watch",
      title: `WBS lag: ${lagging[0].code} ${lagging[0].name}`,
      detail: `Planned ${lagging[0].plannedPct}% vs actual ${lagging[0].actualPct}%. Owner: ${lagging[0].owner}.`,
    });
  }

  if (project.stage === "RESOURCE_MOBILISATION") {
    out.push({
      id: uid("det"),
      step: "DETECT",
      severity: "watch",
      title: "Mobilisation gate incomplete",
      detail: "Plant, camp, and critical materials are not yet at the supervision baseline.",
    });
  }

  if (isPreConstruction(project.stage)) {
    const slipped = project.milestones.filter((m) => m.status === "slipped");
    out.push({
      id: uid("det"),
      step: "DETECT",
      severity: slipped.length ? "watch" : "info",
      title: "Pre-construction milestone scan",
      detail: slipped.length
        ? `${slipped.length} pre-construction milestone(s) slipped (tender / clearance / possession).`
        : "Tender, acceptance, and statutory gates are on the pre-construction log.",
    });
  }

  if (project.lastIngestAt) {
    const ageDays = (Date.now() - new Date(project.lastIngestAt).getTime()) / 86400000;
    if (ageDays > 45) {
      out.push({
        id: uid("det"),
        step: "DETECT",
        severity: "watch",
        title: "API feed stale",
        detail: `Last One-Entry ingest ${Math.round(ageDays)} days ago. Line ministry / agency push is overdue.`,
      });
    }
  }

  if (out.length === 0) {
    out.push({
      id: uid("det"),
      step: "DETECT",
      severity: "info",
      title: "No material anomaly on current metrics",
      detail: "Continue monthly OCMS-style update. Automation will re-scan after the next expenditure posting.",
    });
  }
  return out;
}

export function explain(project: Project, detections: Finding[]): Finding[] {
  if (project.causes.length === 0) {
    return [
      {
        id: uid("exp"),
        step: "EXPLAIN",
        severity: "info",
        title: "No bottleneck cause code on file",
        detail: "Project is in an early lifecycle stage or is running to baseline.",
      },
    ];
  }
  return project.causes.map((cause) => {
    const linked = detections.find((d) => d.severity !== "info");
    return {
      id: uid("exp"),
      step: "EXPLAIN",
      severity: linked?.severity === "critical" ? "critical" : "watch",
      title: `Primary bottleneck: ${cause.replaceAll("_", " ").toLowerCase()}`,
      detail: `Mapped from Detect signals and agency-reported OCMS cause. Stage: ${project.stage.replaceAll("_", " ")}.`,
      cause,
    };
  });
}

export function simulate(project: Project): Simulation[] {
  const dailyBurn = project.revisedCostCr / Math.max(project.physicalPct, 8) / 3;
  const doNothingDays = Math.max(project.delayDays, 30);
  const doNothingCost = Math.round(doNothingDays * dailyBurn * 0.35);
  const actDays = Math.round(doNothingDays * 0.35);
  const actCost = Math.round(actDays * dailyBurn * 0.4);
  const stageShift = LIFECYCLE_STAGES.indexOf(project.stage);
  const baseFinish = project.anticipatedCompletion;
  return [
    {
      id: uid("sim"),
      assumption: "Do nothing — current constraints persist",
      delayDays: doNothingDays + 60,
      extraCostCr: Math.max(doNothingCost, 12),
      revisedCommissioning: addMonths(baseFinish, 4),
      spiIfActed: Math.max(0.55, project.spi - 0.08),
      recommendation: "Reject. Idle cost and PRAGATI exposure both worsen.",
    },
    {
      id: uid("sim"),
      assumption: `Intervene at ${LIFECYCLE_STAGES[Math.min(stageShift, LIFECYCLE_STAGES.length - 1)].replaceAll("_", " ")} gate`,
      delayDays: actDays,
      extraCostCr: Math.max(actCost, 8),
      revisedCommissioning: addMonths(baseFinish, -1),
      spiIfActed: Math.min(1.05, project.spi + 0.14),
      recommendation: "Preferred recovery path. Record a named owner and due date.",
    },
  ];
}

export function proposeDecision(project: Project, sims: Simulation[]): string {
  const best = sims.reduce((a, b) => (a.extraCostCr <= b.extraCostCr ? a : b));
  const cause = project.causes[0]?.replaceAll("_", " ").toLowerCase() ?? "critical path";
  return `Accept recovery path (${best.delayDays}d / ₹${best.extraCostCr} Cr). Clear ${cause} and re-baseline WBS before next Flash Report.`;
}

export function flattenWbs(project: Project) {
  const rows: WbsNode[] = [];
  const walk = (nodes: Project["wbs"]) => {
    for (const n of nodes) {
      rows.push(n);
      if (n.children) walk(n.children);
    }
  };
  walk(project.wbs);
  return rows;
}

export function portfolioStats(projects: Project[]) {
  const live = projects.filter((p) => p.health !== "completed");
  const original = projects.reduce((s, p) => s + p.originalCostCr, 0);
  const revised = projects.reduce((s, p) => s + p.revisedCostCr, 0);
  const spent = projects.reduce((s, p) => s + p.expenditureCr, 0);
  const critical = projects.filter((p) => p.health === "critical").length;
  const delayed = projects.filter((p) => p.delayDays > 0).length;
  const avgSpi = projects.reduce((s, p) => s + p.spi, 0) / projects.length;
  return {
    count: projects.length,
    live: live.length,
    original,
    revised,
    spent,
    overrunPct: ((revised - original) / original) * 100,
    critical,
    delayed,
    avgSpi,
  };
}
