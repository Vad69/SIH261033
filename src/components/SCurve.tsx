import type { ExpenditurePoint } from "../lib/types";

export function SCurve({ series }: { series: ExpenditurePoint[] }) {
  if (series.length === 0) return null;
  const w = 640;
  const h = 220;
  const pad = 28;
  const maxY = Math.max(...series.map((s) => Math.max(s.plannedCr, s.actualCr, 1)));
  const x = (i: number) => pad + (i / Math.max(series.length - 1, 1)) * (w - pad * 2);
  const y = (v: number) => h - pad - (v / maxY) * (h - pad * 2);
  const path = (key: "plannedCr" | "actualCr") =>
    series.map((s, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(s[key])}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full">
      <rect width={w} height={h} fill="#fffdf8" />
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <line
          key={g}
          x1={pad}
          x2={w - pad}
          y1={y(maxY * g)}
          y2={y(maxY * g)}
          stroke="rgba(18,50,90,0.12)"
        />
      ))}
      <path d={path("plannedCr")} fill="none" stroke="#12325a" strokeWidth="2" />
      <path d={path("actualCr")} fill="none" stroke="#c45c12" strokeWidth="2.5" />
      {series.map((s, i) => (
        <circle key={s.month} cx={x(i)} cy={y(s.actualCr)} r="3.5" fill="#c45c12" />
      ))}
      <text x={pad} y={16} fill="#12325a" fontSize="11">
        Planned (navy) vs actual expenditure (saffron)
      </text>
    </svg>
  );
}
