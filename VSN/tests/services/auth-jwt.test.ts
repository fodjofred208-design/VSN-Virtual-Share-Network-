import { describe, it, expect } from "vitest";
import { signJwt, verifyJwt } from "../../src/lib/auth/jwt";

describe("JWT (HS256)", () => {
  it("signs a token with 3 parts", () => {
    const t = signJwt({ sub: "dev-1", role: "receptor" }, 3600);
    expect(t.split(".")).toHaveLength(3);
  });

  it("verifies a valid token and returns the subject", () => {
    const t = signJwt({ sub: "dev-2", role: "donor" }, 3600);
    const p = verifyJwt(t);
    expect(p?.sub).toBe("dev-2");
    expect(p?.role).toBe("donor");
  });

  it("rejects a tampered token", () => {
    const t = signJwt({ sub: "dev-3" }, 3600);
    const [h, payload] = t.split(".");
    const tampered = `${h}.${payload}.AAAA`;
    expect(verifyJwt(tampered)).toBeNull();
  });

  it("rejects an expired token", () => {
    const t = signJwt({ sub: "dev-4" }, -1); // already expired
    expect(verifyJwt(t)).toBeNull();
  });
});
