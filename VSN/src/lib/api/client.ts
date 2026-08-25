// VSN — Typed API client (UI → Next.js route handlers / control plane)
// All calls go through this module; the UI never calls the DB or agent directly.

export class ApiClientError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
  }
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
  headers?: Record<string, string>;
}

export async function api<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, headers = {} } = opts;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json: unknown = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
  }

  if (!res.ok) {
    const err = (json as { error?: string; code?: string }) ?? {};
    throw new ApiClientError(err.error ?? `Request failed (${res.status})`, res.status, err.code);
  }

  return json as T;
}

export const apiClient = {
  get: <T>(path: string, token?: string) => api<T>(path, { method: "GET", token }),
  post: <T>(path: string, body?: unknown, token?: string) => api<T>(path, { method: "POST", body, token }),
  put: <T>(path: string, body?: unknown, token?: string) => api<T>(path, { method: "PUT", body, token }),
  patch: <T>(path: string, body?: unknown, token?: string) => api<T>(path, { method: "PATCH", body, token }),
  delete: <T>(path: string, token?: string) => api<T>(path, { method: "DELETE", token }),
};
