"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { canRunAutomation, canWriteProject } from "./auth";
import { detect, explain, proposeDecision, simulate } from "./automation";
import { onCentralMonitor } from "./metrics";
import { SEED_PROJECTS } from "./seed";
import type { Decision, IngestEvent, PlatformState, Project, Session } from "./types";

const KEY = "pragati-nxt-state-v2";

const PlatformContext = createContext<{
  state: PlatformState;
  hydrated: boolean;
  login: (session: Session) => void;
  logout: () => void;
  monitorProjects: Project[];
  runCycle: (projectId: string) => void;
  recordDecision: (projectId: string, decision: Omit<Decision, "id" | "createdAt">) => void;
  advanceDecision: (projectId: string, decisionId: string, status: Decision["status"]) => void;
  ingestUpdate: (projectId: string) => { ok: boolean; message: string };
  reset: () => void;
} | null>(null);

function empty(): PlatformState {
  return { session: null, projects: structuredClone(SEED_PROJECTS), ingestLog: [] };
}

function scopedProjects(session: Session | null, projects: Project[]) {
  const monitor = projects.filter((p) => onCentralMonitor(p.originalCostCr) || onCentralMonitor(p.revisedCostCr));
  if (!session) return monitor;
  if (session.role === "ministry") return monitor.filter((p) => p.ministry === session.ministry);
  if (session.role === "agency") return projects.filter((p) => p.agency === session.agency);
  return monitor;
}

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlatformState>(empty);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as PlatformState;
        if (parsed.projects?.length) setState({ ...empty(), ...parsed, projects: parsed.projects });
      } catch {
        /* keep seed */
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const login = useCallback((session: Session) => {
    setState((s) => ({ ...s, session }));
  }, []);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, session: null }));
  }, []);

  const runCycle = useCallback((projectId: string) => {
    setState((s) => {
      if (!canRunAutomation(s.session?.role ?? "agency")) return s;
      return {
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
            owner: s.session?.org ?? "IPMD analyst",
            action,
            due: new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10),
            status: "proposed",
            notes: "Auto-drafted by Detect → Explain → Simulate → Decide. Awaiting Record.",
          };
          return {
            ...p,
            findings: [...detections, ...explanations, ...p.findings].slice(0, 14),
            simulations,
            decisions: [draft, ...p.decisions],
          };
        }),
      };
    });
  }, []);

  const recordDecision = useCallback((projectId: string, decision: Omit<Decision, "id" | "createdAt">) => {
    setState((s) => {
      const project = s.projects.find((p) => p.id === projectId);
      if (!project || !canWriteProject(s.session, project.agency, project.ministry)) return s;
      return {
        ...s,
        projects: s.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                decisions: [
                  { ...decision, id: `dec-${Date.now()}`, createdAt: new Date().toISOString() },
                  ...p.decisions,
                ],
              }
            : p,
        ),
      };
    });
  }, []);

  const advanceDecision = useCallback((projectId: string, decisionId: string, status: Decision["status"]) => {
    setState((s) => ({
      ...s,
      projects: s.projects.map((p) =>
        p.id === projectId
          ? { ...p, decisions: p.decisions.map((d) => (d.id === decisionId ? { ...d, status } : d)) }
          : p,
      ),
    }));
  }, []);

  const ingestUpdate = useCallback((projectId: string) => {
    let message = "Ingest refused.";
    let ok = false;
    setState((s) => {
      const project = s.projects.find((p) => p.id === projectId);
      if (!s.session || !project) {
        message = "Sign in with an agency, ministry, or IPMD access code.";
        return s;
      }
      if (!canWriteProject(s.session, project.agency, project.ministry)) {
        message = "Only the nodal owner may push this project — One Data, One Entry.";
        return s;
      }
      const event: IngestEvent = {
        id: `ing-${Date.now()}`,
        at: new Date().toISOString(),
        source: s.session.role === "agency" ? "AGENCY_OCMS" : "LINE_MINISTRY_API",
        projectId,
        actor: s.session.accessCode,
        summary: `Live progress push for ${project.code}. Duplicate keys blocked.`,
        duplicateBlocked: true,
      };
      ok = true;
      message = "Accepted. DPIIT IIG–PMG key reused; no second entry created.";
      return {
        ...s,
        ingestLog: [event, ...s.ingestLog].slice(0, 20),
        projects: s.projects.map((p) =>
          p.id === projectId ? { ...p, lastIngestAt: event.at, source: event.source } : p,
        ),
      };
    });
    return { ok, message };
  }, []);

  const reset = useCallback(() => {
    const session = state.session;
    setState({ ...empty(), session });
    localStorage.removeItem(KEY);
  }, [state.session]);

  const monitorProjects = useMemo(
    () => scopedProjects(state.session, state.projects),
    [state.session, state.projects],
  );

  const value = useMemo(
    () => ({
      state,
      hydrated,
      login,
      logout,
      monitorProjects,
      runCycle,
      recordDecision,
      advanceDecision,
      ingestUpdate,
      reset,
    }),
    [state, hydrated, login, logout, monitorProjects, runCycle, recordDecision, advanceDecision, ingestUpdate, reset],
  );

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error("usePlatform must be used within PlatformProvider");
  return ctx;
}
