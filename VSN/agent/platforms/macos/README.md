# VSN Agent — macOS

## Tunnel engine
- In-kernel WireGuard is available on recent macOS; fallback to `wireguard-go`.

## TUN adapter
- **utun** interface (Apple). The Agent creates a `utunN` device and configures
  routing into it.

## Routing
- Use `route add -net default` into the utun, or Network Extension.

## Notes
- Requires a Network Extension (NEPacketTunnelProvider) or root privileges
  for TUN/routing operations.
