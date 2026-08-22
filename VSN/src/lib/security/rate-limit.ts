// VSN — In-memory rate limiter (token bucket per key/IP).
// Protects the control-plane API from brute-force / DoS. In a distributed
// deployment swap this for a Redis-based limiter. Keys roll over in memory.
export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterMs: number;
  limit: number;
}

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, Bucket>();

/** @param request client ip (or x-forwarded-for) */
export function rateLimit(key: string, opts: { limit?: number; windowMs?: number } = {}): RateLimitResult {
  const limit = opts.limit ?? 60;
  const windowMs = opts.windowMs ?? 60_000;
  const now = Date.now();
  let b = buckets.get(key);
  if (!b) {
    b = { tokens: limit, lastRefill: now };
    buckets.set(key, b);
  }
  // Refill tokens proportionally to elapsed time.
  const elapsed = now - b.lastRefill;
  b.tokens = Math.min(limit, b.tokens + (elapsed / windowMs) * limit);
  b.lastRefill = now;

  if (b.tokens >= 1) {
    b.tokens -= 1;
    return { ok: true, remaining: Math.floor(b.tokens), retryAfterMs: 0, limit };
  }
  const retryAfterMs = Math.ceil(((1 - b.tokens) / limit) * windowMs);
  return { ok: false, remaining: 0, retryAfterMs, limit };
}

/** Get the client IP for rate limiting (respects a proxy header). */
export function clientIpFrom(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const url = new URL(req.url);
  return url.hostname || "unknown";
}
