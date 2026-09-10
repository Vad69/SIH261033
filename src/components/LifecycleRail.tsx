import { LIFECYCLE_STAGES, STAGE_META, stageIndex } from "../lib/lifecycle";
import type { LifecycleStage } from "../lib/types";

export function LifecycleRail({ current, compact = false }: { current: LifecycleStage; compact?: boolean }) {
  const idx = stageIndex(current);
  return (
    <div className="overflow-x-auto pb-1">
      <ol className={`flex min-w-max gap-1 ${compact ? "" : "sm:min-w-0 sm:grid sm:grid-cols-5 lg:grid-cols-10"}`}>
        {LIFECYCLE_STAGES.map((stage, i) => {
          const done = i < idx;
          const here = i === idx;
          return (
            <li
              key={stage}
              className={`min-w-[4.6rem] flex-1 rounded-sm border px-2 py-2 text-center ${
                here
                  ? "border-[var(--saffron)] bg-[#fff3e6]"
                  : done
                    ? "border-[var(--green)]/30 bg-[#eef7f1]"
                    : "border-[var(--line)] bg-white"
              }`}
            >
              <span className="stamp block text-[10px] text-[var(--ink-soft)]">{String(i + 1).padStart(2, "0")}</span>
              <span className={`block ${compact ? "text-[10px] leading-tight" : "text-xs"} font-semibold`}>
                {STAGE_META[stage].short}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
