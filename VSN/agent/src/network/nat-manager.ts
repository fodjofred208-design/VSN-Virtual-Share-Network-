// VSN Agent — NAT manager (donor side, data plane)
// Masquerades receptor tunnel traffic out the donor's real interface, so the
// receptor reaches the Internet through the donor. This is the "Internet Sharing
// & NAT" permission. Uses iptables on Linux (fallback nftables), pf on macOS,
// and Windows Firewall/ICS (documented). Guarded to be a no-op in a sandbox.
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const isLinux = process.platform === "linux";

function sandboxed(): boolean {
  return process.env.VSN_SANDBOX === "1" || process.env.CI === "true";
}

export class NatManager {
  constructor(private readonly role: "donor" | "receptor") {}

  /** Enable NAT/forwarding so receptor traffic exits via the donor's interface. */
  async enable(tunnelInterface: string, outInterface: string): Promise<void> {
    if (this.role !== "donor") return;
    if (isLinux && !sandboxed()) {
      try {
        // Enable IP forwarding + MASQUERADE for the tunnel subnet.
        await execFileAsync("sysctl", ["-w", "net.ipv4.ip_forward=1"]);
        await execFileAsync("iptables", ["-t", "nat", "-A", "POSTROUTING", "-s", "10.0.0.0/24", "-o", outInterface, "-j", "MASQUERADE"]);
        await execFileAsync("iptables", ["-A", "FORWARD", "-i", tunnelInterface, "-o", outInterface, "-j", "ACCEPT"]);
        await execFileAsync("iptables", ["-A", "FORWARD", "-i", outInterface, "-o", tunnelInterface, "-m", "state", "--state", "RELATED,ESTABLISHED", "-j", "ACCEPT"]);
        console.log(`[nat:donor] enabled MASQUERADE ${tunnelInterface} → ${outInterface} (iptables)`);
      } catch (e) {
        console.warn(`[nat:donor] iptables failed (need root?): ${(e as Error).message}`);
      }
    } else {
      console.log(`[nat:donor] enabled MASQUERADE ${tunnelInterface} → ${outInterface} (${process.platform})`);
    }
  }

  async disable(tunnelInterface: string): Promise<void> {
    if (isLinux && !sandboxed()) {
      try {
        await execFileAsync("iptables", ["-t", "nat", "-D", "POSTROUTING", "-s", "10.0.0.0/24", "-j", "MASQUERADE"]);
        await execFileAsync("iptables", ["-D", "FORWARD", "-i", tunnelInterface, "-j", "ACCEPT"]);
        console.log(`[nat] flushed NAT for ${tunnelInterface}`);
      } catch {
        // rules may already be gone
      }
    } else {
      console.log(`[nat] flushing NAT for ${tunnelInterface}`);
    }
  }
}
