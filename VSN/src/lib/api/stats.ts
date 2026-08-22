// VSN — Statistics / audit / security API client
import { apiClient } from "./client";
import type { ConnectionStats, SecurityEvent, AuditEntry } from "@/lib/types";

export async function getStatistics(userId: string): Promise<ConnectionStats> {
  return apiClient.get<ConnectionStats>(`/api/statistics?userId=${userId}`);
}

export async function getSecurityEvents(userId: string, limit = 50): Promise<SecurityEvent[]> {
  const res = await apiClient.get<{ events: SecurityEvent[] }>(
    `/api/security/events?userId=${userId}&limit=${limit}`
  );
  return res.events;
}

export async function getAuditLog(userId: string, limit = 100): Promise<AuditEntry[]> {
  const res = await apiClient.get<{ entries: AuditEntry[] }>(`/api/audit?userId=${userId}&limit=${limit}`);
  return res.entries;
}
