// VSN Agent — Network info (data plane)
// Collects device network facts used for donor registration/status (no
// sensitive data beyond what is needed for discovery).
export interface NetworkInfo {
  countryCode: string;
  publicIp?: string;
  connectionType: "wifi" | "cellular" | "ethernet" | "unknown";
  approxUploadMbps?: number;
  approxDownloadMbps?: number;
  latencyMs?: number;
}

export async function collectNetworkInfo(): Promise<NetworkInfo> {
  // In production this uses OS APIs (e.g. network_info providers). Demo stub:
  return {
    countryCode: "CM",
    connectionType: "wifi",
    approxUploadMbps: 12,
    approxDownloadMbps: 40,
    latencyMs: 42,
  };
}
