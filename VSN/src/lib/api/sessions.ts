// VSN — Session API client
import { apiClient } from "./client";
import type { VSNSession, SessionState } from "@/lib/types";
import type {
  RequestSessionRequest,
  RequestSessionResponse,
  SessionActionResponse,
  SessionStatusResponse,
} from "protocol/messages/session";

export async function requestSession(
  req: RequestSessionRequest,
  token?: string,
): Promise<RequestSessionResponse> {
  return apiClient.post<RequestSessionResponse>("/api/sessions/request", req, token);
}

export async function acceptSession(sessionId: string, token?: string): Promise<SessionActionResponse> {
  return apiClient.post<SessionActionResponse>(`/api/sessions/${sessionId}/accept`, undefined, token);
}

export async function rejectSession(sessionId: string, token?: string): Promise<SessionActionResponse> {
  return apiClient.post<SessionActionResponse>(`/api/sessions/${sessionId}/reject`, undefined, token);
}

export async function terminateSession(
  sessionId: string,
  reason?: string,
  token?: string,
): Promise<SessionActionResponse> {
  return apiClient.post<SessionActionResponse>(`/api/sessions/${sessionId}/terminate`, { reason }, token);
}

export async function getSessionStatus(sessionId: string, token?: string): Promise<SessionStatusResponse> {
  return apiClient.get<SessionStatusResponse>(`/api/sessions/${sessionId}/status`, token);
}

export async function getSessions(userId: string): Promise<VSNSession[]> {
  const res = await apiClient.get<{ sessions: VSNSession[] }>(`/api/sessions?userId=${userId}`);
  return res.sessions;
}
