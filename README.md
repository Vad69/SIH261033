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

- **Login / RBAC** — access codes for IPMD, line ministry, agency, PRAGATI, NITI Aayog, Cabinet Secretariat. Public dashboard has no write access.
- **One Data, One Entry** — DPIIT IIG–PMG nodal key; API pushes; duplicates blocked (`/integration`, `POST /api/ingest`).
- **₹150 Cr filter** — central monitor. A PMGSY demo work sits below the threshold.
- **Time & cost analytics** — overrun attribution and pre-construction log (`/analytics`).
- **Smart automation** — Detect → Explain → Simulate → Decide → Record → Review on the same feed.
- **Flash + PRAGATI pack** — `/reports` and `GET /api/pragati`.
- **Standard metrics** — ₹ crore, calendar days, % physical, SPI, CPI.

## Sign in

Password for every demo identity: `pragati`

| Access code | Desk |
| --- | --- |
| IPMD-001 | MoSPI / IPMD |
| MORTH-014 | Line ministry (roads) |
| NHAI-PIU-VAD | NHAI PIU Vadodara |
| PMO-PRAGATI | PRAGATI board |
| NITI-NIE | NITI Aayog |
| CABSEC-01 | Cabinet Secretariat |

Citizen view: `/public`

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → **Sign in with access code**.

```bash
npm run build
```

## Suggested jury walkthrough

1. Sign in as `IPMD-001` / `pragati`.
2. Portfolio → NH-48 → run Detect cycle.
3. Time & cost analytics.
4. One entry / API — push an update.
5. Flash report / PRAGATI pack.
6. Sign out → public dashboard.
7. Sign in as `NHAI-PIU-VAD` — only NH-48 is writable.

## Architecture

Next.js 15 (App Router) + TypeScript + Tailwind. Session and project state are client-side (`localStorage`). REST stubs: `GET /api/projects?minCost=150`, `POST /api/ingest`, `GET /api/pragati`.

## Mapping to MoSPI

IPMD monitors central-sector projects (₹150 Cr+) for time and cost overrun and feeds PRAGATI. PRAGATI NXT is a use-case for that monitor: one-entry data, role firewalls, earlier lifecycle (tender → handover), and an automation loop that turns data into decisions.
