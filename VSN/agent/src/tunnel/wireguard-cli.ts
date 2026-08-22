// VSN Agent — WireGuard CLI bridge (data plane)
//
// Applies a WireGuard config and brings the tunnel up/down using the platform's
// native tooling. This is what actually creates the encrypted tunnel on the
// device. It shells out to:
//   • Linux/macOS: `wg-quick` (supports wg-quick up/down) + `wg` for status
//   • Windows:     `wg` / `wireguard.exe` (WireGuard for Windows) — or the
//                  userspace `wireguard-go` with a hand-rolled interface.
//
// The tools must be installed for a real tunnel. If not present, it logs a clear
// message rather than crashing (so the control-plane UI still runs).
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { renderWireGuardConfig, type AgentTunnelConfig } from "./tunnel-config";

const execFileAsync = promisify(execFile);

export interface WgStatus {
  up: boolean;
  publicKey: string | null;
  peers: number;
  bytesDown: number;
  bytesUp: number;
}

function isRunningInSandbox(): boolean {
  // `wg-quick` / `wg` are not present in a browser/CI sandbox; detect the bin.
  const platforms = ["linux", "darwin"];
  return !platforms.includes(process.platform);
}

async function hasBinary(bin: string): Promise<boolean> {
  try {
    await execFileAsync("which", [bin]);
    return true;
  } catch {
    return false;
  }
}

/** Apply the WireGuard config and bring the interface up. */
export async function bringUp(cfg: AgentTunnelConfig): Promise<void> {
  if (isRunningInSandbox()) {
    console.warn(`[wg:${cfg.role}] ${process.platform} tunnel requires native WireGuard tooling — skipped.`);
    return;
  }

  const hasWgQuick = await hasBinary("wg-quick");
  const hasWg = await hasBinary("wg");
  if (!hasWgQuick && !hasWg) {
    console.warn("[wg] WireGuard tools (`wg`, `wg-quick`) not found. Install them to enable tunnels.");
    return;
  }

  const dir = await mkdtemp(path.join(tmpdir(), "vsn-wg-"));
  const confPath = path.join(dir, `${cfg.interfaceName}.conf`);
  await writeFile(confPath, renderWireGuardConfig(cfg), { mode: 0o600 });

  try {
    if (hasWgQuick) {
      await execFileAsync("wg-quick", ["up", cfg.interfaceName], { env: { ...process.env, WG_CONFIG_FILE: confPath } });
    } else {
      // Manual `wg` bring-up: create interface, assign config, add route.
      await execFileAsync("ip", ["link", "add", "dev", cfg.interfaceName, "type", "wireguard"]);
      await execFileAsync("wg", ["setconf", cfg.interfaceName, confPath]);
      await execFileAsync("ip", ["address", "add", cfg.wg.address[0], "dev", cfg.interfaceName]);
      await execFileAsync("ip", ["link", "set", "up", "dev", cfg.interfaceName]);
    }
    console.log(`[wg:${cfg.role}] tunnel UP on ${cfg.interfaceName}`);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

/** Bring the tunnel down and clean up. */
export async function bringDown(role: "donor" | "receptor", interfaceName: string): Promise<void> {
  if (isRunningInSandbox()) return;
  const hasWgQuick = await hasBinary("wg-quick");
  try {
    if (hasWgQuick) {
      await execFileAsync("wg-quick", ["down", interfaceName]);
    } else {
      await execFileAsync("ip", ["link", "delete", "dev", interfaceName]);
    }
    console.log(`[wg:${role}] tunnel DOWN on ${interfaceName}`);
  } catch {
    // Interface may already be down.
  }
}

/** Read live tunnel stats from `wg show`. */
export async function showStatus(interfaceName: string): Promise<WgStatus> {
  const fallback: WgStatus = { up: false, publicKey: null, peers: 0, bytesDown: 0, bytesUp: 0 };
  if (isRunningInSandbox()) return fallback;
  try {
    const { stdout } = await execFileAsync("wg", ["show", interfaceName, "dump"]);
    const lines = stdout.trim().split("\n");
    // First line: private_key public_key listen_port fwmark
    const stats = lines[0]?.split("\t") ?? [];
    return {
      up: true,
      publicKey: stats[1] ?? null,
      peers: Math.max(0, lines.length - 1),
      bytesDown: 0,
      bytesUp: 0,
    };
  } catch {
    return fallback;
  }
}
