import { createContext, useContext, useMemo, type ReactNode } from "react";
import { mapSiteContent } from "./content-mapper";
import { snapshotQueryResult } from "./fallback-data";
import { SITE_CONTENT_QUERY } from "./queries";
import { useSanityQuery } from "./useSanityQuery";
import type { SiteContent, SiteContentQueryResult } from "./types";

type SiteContentContextValue = {
  content: SiteContent;
  loading: boolean;
  error: unknown;
  fromCms: boolean;
};

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

type SiteContentProviderProps = {
  children: ReactNode;
};

export function SiteContentProvider({ children }: SiteContentProviderProps) {
  const queryOptions = useMemo(
    () => ({
      ttlMs: 60_000,
      refreshIntervalMs: 90_000,
    }),
    [],
  );

  const { data, loading, error, fromCms } = useSanityQuery<SiteContentQueryResult>(
    SITE_CONTENT_QUERY,
    {
      siteSettings: null,
      categories: [],
      products: [],
    },
    {},
    queryOptions,
  );

  const content = useMemo(() => {
    // Priority: live Sanity data > committed snapshot (synced-content.ts)
    if (data && (data.categories?.length || data.products?.length)) return mapSiteContent(data);
    return mapSiteContent(snapshotQueryResult);
  }, [data]);

  const value = useMemo(
    () => ({
      content,
      loading,
      error,
      fromCms,
    }),
    [content, loading, error, fromCms],
  );

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error("useSiteContent must be used inside SiteContentProvider.");
  }
  return context;
}
