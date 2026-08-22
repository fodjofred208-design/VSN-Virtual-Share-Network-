# VSN — Native Settings Deep-Links & VPN Consent (Android / iOS)

VSN uses the OS's own system dialogs for the privileged tunnel prompt, and deep
links so the web UI / control plane can open the correct in-app screen.

## Android (VpnService consent + deep link)

### VPN consent (the OS prompt)
Android requires the user to **grant VpnService consent** before a VPN can run.
`apps/android/app/src/main/java/com/vsn/app/MainActivity.kt`:

- `VpnService.prepare(this)` returns an **intent** — launching it shows the
  native **"VSN wants to set up a VPN connection"** consent dialog.
- `startActivityForResult(prepareIntent, REQUEST_VPN)` opens it.
- `onActivityResult` (code `RESULT_OK`) then starts `VsnVpnService` with the
  tunnel config.

This is the mobile equivalent of the desktop's UAC/admin prompt for the tunnel.

### Deep link
`AndroidManifest.xml` registers a `vsn://connect` scheme so the control plane can
deep-link into the tunnel-consent flow:

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="vsn" android:host="connect" />
</intent-filter>
```

Link: `vsn://connect?session=<id>` → open VSN → request VPN consent.

## iOS (Network Extension + deep link)

`apps/ios/VsnPacketTunnelProvider.swift` runs the tunnel via
`NEPacketTunnelProvider`. Steps:

1. Request the **Network Extension** entitlement (Apple Developer).
2. Create a `NETunnelProviderProtocol` in the app, set the `providerConfiguration`
   with the tunnel config from the control plane.
3. Start the extension; iOS shows its own **"VSN would like to set up a VPN"**
   system prompt — no custom UI needed.

Deep link scheme: register a URL type (e.g. `vsn://connect`) in the iOS
`Info.plist`/`SCN` so the control plane can open the app.

## Consent vs the VSN onboarding permissions
- The **VSN in-app permission page** documents the 5 permissions conceptually.
- The **OS consent** (VpnService on Android, Network Extension on iOS) is the
  *actual* system grant that enables the tunnel. VSN requests it on demand.

## Why both?
The web control plane cannot itself create a TUN interface or elevate privileges.
The native shell (Android/iOS/desktop) is the only component allowed to do so —
and it does, behind the OS's official consent prompt.
