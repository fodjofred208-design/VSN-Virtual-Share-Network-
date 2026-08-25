# VSN — iOS Application (iPhone / iPad)

Scaffold for the iOS build of VSN. It hosts the control-plane app in a `WKWebView`
and runs the data-plane tunnel via a **Network Extension**
(`VsnPacketTunnelProvider.swift`), using `wireguard-go`.

> This is a **scaffold** — the full iOS app is built in **Xcode** (Swift, iOS 12+).
> The shared agent core (`VSN/agent`) + protocol contracts are reused.

## Stack

| Piece      | Tool                                                                |
| ---------- | ------------------------------------------------------------------- |
| Language   | Swift                                                               |
| UI shell   | `WKWebView` loading the VSN control-plane app                       |
| Data plane | `VsnPacketTunnelProvider` (NEPacketTunnelProvider) + `wireguard-go` |
| Min iOS    | 12                                                                  |

## Key files

| File                            | Role                                  |
| ------------------------------- | ------------------------------------- |
| `VsnPacketTunnelProvider.swift` | Network Extension tunnel (data plane) |
| (add) `ViewController.swift`    | WebView shell                         |
| (add) `Info.plist`              | Network Extension entitlement         |

## Build (in Xcode)

1. Create an iOS App target + a **Packet Tunnel** extension target.
2. Set the **Network Extension entitlement** (Apple Developer account).
3. Add `wireguard-go` (iOS arm64 + simulator).
4. Point the WebView at your VSN control URL.

## Notes

- iOS is best used as a **Receptor** (the OS restricts donor-side NAT).
- See `VSN/agent/platforms/ios/README.md`.

### Android / Samsung / Redmi / Tecno / Xiaomi / Google Pixel

Both Android and iOS are supported; the Android build (see `apps/android`) runs on
**Redmi, Tecno, Xiaomi, Google Pixel, Samsung** and all Android 8.0+ (API 26+)
devices. Android uses `VpnService` (no root); iOS uses Network Extension.
