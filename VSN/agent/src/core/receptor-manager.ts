// VSN Agent — Receptor manager (data plane)
// Discovers donors and establishes a tunnel to the chosen donor.
import { ControlClient } from "../api/control-client";
import { TunnelManager } from "../tunnel/tunnel-manager";

export class ReceptorManager {
  readonly tunnel: TunnelManager;
  readonly control: ControlClient;

  constructor(control: ControlClient) {
    this.control = control;
    this.tunnel = new TunnelManager({ role: "receptor" });
  }

  async discover(): Promise<void> {
    // In production: GET /api/donors/available via the control client.
    console.log("[receptor] discovering available donors");
  }

  async connectToDonor(): Promise<void> {
    await this.tunnel.up();
  }

  async disconnect(): Promise<void> {
    await this.tunnel.down();
  }
}
