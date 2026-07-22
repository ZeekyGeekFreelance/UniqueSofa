import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "../sanity/schemaTypes";
import { getSanityConnection } from "./runtimeConfig";
import type { StructureResolver } from "sanity/structure";
import {
  HOMEPAGE_FEATURED_RANGES_ID,
  HOMEPAGE_FEATURED_PRODUCTS_ID,
} from "../sanity/schemaTypes/homepageCuratorType";

const sanity = getSanityConnection(import.meta.env as unknown as Record<string, unknown>);

export const SITE_SETTINGS_ID   = "site-settings-v1";
export const CONTACT_DETAILS_ID = "contact-details-v1";
export const MAP_LOCATION_ID    = "map-location-v1";

const SINGLETON_TYPES = new Set([
  "siteSettings", "contactDetails", "mapLocation",
  "homepageFeaturedRanges", "homepageFeaturedProducts",
]);
const SINGLETON_IDS = new Set([
  SITE_SETTINGS_ID, CONTACT_DETAILS_ID, MAP_LOCATION_ID,
  HOMEPAGE_FEATURED_RANGES_ID, HOMEPAGE_FEATURED_PRODUCTS_ID,
]);

function singleton(S: Parameters<StructureResolver>[0], title: string, schemaType: string, docId: string) {
  return S.listItem()
    .title(title)
    .id(docId)
    .child(
      S.editor()
        .id(docId)
        .schemaType(schemaType)
        .documentId(docId)
        .title(title)
    );
}

const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      singleton(S, "⚙️  Site Settings",  "siteSettings",  SITE_SETTINGS_ID),
      singleton(S, "📞  Contact Details", "contactDetails", CONTACT_DETAILS_ID),
      singleton(S, "📍  Map Location",    "mapLocation",    MAP_LOCATION_ID),

      S.divider(),

      S.listItem()
        .title("🏠  Homepage")
        .id("homepage-root")
        .child(
          S.list()
            .title("Homepage Sections")
            .items([
              singleton(S, "Featured Ranges",   "homepageFeaturedRanges",   HOMEPAGE_FEATURED_RANGES_ID),
              singleton(S, "Featured Products", "homepageFeaturedProducts", HOMEPAGE_FEATURED_PRODUCTS_ID),
            ])
        ),

      S.divider(),

      S.listItem()
        .title("📦  Products")
        .id("products-root")
        .child(
          S.list()
            .title("Products")
            .items([
              S.documentTypeListItem("category").title("📁  Categories"),
              S.documentTypeListItem("product").title("📦  All Products"),
              S.divider(),
              S.listItem()
                .title("🔍  Browse by Category")
                .id("products-by-category")
                .child(
                  S.documentTypeList("category")
                    .title("Category")
                    .defaultOrdering([
                      { field: "sortOrder", direction: "asc" },
                      { field: "title",     direction: "asc" },
                    ])
                    .child((categoryId) =>
                      S.documentTypeList("product")
                        .title("Products in Category")
                        .filter('_type == "product" && category._ref == $categoryId')
                        .params({ categoryId })
                        .defaultOrdering([
                          { field: "sortOrder",  direction: "asc" },
                          { field: "_updatedAt", direction: "desc" },
                        ])
                    )
                ),
            ])
        ),
    ]);

export default defineConfig({
  name: "default",
  title: sanity.studioTitle || "Unique Sofa World CMS",
  basePath: sanity.studioBasePath || "/admin",
  projectId: sanity.projectId,
  dataset: sanity.dataset || "production",
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: sanity.apiVersion || "2025-01-01" }),
  ],
  document: {
    newDocumentOptions: (prev, context) => {
      if (context.creationContext?.type !== "global") return prev;
      return prev.filter((item) => !SINGLETON_TYPES.has(item.templateId));
    },
    actions: (prev, context) => {
      const isSingleton =
        SINGLETON_TYPES.has(context.schemaType) ||
        SINGLETON_IDS.has(context.documentId || "");
      if (!isSingleton) return prev;
      return prev.filter((item) => !["duplicate", "delete"].includes(item.action || ""));
    },
  },
});
