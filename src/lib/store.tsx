"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { detect, explain, proposeDecision, simulate } from "./automation";
import { SEED_PROJECTS } from "./seed";
import type { Decision, PlatformState, Project, Role } from "./types";

const KEY = "pragati-nxt-state-v1";

const PlatformContext = createContext<{
  state: PlatformState;
  setRole: (role: Role) => void;
  runCycle: (projectId: string) => void;
  recordDecision: (projectId: string, decision: Omit<Decision, "id" | "createdAt">) => void;
  advanceDecision: (projectId: string, decisionId: string, status: Decision["status"]) => void;
  reset: () => void;
} | null>(null);

function load(): PlatformState {
  return { role: "ipmd", projects: structuredClone(SEED_PROJECTS) };
}

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlatformState>(load);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        setState(JSON.parse(raw) as PlatformState);
      } catch {
        /* keep seed */
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const setRole = useCallback((role: Role) => {
    setState((s) => ({ ...s, role }));
  }, []);

  const runCycle = useCallback((projectId: string) => {
    setState((s) => ({
      ...s,
      projects: s.projects.map((p) => {
        if (p.id !== projectId) return p;
        const detections = detect(p);
        const explanations = explain(p, detections);
        const simulations = simulate(p);
        const action = proposeDecision(p, simulations);
        const draft: Decision = {
          id: `dec-${Date.now()}`,
          createdAt: new Date().toISOString(),
          owner: s.role === "board" ? "PRAGATI secretariat" : "IPMD analyst",
          action,
          due: new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10),
          status: "proposed",
          notes: "Auto-drafted by Detect → Explain → Simulate → Decide. Awaiting Record.",
        };
        return {
          ...p,
          findings: [...detections, ...explanations, ...p.findings].slice(0, 12),
          simulations,
          decisions: [draft, ...p.decisions],
        };
      }),
    }));
  }, []);

  const recordDecision = useCallback((projectId: string, decision: Omit<Decision, "id" | "createdAt">) => {
    setState((s) => ({
      ...s,
      projects: s.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              decisions: [
                {
                  ...decision,
                  id: `dec-${Date.now()}`,
                  createdAt: new Date().toISOString(),
                },
                ...p.decisions,
              ],
            }
          : p,
      ),
    }));
  }, []);

  const advanceDecision = useCallback((projectId: string, decisionId: string, status: Decision["status"]) => {
    setState((s) => ({
      ...s,
      projects: s.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              decisions: p.decisions.map((d) => (d.id === decisionId ? { ...d, status } : d)),
            }
          : p,
      ),
    }));
  }, []);

  const reset = useCallback(() => {
    const fresh = load();
    setState(fresh);
    localStorage.removeItem(KEY);
  }, []);

  const value = useMemo(
    () => ({ state, setRole, runCycle, recordDecision, advanceDecision, reset }),
    [state, setRole, runCycle, recordDecision, advanceDecision, reset],
  );

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error("usePlatform must be used within PlatformProvider");
  return ctx;
}

export function useProject(id: string): Project | undefined {
  const { state } = usePlatform();
  return state.projects.find((p) => p.id === id);
}
