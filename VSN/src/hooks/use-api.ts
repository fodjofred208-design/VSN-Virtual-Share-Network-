// VSN — Hook to call the control-plane API with loading/error state
"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiClientError } from "@/lib/api/client";

export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApi<T>(fetcher: (() => Promise<T>) | null, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(Boolean(fetcher));
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async () => {
    if (!fetcher) return;
    setLoading(true);
    setError(null);
    try {
      setData(await fetcher());
    } catch (err) {
      setError(err instanceof ApiClientError || err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  return { data, loading, error, refetch: run };
}

export function useAuthToken(): string | undefined {
  const [token, setToken] = useState<string | undefined>(undefined);
  useEffect(() => {
    // In a real deployment the token is obtained via /api/auth/verify.
    setToken(localStorage.getItem("vsn-token") ?? undefined);
  }, []);
  return token;
}
