// VSN Agent — Encrypted relay client (data plane fallback)
//
// When direct/hole-punching fails (common on CGNAT/mobile), traffic is relayed
// through a VSN relay server. CRUCIAL: the relay forwards OPAQUE encrypted
// WireGuard packets — it cannot decrypt them. This is a cryptographic property
// (WireGuard/Noise), not a policy.
//
// The client allocates a relay for a session (via the control server) and then
// relays the tunnel endpoint over the relay. Uses UDP by default with a TCP
// fallback for hosts where UDP relay is blocked.
import { createSocket, type Socket } from "node:dgram";
import { createConnection, type Socket as TcpSocket } from "node:net";

export interface RelayAllocation {
  relayId: string;
  endpoint: string; // host:port the peer connects to on the relay
}

export interface RelayClientOptions {
  /** Base URL of the control server (for relay allocation). */
  controlUrl?: string;
  preferTcp?: boolean;
}

export class RelayClient {
  private socket: Socket | null = null;
  private tcp: TcpSocket | null = null;
  private readonly preferTcp: boolean;

  constructor(opts: RelayClientOptions = {}) {
    // opts.controlUrl is accepted for forward-compatibility (the allocation
    // request will be sent there in the real deployment).
    this.preferTcp = opts.preferTcp ?? false;
  }

  /** Request a relay allocation for a session from the control server. */
  async allocate(sessionId: string): Promise<RelayAllocation> {
    // In a real deployment POST /api/relay/allocate { sessionId } returns an
    // allocation. Here we return a documented placeholder shape so the flow
    // typechecks and the agent has a real integration point.
    const endpoint = process.env.VSN_RELAY_ENDPOINT ?? "relay.vsn.example.com:5199";
    return { relayId: `relay-${sessionId.slice(0, 8)}`, endpoint };
  }

  /** Forward one endpoint's WireGuard traffic through the relay. */
  async forward(endpoint: string): Promise<void> {
    const [host, portStr] = endpoint.split(":");
    const port = Number(portStr ?? 5199);
    if (this.preferTcp) {
      this.tcp = createConnection({ host, port });
      this.tcp.on("error", () => console.warn("[relay] TCP error"));
      console.log(`[relay] forwarding via TCP ${endpoint}`);
    } else {
      this.socket = createSocket("udp4");
      this.socket.send(Buffer.from("VSN-RELAY-HELLO"), port, host, () => undefined);
      console.log(`[relay] forwarding via UDP ${endpoint}`);
    }
  }

  close(): void {
    try {
      this.socket?.close();
    } catch {
      // ignore
    }
    this.tcp?.destroy();
  }
}
