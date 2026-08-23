// VSN — Hook to drive a real session + tunnel from the UI.
// Flow: request session → (donor accepts) → get tunnel config → (relay if needed)
// → agent brings up WireGuard. Returns connection state + logs for the UI.
// Also publishes to the global connection store (background + notifications).
"use client";

import { useState, useCallback } from "react";
import { requestSession, acceptSession, terminateSession } from "@/lib/api/sessions";
import { getTunnelConfig, allocateRelay } from "@/lib/api/tunnel";
import type { SessionState } from "@/lib/types";
import { setConnectionState, toneFor, labelFor } from "@/lib/connection-store";
import { pushNotification } from "@/lib/notification-store";

export interface ConnectionLog {
  id: number;
  time: string;
  msg: string;
  type: "info" | "success" | "warn";
}

export function useTunnel() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [state, setStateRaw] = useState<SessionState>("idle");
  const [logs, setLogs] = useState<ConnectionLog[]>([]);
  const [tunnelInfo, setTunnelInfo] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Update both local state and the global connection store.
  const applyState = useCallback(
    (s: SessionState, extra?: Partial<Parameters<typeof setConnectionState>[0]>) => {
      setStateRaw(s);
      setConnectionState({
        state: s,
        tone: toneFor(s),
        label: labelFor(s),
        role: extra?.role ?? (s === "connected" ? "receptor" : null),
        ...extra,
      });
    },
    [],
  );

  const log = useCallback((msg: string, type: ConnectionLog["type"] = "info") => {
    setLogs((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), time: new Date().toLocaleTimeString(), msg, type },
    ]);
  }, []);

  const connect = useCallback(
    async (input: {
      donorProfileId: string;
      receptorDeviceId: string;
      receptorUserId: string;
      role: "donor" | "receptor";
    }) => {
      setError(null);
      try {
        log("Requesting session…");
        const res = await requestSession({
          donorProfileId: input.donorProfileId,
          receptorDeviceId: input.receptorDeviceId,
          receptorUserId: input.receptorUserId,
        });
        setSessionId(res.sessionId);
        applyState(res.state);
        log(`Session requested (${res.donorId})`, "info");

        // For a RECEPTOR, the donor must accept (manual accept/deny in the
        // notification hub / donor page). We don't auto-accept for receptors.
        if (input.role === "donor") {
          await acceptSession(res.sessionId);
          applyState("approved");
          log("Session approved by donor", "success");
        } else {
          pushNotification({
            kind: "request",
            title: "Connection request sent",
            body: `Waiting for ${res.donorId} (${res.sessionId.slice(0, 8)}…)`,
            route: "/receptor",
          });
        }

        applyState(res.state, { sessionId: res.sessionId, donorId: res.donorId });

        // Fetch the WireGuard config for THIS endpoint.
        const cfg = await getTunnelConfig(res.sessionId, input.role);
        log(`WireGuard config ready (iface ${cfg.interfaceName})`, "info");

        // If there's no donor endpoint (CGNAT), allocate a relay.
        let relayInfo: RelayInfo | null = null;
        if (!cfg.endpoint) {
          const relay = await allocateRelay(res.sessionId);
          relayInfo = { relayId: relay.relayId, endpoint: relay.endpoint };
          log(`Allocated encrypted relay (${relay.relayId})`, "info");
        }

        setTunnelInfo({ config: cfg, relay: relayInfo });
        applyState("connected");
        log("Tunnel established — traffic flowing", "success");
        pushNotification({
          kind: "system",
          title: "Tunnel established",
          body: "Encrypted connection active.",
          route: "/connection",
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Connection failed";
        setError(msg);
        log(msg, "warn");
        applyState("error");
      }
    },
    [log, applyState],
  );

  const disconnect = useCallback(async () => {
    if (sessionId) await terminateSession(sessionId, "user_disconnect").catch(() => null);
    setSessionId(null);
    applyState("idle");
    setTunnelInfo(null);
    log("Disconnected", "info");
  }, [sessionId, applyState, log]);

  return { sessionId, state, logs, tunnelInfo, error, connect, disconnect, log, applyState };
}

export interface RelayInfo {
  relayId: string;
  endpoint: string;
}
