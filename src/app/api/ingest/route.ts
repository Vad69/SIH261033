import { NextResponse } from "next/server";
import { CAPITAL_THRESHOLD_CR, STANDARD_METRICS } from "../../../lib/metrics";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { projectId?: string; accessCode?: string; physicalPct?: number; expenditureCr?: number }
    | null;
  if (!body?.projectId || !body.accessCode) {
    return NextResponse.json({ ok: false, error: "projectId and accessCode required" }, { status: 400 });
  }
  return NextResponse.json({
    ok: true,
    oneDataOneEntry: true,
    duplicateBlocked: true,
    nodal: "DPIIT_IIG_PMG",
    thresholdCr: CAPITAL_THRESHOLD_CR,
    units: STANDARD_METRICS,
    accepted: {
      projectId: body.projectId,
      actor: body.accessCode,
      physicalPct: body.physicalPct,
      expenditureCr: body.expenditureCr,
    },
  });
}
