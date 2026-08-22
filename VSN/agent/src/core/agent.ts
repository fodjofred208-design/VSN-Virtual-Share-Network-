// VSN Agent — Core agent lifecycle (data plane)
// This is the native/background process that performs privileged networking.
// It runs OFF the browser. The UI talks to it via the IPC/local API (ipc-server).
import { createServer } from "http";
import { AgentCore } from "./connection-manager";

export interface AgentOptions {
  role: "donor" | "receptor";
  controlUrl?: string;
  ipcPort?: number;
}

export class VsnAgent {
  private core: AgentCore;
  readonly role: "donor" | "receptor";

  constructor(opts: AgentOptions) {
    this.role = opts.role;
    this.core = new AgentCore({ role: opts.role, controlUrl: opts.controlUrl ?? process.env.CONTROL_SERVER_URL });
  }

  /** Start the agent: open the IPC endpoint and begin the control-plane handshake. */
  async start(): Promise<void> {
    const port = this.core.ipcPort ?? Number(process.env.AGENT_IPC_PORT ?? 4173);
    const server = createServer((req, res) => this.core.handleIpc(req, res));
    await new Promise<void>((resolve) => server.listen(port, "0.0.0.0", resolve));
    console.log(`[agent:${this.role}] IPC API listening on http://0.0.0.0:${port}`);
    await this.core.connectControl();
  }

  async stop(): Promise<void> {
    await this.core.shutdown();
  }
}

// CLI entrypoint: `npm run agent` → `tsx agent/src/core/agent.ts`
if (require.main === module) {
  const role = (process.env.VSN_AGENT_ROLE === "donor" ? "donor" : "receptor") as "donor" | "receptor";
  const agent = new VsnAgent({ role });
  agent.start().catch((err) => {
    console.error("[agent] failed to start", err);
    process.exit(1);
  });
}
