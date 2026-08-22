// VSN — Auth API client
import { apiClient } from "./client";
import type {
  ChallengeRequest,
  ChallengeResponse,
  VerifyRequest,
  VerifyResponse,
} from "protocol/messages/authentication";

export async function getChallenge(req: ChallengeRequest): Promise<ChallengeResponse> {
  return apiClient.post<ChallengeResponse>("/api/auth/challenge", req);
}

export async function registerDevice(
  body: {
    userId: string;
    deviceName: string;
    deviceType: "android" | "windows" | "linux" | "macos";
    publicKey: string;
    fingerprint: string;
  },
  token?: string
): Promise<{ deviceId: string; message: string }> {
  return apiClient.post<{ deviceId: string; message: string }>("/api/auth/register-device", body, token);
}

export async function verifyChallenge(req: VerifyRequest): Promise<VerifyResponse> {
  return apiClient.post<VerifyResponse>("/api/auth/verify", req);
}
