// VSN Agent — Virtual network interface manager (data plane)
// Creates/removes the TUN adapter used by the tunnel. OS-specific adapters live
// in agent/platforms (Wintun on Windows, utun on macOS, tun/tap on Linux,
// VpnService on Android, NEPacketTunnelProvider on iOS).
export interface InterfaceAdapter {
  create(name: string): Promise<void>;
  delete(name: string): Promise<void>;
  isPresent(name: string): boolean;
}

export class InterfaceManager {
  private adapters: InterfaceAdapter[] = [];

  setAdapter(adapter: InterfaceAdapter): void {
    this.adapters.push(adapter);
  }

  async up(name: string): Promise<void> {
    for (const a of this.adapters) {
      if (!a.isPresent(name)) await a.create(name);
    }
  }

  async down(name: string): Promise<void> {
    for (const a of this.adapters) {
      if (a.isPresent(name)) await a.delete(name);
    }
  }
}
