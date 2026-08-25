// VSN — Route handler helpers (control-plane API)
import { NextResponse } from "next/server";
import { ValidationError } from "@/lib/validation";
import { rateLimit, clientIpFrom } from "@/lib/security/rate-limit";
import { bearer } from "@/lib/auth/jwt";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonCreated<T>(data: T) {
  return NextResponse.json(data, { status: 201 });
}

export function jsonError(message: string, status = 400, code?: string) {
  return NextResponse.json({ error: message, code }, { status });
}

export interface AuthContext {
  deviceId: string;
  role?: "donor" | "receptor";
}

/**
 * Middleware-style guard: applies rate limiting + optional JWT auth.
 * Call at the top of a handler. Throws AuthError / RateLimitError on failure.
 */
export function guard(
  req: Request,
  opts: { auth?: boolean; limit?: number; windowMs?: number } = {},
): AuthContext {
  const ip = clientIpFrom(req);
  const rl = rateLimit(`api:${req.method}:${req.url.split("?")[0]}:${ip}`, {
    limit: opts.limit ?? 60,
    windowMs: opts.windowMs ?? 60_000,
  });
  if (!rl.ok) throw new RateLimitError(rl.retryAfterMs, rl.limit);

  if (opts.auth) {
    const payload = bearer(req);
    if (!payload) throw new AuthError("Missing or invalid bearer token");
    return { deviceId: payload.sub, role: payload.role };
  }
  return { deviceId: "anonymous" };
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class RateLimitError extends Error {
  retryAfterMs: number;
  limit: number;
  constructor(retryAfterMs: number, limit: number) {
    super(`Rate limit exceeded`);
    this.name = "RateLimitError";
    this.retryAfterMs = retryAfterMs;
    this.limit = limit;
  }
}

/** Wrap a handler so service/auth/rate-limit errors map to clean HTTP responses. */
export function withErrors<Args extends unknown[], T>(
  handler: (...args: Args) => Promise<T>,
  okStatus = 200,
) {
  return async (...args: Args): Promise<NextResponse> => {
    try {
      const data = await handler(...args);
      if (okStatus === 201) return jsonCreated(data);
      return jsonOk(data, okStatus);
    } catch (err) {
      if (err instanceof RateLimitError) {
        return NextResponse.json(
          { error: "Too many requests", code: "rate_limited", retryAfterMs: err.retryAfterMs },
          { status: 429, headers: { "Retry-After": String(Math.ceil(err.retryAfterMs / 1000)) } },
        );
      }
      if (err instanceof AuthError) return jsonError(err.message, 401, "unauthorized");
      if (err instanceof ValidationError) return jsonError(err.message, 400, "validation");
      if ((err as Error).name === "SessionNotFoundError")
        return jsonError((err as Error).message, 404, "not_found");
      if ((err as Error).name === "InvalidStateTransitionError")
        return jsonError((err as Error).message, 409, "invalid_state");
      console.error("[api] unexpected error", err);
      return jsonError("Internal error", 500, "internal");
    }
  };
}

/** Convenience to create a bearer-authenticated context (for handlers). */
export function requireAuth(req: Request): AuthContext {
  return guard(req, { auth: true });
}

export function getQueryParam(req: Request, name: string): string | undefined {
  const url = new URL(req.url);
  return url.searchParams.get(name) ?? undefined;
}
