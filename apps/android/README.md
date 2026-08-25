# VSN — Android Application (Android)

The official VSN app for Android. It runs on **all** Android devices, including:

- **Samsung**
- **Redmi** (Xiaomi/POCO)
- **Tecno**
- **Xiaomi**
- **Google Pixel**
- Any Android 8.0+ (API 26+) device

It wraps the VSN control-plane app in a WebView and runs the **data plane**
through a native Android `VpnService` (WireGuard) — **no root needed**.

**Phone ↔ phone** / **Phone ↔ laptop**: both endpoints run this app (or the
desktop app). The control server coordinates discovery/signaling; the WireGuard
tunnel carries traffic between them.

## Stack

| Piece      | Tool                                                                      |
| ---------- | ------------------------------------------------------------------------- |
| Language   | Kotlin                                                                    |
| Build      | Gradle (AGP 8.7, Kotlin 2.0)                                              |
| Tunnel     | WireGuard via `wireguard-android` (VpnService)                            |
| Control UI | WebView loading the VSN control-plane app (`strings.xml` → `control_url`) |
| Min SDK    | 26 (Android 8.0)                                                          |

## Prerequisites

- Android Studio (recommended) or Android SDK command-line tools.
- JDK 17.
- A reachable VSN control server (set `control_url` in
  `app/src/main/res/values/strings.xml`).

## Build

```bash
cd apps/android
./gradlew assembleDebug        # → app/build/outputs/apk/debug/app-debug.apk
./gradlew assembleRelease      # signed release
```

## Run

1. Open in Android Studio, or install the built APK.
2. On first launch it shows the VSN onboarding (splash → terms → permissions).
3. Grant the **VpnService** consent when VSN requests it.

## Pointing at your local control server (emulator)

Set `control_url` to `http://10.0.2.2:3000` (host machine's localhost) and
`signaling_url` to `ws://10.0.2.2:3002`.

## Key source files

| File                  | Role                                                          |
| --------------------- | ------------------------------------------------------------- |
| `MainActivity.kt`     | WebView shell loading the control-plane app                   |
| `VsnVpnService.kt`    | Data plane — WireGuard `VpnService` (tunnel + virtual NIC)    |
| `VsnAgentService.kt`  | Background agent — signaling/coordination with control server |
| `AndroidManifest.xml` | Permissions + service declarations                            |

## Notes

- The WireGuard config (peer public key, endpoint, allowed IPs) is delivered by
  the control plane / agent at connect time and passed to `VsnVpnService`.
- Add proper launcher icons (`mipmap-*`) and your signing keystore for release.
