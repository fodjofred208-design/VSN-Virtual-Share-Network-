// VSN — Route handler helpers (control-plane API)
import { NextResponse } from "next/server";
import { ValidationError } from "@/lib/validation";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonCreated<T>(data: T) {
  return NextResponse.json(data, { status: 201 });
}

export function jsonError(message: string, status = 400, code?: string) {
  return NextResponse.json({ error: message, code }, { status });
}

/** Wrap a handler so service errors map to clean HTTP responses. */
export function withErrors<Args extends unknown[], T>(
  handler: (...args: Args) => Promise<T>,
  okStatus = 200
) {
  return async (...args: Args): Promise<NextResponse> => {
    try {
      const data = await handler(...args);
      if (okStatus === 201) return jsonCreated(data);
      return jsonOk(data, okStatus);
    } catch (err) {
      if (err instanceof ValidationError) return jsonError(err.message, 400, "validation");
      if ((err as Error).name === "SessionNotFoundError") return jsonError((err as Error).message, 404, "not_found");
      if ((err as Error).name === "InvalidStateTransitionError") return jsonError((err as Error).message, 409, "invalid_state");
      console.error("[api] unexpected error", err);
      return jsonError("Internal error", 500, "internal");
    }
  };
}

export function getQueryParam(req: Request, name: string): string | undefined {
  const url = new URL(req.url);
  return url.searchParams.get(name) ?? undefined;
}
