// VSN Agent — Control-plane client (agent → VSN control server)
// A real WebSocket client that registers the agent (donor/receptor), listens for
// signaling, performs NAT traversal (STUN/ICE + relay), and drives the tunnel.
import WebSocket from "ws";
import type { SignalingMessage } from "protocol/messages/signaling";
import type { TraversalCandidate, TraversalMessage } from "protocol/messages/traversal";
import { NatTraversal, type Candidate } from "../tunnel/nat-traversal";
import { RelayClient } from "../tunnel/relay-client";
import type { ConnType } from "protocol/types";

export interface ControlClientOptions {
  url?: string;
  role?: "donor" | "receptor";
  getPublicKey?: () => string;
  onTunnelReady?: (sessionId: string, connType: ConnType) => Promise<void>;
  onTunnelClosed?: (sessionId: string) => Promise<void>;
}

export class ControlClient {
  private readonly url: string;
  private readonly role: "donor" | "receptor";
  private readonly getPublicKey?: () => string;
  private readonly onTunnelReady?: (sessionId: string, connType: ConnType) => Promise<void>;
  private readonly onTunnelClosed?: (sessionId: string) => Promise<void>;
  private ws: WebSocket | null = null;
  private ready = false;
  private peerId: string | undefined;
  private readonly nat = new NatTraversal();
  private readonly relay = new RelayClient();
  private candidates = new Map<string, TraversalCandidate>();

  constructor(opts: ControlClientOptions) {
    this.url = opts.url ?? process.env.SIGNALING_URL ?? "ws://localhost:3002";
    this.role = opts.role ?? "receptor";
    this.getPublicKey = opts.getPublicKey;
    this.onTunnelReady = opts.onTunnelReady;
    this.onTunnelClosed = opts.onTunnelClosed;
  }

  async connect(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.ws = new WebSocket(this.url);
      this.ws.on("open", () => {
        this.ready = true;
        this.announce();
        console.log(`[control] connected to ${this.url} as ${this.role}`);
        resolve();
      });
      this.ws.on("error", (e) => {
        if (!this.ready) reject(e);
        else console.error("[control] ws error", e.message);
      });
      this.ws.on("message", (data) => this.handleMessage(String(data)));
      this.ws.on("close", () => (this.ready = false));
    });
  }

  private announce(): void {
    this.peerId = this.getPublicKey?.();
    if (this.role === "donor") {
      this.send({
        type: "donor_online",
        donorId: this.peerId ?? "donor",
        donorProfileId: "profile",
        status: "available",
        countryCode: "CM",
        timestamp: new Date().toISOString(),
      });
    } else {
      this.send({
        type: "heartbeat",
        role: "receptor",
        receptorDeviceId: this.peerId ?? "receptor",
        timestamp: new Date().toISOString(),
      });
    }
  }

  private async handleMessage(raw: string): Promise<void> {
    let msg: SignalingMessage | TraversalMessage;
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }

    switch (msg.type) {
      case "connection_request":
        // Donor hears a receptor wants to connect → publish candidate.
        if (this.role === "donor") await this.publishCandidate(msg.sessionId, "donor");
        break;
      case "connection_accepted":
        // Receptor hears donor accepted → publish candidate + punch.
        if (this.role === "receptor") await this.publishCandidate(msg.sessionId, "receptor");
        break;
      case "traversal_candidate":
        if (msg.candidate.sessionId) {
          this.candidates.set(`${msg.role}-${msg.candidate.sessionId}`, msg.candidate);
          // If the peer's candidate arrived, attempt hole punching.
          if (this.role !== msg.role) {
            const connType = await this.attemptTraversal(msg.sessionId, msg.role);
            await this.onTunnelReady?.(msg.sessionId, connType);
          }
        }
        break;
      case "tunnel_ready":
        await this.onTunnelReady?.(msg.sessionId, msg.connectionType);
        break;
      case "tunnel_closed":
        await this.onTunnelClosed?.(msg.sessionId);
        break;
      default:
        break;
    }
  }

  private async publishCandidate(sessionId: string, role: "donor" | "receptor"): Promise<void> {
    let candidate: Candidate = { ip: "", port: 0, type: "srflx" };
    try {
      candidate = await this.nat.discoverPublicCandidate();
    } catch {
      // STUN timed out → we'll relay.
    }
    const tc: TraversalCandidate = { ...candidate, sessionId, role };
    this.send({
      type: "traversal_candidate",
      sessionId,
      role,
      candidate: tc,
      timestamp: new Date().toISOString(),
    });
  }

  private async attemptTraversal(sessionId: string, peerRole: "donor" | "receptor"): Promise<ConnType> {
    const peer = this.candidates.get(`${peerRole}-${sessionId}`);
    const plan = peer ? NatTraversal.plan({ ip: "", port: 0, type: "host" }, peer) : "relay";
    if (plan !== "relay" && peer) {
      const result = await this.nat.holePunch(peer);
      if (result.connType !== "relay") {
        this.send({
          type: "traversal_result",
          sessionId,
          connType: result.connType,
          timestamp: new Date().toISOString(),
        });
        return result.connType;
      }
    }
    // Fall back to relay.
    const alloc = await this.relay.allocate(sessionId);
    await this.relay.forward(alloc.endpoint);
    this.send({
      type: "traversal_result",
      sessionId,
      connType: "relay",
      relayId: alloc.relayId,
      timestamp: new Date().toISOString(),
    });
    return "relay";
  }

  send(msg: SignalingMessage | TraversalMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(msg));
  }

  close(): void {
    this.nat.close();
    this.relay.close();
    this.ws?.close();
  }
}
