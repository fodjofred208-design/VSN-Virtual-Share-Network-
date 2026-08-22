// VSN Agent — Tunnel client (data plane)
// Real WireGuard integration: builds the interface config and drives the
// platform CLI (wg-quick / wg) to bring the tunnel up/down. Also generates the
// device keypair and a per-session preshared key.
import type { AgentTunnelConfig } from "./tunnel-config";
import { bringUp, bringDown, showStatus, type WgStatus } from "./wireguard-cli";
import { generateKeyPair, generatePresharedKey } from "./wireguard-keys";

export class TunnelClient {
  private readonly cfg: AgentTunnelConfig;
  private upFlag = false;
  private readonly keyPair = generateKeyPair();
  private readonly presharedKey = generatePresharedKey();

  constructor(cfg: AgentTunnelConfig) {
    this.cfg = cfg;
  }

  /** Generate the device identity (public key is given to the control plane). */
  getPublicKey(): string {
    return this.keyPair.publicKey;
  }

  getPrivateKey(): string {
    return this.keyPair.privateKey;
  }

  getPresharedKey(): string {
    return this.presharedKey;
  }

  /** Bring up the virtual interface + start the WireGuard tunnel. */
  async start(): Promise<void> {
    // Inject this device's generated identity into the config before applying.
    this.cfg.wg.privateKey = this.keyPair.privateKey;
    if (!this.cfg.wg.peers.some((p) => p.presharedKey)) {
      this.cfg.wg.peers = this.cfg.wg.peers.map((p) => ({ ...p, presharedKey: this.presharedKey }));
    }
    await bringUp(this.cfg);
    this.upFlag = true;
  }

  async stop(): Promise<void> {
    await bringDown(this.cfg.role, this.cfg.interfaceName);
    this.upFlag = false;
  }

  isUp(): boolean {
    return this.upFlag;
  }

  async status(): Promise<WgStatus> {
    return showStatus(this.cfg.interfaceName);
  }
}
