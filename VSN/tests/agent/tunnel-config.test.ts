import { describe, it, expect } from "vitest";
import { renderWireGuardConfig, type AgentTunnelConfig } from "../../agent/src/tunnel/tunnel-config";

describe("WireGuard config rendering (wg-quick)", () => {
  const cfg: AgentTunnelConfig = {
    role: "receptor",
    interfaceName: "vsn-receptor0",
    wg: {
      privateKey: "PRIVATEKEYPLACEHOLDER",
      address: ["10.0.0.2/32"],
      listenPort: 51820,
      mtu: 1420,
      peers: [
        {
          publicKey: "PEERPUBLICKEY",
          presharedKey: "PSK",
          allowedIPs: ["0.0.0.0/0"],
          endpoint: "donor.example.com:51820",
          persistentKeepalive: 25,
        },
      ],
    },
  };

  it("renders an [Interface] section with private key + address", () => {
    const rendered = renderWireGuardConfig(cfg);
    expect(rendered).toContain("[Interface]");
    expect(rendered).toContain("PrivateKey = PRIVATEKEYPLACEHOLDER");
    expect(rendered).toContain("Address = 10.0.0.2/32");
    expect(rendered).toContain("ListenPort = 51820");
    expect(rendered).toContain("MTU = 1420");
  });

  it("renders a [Peer] section with public key, preshared key, allowed IPs, endpoint", () => {
    const rendered = renderWireGuardConfig(cfg);
    expect(rendered).toContain("[Peer]");
    expect(rendered).toContain("PublicKey = PEERPUBLICKEY");
    expect(rendered).toContain("PresharedKey = PSK");
    expect(rendered).toContain("AllowedIPs = 0.0.0.0/0");
    expect(rendered).toContain("Endpoint = donor.example.com:51820");
    expect(rendered).toContain("PersistentKeepalive = 25");
  });

  it("omits optional fields when absent", () => {
    const minimal: AgentTunnelConfig = {
      role: "donor",
      interfaceName: "vsn-donor0",
      wg: {
        privateKey: "k",
        address: ["10.0.0.1/32"],
        peers: [{ publicKey: "p", allowedIPs: ["10.0.0.2/32"] }],
      },
    };
    const rendered = renderWireGuardConfig(minimal);
    expect(rendered).not.toContain("ListenPort");
    expect(rendered).not.toContain("PresharedKey");
    expect(rendered).not.toContain("Endpoint");
  });
});
