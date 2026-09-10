import type { WbsNode } from "../lib/types";
import { inrCr } from "../lib/format";

function Row({ node, depth }: { node: WbsNode; depth: number }) {
  const lag = node.plannedPct - node.actualPct;
  return (
    <>
      <tr className="border-t border-[var(--line)]">
        <td className="py-2 pr-3 font-mono text-xs" style={{ paddingLeft: 8 + depth * 16 }}>
          {node.code}
        </td>
        <td className="py-2">{node.name}</td>
        <td className="py-2 text-sm">{node.owner}</td>
        <td className="py-2 text-right text-sm">{node.plannedPct}%</td>
        <td className="py-2 text-right text-sm">{node.actualPct}%</td>
        <td className={`py-2 text-right text-sm ${lag >= 15 ? "text-[#9b1c1c]" : ""}`}>{lag} pp</td>
        <td className="py-2 text-right text-sm">{inrCr(node.spentCr)}</td>
        <td className="py-2 text-right text-sm">{inrCr(node.budgetCr)}</td>
      </tr>
      {node.children?.map((c) => (
        <Row key={c.id} node={c} depth={depth + 1} />
      ))}
    </>
  );
}

export function WbsTree({ nodes }: { nodes: WbsNode[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="stamp text-[var(--ink-soft)]">
          <tr>
            <th className="py-2">Code</th>
            <th>Package</th>
            <th>Owner</th>
            <th className="text-right">Plan</th>
            <th className="text-right">Actual</th>
            <th className="text-right">Lag</th>
            <th className="text-right">Spent</th>
            <th className="text-right">Budget</th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((n) => (
            <Row key={n.id} node={n} depth={0} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
