import { SITE_CONTENT_QUERY } from "./queries";
import { fetchSanityQuery } from "./queryCache";
import { isSanityConfigured } from "./sanityClient";

export async function preloadSanityData() {
  if (!isSanityConfigured) return;
  await Promise.allSettled([
    fetchSanityQuery(SITE_CONTENT_QUERY, {}, { ttlMs: 60_000 }),
  ]);
}

