// VSN Agent — Control-plane client (agent → VSN control server)
// Registers heartbeats and listens for signaling to know when to bring the
// tunnel up/down. Uses the shared protocol contracts.
import type { SignalingMessage } from "protocol/messages/signaling";

export interface ControlClientOptions {
  url?: string;
}

export class ControlClient {
  private readonly url?: string;
  private sockets: { send: (msg: SignalingMessage) => void }[] = [];

  constructor(opts: ControlClientOptions) {
    this.url = opts.url;
  }

  async connect(): Promise<void> {
    // In production, opens a WebSocket to the signaling server and registers
    // this device (donor_online / receptor_online). Here we simulate.
    console.log(`[agent:control] connected to ${this.url ?? "control server"}`);
  }

  announce(msg: SignalingMessage): void {
    for (const s of this.sockets) s.send(msg);
  }

  onSignaling(handler: (msg: SignalingMessage) => void): void {
    // Registered by the platform adapter to react to tunnel_ready/tunnel_closed.
    void handler;
  }
}
