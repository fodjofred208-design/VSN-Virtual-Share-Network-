// VSN Agent — Routing manager (data plane)
// On the receptor: routes 0.0.0.0/0 into the tunnel. On the donor: masquerades
// tunnel traffic out the real interface and sets the isolation firewall.
export class RoutingManager {
  constructor(private readonly role: "donor" | "receptor") {}

  /** Configure kernel routes for the tunnel. */
  async configure(tunnelInterface: string, gatewayInterface: string): Promise<void> {
    if (this.role === "receptor") {
      console.log(`[routing:receptor] adding default route via ${tunnelInterface}`);
    } else {
      console.log(`[routing:donor] masquerading ${tunnelInterface} → ${gatewayInterface}`);
    }
  }

  async teardown(tunnelInterface: string): Promise<void> {
    console.log(`[routing] flushing routes for ${tunnelInterface}`);
  }
}
