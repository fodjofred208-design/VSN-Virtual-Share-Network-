// VSN Agent — IPC server (agent ↔ UI)
// The UI (browser) NEVER performs privileged networking. It talks to this local
// API, which proxies to the tunnel/network managers. Bind to 127.0.0.1 only.
import { createServer, type Server, type IncomingMessage, type ServerResponse } from "http";

export class IpcServer {
  private server: Server | null = null;
  private handlers = new Map<string, (req: IncomingMessage, res: ServerResponse) => void>();

  on(path: string, handler: (req: IncomingMessage, res: ServerResponse) => void): void {
    this.handlers.set(path, handler);
  }

  async listen(port = 4173): Promise<void> {
    this.server = createServer((req, res) => {
      const url = new URL(req.url ?? "/", "http://127.0.0.1");
      const handler = this.handlers.get(url.pathname);
      if (!handler) return this.json(res, 404, { error: "not found" });
      handler(req, res);
    });
    await new Promise<void>((resolve) => this.server!.listen(port, "127.0.0.1", resolve));
    console.log(`[agent:ipc] listening on http://127.0.0.1:${port}`);
  }

  async close(): Promise<void> {
    if (!this.server) return;
    await new Promise<void>((resolve) => this.server!.close(() => resolve()));
    this.server = null;
  }

  private json(res: ServerResponse, status: number, body: unknown): void {
    res.writeHead(status, { "content-type": "application/json" });
    res.end(JSON.stringify(body));
  }
}
