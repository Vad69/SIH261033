import { NextResponse } from "next/server";
import { portfolioStats } from "../../../lib/automation";
import { CAPITAL_THRESHOLD_CR } from "../../../lib/metrics";
import { modelOverrun } from "../../../lib/overrun";
import { SEED_PROJECTS } from "../../../lib/seed";

export async function GET() {
  const monitor = SEED_PROJECTS.filter((p) => p.originalCostCr >= CAPITAL_THRESHOLD_CR);
  const stats = portfolioStats(monitor);
  const pack = monitor
    .filter((p) => p.health === "critical" || p.delayDays > 90)
    .map((p) => {
      const model = modelOverrun(p);
      return {
        project: p.name,
        ministry: p.ministry,
        delayDays: p.delayDays,
        costOverrunCr: model.costOverrunCr,
        bottlenecks: p.causes,
        ask: p.decisions[0]?.action ?? "Detect cycle required",
      };
    });
  return NextResponse.json({
    title: "PRAGATI NXT flash / PRAGATI pack",
    generated: new Date().toISOString(),
    stats,
    pack,
  });
}
