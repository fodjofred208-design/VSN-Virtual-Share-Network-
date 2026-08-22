// VSN Agent — Connection manager
// Owns the tunnel lifecycle on the device and the IPC endpoint the UI calls.
import type { IncomingMessage, ServerResponse } from "http";
import { TunnelManager } from "../tunnel/tunnel-manager";
import { ControlClient } from "../api/control-client";
import { getPlatformAdapter } from "./platform-adapter";

export interface AgentCoreOptions {
  role: "donor" | "receptor";
  controlUrl?: string;
  ipcPort?: number;
}

export class AgentCore {
  readonly role: "donor" | "receptor";
  readonly ipcPort: number;
  readonly tunnel: TunnelManager;
  readonly control: ControlClient;
  private running = false;

  constructor(opts: AgentCoreOptions) {
    this.role = opts.role;
    this.ipcPort = opts.ipcPort ?? 4173;
    const adapter = getPlatformAdapter();
    this.tunnel = new TunnelManager({
      role: opts.role,
      address: adapter.address,
      interfaceName: adapter.interfaceName(opts.role),
    });
    this.control = new ControlClient({ url: opts.controlUrl });
  }

  async connectControl(): Promise<void> {
    await this.control.connect();
  }

  /** Minimal IPC handler for the UI — routes intended to stay local (no browser). */
  async handleIpc(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const url = new URL(req.url ?? "/", "http://localhost");
    if (!req.method) return this.json(res, 405, { error: "method required" });

    switch (`${req.method} ${url.pathname}`) {
      case "GET /v1/tunnel/status":
        return this.json(res, 200, this.tunnel.status());
      case "POST /v1/tunnel/start":
        this.running = true;
        await this.tunnel.up();
        return this.json(res, 200, { ok: true, running: this.running });
      case "POST /v1/tunnel/stop":
        this.running = false;
        await this.tunnel.down();
        return this.json(res, 200, { ok: true, running: this.running });
      default:
        return this.json(res, 404, { error: "not found" });
    }
  }

  private json(res: ServerResponse, status: number, body: unknown): void {
    res.writeHead(status, { "content-type": "application/json" });
    res.end(JSON.stringify(body));
  }

  async shutdown(): Promise<void> {
    await this.tunnel.down();
  }
}
