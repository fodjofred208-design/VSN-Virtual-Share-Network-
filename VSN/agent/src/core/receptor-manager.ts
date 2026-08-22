// VSN Agent — Receptor manager (data plane)
// Discovers donors and establishes a tunnel to the chosen donor, then routes
// the device's traffic through it.
import { ControlClient } from "../api/control-client";
import { TunnelManager } from "../tunnel/tunnel-manager";
import { RoutingManager } from "../network/routing-manager";
import { getPlatformAdapter } from "./platform-adapter";

export class ReceptorManager {
  readonly tunnel: TunnelManager;
  readonly control: ControlClient;
  readonly routing: RoutingManager;
  private readonly adapter = getPlatformAdapter();

  constructor(control: ControlClient) {
    this.control = control;
    this.tunnel = new TunnelManager({ role: "receptor", interfaceName: this.adapter.interfaceName("receptor") });
    this.routing = new RoutingManager("receptor");
  }

  getPublicKey(): string {
    return this.tunnel.getPublicKey();
  }

  async discover(): Promise<void> {
    // In production: GET /api/donors/available via the control client.
    console.log("[receptor] discovering available donors");
  }

  async connectToDonor(): Promise<void> {
    const iface = this.adapter.interfaceName("receptor");
    await this.tunnel.up();
    // Route the device's traffic into the tunnel (default route).
    await this.routing.configure(iface, this.outInterface());
  }

  async disconnect(): Promise<void> {
    const iface = this.adapter.interfaceName("receptor");
    await this.routing.teardown(iface);
    await this.tunnel.down();
  }

  private outInterface(): string {
    return process.env.VSN_RECEPTOR_OUT_IFACE ?? "eth0";
  }
}
