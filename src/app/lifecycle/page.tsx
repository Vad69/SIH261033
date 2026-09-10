import { AppShell } from "../../components/AppShell";
import { AUTOMATION_META, AUTOMATION_STEPS, LIFECYCLE_STAGES, STAGE_META } from "../../lib/lifecycle";

export default function LifecyclePage() {
  return (
    <AppShell>
      <p className="stamp text-[var(--saffron)]">Operating model</p>
      <h1 className="font-serif text-4xl">Project lifecycle</h1>
      <p className="mt-2 max-w-3xl text-[var(--ink-soft)]">
        Classic monitors start too late — after a work order — and treat “under implementation” as one
        blob. PRAGATI NXT treats every gate as a first-class state with owners, documents, and
        automation hooks.
      </p>
      <ol className="mt-8 space-y-4">
        {LIFECYCLE_STAGES.map((stage, i) => (
          <li key={stage} className="card flex gap-4 rounded-sm p-4">
            <span className="font-serif text-3xl text-[var(--saffron)]">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2 className="font-serif text-2xl">{STAGE_META[stage].label}</h2>
              <p className="text-sm text-[var(--ink-soft)]">{STAGE_META[stage].intent}</p>
              <p className="mt-2 text-sm">
                Automation at this gate:{" "}
                {AUTOMATION_STEPS.map((s) => AUTOMATION_META[s].label).join(" → ")}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </AppShell>
  );
}
