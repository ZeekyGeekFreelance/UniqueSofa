// Fallback is the committed Sanity snapshot — site.ts is not involved at runtime.
// If the snapshot is also empty (first run before any seed), the mapper's own
// empty-string / empty-array defaults keep the app from crashing.
import {
  syncedCategories,
  syncedProducts,
  syncedSiteSettings,
} from "./synced-content";
import type { SiteContentQueryResult } from "./types";

export const snapshotQueryResult: SiteContentQueryResult = {
  siteSettings: syncedSiteSettings as SiteContentQueryResult["siteSettings"],
  categories: syncedCategories as SiteContentQueryResult["categories"],
  products: syncedProducts as SiteContentQueryResult["products"],
};
