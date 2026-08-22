import { describe, it, expect } from "vitest";
import { allocateRelay, getRelay } from "../../server/services/relay-manager";

describe("relay manager", () => {
  it("allocates a relay for a session and returns the same one on repeat", () => {
    const a = allocateRelay("sess-1");
    const b = allocateRelay("sess-1");
    expect(a.relayId).toBe(b.relayId);
    expect(a.endpoint).toMatch(/:[0-9]+$/);
    expect(a.sessionId).toBe("sess-1");
  });

  it("rotates across the pool between different sessions", () => {
    const a = allocateRelay("sess-A");
    const b = allocateRelay("sess-B");
    expect(a.relayId).not.toBe(b.relayId);
  });

  it("is retrievable by session id", () => {
    allocateRelay("sess-C");
    expect(getRelay("sess-C")?.relayId).toBeTruthy();
  });
});
