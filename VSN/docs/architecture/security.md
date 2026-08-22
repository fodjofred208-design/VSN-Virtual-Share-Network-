# VSN — Security Architecture

Security is designed in from the start. The model is **Zero Trust + Defense in
Depth**.

## Pillars

| Pillar | Implementation |
|--------|----------------|
| Cryptographic identity | Device keypairs, mutual auth; server never holds private keys |
| End-to-end encryption | WireGuard: ChaCha20-Poly1305, Noise handshake, forward secrecy |
| Network isolation | Receptor gets Internet ✅, never access to Donor LAN ❌ (firewall) |
| Audit logging | Metadata only (who/when/volume/duration), never traffic contents |
| Device revocation | Terminate sessions, revoked auth, reject future connections, rotate keys |
| Device verification | Fingerprint-based device identity, authorization before connection |

## Secrets handling

- Passwords hashed with **scrypt** (`src/lib/security`), salted.
- Session tokens are HMAC-signed (`src/lib/auth`).
- **Never commit** `.env`, private keys, tokens, or credentials. See `.gitignore`.

## Threat model (STRIDE)

| Threat | Risk | Mitigation |
|--------|------|------------|
| Malicious receptor | LAN scanning, bandwidth abuse | Firewall isolation, quotas, monitoring |
| Malicious donor | Traffic inspection, MITM | E2E encryption, HTTPS, WireGuard |
| Compromised server | MITM, credential theft | Server never holds private keys |
| Stolen device | Unauthorized access | Device revocation, key rotation |
| API abuse | Brute force, DoS | Rate limiting, auth, validation |
| Relay abuse | Traffic inspection | Encrypted packets; relay cannot decrypt |
| Replay attacks | Session hijacking | Short-lived tokens, nonce-based auth |

## Tools used (data plane)

- `wireguard-go` / `boringtun` — userspace tunnel engine.
- `wg` / `wg-quick` / `wgctrl` — config and programmatic control.
- `iptables`/`nftables` (Linux), Windows Firewall, macOS pf — donor isolation.
- STUN/ICE + relay fallback — NAT traversal (UDP hole punching or relay).
