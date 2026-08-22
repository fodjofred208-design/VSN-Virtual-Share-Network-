# VSN Agent

The **data plane** — a native/background process that performs the privileged
networking the browser cannot: creating a virtual NIC, running the WireGuard
tunnel, configuring routing/NAT, and enforcing the donor isolation firewall.

> **Scope note:** Even though this is written in TypeScript and typechecks, the
> tunnel engine (`wireguard-go` / `boringtun`) and the TUN adapters (Wintun,
> utun, tun, VpnService, NEPacketTunnelProvider) must run **on each target OS**
> — not inside a browser. This directory provides the platform-agnostic core
> plus per-platform integration guides.

## The WireGuard key model

The agent generates **real Curve25519 (X25519) keys** via Node `crypto`
(`agent/src/tunnel/wireguard-keys.ts`):

- **Private key** (32-byte base64) — stored in the OS keychain, **never leaves
  the device**.
- **Public key** (32-byte base64) — this is the device's VSN identity; registered
  with the control plane and shared with peers.
- **Preshared key** (32-byte base64) — per-session secret for defense-in-depth,
  exchanged out-of-band via the control plane.
- **Fingerprint** — SHA-256 of the public key, used for audit/status.

`TunnelClient.start()` injects the device private key + preshared key into a
`wg-quick`-compatible config and calls the platform CLI to bring the tunnel up.

## Layout

```
agent/
├── README.md
├── package.json
├── src/
│   ├── core/
│   │   ├── agent.ts             # lifecycle + CLI entrypoint
│   │   ├── connection-manager.ts# IPC endpoint + tunnel orchestration
│   │   ├── donor-manager.ts     # register + start/stop sharing
│   │   └── receptor-manager.ts  # discover + connect/disconnect
│   ├── tunnel/
│   │   ├── tunnel-manager.ts    # platform-agnostic tunnel up/down
│   │   ├── tunnel-client.ts     # userspace WireGuard wrapper
│   │   └── tunnel-config.ts     # WG config generation
│   ├── network/
│   │   ├── interface-manager.ts # virtual NIC (TUN) management
│   │   ├── routing-manager.ts   # receptor default route / donor masq
│   │   ├── nat-manager.ts       # donor NAT
│   │   └── network-info.ts      # device facts for discovery
│   ├── security/
│   │   ├── encryption.ts        # keypair generation
│   │   ├── credentials.ts       # per-session secret store
│   │   └── identity.ts          # device identity (fingerprint/keypair)
│   ├── api/
│   │   └── control-client.ts    # agent → control-server signaling client
│   └── ipc/
│       └── ipc-server.ts        # local API the UI calls (127.0.0.1 only)
└── platforms/
    ├── windows/  linux/  macos/  android/
```

## Running (scaffold)

```bash
VSN_AGENT_ROLE=receptor npm run agent   # or donor
# IPC: GET http://127.0.0.1:4173/v1/tunnel/status
```

Real tunnel bringing-up is OS-specific and documented under `platforms/`.
