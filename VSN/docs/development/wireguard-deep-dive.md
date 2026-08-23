# VSN — WireGuard: The Complete, Detailed Explanation

> A deep dive into what WireGuard actually is, how it works under the hood,
> and exactly how VSN uses it. Read top to bottom — each section builds on
> the previous one.

---

## 1. What WireGuard is (plain language)

WireGuard is a **virtual private tunnel between two computers**. It creates
an invisible, encrypted pipe through which the two machines can talk as if
they were plugged into the same private switch — no matter which public
networks (home Wi-Fi, mobile 4G/5G, café Wi-Fi) each machine sits on.

**Analogy:** imagine two people living in different countries, each behind a
gated compound (their router). WireGuard first **digs a private tunnel**
through the earth connecting the two houses. Once the tunnel exists, any
package (data) dropped in one house's mailbox arrives in the other's — and
**nobody along the way can open the packages**, because they are sealed
(encrypted) with a lock only the two house owners hold the keys to.

In VSN:
- The **Receptor** (the device that needs Internet) sits on one end.
- The **Donor** (the device that shares its Internet) sits on the other.
- Everything the Receptor sends goes through the tunnel to the Donor, and
  the Donor forwards it to the real Internet. The return path works
  identically.

```
 Receptor (phone/laptop)                    Donor (laptop with Internet)
┌──────────────┐   encrypted tunnel    ┌──────────────┐         ┌──────────┐
│  your apps   │◄─────────────────────►│  WireGuard   │────────►│  ISP /   │
│   send data  │  (WireGuard, UDP)     │  endpoint    │  NAT + │ Internet │
└──────────────┘                        └──────────────┘  route └──────────┘
```

**Key property:** the tunnel is **end-to-end encrypted**. Even the VSN
control server — which coordinates the connection — only ever sees the two
devices *shake hands*. It can **never read** what flows through the tunnel.
That is a mathematical property of the crypto, not a promise.

---

## 2. Why WireGuard (and not OpenVPN/SSL-VPN)

| Property | WireGuard | Typical VPNs |
|---|---|---|
| Code size | ~4,000 lines (fully auditable) | 100,000+ lines |
| Crypto | Modern, only ChaCha20-Poly1305 + Curve25519 + Noise | Often legacy algorithms |
| Latency | Very low (UDP, in-kernel fast path) | Higher (TCP, complex stack) |
| Mobile roaming | Excellent (re-keys automatically when network changes) | Often drops |
| Config size | A few lines per peer | Long, error-prone |
| Attack surface | Tiny — audited line by line | Large — decades of history |

VSN is a networking product where **trust and speed are the product** —
that is exactly WireGuard's strength.

---

## 3. The five building blocks (what you need to actually understand it)

### 3.1 UDP — the transport

WireGuard speaks **UDP only** (no TCP). Each encrypted packet is a separate
UDP datagram. Why:
- UDP has no handshake overhead → lowest latency.
- If one packet is lost, the others still flow (TCP would stall).
- WireGuard has its **own** reliability on top (retransmits during
  handshake) where it matters.

**Consequence:** you connect to a peer as `ip:port` (e.g.
`203.0.113.7:51820`) — there is no persistent "session" at the UDP level.
That's why WireGuard is "stateless-friendly" and roams well.

### 3.2 The TUN device — the virtual network card

To make the **whole device** (not just one app) route through the tunnel,
WireGuard creates a **virtual network interface** inside the operating
system:

| OS | Virtual interface name |
|---|---|
| Linux | `tun` (e.g. `vsn0`) |
| macOS | `utun` (e.g. `utun5`) |
| Windows | via **Wintun** (e.g. `vsn0`) |
| Android | `VpnService` (e.g. `tun0`) |
| iOS | `NEPacketTunnelProvider` |

Think of it as a **fake Ethernet port inside the computer**. The OS's
router can then say: *"for traffic to the Internet, use this fake port"* —
and every app on the device (browser, WhatsApp, games) is sucked into the
tunnel without any app knowing or caring. The VSN Agent creates/destroys
this interface (`agent/src/network/interface-manager.ts`).

### 3.3 Curve25519 — the identity (keys)

Each device gets a **key pair**:

- **Private key** — 32 random bytes. NEVER leaves the device. It is your
  secret identity, like a fingerprint + a secret hand-shake pattern.
- **Public key** — derived mathematically from the private key. Anyone can
  have it; it cannot be used to recover the private key (this is the
  one-way street of elliptic-curve math).

The magic property: **two parties each holding their own private key and the
other's public key can derive the SAME shared secret — without ever sending
the secret over the network.** An eavesdropper who sees both public keys
still cannot compute the shared secret (that is the Elliptic Curve
Diffie-Hellman problem, believed hard).

VSN generates real keys with Node's built-in `crypto` module
(`agent/src/tunnel/wireguard-keys.ts`) — no fake/example keys:

```
private key  → 32 random bytes  → base64 (44 chars)   [never leaves device]
public key   → Curve25519(private) → base64 (44 chars) [shared with control plane + peer]
preshared key→ 32 random bytes  → base64 (44 chars)   [per-session, both peers only]
fingerprint  → SHA-256(public) → 16 hex chars          [shown in UI for trust]
```

**Why also a preshared key per session?** Defense in depth: even if the
identity public keys were somehow known to an attacker, the per-session
preshared key (agreed during the session) adds a second secret that must
also be known to fake the tunnel. VSN allocates a fresh one per session
(`src/services/session.service.ts`) and it is delivered to the two peers
through the control plane **only while the session is being negotiated**.

### 3.4 Noise protocol — the handshake

When the tunnel starts, the two ends perform a **Noise_IK handshake**:

```
  Receptor ──────────────────────────────► Donor
   1. "Hello. Here's my ephemeral public key
      + my identity public key, and a MAC
      proving I know my private key"

  Receptor ◄───────────────────────────── Donor
   2. "Here's my ephemeral + identity keys
      + MAC. From your ephemeral + my
      ephemeral we now BOTH derived the
      same traffic keys (ChaCha20 key +
      nonce counter) — and your MAC proves
      you're really the Donor."
```

What just happened, in one line: **mutual authentication + shared secret
derivation in two messages, with forward secrecy** (the ephemeral keys are
thrown away after the handshake, so capturing the handshake later is useless).

**Forward secrecy:** every time the network changes (or every 24h/12h,
handshake / rekey interval), fresh ephemeral keys are used → old captured
traffic stays unreadable forever.

### 3.5 ChaCha20-Poly1305 — the encryption

All actual data is sealed with **ChaCha20-Poly1305**:
- **ChaCha20** — the stream cipher (scrambles the bytes).
- **Poly1305** — the authenticator (a 16-byte tag; any tampered or forged
  packet is detected and dropped, not decrypted-and-trusted).

Properties: very fast on phones (no CPU crypto-instruction dependency),
constant-time (no timing leaks), and approved by modern standards (RFC 7539,
used by Signal and HTTPS).

---

## 4. The full VSN lifecycle (what actually happens, step by step)

```
STEP 1 — DEVICE REGISTRATION (once per device)
  Agent generates Curve25519 keypair → registers PUBLIC key + fingerprint
  with the control plane:  POST /api/auth/register-device
  (the private key stays on the device)

STEP 2 — SESSION REQUEST
  Receptor UI → POST /api/sessions/request { donorProfileId, ... }
  Control plane records the session (state: requested) and notifies the
  Donor over the signaling WebSocket (donor_online / connection_request).

STEP 3 — DONOR ACCEPTS
  Donor taps "Accept" in the notification hub → POST /api/sessions/:id/accept
  Control plane (session.service):
    • creates a FRESH per-session preshared key
    • assigns tunnel endpoint addresses (e.g. 10.9.0.1 / 10.9.0.2)
    • state: approved → negotiating

STEP 4 — TUNNEL CONFIG EXCHANGE
  Each side calls:  GET /api/sessions/:id/tunnel-config?role=donor|receptor
  The response contains EVERYTHING needed for WireGuard EXCEPT private keys:
    interface name, local address, peer PUBLIC key, AllowedIPs,
    preshared key, listen port, peer endpoint (if known)
  (route rule: the control plane NEVER returns private keys)

STEP 5 — NAT TRAVERSAL (finding each other through routers)
  Both devices are usually behind NAT (private IPs). VSN tries, in order:
    a) DIRECT   — both have public/reachable endpoints → use them.
    b) HOLE-PUNCH — STUN: each asks a STUN server "what public ip:port am I
       actually reachable on?" → candidates exchanged over signaling
       (protocol/messages/traversal.ts) → both fire UDP at each other's
       public ip:port simultaneously → router "forgets" to block the
       reply → a direct path opens. (agent/src/tunnel/nat-traversal.ts)
    c) RELAY    — if hole-punching fails (CGNAT / symmetric NAT — common on
       mobile), the control plane allocates an encrypted relay
       (POST /api/relay/allocate). The relay forwards opaque UDP datagrams.
       It CANNOT decrypt them (it never has the keys) — it is a speed
       fallback, not a trust downgrade.

STEP 6 — TUNNEL UP
  Each agent writes the WireGuard config (agent/src/tunnel/tunnel-config.ts
  renders the INI) and runs `wg-quick up vsn0` (agent/src/tunnel/wireguard-cli.ts).
  The Noise handshake completes → the tunnel is LIVE.
  Agent → onTunnelReady → session state: connected.

STEP 7 — TRAFFIC FLOWS
  Receptor apps → OS router → TUN interface → ChaCha20-Poly1305 encrypted →
  UDP → (direct | hole-punched | relay) → Donor TUN → Donor's NAT
  (MASQUERADE) → Donor's ISP → Internet.  Return path mirrors.

STEP 8 — TEarDown (any side)
  terminate (UI / timeout / limit) → `wg-quick down` → TUN removed →
  routes/DNS/firewall restored → session: terminated.
```

---

## 5. The Donor's side of the street: NAT + isolation

When the Donor shares Internet, two things must be configured on the Donor
host (done by the Agent, `agent/src/network/`):

1. **NAT (MASQUERADE)** — packets arriving from the tunnel carry the
   Receptor's tunnel address (10.9.0.1); the Donor rewrites the source to
   its own real address before sending to the ISP (and rewrites replies
   back). Implemented with `iptables`/`nftables`/`pf`/Windows Firewall
   depending on OS (`nat-manager.ts`).

2. **LAN ISOLATION firewall** — the Receptor must get **Internet only**.
   Rules DROP any tunneled packet whose destination is the Donor's private
   LAN (192.168.x.x, 10.x.x.x except the tunnel subnet, 172.16-31.x.x).
   So a Receptor can never peek at the Donor's home network, printers, or
   NAS — even though it technically "shares" the connection.
   (`routing-manager.ts`)

---

## 6. Installing WireGuard on your machine (to run the real data plane)

The web app + control plane run **without** WireGuard. To move real
traffic you install the per-OS tools. Full guide:
`docs/development/install-wireguard.md`. Short version:

| OS | Install | Verify |
|----|---------|--------|
| Linux (Ubuntu/Debian) | `sudo apt install wireguard wireguard-tools` | `wg --help` |
| Linux (Fedora) | `sudo dnf install wireguard-tools` | `wg --help` |
| macOS | `brew install wireguard wireguard-tools` | `wg --help` |
| Windows | WireGuard installer from wireguard.net (bundles Wintun + `wg`) | `wg --help` in PowerShell |
| Android | "WireGuard" app on Play Store (boringtun engine) | app opens |
| iOS | "WireGuard" app on App Store | app opens |

> On systems where the kernel module is unavailable (most Android/iOS),
> the **userspace engine** (`wireguard-go` / `boringtun`) is used instead —
> same protocol, same security, slightly slower. The Agent's
> `platform-adapter.ts` picks the right tool per OS.

## 7. Verifying a live tunnel (what "it works" looks like)

On the machine where the tunnel runs:

```bash
wg show vsn0            # interface + peer + handshake age ("handshake: 4s ago" = alive)
wg show vsn0 transfer   # bytes received/transmitted — watch them move
ip addr show vsn0       # (Linux) the tunnel address, e.g. 10.9.0.1
```

Then, as the Receptor:
```bash
ping 10.9.0.2           # reaches the Donor THROUGH the tunnel
curl https://ifconfig.co  # should print the DONOR's public IP = traffic really flows
```

In the VSN UI: the Statistics page shows session bytes up/down and the
dashboard state machine reaches **Connected** (green background, 5 circles).

## 8. Common failures and their fixes

| Symptom | Cause | Fix |
|---|---|---|
| `wg-quick: command not found` | Tools not installed | Section 6 table |
| `Device vsn0 not found` / no TUN | Missing TUN support / permissions | Linux: `sudo` or udev rule; Windows: reinstall (Wintun); Android: grant VpnService permission |
| Tunnel up but no Internet | Donor NAT/isolation not applied | Check `nat-manager` log lines; on some distros `nftables` is required instead of `iptables` |
| Handshake never completes | Endpoint unreachable (symmetric NAT) | VSN falls back to relay automatically — check `VSN_RELAY_ENDPOINT` and relay allocation log |
| `tunnel established` in UI but nothing flows | Router sent traffic to a different interface | Receptor: check default route points to the TUN (`ip route`); kill-switch (settings) forces all traffic through the tunnel |
| Works on laptop, fails on phone | CGNAT / battery-optimized background limits | Use relay (auto), disable battery optimization for VSN |
| `VSN_SANDBOX=1` is set | Sandbox mode skips ALL privileged ops | Remove it on a real machine (keep it only in containers/CI) |

## 9. Security model — what the VSN server CAN and CANNOT see

| Data | Server sees it? |
|---|---|
| That a Donor is online | Yes (metadata) |
| That R requested D, when, how long | Yes (metadata) |
| The two devices' **public** keys + fingerprints | Yes |
| The **preshared** key | Only during session setup (then held by the two devices) |
| **Any packet content** (websites, messages, files) | **NO — impossible** (ChaCha20-Poly1305 between the two devices) |
| The **private** keys | **NO — they never leave the devices** |
| Receptor's LAN access via the Donor | **NO — blocked by the isolation firewall** |

That asymmetry — *coordination without visibility* — is the core design
goal of VSN and it comes directly from choosing WireGuard as the data plane.

---

## 10. One-paragraph summary (for when you need to explain it to someone)

> VSN uses WireGuard — a modern, tiny, auditable tunnel protocol. Each
> device owns a Curve25519 key pair whose private half never leaves the
> machine; only public keys are registered with the control plane. When a
> Receptor requests a Donor and the Donor accepts, the control plane
> generates a fresh per-session preshared key and hands both sides a
> WireGuard config (peer public key + preshared key + endpoint) — never a
> private key. The two agents then find each other through their routers
> (direct, STUN hole-punching, or an encrypted relay that cannot read the
> traffic), run a Noise handshake, and a virtual network interface carries
> all of the Receptor's traffic, ChaCha20-Poly1305-encrypted, to the
> Donor, which NATs it out to the real Internet while a firewall blocks
> any access to its own LAN. The control server coordinates all of this
> but mathematically cannot read a single byte of it.
