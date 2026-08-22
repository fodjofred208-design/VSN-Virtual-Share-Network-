// VSN — Hook to drive a real session + tunnel from the UI.
// Flow: request session → (donor accepts) → get tunnel config → (relay if needed)
// → agent brings up WireGuard. Returns connection state + logs for the UI.
"use client";

import { useState, useCallback } from "react";
import { requestSession, acceptSession, terminateSession } from "@/lib/api/sessions";
import { getTunnelConfig, allocateRelay } from "@/lib/api/tunnel";
import type { SessionState } from "@/lib/types";

export interface ConnectionLog {
  id: number;
  time: string;
  msg: string;
  type: "info" | "success" | "warn";
}

export function useTunnel() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [state, setState] = useState<SessionState>("idle");
  const [logs, setLogs] = useState<ConnectionLog[]>([]);
  const [tunnelInfo, setTunnelInfo] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const log = useCallback((msg: string, type: ConnectionLog["type"] = "info") => {
    setLogs((prev) => [...prev, { id: Date.now() + Math.random(), time: new Date().toLocaleTimeString(), msg, type }]);
  }, []);

  const connect = useCallback(
    async (input: { donorProfileId: string; receptorDeviceId: string; receptorUserId: string; role: "donor" | "receptor" }) => {
      setError(null);
      try {
        log("Requesting session…");
        const res = await requestSession({
          donorProfileId: input.donorProfileId,
          receptorDeviceId: input.receptorDeviceId,
          receptorUserId: input.receptorUserId,
        });
        setSessionId(res.sessionId);
        setState(res.state);
        log(`Session requested (${res.donorId})`, "info");

        // Donor side auto-accepts in this demo; a real donor accepts via UI/signaling.
        if (input.role === "donor") {
          await acceptSession(res.sessionId);
          setState("approved");
          log("Session approved by donor", "success");
        }

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
        setState("connected");
        log("Tunnel established — traffic flowing", "success");
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Connection failed";
        setError(msg);
        log(msg, "warn");
        setState("error");
      }
    },
    [log]
  );

  const disconnect = useCallback(async () => {
    if (sessionId) await terminateSession(sessionId, "user_disconnect").catch(() => null);
    setSessionId(null);
    setState("idle");
    setTunnelInfo(null);
    log("Disconnected", "info");
  }, [sessionId, log]);

  return { sessionId, state, logs, tunnelInfo, error, connect, disconnect, log };
}

export interface RelayInfo {
  relayId: string;
  endpoint: string;
}
