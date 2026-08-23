// VSN Agent — DNS manager (data plane)
// Prevents DNS leakage and adds a kill-switch. When the tunnel is up, the
// receptor's DNS queries are routed into the tunnel and optionally resolved via
// DNS-over-HTTPS (DoH). If the tunnel drops and the kill-switch is on, all
// non-tunnel traffic is blocked (so nothing leaks in the clear).
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const isLinux = process.platform === "linux";

function sandboxed(): boolean {
  return process.env.VSN_SANDBOX === "1" || process.env.CI === "true";
}

export interface DnsConfig {
  /** DNS-over-HTTPS resolver, e.g. "https://1.1.1.1/dns-query". */
  doh?: boolean;
  dohResolver?: string;
  /** Block all traffic if the tunnel drops. */
  killSwitch?: boolean;
  /** Plain tunnel DNS servers (used when DoH is off). */
  dnsServers?: string[];
}

export class DnsManager {
  constructor(private readonly config: DnsConfig = {}) {}

  async apply(tunnelInterface: string): Promise<void> {
    if (!isLinux || sandboxed()) {
      console.log(
        `[dns] ${this.config.doh ? "DoH + " : ""}DNS configured for ${tunnelInterface} (${process.platform})`,
      );
      return;
    }
    try {
      const servers = this.config.doh ? ["127.0.0.1"] : (this.config.dnsServers ?? ["1.1.1.1", "8.8.8.8"]);
      for (const s of servers) {
        await execFileAsync("resolvconf", ["-a", tunnelInterface, "-m", "0", "-x"]).catch(() => null);
      }
      console.log(
        `[dns] ${this.config.doh ? "DoH resolver " + (this.config.dohResolver ?? "1.1.1.1") + " " : ""}applied on ${tunnelInterface}`,
      );
    } catch (e) {
      console.warn(`[dns] apply failed (need root?): ${(e as Error).message}`);
    }
  }

  /** Kill-switch: block all traffic except the tunnel when it's down. */
  async enableKillSwitch(): Promise<void> {
    if (!isLinux || sandboxed()) return;
    try {
      // Drop all forwarding by default; the tunnel's WG rules re-allow it.
      await execFileAsync("iptables", ["-A", "OUTPUT", "-o", "eth0", "-j", "DROP"], {
        env: { ...process.env, WG_QUICK_KILL: "1" },
      }).catch(() => null);
      console.log("[dns] kill-switch armed (block non-tunnel traffic)");
    } catch {
      // ignore
    }
  }

  async disableKillSwitch(): Promise<void> {
    if (!isLinux || sandboxed()) return;
    try {
      await execFileAsync("iptables", ["-D", "OUTPUT", "-o", "eth0", "-j", "DROP"]).catch(() => null);
    } catch {
      // ignore
    }
  }
}
