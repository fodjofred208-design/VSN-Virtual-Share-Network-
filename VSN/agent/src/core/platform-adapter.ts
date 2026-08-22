// VSN Agent — Platform adapter selector (data plane)
// Chooses the OS-specific networking primitives so the rest of the agent is
// platform-agnostic. Each platform provides:
//   • interfaceName / address scheme for the virtual NIC
//   • the tooling used to bring the WireGuard tunnel up/down
import os from "node:os";

export interface PlatformAdapter {
  platform: string;
  interfaceName: (role: "donor" | "receptor") => string;
  address: string[]; // default tunnel subnet per-role
  listenPort?: number;
  /** Human description of the tunnel engine used on this OS. */
  engine: string;
  /** The virtual NIC / driver name on this OS. */
  nic: string;
  requirements: string[];
}

const LINUX: PlatformAdapter = {
  platform: "linux",
  interfaceName: (role) => (role === "donor" ? "vsn-donor0" : "vsn-receptor0"),
  address: ["10.0.0.2/32"], // receptor endpoint; donor uses .1
  engine: "wireguard (kernel module) or wireguard-go (userspace)",
  nic: "tun/tap",
  requirements: ["wireguard-tools (wg, wg-quick)", "iproute2 (ip)", "CAP_NET_ADMIN / root"],
};

const MACOS: PlatformAdapter = {
  platform: "darwin",
  interfaceName: (role) => (role === "donor" ? "vsn-donor0" : "vsn-receptor0"),
  address: ["10.0.0.2/32"],
  engine: "wireguard-go (userspace) or in-kernel WireGuard (macOS 11+)",
  nic: "utun",
  requirements: ["wireguard-tools", "Network Extension / root"],
};

const WINDOWS: PlatformAdapter = {
  platform: "win32",
  interfaceName: (role) => (role === "donor" ? "VSNDonor" : "VSNReceptor"),
  address: ["10.0.0.2/32"],
  engine: "wireguard-go (userspace) + WireGuard for Windows driver",
  nic: "Wintun",
  requirements: ["WireGuard for Windows / wireguard-go", "Wintun driver", "Administrator"],
};

const ANDROID: PlatformAdapter = {
  platform: "android",
  interfaceName: (role) => (role === "donor" ? "vsn-donor" : "vsn-receptor"),
  address: ["10.0.0.2/32"],
  engine: "wireguard-go (userspace) via VpnService",
  nic: "VpnService (no root)",
  requirements: ["VSN Android app", "VpnService consent", "wireguard-android"],
};

const IOS: PlatformAdapter = {
  platform: "ios",
  interfaceName: (role) => (role === "donor" ? "vsn-donor0" : "vsn-receptor0"),
  address: ["10.0.0.2/32"],
  engine: "wireguard-go (userspace) via Network Extension",
  nic: "NEPacketTunnelProvider",
  requirements: ["Network Extension entitlement", "wireguard-go (iOS)", "VSN iOS app"],
};

const ADAPTERS: Record<string, PlatformAdapter> = {
  linux: LINUX,
  darwin: MACOS,
  win32: WINDOWS,
  android: ANDROID,
  ios: IOS,
};

export function getPlatformAdapter(): PlatformAdapter {
  // `process.platform` is `android` only inside the Android runtime; on a host
  // the mobile app supplies its own adapter via env. Fall back to linux.
  const key = (process.env.VSN_PLATFORM as string) ?? process.platform;
  return ADAPTERS[key] ?? LINUX;
}
