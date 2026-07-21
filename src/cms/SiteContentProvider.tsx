import { createContext, useContext, useMemo, type ReactNode } from "react";
  import { mapSiteContent } from "./content-mapper";
import { fallbackSiteContent } from "./fallback-data";
import { SITE_CONTENT_QUERY } from "./queries";
import { syncedCategories, syncedFeaturedProducts, syncedFeaturedRanges, syncedProducts, syncedSiteSettings } from "./synced-content";
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
      listenTypes: ["siteSettings", "category", "product"] as string[],
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
    // Priority: live Sanity data > committed snapshot > hardcoded fallback
    if (data && (data.categories?.length || data.products?.length)) return mapSiteContent(data);
    if (syncedCategories.length || syncedProducts.length || syncedSiteSettings) {
      return mapSiteContent({
        siteSettings: syncedSiteSettings as SiteContentQueryResult["siteSettings"],
        featuredRanges: syncedFeaturedRanges as SiteContentQueryResult["featuredRanges"],
        featuredProducts: syncedFeaturedProducts as SiteContentQueryResult["featuredProducts"],
        categories: syncedCategories as SiteContentQueryResult["categories"],
        products: syncedProducts as SiteContentQueryResult["products"],
      });
    }
    return fallbackSiteContent;
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
