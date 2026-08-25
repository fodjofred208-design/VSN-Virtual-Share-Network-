// VSN — Signaling WebSocket client (browser/UI side)
// Connects to the signaling server and dispatches the message bus.
import type { SignalingMessage } from "protocol/messages/signaling";

export interface SignalingHandlers {
  onOpen?: () => void;
  onClose?: (ev: CloseEvent) => void;
  onError?: (err: Event) => void;
  onMessage?: (msg: SignalingMessage) => void;
  onDonorOnline?: (msg: Extract<SignalingMessage, { type: "donor_online" }>) => void;
  onDonorOffline?: (msg: Extract<SignalingMessage, { type: "donor_offline" }>) => void;
  onConnectionRequest?: (msg: Extract<SignalingMessage, { type: "connection_request" }>) => void;
  onConnectionAccepted?: (msg: Extract<SignalingMessage, { type: "connection_accepted" }>) => void;
  onConnectionRejected?: (msg: Extract<SignalingMessage, { type: "connection_rejected" }>) => void;
  onTunnelReady?: (msg: Extract<SignalingMessage, { type: "tunnel_ready" }>) => void;
  onTunnelClosed?: (msg: Extract<SignalingMessage, { type: "tunnel_closed" }>) => void;
}

export class SignalingClient {
  private ws: WebSocket | null = null;
  private url: string;
  private handlers: SignalingHandlers;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private shouldReconnect = false;

  constructor(url: string, handlers: SignalingHandlers = {}) {
    this.url = url;
    this.handlers = handlers;
  }

  connect(): void {
    const protocol = typeof window !== "undefined" && window.location.protocol === "https:" ? "wss" : "ws";
    const resolved = this.url || `${protocol}://${window.location.host}`;
    this.shouldReconnect = true;
    this.ws = new WebSocket(resolved);

    this.ws.onopen = () => {
      this.handlers.onOpen?.();
      this.startHeartbeat();
    };
    this.ws.onclose = (ev) => {
      this.handlers.onClose?.(ev);
      this.stopHeartbeat();
      if (this.shouldReconnect) setTimeout(() => this.connect(), 3000);
    };
    this.ws.onerror = (err) => this.handlers.onError?.(err);
    this.ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data as string) as SignalingMessage;
        this.dispatch(msg);
      } catch {
        // ignore malformed frames
      }
    };
  }

  private dispatch(msg: SignalingMessage): void {
    this.handlers.onMessage?.(msg);
    switch (msg.type) {
      case "donor_online":
        this.handlers.onDonorOnline?.(msg);
        break;
      case "donor_offline":
        this.handlers.onDonorOffline?.(msg);
        break;
      case "connection_request":
        this.handlers.onConnectionRequest?.(msg);
        break;
      case "connection_accepted":
        this.handlers.onConnectionAccepted?.(msg);
        break;
      case "connection_rejected":
        this.handlers.onConnectionRejected?.(msg);
        break;
      case "tunnel_ready":
        this.handlers.onTunnelReady?.(msg);
        break;
      case "tunnel_closed":
        this.handlers.onTunnelClosed?.(msg);
        break;
      default:
        break;
    }
  }

  send(msg: SignalingMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      this.send({ type: "heartbeat", role: "receptor", timestamp: new Date().toISOString() });
    }, 25000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = null;
  }

  close(): void {
    this.shouldReconnect = false;
    this.ws?.close();
  }
}
