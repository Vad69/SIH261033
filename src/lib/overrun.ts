import { CAUSE_LABEL } from "./format";
import { isPreConstruction } from "./lifecycle";
import type { CauseCode, Project } from "./types";

export type OverrunModel = {
  costOverrunCr: number;
  costOverrunPct: number;
  timeOverrunDays: number;
  idleCostCr: number;
  attribution: { cause: CauseCode; sharePct: number; costCr: number }[];
  preConstructionSharePct: number;
  narrative: string;
};

export function modelOverrun(project: Project): OverrunModel {
  const costOverrunCr = Math.max(0, project.revisedCostCr - project.originalCostCr);
  const costOverrunPct = project.originalCostCr > 0 ? (costOverrunCr / project.originalCostCr) * 100 : 0;
  const daily = project.revisedCostCr / Math.max(project.physicalPct, 5) / 4;
  const idleCostCr = Math.round(Math.max(project.delayDays, 0) * daily * 0.22);
  const causes = project.causes.length ? project.causes : [];
  const weights = causes.map((_, i) => (causes.length - i) * 2);
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  const attribution = causes.map((cause, i) => {
    const sharePct = (weights[i] / sum) * 100;
    return { cause, sharePct, costCr: Math.round((costOverrunCr * sharePct) / 100) };
  });
  const preConstructionSharePct = isPreConstruction(project.stage)
    ? 72
    : project.stage === "RESOURCE_MOBILISATION" || project.stage === "SCHEDULING_WBS"
      ? 45
      : 18;
  const top = attribution[0];
  const narrative = top
    ? `${CAUSE_LABEL[top.cause]} explains ~${Math.round(top.sharePct)}% of the ₹${costOverrunCr} Cr cost deviation; ${project.delayDays} days of time overrun imply ~₹${idleCostCr} Cr idle / carrying cost if unconstrained.`
    : `No bottleneck tag on file. Deviation is ${costOverrunPct.toFixed(1)}% cost and ${project.delayDays} days time versus original sanction.`;
  return {
    costOverrunCr,
    costOverrunPct,
    timeOverrunDays: project.delayDays,
    idleCostCr,
    attribution,
    preConstructionSharePct,
    narrative,
  };
}
