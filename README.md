# PRAGATI NXT — SIH26103

Web-based **integrated project-monitoring platform** for Smart India Hackathon 2026.

| Field | Value |
| --- | --- |
| Problem | SIH26103 — Use case on web-based integrated project-monitoring platform |
| Ministry | MoSPI (Ministry of Statistics and Programme Implementation) |
| Theme | Smart Automation |
| Category | Software |

This is a **demo prototype**, not an official Government of India system. Seeded numbers are illustrative.

## What the mentor asked for

Projects move through a full delivery lifecycle, not a single “under implementation” flag:

```
TENDER
   ↓
TENDER ACCEPTANCE
   ↓
WORK ORDER
   ↓
PROJECT START
   ↓
SUPERVISION
   ↓
RESOURCE MOBILISATION
   ↓
SCHEDULING / WBS
   ↓
EXECUTION + EXPENDITURE
   ↓
COMPLETION
   ↓
COMMISSIONING + HANDOVER
```

Smart automation sits across every gate:

```
Project data → DETECT → EXPLAIN → SIMULATE → DECIDE → RECORD → REVIEW
```

## What the app does

- **Portfolio dashboard** — original vs revised cost, expenditure, SPI, critical queue (OCMS / PAIMANA-style).
- **Project file** — contract, WBS, expenditure S-curve, milestones, cause codes.
- **Smart automation** — deterministic Detect (SPI/CPI, stalled progress, WBS lag, mobilisation), Explain (MoSPI-style cause codes), Simulate recovery vs idle cost, draft Decide, Record, PRAGATI Review pack.
- **Flash report** — annex by sector and lifecycle gate.
- **Role switcher** — MoSPI/IPMD, line ministry, implementing agency, PRAGATI board (demo lens only).

Eight seeded Indian infrastructure projects (roads, power, freight, port, health, GEC, JJM, metro) so a jury can click through a live story in minutes.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Open the live demo**, then open **NH-48 six-laning** and click **Run Detect → Decide cycle**.

```bash
npm run build
```

## Suggested jury walkthrough (5 minutes)

1. Landing page — lifecycle + automation in one slide.
2. Portfolio — critical NH-48 card.
3. Project file — WBS lag on Narmada bridge, S-curve stall.
4. Run the automation cycle — new findings, two simulations, draft decision.
5. Record / accept the decision.
6. PRAGATI review — agenda card with named owner.
7. Flash report — portfolio totals.

## Architecture

Next.js 15 (App Router) + TypeScript + Tailwind. State is client-side (`localStorage`) so the demo runs without a database. Automation lives in `src/lib/automation.ts` and can later call a real LLM or OCMS APIs without changing the screens.

## Mapping to MoSPI

IPMD already monitors central-sector projects (₹150 Cr+) for time and cost overrun and feeds PRAGATI. PRAGATI NXT is a use-case for a **next** monitor: earlier in the lifecycle (tender → handover), with an automation loop that turns data into decisions instead of only reports.
