import { AUTOMATION_STEPS, AUTOMATION_META } from "../lib/lifecycle";

export function AutomationLoop({ highlight }: { highlight?: string }) {
  return (
    <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      {AUTOMATION_STEPS.map((step, i) => {
        const active = highlight === step;
        return (
          <li
            key={step}
            className={`card rounded-sm p-3 ${active ? "ring-2 ring-[var(--saffron)]" : ""}`}
          >
            <span className="stamp text-[var(--saffron)]">
              {String(i + 1).padStart(2, "0")} {AUTOMATION_META[step].verb}
            </span>
            <p className="font-serif text-lg">{AUTOMATION_META[step].label}</p>
            <p className="mt-1 text-xs text-[var(--ink-soft)]">{AUTOMATION_META[step].intent}</p>
          </li>
        );
      })}
    </ol>
  );
}
