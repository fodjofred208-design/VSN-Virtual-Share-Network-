# VSN — WireGuard Tunnel & Keys (Implementation)

> **Status:** Implemented in the VSN Agent (data plane). Real tunnel bring-up
> requires the OS WireGuard tools (works on the host; not in a browser sandbox).
> **Date:** 2026-08-22

---

## 1. Why WireGuard

WireGuard is the VSN **data plane** — it encrypts and moves the actual Internet
packets between Receptor and Donor. It was chosen for:

ChaCha20-Poly1305 · Noise handshake · Curve25519 identity · low latency ·
roaming · tiny/auditable codebase · end-to-end (server can't decrypt).

```
Receptor app → OS → VSN Virtual NIC (TUN) → WireGuard tunnel → Donor → NAT → Internet
```

---

## 2. How it was implemented in the VSN Agent

| File | Role |
|------|------|
| `agent/src/tunnel/wireguard-keys.ts` | **Real Curve25519 (X25519) key generation**, preshared keys, public-key derivation (Node `crypto`, no native deps). |
| `agent/src/tunnel/tunnel-config.ts` | WireGuard config types + `renderWireGuardConfig()` → `wg-quick`-compatible INI. |
| `agent/src/tunnel/wireguard-cli.ts` | Platform CLI bridge: `wg-quick up/down`, `wg show`, `ip` fallback; graceful no-op if tools aren't installed. |
| `agent/src/tunnel/tunnel-client.ts` | Wraps keygen + CLI; injects the device private key + preshared key into the config. |
| `agent/src/tunnel/tunnel-manager.ts` | Platform-agnostic orchestration; exposes live status (peers, bytes). |
| `agent/src/core/platform-adapter.ts` | Per-OS settings (interface name, address, engine, NIC, requirements). |
| `agent/src/security/identity.ts` | Device identity: Curve25519 keypair + SHA-256 fingerprint (private key never leaves device). |

### The keys (and where they go)

| Key | How it's made | Size | Where it lives | Who sees it |
|-----|---------------|------|----------------|-------------|
| **Private key** | `generateKeyPair()` → X25519 scalar | 32 bytes (base64) | OS keychain / encrypted store on the device | **Never leaves the device** |
| **Public key** | derived via X25519 from private | 32 bytes (base64) | registered with the control plane / peers | Shared (this is your "ID") |
| **Preshared key** | `generatePresharedKey()` | 32 bytes (base64) | exchanged out-of-band via the control plane | Donor + Receptor only (defense-in-depth) |
| **Fingerprint** | SHA-256(publicKey) → 16 hex | — | audit/logging | Control plane |

> **Private keys are never transmitted.** Only public keys and fingerprints are
> shared. The preshared key adds post-quantum defense-in-depth for a session.

### Config example (what `renderWireGuardConfig()` produces)

```ini
[Interface]
PrivateKey = <device private key>
Address = 10.0.0.2/32
ListenPort = 51820
MTU = 1420

[Peer]
PublicKey = <peer public key>
PresharedKey = <session preshared key>
AllowedIPs = 0.0.0.0/0
Endpoint = donor.example.com:51820
PersistentKeepalive = 25
```

---

## 3. Session lifecycle with keys

1. **Register** — the device generates a keypair; the public key is sent to the
   control plane (donor registration / receptor registration).
2. **Signal** — via WebSocket: `connection_request` → `connection_accepted`.
3. **Key exchange** — the control plane hands each side the **other's public key**
   and a **per-session preshared key** (transmitted securely, not over the tunnel).
4. **NAT traversal** — direct (STUN/ICE/hole punch) → relay fallback.
5. **Tunnel up** — `TunnelClient.start()` injects keys into the config and runs
   `wg-quick up <iface>`; routes traffic.
6. **Live** — `wg show` reports handshakes/transfer stats → UI.
7. **Teardown** — `wg-quick down <iface>`; keys discarded.

---

## 4. Verified correctness

The key module is unit-tested (`tests/agent/wireguard-keys.test.ts`):
- Keys are well-formed 44-char base64 (32-byte scalars).
- `derivePublicKey(privateKey) === publicKey` (guaranteed matching pair).
- Preshared keys are 32 bytes.

```
private: mHm02BfI+1CEIQhczTbbjP3PlNh3qs8P2H4XMh6DH2M=
public : UGBwAzLY/A8CsSxn83QqH9Kv9iRhx7OdGqyc8j2e2XI=
derive(private) === public: true
```

---

## 5. What you need on the host to actually run a tunnel

| OS | Tools |
|----|-------|
| Linux | `wireguard-tools` (`wg`, `wg-quick`), `iproute2`, CAP_NET_ADMIN/root |
| macOS | `wireguard-tools` (or `wireguard-go`), Network Extension/root |
| Windows | WireGuard for Windows (`wg`), Wintun, Administrator |
| Android | VSN app + VpnService (wireguard-go) — no root needed |

> In this sandbox `wg-quick` is not installed, so the CLI prints a clear message
> and skips rather than crashing — the control-plane UI still runs.

---

## 6. Feasibility recap

| Work | Status |
|------|--------|
| WireGuard keygen (Curve25519) | ✅ Implemented + tested |
| Config generation | ✅ Implemented |
| CLI bridge (wg-quick/wg/ip) | ✅ Implemented (host-tool dependent) |
| Platform adapters | ✅ Implemented |
| Real tunnel on host | ⚠️ Requires OS tools (run on your machine) |
