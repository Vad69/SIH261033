export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <article className="card rounded-sm p-4">
      <p className="stamp text-[var(--ink-soft)]">{label}</p>
      <p className="mt-2 font-serif text-3xl tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-[var(--ink-soft)]">{hint}</p> : null}
    </article>
  );
}
