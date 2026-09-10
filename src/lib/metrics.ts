/** Standard units used across ministries so Flash / PRAGATI pulls stay comparable. */
export const CAPITAL_THRESHOLD_CR = 150;

export const STANDARD_METRICS = {
  currency: { code: "INR_CRORE", label: "₹ crore", note: "All capital and expenditure figures." },
  time: { code: "CALENDAR_DAY", label: "calendar days", note: "Time overrun vs original completion." },
  physical: { code: "PERCENT_COMPLETE", label: "% physical", note: "Earned vs baseline WBS." },
  spi: { code: "SPI", label: "Schedule Performance Index", note: "EV / PV. Watch < 0.95, critical < 0.85." },
  cpi: { code: "CPI", label: "Cost Performance Index", note: "EV / AC. Watch < 0.95, critical < 0.90." },
} as const;

export const NIE_SECTORS: Record<string, { nie: number; kpi: string }> = {
  "Road transport": { nie: 71, kpi: "Lane-km commissioned vs annual target" },
  "Power generation": { nie: 64, kpi: "MW COD vs scheduled COD" },
  Railways: { nie: 76, kpi: "Route-km commissioned / CRS cleared" },
  Ports: { nie: 69, kpi: "Berth capacity MTPA added" },
  Health: { nie: 73, kpi: "Beds / facilities handed to O&M" },
  "Power transmission": { nie: 67, kpi: "ckm charged vs plan" },
  "Water supply": { nie: 62, kpi: "FHTC coverage in sanctioned habitations" },
  "Urban transport": { nie: 58, kpi: "Corridor km in trial / revenue service" },
};

export function onCentralMonitor(costCr: number) {
  return costCr >= CAPITAL_THRESHOLD_CR;
}
