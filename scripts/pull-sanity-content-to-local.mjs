/**
 * pull-sanity-content-to-local.mjs
 *
 * Fetches all content from Sanity and writes it to src/cms/synced-content.ts
 * so the website always has real data even when Sanity is unreachable.
 *
 * Run after any CMS edit:  node scripts/pull-sanity-content-to-local.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@sanity/client";

async function loadEnv(filename) {
  try {
    const content = await fs.readFile(path.resolve(process.cwd(), filename), "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
        val = val.slice(1, -1);
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch { /* ignore */ }
}

await loadEnv(".env");
await loadEnv(".env.local");

const projectId  = process.env.VITE_SANITY_PROJECT_ID || "";
const dataset    = process.env.VITE_SANITY_DATASET || "production";
const apiVersion = process.env.VITE_SANITY_API_VERSION || "2025-01-01";
const token      = process.env.SANITY_API_TOKEN || "";

if (!projectId) { console.error("❌  Missing VITE_SANITY_PROJECT_ID in .env"); process.exit(1); }

const client = createClient({ projectId, dataset, apiVersion, token: token || undefined, useCdn: false });

const OUTPUT = path.resolve(process.cwd(), "src/cms/synced-content.ts");

const QUERY = `{
  "siteSettings": *[_type == "siteSettings" && _id == "site-settings-v1"][0]{
    brandName, brandShortName, brandSupportLabel,
    "brandLogoUrl": brandLogo.asset->url,
    phoneDisplay, phoneRaw, phoneHref,
    email, emailHref, whatsappHref, city, intro,
    catalogueFile, brands,
    navItems[]{ href, label },
    stats[]{ value, label },
    stores[]{ name, type, address, city, mapsUrl },
    specializations[]{ title, summary, items },
    familyOverview,
    headerCtaLabel,
    homeFeaturedRangesEyebrow, homeFeaturedRangesTitle, homeFeaturedRangesDescription,
    homeFeaturedProductsEyebrow, homeFeaturedProductsTitle, homeFeaturedProductsDescription,
    homeWhyEyebrow, homeWhyTitle, homeWhyDescription,
    homeBrandsEyebrow, homeBrandsTitle, homeBrandsDescription,
    productsHeroEyebrow, productsHeroTitle, productsHeroSubtitle,
    productsSummaryTitle, productsSummaryDescription,
    productsNoResultEyebrow, productsNoResultTitle, productsNoResultDescription, productsNoResultResetLabel,
    productsFilterFamilyLabel, productsFilterRangeLabel, productsFilterBrandLabel,
    catalogueHeroEyebrow, catalogueHeroTitle, catalogueHeroDescription,
    catalogueFocusEyebrow, catalogueBrowseEyebrow,
    catalogueDownloadLabel, catalogueCallLabel, catalogueEmailLabel,
    aboutHeroEyebrow, aboutHeroTitle, aboutHeroSubtitle,
    aboutPrimaryCtaLabel, aboutSecondaryCtaLabel,
    aboutModelEyebrow, aboutModelTitle, aboutModelDescription,
    aboutBrandsEyebrow, aboutBrandsTitle, aboutBrandsDescription,
    contactHeroEyebrow, contactHeroTitle, contactHeroSubtitle,
    contactQuickContactEyebrow, contactWhatsappTitle, contactWhatsappDescription,
    contactEnquiryEyebrow, contactEnquiryTitle, contactEnquiryDescription,
    contactEnquirySentTitle, contactEnquirySentDescription, contactEnquirySubmitLabel,
    contactBusinessHoursWeekday, contactBusinessHoursSunday,
    footerNavigateTitle, footerStoresTitle, footerContactTitle, footerBottomCaption,
    "heroMedia": heroMedia[]{ eyebrow, title, description, "image": image.asset->url },
    "cataloguePages": cataloguePages[]{ id, title, section, "image": image.asset->url },
    "ssFeaturedCategories": featuredCategories[]->{ "id": coalesce(id, slug.current) },
    "ssFeaturedProducts": featuredProducts[]->{ "id": coalesce(id, _id) }
  },
  "contactDetails": *[_type == "contactDetails" && _id == "contact-details-v1"][0]{
    studioName, phone, email, whatsappRaw, whatsappTemplate,
    addressArea, businessHoursWeekday, businessHoursSunday
  },
  "mapLocation": *[_type == "mapLocation" && _id == "map-location-v1"][0]{
    label, googleMapsUrl, embedUrl
  },
  "featuredRanges": *[_type == "homepageFeaturedRanges" && _id == "homepage-featured-ranges-v1"][0]{
    eyebrow, title, description,
    "categoryIds": categories[]->{ "id": coalesce(id, slug.current) }
  },
  "featuredProducts": *[_type == "homepageFeaturedProducts" && _id == "homepage-featured-products-v1"][0]{
    eyebrow, title, description,
    "productIds": products[]->{ "id": coalesce(id, _id) }
  },
  "categories": *[_type == "category" && coalesce(isPublished, true) == true]
    | order(coalesce(sortOrder, 999) asc, title asc){
      "id": coalesce(id, slug.current),
      "slug": slug.current,
      code, title, subtitle, summary, badge, accent, tone, family, items, cataloguePageIds
    },
  "products": *[_type == "product" && coalesce(isPublished, true) == true]
    | order(coalesce(sortOrder, 999) asc, _updatedAt desc){
      "id": coalesce(id, _id),
      "slug": coalesce(slug.current, _id),
      name, brand, badge,
      "categoryId": coalesce(category->id, category->slug.current),
      "categoryTitle": coalesce(category->title, ""),
      "family": coalesce(category->family, family),
      type, summary, description, features,
      specs[]{ label, value },
      tags,
      "images": images[].asset->url,
      referencePageIds
    }
}`;

console.log(`\n📥  Pulling from Sanity — project: ${projectId}  dataset: ${dataset}\n`);

let data;
try {
  data = await client.fetch(QUERY);
} catch (err) {
  console.error("❌  Fetch failed:", err.message);
  process.exit(1);
}

const { siteSettings, contactDetails, mapLocation, featuredRanges, featuredProducts, categories, products } = data;

const source = `// Auto-generated by \`npm run cms:pull\`.
// Committed snapshot — mirrors the latest Sanity content.
// Do not edit manually. Re-run \`npm run cms:pull\` after CMS changes.

export const syncedContentMeta = ${JSON.stringify({
  syncedAt: new Date().toISOString(),
  source: "sanity",
  projectId,
  dataset,
  categoriesCount: categories?.length ?? 0,
  productsCount: products?.length ?? 0,
}, null, 2)};

export const syncedSiteSettings = ${JSON.stringify(siteSettings ?? null, null, 2)};

export const syncedFeaturedRanges = ${JSON.stringify(featuredRanges ?? null, null, 2)};

export const syncedFeaturedProducts = ${JSON.stringify(featuredProducts ?? null, null, 2)};

export const syncedContactDetails = ${JSON.stringify(contactDetails ?? null, null, 2)};

export const syncedMapLocation = ${JSON.stringify(mapLocation ?? null, null, 2)};

export const syncedCategories = ${JSON.stringify(categories ?? [], null, 2)};

export const syncedProducts = ${JSON.stringify(products ?? [], null, 2)};
`;

await fs.writeFile(OUTPUT, source, "utf8");

console.log(`✅  Snapshot written to src/cms/synced-content.ts`);
console.log(`   siteSettings:   ${siteSettings ? "✓" : "empty"}`);
console.log(`   contactDetails: ${contactDetails ? "✓" : "empty"}`);
console.log(`   mapLocation:    ${mapLocation ? "✓" : "empty"}`);
console.log(`   categories:     ${categories?.length ?? 0}`);
console.log(`   products:       ${products?.length ?? 0}\n`);
