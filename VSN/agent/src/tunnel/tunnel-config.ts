// VSN Agent — Tunnel config types + WireGuard config generation
export type Role = "donor" | "receptor";

export interface WireGuardPeerConfig {
  publicKey: string;
  presharedKey?: string;
  allowedIPs: string[];
  endpoint?: string;
  persistentKeepalive?: number;
}

export interface WireGuardInterfaceConfig {
  privateKey: string;
  address: string[]; // e.g. ["10.0.0.2/32"]
  listenPort?: number;
  mtu?: number;
  peers: WireGuardPeerConfig[];
}

export interface AgentTunnelConfig {
  role: Role;
  interfaceName: string;
  wg: WireGuardInterfaceConfig;
}

/** Build a WireGuard config file (INI, `wg-quick`-compatible) from config. */
export function renderWireGuardConfig(cfg: AgentTunnelConfig): string {
  const lines: string[] = ["[Interface]"];
  lines.push(`PrivateKey = ${cfg.wg.privateKey}`);
  lines.push(`Address = ${cfg.wg.address.join(", ")}`);
  if (cfg.wg.listenPort) lines.push(`ListenPort = ${cfg.wg.listenPort}`);
  if (cfg.wg.mtu) lines.push(`MTU = ${cfg.wg.mtu}`);
  for (const peer of cfg.wg.peers) {
    lines.push("", "[Peer]");
    lines.push(`PublicKey = ${peer.publicKey}`);
    if (peer.presharedKey) lines.push(`PresharedKey = ${peer.presharedKey}`);
    lines.push(`AllowedIPs = ${peer.allowedIPs.join(", ")}`);
    if (peer.endpoint) lines.push(`Endpoint = ${peer.endpoint}`);
    if (peer.persistentKeepalive) lines.push(`PersistentKeepalive = ${peer.persistentKeepalive}`);
  }
  return lines.join("\n");
}
