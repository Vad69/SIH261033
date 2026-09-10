"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { canIngest, canReview, canRunAutomation } from "../lib/auth";
import { ROLE_LABEL } from "../lib/format";
import { usePlatform } from "../lib/store";

const NAV = [
  { href: "/dashboard", label: "Portfolio" },
  { href: "/projects", label: "Projects" },
  { href: "/analytics", label: "Time & cost" },
  { href: "/integration", label: "One entry / API" },
  { href: "/automation", label: "Smart automation" },
  { href: "/review", label: "PRAGATI review" },
  { href: "/reports", label: "Flash report" },
];

export function AppShell({
  children,
  auth = "required",
}: {
  children: React.ReactNode;
  auth?: "required" | "public";
}) {
  const path = usePathname();
  const router = useRouter();
  const { state, hydrated, logout } = usePlatform();

  useEffect(() => {
    if (!hydrated) return;
    if (auth === "required" && !state.session) {
      router.replace(`/login?next=${encodeURIComponent(path)}`);
    }
  }, [hydrated, auth, state.session, path, router]);

  if (!hydrated) {
    return (
      <div className="grid-paper min-h-screen p-10">
        <p className="stamp">Checking access code…</p>
      </div>
    );
  }

  if (auth === "required" && !state.session) {
    return (
      <div className="grid-paper min-h-screen p-10">
        <p className="stamp">Redirecting to login…</p>
      </div>
    );
  }

  const role = state.session?.role;
  const links = NAV.filter((item) => {
    if (!role) return item.href === "/dashboard";
    if (item.href === "/review") return canReview(role);
    if (item.href === "/automation") return canRunAutomation(role) || role === "ministry";
    if (item.href === "/integration") return canIngest(role) || role === "board" || role === "niti" || role === "cabinet";
    return true;
  });

  return (
    <div className="min-h-screen">
      <div className="india-ribbon" />
      <header className="border-b border-[var(--line)] bg-[#fffdf8]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-[var(--navy)] font-serif text-lg text-[#f4efe4]">
              प
            </span>
            <span>
              <span className="block font-serif text-lg leading-none tracking-tight">PRAGATI NXT</span>
              <span className="stamp text-[var(--saffron)]">MoSPI · SIH26103 · Secure</span>
            </span>
          </Link>
          <nav className="-mx-1 flex gap-1 overflow-x-auto text-sm">
            {links.map((item) => {
              const active = path === item.href || path.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-sm px-3 py-1.5 ${active ? "bg-[var(--navy)] text-[#f4efe4]" : "hover:bg-[var(--paper-2)]"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            {state.session ? (
              <>
                <span>
                  <span className="stamp block text-[var(--ink-soft)]">{ROLE_LABEL[state.session.role]}</span>
                  <span className="text-xs">{state.session.name}</span>
                </span>
                <button type="button" className="stamp underline" onClick={() => { logout(); router.push("/login"); }}>
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/login" className="stamp underline">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      <footer className="border-t border-[var(--line)] px-4 py-6 text-center text-xs text-[var(--ink-soft)]">
        Prototype for Smart India Hackathon 2026 · Problem SIH26103 · Ministry of Statistics and Programme Implementation.
        Not an official Government of India system. Demo data only. Access is role-gated.
      </footer>
    </div>
  );
}
