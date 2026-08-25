// VSN Agent — Donor manager (data plane)
// Registers the device as a donor and manages sharing of its connectivity:
// tunnel namespace → NAT masquerade → donor isolation firewall.
import { ControlClient } from "../api/control-client";
import { TunnelManager } from "../tunnel/tunnel-manager";
import { NatManager } from "../network/nat-manager";
import { RoutingManager } from "../network/routing-manager";
import { collectNetworkInfo } from "../network/network-info";
import { getPlatformAdapter } from "./platform-adapter";

export class DonorManager {
  readonly tunnel: TunnelManager;
  readonly control: ControlClient;
  readonly nat: NatManager;
  readonly routing: RoutingManager;
  private readonly adapter = getPlatformAdapter();
  private readonly outInterface: string;

  constructor(control: ControlClient) {
    this.control = control;
    this.tunnel = new TunnelManager({ role: "donor", interfaceName: this.adapter.interfaceName("donor") });
    this.nat = new NatManager("donor");
    this.routing = new RoutingManager("donor");
    // In production the donor picks the interface that has Internet (e.g. wlan0).
    this.outInterface = process.env.VSN_DONOR_OUT_IFACE ?? "eth0";
  }

  getPublicKey(): string {
    return this.tunnel.getPublicKey();
  }

  async register(): Promise<void> {
    const info = await collectNetworkInfo();
    // In production: POST /api/donors/register with the WG public key + network info.
    console.log(`[donor] registering in ${info.countryCode} (${info.connectionType})`);
  }

  async startSharing(): Promise<void> {
    const iface = this.adapter.interfaceName("donor");
    await this.tunnel.up();
    // Routes + NAT + isolation firewall (Internet Sharing & NAT, Firewall).
    await this.routing.configure(iface, this.outInterface);
    await this.nat.enable(iface, this.outInterface);
  }

  async stopSharing(): Promise<void> {
    const iface = this.adapter.interfaceName("donor");
    await this.nat.disable(iface);
    await this.routing.teardown(iface);
    await this.tunnel.down();
  }
}
