# VSN Agent — iOS / iPadOS

## Tunnel engine
- **`wireguard-go`** (userspace) — iOS does not expose a generic tun/tap device.
  WireGuard for iOS ships its own userspace engine.

## TUN adapter
- **`NEPacketTunnelProvider`** — Apple's Network Extension for packet tunnels.
  The VSN iOS app creates a tunnel via a `PacketTunnelProvider` subclass and
  `NETunnelProviderProtocol`.

## Routing
- Declare the receptor's routes in the `NETunnelProviderProtocol` so iOS routes
  traffic into the tunnel.

## Requirements
- **Network Extension entitlement** (Apple Developer).
- `wireguard-go` compiled for iOS (arm64 / simulator).
- A VSN iOS app that hosts the extension.

## Notes
- This is a **scaffold/integration guide**; the Swift/Objective-C extension is
  built in Xcode. The agent core (`agent/src`) is shared and drives the same
  WireGuard tunnel config that this platform applies via Network Extension.
- Donor-side NAT on iOS is **not** supported by the OS in the same way as
  desktop; iOS is best used as a **Receptor**.
