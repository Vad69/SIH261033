export const LIFECYCLE_STAGES = [
  "TENDER",
  "TENDER_ACCEPTANCE",
  "WORK_ORDER",
  "PROJECT_START",
  "SUPERVISION",
  "RESOURCE_MOBILISATION",
  "SCHEDULING_WBS",
  "EXECUTION_EXPENDITURE",
  "COMPLETION",
  "COMMISSIONING_HANDOVER",
] as const;

export type LifecycleStage = (typeof LIFECYCLE_STAGES)[number];

export const AUTOMATION_STEPS = [
  "DETECT",
  "EXPLAIN",
  "SIMULATE",
  "DECIDE",
  "RECORD",
  "REVIEW",
] as const;

export type AutomationStep = (typeof AUTOMATION_STEPS)[number];

export type Health = "on-track" | "watch" | "critical" | "completed";
export type Role = "ipmd" | "ministry" | "agency" | "board" | "niti" | "cabinet";
export type DataSource = "DPIIT_IIG_PMG" | "LINE_MINISTRY_API" | "AGENCY_OCMS";

export type CauseCode =
  | "LAND_ACQUISITION"
  | "FOREST_CLEARANCE"
  | "ENVIRONMENT_CLEARANCE"
  | "UTILITY_SHIFTING"
  | "FUNDING_CONSTRAINT"
  | "CONTRACTOR_CAPACITY"
  | "DESIGN_CHANGE"
  | "LAW_AND_ORDER"
  | "GEOTECH_SURPRISE"
  | "MONSOON_WEATHER"
  | "STATUTORY_APPROVAL"
  | "MATERIAL_SHORTAGE";

export type WbsNode = {
  id: string;
  code: string;
  name: string;
  plannedPct: number;
  actualPct: number;
  budgetCr: number;
  spentCr: number;
  owner: string;
  start: string;
  finish: string;
  children?: WbsNode[];
};

export type ExpenditurePoint = {
  month: string;
  plannedCr: number;
  actualCr: number;
  physicalPct: number;
};

export type Milestone = {
  id: string;
  name: string;
  due: string;
  actual?: string;
  status: "done" | "due" | "slipped";
};

export type Finding = {
  id: string;
  step: AutomationStep;
  severity: "info" | "watch" | "critical";
  title: string;
  detail: string;
  metric?: string;
  cause?: CauseCode;
};

export type Simulation = {
  id: string;
  assumption: string;
  delayDays: number;
  extraCostCr: number;
  revisedCommissioning: string;
  spiIfActed: number;
  recommendation: string;
};

export type Decision = {
  id: string;
  createdAt: string;
  owner: string;
  action: string;
  due: string;
  status: "proposed" | "accepted" | "closed";
  notes: string;
};

export type Project = {
  id: string;
  code: string;
  name: string;
  sector: string;
  ministry: string;
  agency: string;
  state: string;
  stage: LifecycleStage;
  health: Health;
  originalCostCr: number;
  revisedCostCr: number;
  expenditureCr: number;
  originalStart: string;
  originalCompletion: string;
  anticipatedCompletion: string;
  physicalPct: number;
  spi: number;
  cpi: number;
  delayDays: number;
  causes: CauseCode[];
  description: string;
  tenderRef: string;
  workOrderNo: string;
  contractor: string;
  wbs: WbsNode[];
  expenditure: ExpenditurePoint[];
  milestones: Milestone[];
  findings: Finding[];
  simulations: Simulation[];
  decisions: Decision[];
  source: DataSource;
  lastIngestAt: string;
  nieScore: number;
};

export type Session = {
  accessCode: string;
  name: string;
  org: string;
  role: Role;
  ministry?: string;
  agency?: string;
};

export type IngestEvent = {
  id: string;
  at: string;
  source: DataSource;
  projectId: string;
  actor: string;
  summary: string;
  duplicateBlocked: boolean;
};

export type PlatformState = {
  session: Session | null;
  projects: Project[];
  ingestLog: IngestEvent[];
};
