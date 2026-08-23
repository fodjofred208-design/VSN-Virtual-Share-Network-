// VSN — Donor API client
import { apiClient } from "./client";
import type { AvailableDonor, DonorProfile } from "@/lib/types";
import type {
  RegisterDonorRequest,
  RegisterDonorResponse,
  DonorHeartbeatRequest,
  DonorHeartbeatResponse,
  ApproveReceptorRequest,
  ApproveReceptorResponse,
} from "protocol/messages/donor";

export async function registerDonor(
  req: RegisterDonorRequest,
  token?: string,
): Promise<RegisterDonorResponse> {
  return apiClient.post<RegisterDonorResponse>("/api/donors/register", req, token);
}

export async function getAvailableDonors(userId: string, fingerprint?: string): Promise<AvailableDonor[]> {
  const params = new URLSearchParams({ userId });
  if (fingerprint) params.set("fingerprint", fingerprint);
  const res = await apiClient.get<{ donors: AvailableDonor[] }>(`/api/donors/available?${params.toString()}`);
  return res.donors;
}

export async function getMyDonors(userId: string): Promise<AvailableDonor[]> {
  const res = await apiClient.get<{ donors: AvailableDonor[] }>(`/api/donors?userId=${userId}`);
  return res.donors;
}

export async function donorHeartbeat(
  req: DonorHeartbeatRequest,
  token?: string,
): Promise<DonorHeartbeatResponse> {
  return apiClient.post<DonorHeartbeatResponse>("/api/donors/heartbeat", req, token);
}

export async function approveReceptor(
  donorProfileId: string,
  req: ApproveReceptorRequest,
  token?: string,
): Promise<ApproveReceptorResponse> {
  return apiClient.post<ApproveReceptorResponse>(`/api/donors/${donorProfileId}/approve`, req, token);
}
