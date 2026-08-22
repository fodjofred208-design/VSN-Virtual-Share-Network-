// VSN — WebSocket signaling server (standalone Node process)
// Run: `npm run signaling`  (or as part of `npm run dev:all`)
// Port configured via SIGNALING_PORT (default 3002).
// This is the control-plane real-time channel; it does NOT carry data-plane
// traffic (that flows through the WireGuard tunnel between endpoints).
import { WebSocketServer, WebSocket } from "ws";
import { registerPeer, unregisterPeer, broadcast, peerCount } from "../../src/services/signaling.service";
import type { SignalingMessage } from "../../protocol/messages/signaling";

const PORT = Number(process.env.SIGNALING_PORT ?? 3002);
const wss = new WebSocketServer({ port: PORT, host: "0.0.0.0" });

function send(ws: WebSocket, payload: SignalingMessage): void {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload));
}

wss.on("connection", (ws) => {
  const peerId = `ui-${Math.random().toString(36).slice(2, 8)}`;

  ws.on("message", (raw) => {
    let msg: SignalingMessage;
    try {
      msg = JSON.parse(raw.toString()) as SignalingMessage;
    } catch {
      send(ws, { type: "error", code: "bad_frame", message: "Invalid JSON" });
      return;
    }

    switch (msg.type) {
      case "heartbeat":
        // Keepalive; respond with same type so client knows server is alive.
        send(ws, { type: "heartbeat", role: "receptor", timestamp: new Date().toISOString() });
        break;
      case "donor_online":
        registerPeer({ id: msg.donorId, kind: "donor", send: (p) => send(ws, p as SignalingMessage) });
        broadcast(msg);
        break;
      case "donor_offline":
        unregisterPeer(msg.donorId);
        broadcast(msg);
        break;
      case "connection_request":
        // Relay the request to the target donor (by donorId) and notify the bus.
        broadcast(msg);
        break;
      case "connection_accepted":
      case "connection_rejected":
      case "tunnel_ready":
      case "tunnel_closed":
        broadcast(msg);
        break;
      default:
        send(ws, { type: "error", code: "unknown_type", message: "Unsupported message type" });
    }
  });

  ws.on("close", () => {
    unregisterPeer(peerId);
  });
});

console.log(`[signaling] VSN control-plane WS server listening on ws://0.0.0.0:${PORT}`);
console.log(`[signaling] connected peers: ${peerCount()}`);
