import { describe, it, expect } from "vitest";
import { rateLimit } from "../../src/lib/security/rate-limit";

describe("rate limiter (token bucket)", () => {
  it("allows up to `limit` requests then rejects", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 3; i++) expect(rateLimit(key, { limit: 3 }).ok).toBe(true);
    expect(rateLimit(key, { limit: 3 }).ok).toBe(false);
  });

  it("returns a retry-after hint when limited", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) rateLimit(key, { limit: 5 });
    const r = rateLimit(key, { limit: 5 });
    expect(r.ok).toBe(false);
    expect(r.retryAfterMs).toBeGreaterThan(0);
  });

  it("treats different keys independently", () => {
    const a = `test-${Math.random()}`;
    const b = `test-${Math.random()}`;
    for (let i = 0; i < 2; i++) rateLimit(a, { limit: 2 });
    expect(rateLimit(a, { limit: 2 }).ok).toBe(false);
    expect(rateLimit(b, { limit: 2 }).ok).toBe(true);
  });
});
