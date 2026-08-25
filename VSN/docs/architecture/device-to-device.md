# VSN — Device-to-Device (Cross-Platform) Architecture

VSN is designed to run as a real application on **every** device — desktops
(Windows, macOS, Linux) and phones (Android, including Samsung). The same core
works across all of them; only the platform-specific data-plane integration
differs.

## Supported platforms & shells

| Platform          | Shell                       | Data plane                                  | Apps          |
| ----------------- | --------------------------- | ------------------------------------------- | ------------- |
| Windows           | Electron (`apps/desktop`)   | `agent/` + Wintun + WireGuard               | `VSN` desktop |
| macOS             | Electron (`apps/desktop`)   | `agent/` + utun + WireGuard                 | `VSN` desktop |
| Linux             | Electron (`apps/desktop`)   | `agent/` + tun + WireGuard                  | `VSN` desktop |
| Android / Samsung | Native app (`apps/android`) | `VsnVpnService` (VpnService + wireguard-go) | `VSN` Android |
| iOS               | (future)                    | NEPacketTunnelProvider                      | (future)      |

## Laptop ↔ Laptop

```
+---------------------------+          +---------------------------+
|  Laptop A (Donor)         |          |  Laptop B (Receptor)      |
|  Electron shell           |          |  Electron shell           |
|   ├─ VSN control app      |          |   ├─ VSN control app      |
|   └─ Agent (WireGuard)    |◄─ tunnel ─►|   └─ Agent (WireGuard)  |
+---------------------------+          +---------------------------+
          │ control API                       │ control API
          └──────────┬────────────────────────┘
                     ▼
            VSN Control Server  (Next.js)
```

Both desktops run the Electron app. The donor starts its agent (WireGuard) and
registers; the receptor discovers the donor (via the control plane) and
connects. The control plane signals; the two agents establish the encrypted
tunnel directly (STUN/ICE hole punch) or via relay. Laptop A's connection is
NAT'd out to the Internet for Laptop B.

## Phone ↔ Phone

```
+---------------------------+          +---------------------------+
|  Phone A (Donor)          |          |  Phone B (Receptor)       |
|  Android app              |          |  Android app              |
|   ├─ WebView control UI   |          |   ├─ WebView control UI   |
|   └─ VpnService+WireGuard |◄─ tunnel ─►|   └─ VpnService+WireGuard|
+---------------------------+          +---------------------------+
          │ control API                       │ control API
          └──────────┬────────────────────────┘
                     ▼
            VSN Control Server (Next.js)
```

Both phones run the native Android app. The donor's `VsnVpnService` forwards
traffic; the receptor's `VsnVpnService` captures its traffic into the tunnel.
Android's `VpnService` gives the tunnel a real virtual NIC without root.

## Mixed (Laptop ↔ Phone)

Exactly the same control-plane flow. The difference is only which data-plane
adapter each side uses: the laptop runs the `agent/` (Wintun/utun/tun), the
phone runs `VpnService`. They interoperate because both use the **same WireGuard
protocol** and the **same signaling contracts** in `protocol/`.

## What makes them interoperable

- **Shared protocol** — `VSN/protocol/` (types + messages) is used by the
  desktop agent, the mobile app, and the control server.
- **Same tunnel** — WireGuard (ChaCha20-Poly1305) on every platform.
- **Same control plane** — one Next.js server handles discovery, signaling,
  sessions, auth, and statistics for all devices.
- **Role symmetry** — donor and receptor logic is identical regardless of OS.

## How to build each shell

- **Desktop (Electron):** see `apps/desktop/README.md`
  (`npm run dist` → installers for Windows/macOS/Linux).
- **Android:** see `apps/android/README.md`
  (`./gradlew assembleDebug` → APK for Android/Samsung).

## Platform caveats

- **Desktop donor + routing/NAT** requires elevated privileges (admin/root) to
  configure the virtual NIC, routes, and firewall.
- **Android donor** sharing is constrained by the OS: without root, the
  recipient can use the donor's tunnel, but the donor can't easily masquerade
  arbitrary LAN traffic — the `VpnService` model is designed for the
  receptor/client side. Full donor-side NAT on Android typically needs root or a
  custom kernel.
- **iOS** lacks a generic TUN for third-party VPNs; it requires
  `NEPacketTunnelProvider` (planned, not yet implemented).

## Conclusion

VSN is already architected to be a **cross-platform application**, not just a
web app. The control plane and protocol are shared; each platform gets its own
thin shell + data-plane adapter. The existing `agent/` (desktop) and new
`apps/android` (mobile) provide the per-platform data planes, and they
interoperate peer-to-peer over the same WireGuard tunnel.
