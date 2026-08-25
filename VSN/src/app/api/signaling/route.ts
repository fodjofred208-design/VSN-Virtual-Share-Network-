// VSN API: GET /api/signaling — Signaling reachability/health endpoint
// The actual WebSocket transport lives in server/websocket/signaling-server.ts.
// This route lets the UI verify the signaling service is up and report peer count.
import { withErrors } from "@/lib/api/route-helpers";
import { peerCount } from "@/services/signaling.service";

export async function GET() {
  return withErrors(async () => {
    return {
      ok: true,
      service: "VSN signaling",
      peers: peerCount(),
      timestamp: new Date().toISOString(),
    };
  })();
}
