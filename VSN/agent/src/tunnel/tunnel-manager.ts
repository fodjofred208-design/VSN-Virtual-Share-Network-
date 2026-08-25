// VSN Agent — Tunnel manager (data plane)
// Platform-agnostic orchestration over the real WireGuard client. The OS-specific
// adapter details (Wintun, utun, tun, VpnService, NEPacketTunnelProvider) are
// handled in agent/platforms and by wg-quick/wireguard-go.
import type { Role } from "./tunnel-config";
import { TunnelClient } from "./tunnel-client";
import type { WgStatus } from "./wireguard-cli";

export interface TunnelStatus {
  up: boolean;
  role: string;
  interfaceName: string | null;
  publicKey: string | null;
  peers: number;
  bytesTransferredDown: number;
  bytesTransferredUp: number;
}

export interface TunnelManagerOptions {
  role: "donor" | "receptor";
  address?: string[]; // e.g. ["10.0.0.2/32"]
  listenPort?: number;
  interfaceName?: string;
}

export class TunnelManager {
  private readonly role: Role;
  private readonly client: TunnelClient;
  private readonly interfaceName: string;
  private readonly address: string[];
  private upFlag = false;

  constructor(opts: TunnelManagerOptions) {
    this.role = opts.role;
    this.interfaceName = opts.interfaceName ?? (this.role === "donor" ? "vsn-donor0" : "vsn-receptor0");
    this.address = opts.address ?? ["10.0.0.2/32"];
    this.client = new TunnelClient({
      role: this.role,
      interfaceName: this.interfaceName,
      wg: {
        privateKey: "",
        address: this.address,
        listenPort: opts.listenPort ?? (this.role === "donor" ? 51820 : undefined),
        peers: [],
      },
    });
  }

  /** Public key to register with the control plane (donor) / to connect (receptor). */
  getPublicKey(): string {
    return this.client.getPublicKey();
  }

  async up(): Promise<void> {
    await this.client.start();
    this.upFlag = true;
  }

  async down(): Promise<void> {
    await this.client.stop();
    this.upFlag = false;
  }

  async status(): Promise<TunnelStatus> {
    const s: WgStatus = await this.client.status();
    return {
      up: this.upFlag || s.up,
      role: this.role,
      interfaceName: this.upFlag ? this.interfaceName : null,
      publicKey: this.client.getPublicKey(),
      peers: s.peers,
      bytesTransferredDown: s.bytesDown,
      bytesTransferredUp: s.bytesUp,
    };
  }
}
