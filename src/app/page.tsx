import Link from "next/link";
import { AUTOMATION_META, AUTOMATION_STEPS, LIFECYCLE_STAGES, STAGE_META } from "../lib/lifecycle";

export default function HomePage() {
  return (
    <div className="grid-paper min-h-screen">
      <div className="india-ribbon" />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="stamp text-[var(--saffron)]">SIH 2026 · SIH26103 · MoSPI · Smart Automation</p>
        <h1 className="mt-3 max-w-4xl font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl">
          PRAGATI NXT — a web-based integrated project-monitoring platform
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-[var(--ink-soft)]">
          One Data, One Entry from DPIIT IIG–PMG, API updates from ministries and agencies, ₹150 Cr
          capital filter, overrun analytics, and a Detect → Explain → Simulate → Decide → Record → Review
          loop across tender to handover. Role-based access for IPMD, line ministries, agencies, NITI
          Aayog, Cabinet Secretariat, and the PRAGATI board.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/login" className="rounded-sm bg-[var(--navy)] px-5 py-2.5 text-sm text-[#f4efe4]">
            Sign in with access code
          </Link>
          <Link href="/public" className="rounded-sm border border-[var(--navy)] px-5 py-2.5 text-sm">
            Public dashboard
          </Link>
        </div>

        <section className="mt-14">
          <h2 className="font-serif text-2xl">How a project moves</h2>
          <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {LIFECYCLE_STAGES.map((stage, i) => (
              <li key={stage} className="card rounded-sm p-3">
                <span className="stamp text-[var(--saffron)]">{String(i + 1).padStart(2, "0")}</span>
                <p className="font-semibold">{STAGE_META[stage].label}</p>
                <p className="mt-1 text-xs text-[var(--ink-soft)]">{STAGE_META[stage].intent}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl">Smart automation sits across the whole chain</h2>
          <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
            {AUTOMATION_STEPS.map((step) => (
              <li key={step} className="card rounded-sm p-3">
                <p className="font-serif text-xl">{AUTOMATION_META[step].label}</p>
                <p className="mt-1 text-xs text-[var(--ink-soft)]">{AUTOMATION_META[step].intent}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
