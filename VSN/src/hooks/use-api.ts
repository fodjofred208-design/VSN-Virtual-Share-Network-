// VSN — Hook to call the control-plane API with loading/error state
"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ApiClientError } from "@/lib/api/client";

export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Minimal external store for fetch state. Updates happen outside of render
 * (in promise callbacks) and `useSyncExternalStore` re-renders the consumer
 * when the store notifies — no setState calls inside effect bodies.
 */
class ApiStore<T> {
  private state: ApiState<T>;
  private readonly listeners = new Set<() => void>();

  constructor(initial: ApiState<T>) {
    this.state = initial;
  }

  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  readonly getSnapshot = (): ApiState<T> => this.state;

  start(): void {
    this.replace((s) => ({ ...s, loading: true, error: null }));
  }

  succeed(data: T): void {
    this.replace((s) => ({ ...s, data, loading: false }));
  }

  fail(error: string): void {
    this.replace((s) => ({ ...s, error, loading: false }));
  }

  private replace(updater: (s: ApiState<T>) => ApiState<T>): void {
    this.state = updater(this.state);
    for (const listener of [...this.listeners]) listener();
  }
}

const subscribeNoop = () => () => {};
const getTrue = () => true;
const getFalse = () => false;

export function useApi<T>(fetcher: (() => Promise<T>) | null, deps: unknown[] = []) {
  // Stable per-component store instance, created once via lazy initializer.
  const [store] = useState(() => new ApiStore<T>({ data: null, loading: fetcher !== null, error: null }));

  // Keep the latest fetcher without recreating the fetch effect.
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  // Stable string identity for the caller-provided dependency list
  // (callers pass primitives such as [userId]).
  const depsKey = useMemo(() => JSON.stringify(deps), [deps]);

  const [nonce, setNonce] = useState(0);

  const refetch = useCallback(() => {
    setNonce((n) => n + 1);
  }, []);

  useEffect(() => {
    const run = fetcherRef.current;
    if (run === null) return;
    let cancelled = false;
    store.start();
    run()
      .then((result) => {
        if (!cancelled) store.succeed(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          store.fail(err instanceof ApiClientError || err instanceof Error ? err.message : "Request failed");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [store, depsKey, nonce]);

  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

  return { data: state.data, loading: state.loading, error: state.error, refetch };
}

export function useAuthToken(): string | undefined {
  const [token] = useState<string | undefined>(() =>
    typeof window === "undefined" ? undefined : (localStorage.getItem("vsn-token") ?? undefined),
  );
  const hasMounted = useSyncExternalStore(subscribeNoop, getTrue, getFalse);
  return hasMounted ? token : undefined;
}
