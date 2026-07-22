// Fallback is the committed Sanity snapshot — site.ts is not involved at runtime.
// If the snapshot is also empty (first run before any seed), the mapper's own
// empty-string / empty-array defaults keep the app from crashing.
import {
  syncedCategories,
  syncedContactDetails,
  syncedFeaturedProducts,
  syncedFeaturedRanges,
  syncedProducts,
  syncedSiteSettings,
} from "./synced-content";
import type { SiteContentQueryResult } from "./types";

export const snapshotQueryResult: SiteContentQueryResult = {
  siteSettings: syncedSiteSettings as SiteContentQueryResult["siteSettings"],
  featuredRanges: syncedFeaturedRanges as SiteContentQueryResult["featuredRanges"],
  featuredProducts: syncedFeaturedProducts as SiteContentQueryResult["featuredProducts"],
  categories: syncedCategories as SiteContentQueryResult["categories"],
  products: syncedProducts as SiteContentQueryResult["products"],
};

// Re-export contact/map for any consumers that need them directly.
export { syncedContactDetails };
