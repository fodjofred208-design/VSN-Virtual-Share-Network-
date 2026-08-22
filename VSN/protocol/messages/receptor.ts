// VSN — Receptor Protocol Messages (control-plane API)

import type { AvailableDonor } from "../types";

export interface DonorDiscoveryRequest {
  userId: string;
  fingerprint?: string;
}

export interface DonorDiscoveryResponse {
  donors: AvailableDonor[];
}
