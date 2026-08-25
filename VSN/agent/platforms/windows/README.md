# VSN Agent — Windows

## Tunnel engine

- Userspace `wireguard-go` (the kernel module is not generally available on Windows).
- Alternatively the WireGuard-for-Windows driver.

## TUN adapter

- **Wintun** (Microsoft driver). The VSN Agent installs the Wintun adapter and
  attaches the tunnel to it.

## Routing

- Use `route` / the routing APIs to send the receptor's default route into the
  tunnel.

## Isolation (donor)

- Use Windows Firewall rules to allow tunnel → NAT → Internet and block
  donor-LAN access from the tunnel.

## Notes

- Wintun requires an admin/installer step. The Agent requests elevation
  (UAC) for the privileged operations.
