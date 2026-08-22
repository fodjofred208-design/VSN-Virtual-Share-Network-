# VSN Agent — Android

## Tunnel engine
- **`wireguard-go`** (userspace) — the Android kernel does not expose a tun/tap
  device directly.

## TUN adapter
- **VpnService API**: the app supplies the tunnel via `VpnService.Builder`.
  Android routes allowed traffic into the virtual adapter; no root required.

## Routing
- Declare the receptor's allowed routes in the VpnService builder so Android
  routes the default route into the tunnel.

## Notes
- The VSN Agent on Android is delivered as a foreground service that holds the
  VpnService with `FOREGROUND_SERVICE` permission.
- No root needed; uses `VpnService.PROTECTED_NETWORKS`.
