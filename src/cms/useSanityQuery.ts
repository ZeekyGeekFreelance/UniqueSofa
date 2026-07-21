import { useEffect, useMemo, useRef, useState } from "react";
import {
  fetchSanityQuery,
  getSanityQueryCacheSnapshot,
  refreshSanityQuery,
} from "./queryCache";
import { isSanityConfigured, sanityClient } from "./sanityClient";

type UseSanityQueryOptions = {
  ttlMs?: number;
  refreshIntervalMs?: number;
  listenTypes?: string[];
};

function hasData(value: unknown) {
  if (value == null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

export function useSanityQuery<T>(
  query: string,
  fallbackValue: T,
  params: Record<string, unknown> = {},
  options: UseSanityQueryOptions = {},
) {
  const paramsKey = useMemo(() => JSON.stringify(params), [params]);
  const fallbackRef = useRef(fallbackValue);
  fallbackRef.current = fallbackValue;

  const snapshot = getSanityQueryCacheSnapshot<T>(query, params);
  const [data, setData] = useState<T>(() => {
    if (!isSanityConfigured || !sanityClient || !query) {
      return fallbackRef.current;
    }
    if (snapshot.exists && hasData(snapshot.value)) {
      return snapshot.value as T;
    }
    return fallbackRef.current;
  });
  const [loading, setLoading] = useState(
    Boolean(isSanityConfigured && sanityClient && query && !snapshot.exists),
  );
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!isSanityConfigured || !sanityClient || !query) {
      setData(fallbackRef.current);
      setLoading(false);
      setError(null);
      return;
    }

    let ignore = false;
    const ttlMs = options.ttlMs ?? 60_000;

    const cached = getSanityQueryCacheSnapshot<T>(query, params);
    if (cached.exists && hasData(cached.value)) {
      setData(cached.value as T);
      setLoading(false);
    } else {
      setLoading(true);
    }
    setError(null);

    fetchSanityQuery<T>(query, params, { ttlMs })
      .then((result) => {
        if (ignore) return;
        setData(hasData(result) ? (result as T) : fallbackRef.current);
      })
      .catch((nextError) => {
        if (ignore) return;
        setError(nextError);
        if (!cached.exists) {
          setData(fallbackRef.current);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [query, paramsKey, options.ttlMs]);

  useEffect(() => {
    if (!isSanityConfigured || !sanityClient || !query) return;
    if (!options.refreshIntervalMs || options.refreshIntervalMs <= 0) return;

    let active = true;
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      refreshSanityQuery<T>(query, params, { ttlMs: options.ttlMs })
        .then((result) => {
          if (!active) return;
          setData(hasData(result) ? (result as T) : fallbackRef.current);
        })
        .catch(() => {});
    }, options.refreshIntervalMs);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [query, paramsKey, options.refreshIntervalMs, options.ttlMs]);

  useEffect(() => {
    if (!isSanityConfigured || !sanityClient || !query) return;
    if (!options.listenTypes || options.listenTypes.length === 0) return;

    let cancelled = false;
    let debounceTimer: number | undefined;

    const subscription = sanityClient
      .listen(
        '*[_type in $types]',
        { types: options.listenTypes },
        { visibility: "query" },
      )
      .subscribe(() => {
        if (debounceTimer) {
          window.clearTimeout(debounceTimer);
        }
        debounceTimer = window.setTimeout(() => {
          refreshSanityQuery<T>(query, params, { ttlMs: options.ttlMs })
            .then((result) => {
              if (cancelled) return;
              setData(hasData(result) ? (result as T) : fallbackRef.current);
            })
            .catch(() => {});
        }, 250);
      });

    return () => {
      cancelled = true;
      if (debounceTimer) window.clearTimeout(debounceTimer);
      subscription.unsubscribe();
    };
  }, [query, paramsKey, options.listenTypes, options.ttlMs]);

  return {
    data,
    loading,
    error,
    fromCms: Boolean(isSanityConfigured && !error),
  };
}

