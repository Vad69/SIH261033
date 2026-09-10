"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { authenticate, DEMO_PASSWORD, DEMO_USERS } from "../../lib/auth";
import { ROLE_LABEL } from "../../lib/format";
import { usePlatform } from "../../lib/store";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = usePlatform();
  const [accessCode, setAccessCode] = useState("IPMD-001");
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const session = authenticate(accessCode, password);
    if (!session) {
      setError("Access code or password rejected. Use a listed demo identity.");
      return;
    }
    login(session);
    const next = params.get("next") || "/dashboard";
    router.push(next.startsWith("/") ? next : "/dashboard");
  }

  return (
    <div className="grid-paper min-h-screen">
      <div className="india-ribbon" />
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 lg:grid-cols-2">
        <div>
          <p className="stamp text-[var(--saffron)]">Secure access · SIH26103</p>
          <h1 className="mt-2 font-serif text-4xl">Sign in to PRAGATI NXT</h1>
          <p className="mt-3 text-[var(--ink-soft)]">
            Role-based authentication. Only the nodal owner may write a project (One Data, One Entry).
            Public dashboards stay outside this firewall.
          </p>
          <form onSubmit={onSubmit} className="card mt-6 space-y-3 rounded-sm p-5">
            <label className="block text-sm">
              Access code
              <input
                className="mt-1 w-full rounded-sm border border-[var(--line)] px-3 py-2"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                autoComplete="username"
              />
            </label>
            <label className="block text-sm">
              Password
              <input
                type="password"
                className="mt-1 w-full rounded-sm border border-[var(--line)] px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>
            {error ? <p className="text-sm text-[#9b1c1c]">{error}</p> : null}
            <button type="submit" className="w-full rounded-sm bg-[var(--navy)] px-4 py-2 text-sm text-[#f4efe4]">
              Authenticate
            </button>
          </form>
        </div>
        <div>
          <p className="stamp text-[var(--ink-soft)]">Demo identities · password {DEMO_PASSWORD}</p>
          <ul className="mt-3 space-y-2">
            {DEMO_USERS.map((u) => (
              <li key={u.accessCode}>
                <button
                  type="button"
                  className="card w-full rounded-sm p-3 text-left hover:bg-[#fff8ee]"
                  onClick={() => {
                    setAccessCode(u.accessCode);
                    setPassword(DEMO_PASSWORD);
                    setError("");
                  }}
                >
                  <span className="stamp text-[var(--saffron)]">{u.accessCode}</span>
                  <p className="font-semibold">{ROLE_LABEL[u.role]}</p>
                  <p className="text-xs text-[var(--ink-soft)]">{u.org}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="p-8 stamp">Loading…</p>}>
      <LoginForm />
    </Suspense>
  );
}
