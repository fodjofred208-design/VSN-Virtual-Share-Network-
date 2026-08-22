// VSN — Authentication Protocol Messages (control-plane API)

export interface RegisterDeviceRequest {
  userId: string;
  deviceName: string;
  deviceType: "android" | "windows" | "linux" | "macos";
  publicKey: string;
  fingerprint: string;
}

export interface RegisterDeviceResponse {
  deviceId: string;
  message: string;
}

export interface ChallengeRequest {
  deviceId?: string;
  fingerprint?: string;
}

export interface ChallengeResponse {
  challenge: string;
  expiresAt: string;
  message: string;
}

export interface VerifyRequest {
  deviceId: string;
  challenge: string;
  signature: string;
}

export interface VerifyResponse {
  verified: boolean;
  token: string;
  expiresIn: number;
}
