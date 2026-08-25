import { describe, it, expect } from "vitest";
import { canTransition, SESSION_STATE_TRANSITIONS } from "protocol/types";

describe("session state machine", () => {
  it("allows idle → requested", () => {
    expect(canTransition("idle", "requested")).toBe(true);
  });

  it("allows requested → approved", () => {
    expect(canTransition("requested", "approved")).toBe(true);
  });

  it("allows connected → reconnecting", () => {
    expect(canTransition("connected", "reconnecting")).toBe(true);
  });

  it("disallows idle → connected (skips states)", () => {
    expect(canTransition("idle", "connected")).toBe(false);
  });

  it("every state has defined transitions", () => {
    const states = Object.keys(SESSION_STATE_TRANSITIONS);
    expect(states).toHaveLength(9);
    for (const from of states) {
      expect(Array.isArray(SESSION_STATE_TRANSITIONS[from as keyof typeof SESSION_STATE_TRANSITIONS])).toBe(
        true,
      );
    }
  });
});
