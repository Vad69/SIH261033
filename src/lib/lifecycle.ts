import { AUTOMATION_STEPS, LIFECYCLE_STAGES, type AutomationStep, type LifecycleStage } from "./types";

export const STAGE_META: Record<
  LifecycleStage,
  { label: string; short: string; intent: string }
> = {
  TENDER: {
    label: "Tender",
    short: "Tender",
    intent: "Publish, bid, and evaluate packages with compliance trails.",
  },
  TENDER_ACCEPTANCE: {
    label: "Tender acceptance",
    short: "Accept",
    intent: "Award, negotiate, and lock commercial conditions.",
  },
  WORK_ORDER: {
    label: "Work order",
    short: "WO",
    intent: "Issue work order, mobilise contract, and freeze baselines.",
  },
  PROJECT_START: {
    label: "Project start",
    short: "Start",
    intent: "Kick-off, site possession, and baseline kick-off review.",
  },
  SUPERVISION: {
    label: "Supervision",
    short: "Supervise",
    intent: "PMC, quality, safety, and third-party inspection setup.",
  },
  RESOURCE_MOBILISATION: {
    label: "Resource mobilisation",
    short: "Mobilise",
    intent: "Plant, manpower, camp, and critical materials on ground.",
  },
  SCHEDULING_WBS: {
    label: "Scheduling / WBS",
    short: "WBS",
    intent: "Lock WBS, critical path, and earned-value baseline.",
  },
  EXECUTION_EXPENDITURE: {
    label: "Execution + expenditure",
    short: "Execute",
    intent: "Physical progress, bills, SPI/CPI, and bottleneck clearance.",
  },
  COMPLETION: {
    label: "Completion",
    short: "Complete",
    intent: "Punch lists, testing, and substantial completion certificate.",
  },
  COMMISSIONING_HANDOVER: {
    label: "Commissioning + handover",
    short: "Handover",
    intent: "Commission, asset register, O&M transfer, and close-out.",
  },
};

export const AUTOMATION_META: Record<
  AutomationStep,
  { label: string; verb: string; intent: string }
> = {
  DETECT: {
    label: "Detect",
    verb: "Scan",
    intent: "Flag time/cost slippage, idle spend, and data mismatches.",
  },
  EXPLAIN: {
    label: "Explain",
    verb: "Diagnose",
    intent: "Map signals to MoSPI cause codes and bottleneck owners.",
  },
  SIMULATE: {
    label: "Simulate",
    verb: "Forecast",
    intent: "Test delay and recovery scenarios on cost and commissioning.",
  },
  DECIDE: {
    label: "Decide",
    verb: "Recommend",
    intent: "Propose time-bound actions with a named owner.",
  },
  RECORD: {
    label: "Record",
    verb: "Log",
    intent: "Write decisions into the project file of record.",
  },
  REVIEW: {
    label: "Review",
    verb: "Escalate",
    intent: "Pack PRAGATI / ministry review with facts and asks.",
  },
};

export function stageIndex(stage: LifecycleStage) {
  return LIFECYCLE_STAGES.indexOf(stage);
}

export function stageProgress(stage: LifecycleStage) {
  return Math.round(((stageIndex(stage) + 1) / LIFECYCLE_STAGES.length) * 100);
}

export { LIFECYCLE_STAGES, AUTOMATION_STEPS };
