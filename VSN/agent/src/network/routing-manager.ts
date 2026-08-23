// VSN Agent — Routing manager (data plane)
// Receptor: routes 0.0.0.0/0 into the tunnel (all traffic through the donor).
// Donor: masquerades tunnel traffic + installs an ISOLATION firewall so the
// receptor gets Internet but NEVER access to the donor's LAN.
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const isLinux = process.platform === "linux";

function sandboxed(): boolean {
  return process.env.VSN_SANDBOX === "1" || process.env.CI === "true";
}

export class RoutingManager {
  constructor(private readonly role: "donor" | "receptor") {}

  /** Configure kernel routes for the tunnel. */
  async configure(tunnelInterface: string, gatewayInterface: string): Promise<void> {
    if (this.role === "receptor") {
      if (isLinux && !sandboxed()) {
        try {
          // Route all traffic into the tunnel.
          await execFileAsync("ip", ["route", "add", "default", "dev", tunnelInterface]);
          // Don't let the tunnel route its own traffic back into itself.
          await execFileAsync("ip", ["route", "add", "10.0.0.0/24", "dev", tunnelInterface]);
          console.log(`[routing:receptor] default route added via ${tunnelInterface}`);
        } catch (e) {
          console.warn(`[routing:receptor] route add failed: ${(e as Error).message}`);
        }
      } else {
        console.log(`[routing:receptor] would add default route via ${tunnelInterface}`);
      }
    } else {
      // Donor: masquerade handled by NatManager; add LAN-isolation rules.
      await this.isolateDonorLan(tunnelInterface, gatewayInterface);
    }
  }

  /**
   * Donor-side isolation: the receptor may reach the Internet through the
   * tunnel, but must NEVER reach the donor's LAN (router admin, SSH, files,
   * mDNS, etc.). This is the "Firewall & Network Security" permission.
   */
  private async isolateDonorLan(tunnelInterface: string, lanInterface: string): Promise<void> {
    if (isLinux && !sandboxed()) {
      try {
        // Drop any traffic from the tunnel that is addressed to the donor's LAN
        // on the LAN interface (prevents LAN scanning / access from the tunnel).
        await execFileAsync("iptables", [
          "-A",
          "FORWARD",
          "-i",
          tunnelInterface,
          "-o",
          lanInterface,
          "-j",
          "DROP",
        ]);
        // Accept established/related replies and tunnel→internet (added by NAT).
        await execFileAsync("iptables", [
          "-A",
          "FORWARD",
          "-i",
          tunnelInterface,
          "-o",
          lanInterface,
          "-m",
          "state",
          "--state",
          "ESTABLISHED,RELATED",
          "-j",
          "ACCEPT",
        ]);
        // Block mDNS/LLMNR from the tunnel (prevents service discovery).
        await execFileAsync("iptables", [
          "-A",
          "FORWARD",
          "-i",
          tunnelInterface,
          "-p",
          "udp",
          "--dport",
          "5353",
          "-j",
          "DROP",
        ]);
        console.log(`[routing:donor] LAN isolation firewall active on ${lanInterface}`);
      } catch (e) {
        console.warn(`[routing:donor] isolation firewall failed (need root?): ${(e as Error).message}`);
      }
    } else {
      console.log(`[routing:donor] would isolate donor LAN from tunnel (${lanInterface})`);
    }
  }

  async teardown(tunnelInterface: string): Promise<void> {
    if (isLinux && !sandboxed()) {
      try {
        await execFileAsync("ip", ["route", "del", "default", "dev", tunnelInterface]).catch(() => null);
        await execFileAsync("iptables", ["-D", "FORWARD", "-i", tunnelInterface, "-j", "DROP"]).catch(
          () => null,
        );
      } catch {
        // ignore
      }
    }
    console.log(`[routing] flushed routes for ${tunnelInterface}`);
  }
}
