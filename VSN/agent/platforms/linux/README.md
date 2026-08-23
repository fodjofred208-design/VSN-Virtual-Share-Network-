# VSN Agent — Linux

## Tunnel engine

- Prefer the in-kernel WireGuard module: `modprobe wireguard`.
- Fallback userspace: `wireguard-go`.

## TUN adapter

- `tun`/`tap` kernel device. Create with `ip tuntap add dev vsn0 mode tun`.

## Routing

- Receptor: `ip route add default dev vsn0`.
- Donor: `ip route` + masquerade + isolation firewall via `iptables`/`nftables`.

## Isolation firewall (donor)

- Allow `vsn0` → `wlan0`/`eth0` → Internet (NAT/masquerade).
- Block donor-LAN reachability from `vsn0` (no SSH/files/router admin/mDNS).

## Notes

- Requires CAP_NET_ADMIN and CAP_NET_RAW (or run as root / with setcap).
