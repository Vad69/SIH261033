import { NextRequest, NextResponse } from "next/server";
import { CAPITAL_THRESHOLD_CR } from "../../../lib/metrics";
import { SEED_PROJECTS } from "../../../lib/seed";

export async function GET(req: NextRequest) {
  const min = Number(req.nextUrl.searchParams.get("minCost") ?? CAPITAL_THRESHOLD_CR);
  const rows = SEED_PROJECTS.filter((p) => p.originalCostCr >= min || p.revisedCostCr >= min).map((p) => ({
    id: p.id,
    code: p.code,
    name: p.name,
    ministry: p.ministry,
    sector: p.sector,
    originalCostCr: p.originalCostCr,
    revisedCostCr: p.revisedCostCr,
    expenditureCr: p.expenditureCr,
    spi: p.spi,
    cpi: p.cpi,
    delayDays: p.delayDays,
    stage: p.stage,
    source: p.source,
    unit: "INR_CRORE",
  }));
  return NextResponse.json({
    standard: "INR_CRORE / CALENDAR_DAY / PERCENT_COMPLETE / SPI / CPI",
    minCostCr: min,
    count: rows.length,
    projects: rows,
  });
}
