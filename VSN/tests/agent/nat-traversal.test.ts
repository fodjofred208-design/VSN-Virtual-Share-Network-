import { describe, it, expect } from "vitest";
import { NatTraversal } from "../../agent/src/tunnel/nat-traversal";

describe("NAT traversal planning", () => {
  it("plans hole-punching when the peer has a server-reflexive candidate", () => {
    const plan = NatTraversal.plan(
      { ip: "", port: 0, type: "host" },
      { ip: "203.0.113.5", port: 50000, type: "srflx" },
    );
    expect(plan).toBe("hole_punched");
  });

  it("plans relay when the peer candidate is unknown/unreachable", () => {
    const plan = NatTraversal.plan({ ip: "", port: 0, type: "host" }, { ip: "", port: 0, type: "relay" });
    expect(plan).toBe("relay");
  });

  it("plans hole-punching for a host candidate too", () => {
    const plan = NatTraversal.plan(
      { ip: "", port: 0, type: "host" },
      { ip: "192.168.1.20", port: 51820, type: "host" },
    );
    expect(plan).toBe("hole_punched");
  });
});
