"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROLE_LABEL } from "../lib/format";
import { usePlatform } from "../lib/store";
import type { Role } from "../lib/types";

const NAV = [
  { href: "/dashboard", label: "Portfolio" },
  { href: "/projects", label: "Projects" },
  { href: "/lifecycle", label: "Lifecycle" },
  { href: "/automation", label: "Smart automation" },
  { href: "/review", label: "PRAGATI review" },
  { href: "/reports", label: "Flash report" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { state, setRole, reset } = usePlatform();

  return (
    <div className="min-h-screen">
      <div className="india-ribbon" />
      <header className="border-b border-[var(--line)] bg-[#fffdf8]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-[var(--navy)] font-serif text-lg text-[#f4efe4]">
              प
            </span>
            <span>
              <span className="block font-serif text-lg leading-none tracking-tight">PRAGATI NXT</span>
              <span className="stamp text-[var(--saffron)]">MoSPI · SIH26103</span>
            </span>
          </Link>
          <nav className="flex flex-wrap gap-1 text-sm">
            {NAV.map((item) => {
              const active = path === item.href || path.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-sm px-3 py-1.5 ${active ? "bg-[var(--navy)] text-[#f4efe4]" : "hover:bg-[var(--paper-2)]"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <label className="stamp text-[var(--ink-soft)]">Role</label>
            <select
              className="rounded-sm border border-[var(--line)] bg-white px-2 py-1 text-sm"
              value={state.role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABEL[r]}
                </option>
              ))}
            </select>
            <button type="button" className="stamp text-[var(--ink-soft)] underline" onClick={reset}>
              Reset demo
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      <footer className="border-t border-[var(--line)] px-4 py-6 text-center text-xs text-[var(--ink-soft)]">
        Prototype for Smart India Hackathon 2026 · Problem SIH26103 · Ministry of Statistics and Programme Implementation.
        Not an official Government of India system. Demo data only.
      </footer>
    </div>
  );
}
