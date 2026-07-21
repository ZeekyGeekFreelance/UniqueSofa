import { isSanityConfigured, sanityClient } from "./sanityClient";

type CacheEntry<T = unknown> = {
  value: T;
  expiresAt: number;
};

const DEFAULT_TTL_MS = 60 * 1000;
const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<unknown>>();

function makeKey(query: string, params: Record<string, unknown>) {
  return `${query}::${JSON.stringify(params)}`;
}

export function getSanityQueryCacheSnapshot<T>(
  query: string,
  params: Record<string, unknown> = {},
) {
  const entry = cache.get(makeKey(query, params)) as CacheEntry<T> | undefined;
  if (!entry) {
    return { exists: false as const, isStale: true, value: undefined as T | undefined };
  }

  return {
    exists: true as const,
    isStale: Date.now() >= entry.expiresAt,
    value: entry.value,
  };
}

export function clearSanityQueryCache(query?: string) {
  if (!query) {
    cache.clear();
    inflight.clear();
    return;
  }

  for (const key of cache.keys()) {
    if (key.startsWith(`${query}::`)) {
      cache.delete(key);
      inflight.delete(key);
    }
  }
}

type FetchOptions = {
  force?: boolean;
  ttlMs?: number;
};

export async function fetchSanityQuery<T>(
  query: string,
  params: Record<string, unknown> = {},
  options: FetchOptions = {},
) {
  if (!isSanityConfigured || !sanityClient || !query) return undefined;

  const key = makeKey(query, params);
  const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
  const snapshot = getSanityQueryCacheSnapshot<T>(query, params);

  if (!options.force && snapshot.exists && !snapshot.isStale) {
    return snapshot.value;
  }

  const running = inflight.get(key) as Promise<T> | undefined;
  if (running) return running;

  const request = sanityClient
    .fetch<T>(query, params)
    .then((result) => {
      cache.set(key, { value: result, expiresAt: Date.now() + ttlMs });
      return result;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, request);
  return request;
}

export function refreshSanityQuery<T>(
  query: string,
  params: Record<string, unknown> = {},
  options: Omit<FetchOptions, "force"> = {},
) {
  return fetchSanityQuery<T>(query, params, { ...options, force: true });
}

