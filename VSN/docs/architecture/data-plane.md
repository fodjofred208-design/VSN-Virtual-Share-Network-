# VSN — Data Plane

The data plane is the **actual Internet traffic path** between the Receptor and
the Donor. It runs on the VSN Agent (native process), not in the browser.

```
Receptor app → OS → VSN Virtual NIC (TUN) → WireGuard tunnel → Donor → NAT → Internet
```

## Agent responsibilities

- **Virtual network interface** — create a TUN adapter (Wintun / utun / tun /
  VpnService / NEPacketTunnelProvider).
- **Tunnel** — run WireGuard (userspace `wireguard-go` / `boringtun`, or kernel).
- **Routing** — receptor default route into tunnel; donor masquerade out.
- **NAT** — donor-side masquerade with per-receptor isolation.
- **Encryption** — ChaCha20-Poly1305 + Noise handshake (WireGuard).
- **Security/isolation** — firewall so the receptor never reaches the donor's LAN.

## Donor vs Receptor flow

**Donor:** `register → waiting for receptor → negotiate → tunnel up → NAT → internet`
**Receptor:** `discover donors → select → negotiate → tunnel up → virtual NIC → internet`

## Agent ↔ UI

The browser calls the agent's local IPC API (`agent/src/ipc/ipc-server.ts`,
`127.0.0.1:4173`) to start/stop the tunnel and read status. The browser never
touches networking directly.

## Database

The database stores **control-plane metadata only** (users, devices, donors,
sessions, security events, audit). It never stores tunnel traffic.

See `docs/architecture/tunnel.md` for the WireGuard tooling breakdown.
