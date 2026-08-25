# VSN — Installing WireGuard on a Host (OS-by-OS Guide)

This guide explains **how to install WireGuard on each host OS** and **what to
choose**, so VSN's data plane can actually bring the tunnel up. VSN itself
generates the Curve25519 keys; the OS WireGuard tooling is what applies the
config and creates the tunnel interface.

> **TL;DR — what to choose:**
>
> - **Linux (recommended for VSN host/donor)** → the **in-kernel WireGuard**
>   module + `wireguard-tools` (`wg`, `wg-quick`). Best performance.
> - **macOS** → **`wireguard-go`** via Homebrew + `wireguard-tools` (or the
>   WireGuard app's command-line tools).
> - **Windows** → **WireGuard for Windows** (installer gives `wg.exe` + Wintun).
> - **Android / Samsung** → the **WireGuard app** (or VSN's built-in VpnService),
>   no root needed.
>
> For **VSN donor** mode on a computer, **Linux + kernel WireGuard** is the
> easiest and most capable (routing + NAT + firewall). On a phone, use the
> VpnService path.

---

## 1. What WireGuard actually is (and what you install)

WireGuard is a **protocol** (encrypted tunnel). Each OS provides a way to run it:

| Component              | What it is                                                                                                                  | Needed?                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| **WireGuard engine**   | Runs the crypto + tunnel. Either a **kernel module** (Linux/macOS) or a **userspace daemon** (`wireguard-go`, `boringtun`). | Required                  |
| **`wg` tool**          | Configures the interface: add peers, set private/public keys, dump stats.                                                   | Required                  |
| **`wg-quick`**         | Helper that wraps `wg` to set up interface + routing + DNS automatically.                                                   | Recommended (VSN uses it) |
| **Virtual NIC driver** | The interface packets go through. **tun/tap** (Linux), **utun** (macOS), **Wintun** (Windows), **VpnService** (Android).    | Required                  |

VSN generates the **private/public/preshared keys** for you (in the agent), but
the OS **engine + tools** must be installed for the tunnel to come up.

---

## 2. Linux (recommended for donor/VSN host)

**Choose:** the in-kernel WireGuard module (fastest) + `wireguard-tools`.

### Ubuntu / Debian

```bash
sudo apt update
sudo apt install wireguard wireguard-tools   # pulls the kernel module + wg/wg-quick
```

The kernel module is usually already built in. Verify:

```bash
sudo modprobe wireguard
lsmod | grep wireguard        # should show wireguard
which wg wg-quick             # /usr/bin/wg  /usr/bin/wg-quick
```

### Fedora / RHEL

```bash
sudo dnf install wireguard-tools
sudo modprobe wireguard
```

### Arch

```bash
sudo pacman -S wireguard-tools
```

### Or use userspace engine (no kernel module, e.g. on a VPS without it)

```bash
# wireguard-go — userspace implementation
curl -sSL https://github.com/WireGuard/wireguard-go/releases/download/v0.0.20230223/wireguard-go-linux-amd64.tar.gz | tar xz
sudo install -m 0755 wireguard-go /usr/local/bin/wireguard-go
sudo apt install wireguard-tools   # still need wg/wg-quick
```

### What you need for privileges (donor)

WireGuard interface + routing + firewall need `CAP_NET_ADMIN` / root:

```bash
sudo setcap cap_net_admin,cap_net_raw+ep /usr/bin/wg
# or run the VSN agent as root / via sudo.
```

---

## 3. macOS

**Choose:** `wireguard-go` (userspace) + `wireguard-tools` (via Homebrew), or the
official WireGuard app.

### Option A — Homebrew (recommended)

```bash
brew install wireguard-tools         # gives wg + wg-quick
# wireguard-go comes with the WireGuard app; or install the userspace engine:
brew install wireguard-go
```

Verify:

```bash
which wg wg-quick
```

### Option B — the WireGuard.app

Install from https://www.wireguard.com/install/ (Apple Silicon/Intel). It
installs `wg`/`wg-quick` and a Network Extension tunnel. VSN can use
`wg-quick` once it's installed.

### TUN

macOS uses the built-in **utun** device — no extra driver needed.

---

## 4. Windows

**Choose:** **WireGuard for Windows** (installs `wg.exe` + the **Wintun** driver).

### Install

1. Download from https://www.wireguard.com/install/ — the MSI/installer.
2. Run the installer (it installs `wg.exe` and registers the **Wintun** driver).
3. Verify in PowerShell:

```powershell
Get-Command wg          # C:\Program Files\WireGuard\wg.exe
```

4. The `wg-quick` equivalent is available in `C:\Program Files\WireGuard\`.

### For VSN

- The desktop shell (`apps/desktop`) + agent use `wg` (WireGuard for Windows).
- VSN runs the tunnel via the userspace engine and the **Wintun** virtual NIC.
- Donor mode needs **Administrator** privileges for routing/ICS.

---

## 5. Android / Samsung

**Choose:** the **WireGuard app** (or VSN's built-in `VpnService`).

### Option A — the WireGuard app (for testing/manual)

1. Install from the Play Store ("WireGuard" by WireGuard).
2. It uses **`wireguard-go`** + Android's **VpnService** — **no root needed**.
3. You can import a `.conf` VSN generates.

### Option B — VSN's own app (`apps/android`)

- VSN's Android app already wraps `VpnService` (`VsnVpnService.kt`) and uses
  `wireguard-android` (userspace `wireguard-go`).
- Just run the VSN app and allow the **VPN** prompt.
- This is the recommended path — no manual WirelessGuard install.

> **Important:** On Android, the VpnService _receives_ traffic into the tunnel
> (receptor). Full **donor-side NAT** (sharing a phone's connection to others)
> typically needs **root** or a custom kernel because Android restricts interface
> forwarding. For casual donor sharing on Android, use the desktop donor instead.

---

## 6. iOS / iPadOS

**Choose:** Apple's **Network Extension** path (not a generic TUN).

- Requires `NEPacketTunnelProvider`. VSN has this as a **planned** platform
  (`agent/platforms/`). Install the WireGuard app for iOS as the engine, or build
  VSN as a Network Extension app. **Not yet implemented** in this repo.

---

## 7. What should YOU choose? (decision guide)

| Situation                                     | Recommended                                                              |
| --------------------------------------------- | ------------------------------------------------------------------------ |
| **VSN host running as a Donor** (laptop/PC)   | Linux + kernel WireGuard + `wireguard-tools` (best routing/NAT/firewall) |
| **VSN desktop on Windows**                    | WireGuard for Windows (Wintun)                                           |
| **VSN desktop on macOS**                      | `wireguard-go` + `wireguard-tools` via Homebrew                          |
| **VSN Receptor on a phone (Android/Samsung)** | VSN app's built-in VpnService (no root)                                  |
| **VSN Donor on a phone**                      | Best-effort; full NAT needs root. Use a desktop Donor.                   |
| **VPS/relay server**                          | Kernel WireGuard + `wireguard-tools`                                     |
| **Sandbox/CI**                                | Skip (VSN prints a clear message and no-ops)                             |

### Why Linux + kernel WireGuard for the donor is best:

1. **Performance** — kernel module is faster than userspace.
2. **Full NAT + routing control** — `iptables`/`ip` make donor sharing + LAN
   isolation straightforward.
3. **`wg-quick`** handles the interface, routes, and DNS automatically — exactly
   what VSN's `wireguard-cli.ts` calls.

---

## 8. Verify your installation

```bash
# Linux/macOS
wg --version
wg-quick --version
# Should print WireGuard tools version.

# Windows
wg --version

# Android
# Check VSN app shows the VPN connection in the system status bar.
```

Then confirm the engine is available:

```bash
# Linux kernel module
sudo modprobe wireguard && sudo wg show

# userspace
which wireguard-go
```

---

## 9. Enabling it for VSN

1. Install the tools above for your OS.
2. Run the VSN agent (`VSN_AGENT_ROLE=donor npm run agent` in `VSN/`).
3. VSN generates its **Curve25519 keys** automatically and calls `wg-quick up`.
4. If the tools are missing, VSN logs a warning instead of crashing (so the
   control-plane UI still works).

### Files that use the tools

- `agent/src/tunnel/wireguard-cli.ts` — `wg-quick up/down`, `wg show`.
- `agent/src/network/routing-manager.ts` — `ip route`, `iptables` (donor isolation).
- `agent/src/network/nat-manager.ts` — `iptables -t nat` MASQUERADE.
- `agent/src/network/interface-manager.ts` — `ip tuntap` (Linux TUN).
