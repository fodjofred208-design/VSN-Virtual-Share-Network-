// VSN — Tunnel & relay API client (UI → control plane)
import { apiClient } from "./client";

export interface TunnelConfig {
  role: "donor" | "receptor";
  sessionId: string;
  selfAddress: string;
  peerPublicKey: string;
  peerAllowedIPs: string[];
  presharedKey: string | null;
  listenPort?: number;
  endpoint?: string;
  interfaceName: string;
}

export interface RelayAllocation {
  relayId: string;
  endpoint: string;
  sessionId: string;
  allocatedAt: string;
}

/** Get the WireGuard config data for one endpoint of a session. */
export function getTunnelConfig(sessionId: string, role: "donor" | "receptor"): Promise<TunnelConfig> {
  return apiClient.get<TunnelConfig>(`/api/sessions/${sessionId}/tunnel-config?role=${role}`);
}

/** Allocate an encrypted relay for a session (CGNAT fallback). */
export function allocateRelay(sessionId: string): Promise<RelayAllocation> {
  return apiClient.post<RelayAllocation>("/api/relay/allocate", { sessionId });
}
