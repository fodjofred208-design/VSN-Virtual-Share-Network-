// VSN Agent — Donor manager (data plane)
// Registers the device as a donor and manages sharing of its connectivity.
import { ControlClient } from "../api/control-client";
import { TunnelManager } from "../tunnel/tunnel-manager";
import { collectNetworkInfo } from "../network/network-info";

export class DonorManager {
  readonly tunnel: TunnelManager;
  readonly control: ControlClient;

  constructor(control: ControlClient) {
    this.control = control;
    this.tunnel = new TunnelManager({ role: "donor" });
  }

  async register(): Promise<void> {
    const info = await collectNetworkInfo();
    // In production: POST /api/donors/register with the WG public key + network info.
    console.log(`[donor] registering in ${info.countryCode} (${info.connectionType})`);
  }

  async startSharing(): Promise<void> {
    await this.tunnel.up();
  }

  async stopSharing(): Promise<void> {
    await this.tunnel.down();
  }
}
