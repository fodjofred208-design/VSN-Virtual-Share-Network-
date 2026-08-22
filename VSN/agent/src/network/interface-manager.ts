// VSN Agent — Virtual network interface manager (data plane)
// Creates/removes the TUN adapter used by the tunnel. OS-specific adapters live
// per platform (Wintun on Windows, utun on macOS, tun/tap on Linux, VpnService
// on Android, NEPacketTunnelProvider on iOS). On Linux it uses `ip tuntap`.
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const isLinux = process.platform === "linux";

function sandboxed(): boolean {
  return process.env.VSN_SANDBOX === "1" || process.env.CI === "true";
}

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
    if (!isLinux || sandboxed()) {
      console.log(`[iface] would create TUN ${name} (${process.platform})`);
      return;
    }
    try {
      await execFileAsync("ip", ["tuntap", "add", "dev", name, "mode", "tun"]);
      await execFileAsync("ip", ["link", "set", "dev", name, "up"]);
      console.log(`[iface] created TUN ${name}`);
    } catch (e) {
      console.warn(`[iface] create failed (need root?): ${(e as Error).message}`);
    }
  }

  async down(name: string): Promise<void> {
    if (!isLinux || sandboxed()) return;
    try {
      await execFileAsync("ip", ["link", "del", "dev", name]);
    } catch {
      // ignore
    }
  }
}
