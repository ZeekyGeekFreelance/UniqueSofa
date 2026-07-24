/**
 * pull-sanity-content-to-local.mjs
 *
 * Fetches all content from Sanity and writes it to src/cms/synced-content.ts
 * so the website always has real data even when Sanity is unreachable.
 *
 * Run after any CMS edit:  npm run cms:pull
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
    brands,
    navItems[]{ href, label },
    stats[]{ value, label },
    stores[]{ name, type, address, city, mapsUrl },
    specializations[]{ title, summary, items },
    headerCtaLabel,
    homeFeaturedRangesEyebrow, homeFeaturedRangesTitle, homeFeaturedRangesDescription,
    homeFeaturedProductsEyebrow, homeFeaturedProductsTitle, homeFeaturedProductsDescription,
    homeWhyEyebrow, homeWhyTitle, homeWhyDescription,
    homeBrandsEyebrow, homeBrandsTitle, homeBrandsDescription,
    heroHappyCustomersCount, heroHappyCustomersLabel,
    heroFloatingCardTitle,
    "heroFloatingCardImage": heroFloatingCardImage.asset->url,
    "heroMedia": heroMedia[]{ eyebrow, title, description, "image": image.asset->url },
    productsHeroEyebrow, productsHeroTitle, productsHeroSubtitle,
    productsSummaryTitle, productsSummaryDescription,
    productsNoResultEyebrow, productsNoResultTitle, productsNoResultDescription, productsNoResultResetLabel,
    productsFilterFamilyLabel, productsFilterRangeLabel, productsFilterBrandLabel,
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
    "featuredCategoryIds": featuredCategories[]->{ "id": string::split(_id, "category-")[1] },
    "featuredProductIds": featuredProducts[]->{ "id": string::split(_id, "product-")[1] }
  },
  "categories": *[_type == "category" && coalesce(isPublished, true) == true]
    | order(coalesce(sortOrder, 999) asc, title asc){
      "id": string::split(_id, "category-")[1],
      "slug": string::split(_id, "category-")[1],
      code, title, subtitle, summary, badge, accent, tone, family, items,
      "images": coalesce(images[].asset->url, [])
    },
  "products": *[_type == "product" && coalesce(isPublished, true) == true]
    | order(coalesce(sortOrder, 999) asc, _updatedAt desc){
      "id": string::split(_id, "product-")[1],
      "slug": string::split(_id, "product-")[1],
      name, brand, badge,
      "categoryId": string::split(category._ref, "category-")[1],
      "categoryTitle": coalesce(category->title, ""),
      "family": coalesce(category->family, ""),
      type, summary, description, features,
      specs[]{ label, value },
      tags,
      "images": images[].asset->url
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

const { siteSettings, categories, products } = data;

// Strip /catalogue from navItems in case the Sanity document hasn't been
// cleaned up yet — keeps the snapshot authoritative without manual CMS edits.
if (siteSettings?.navItems) {
  siteSettings.navItems = siteSettings.navItems.filter((i) => i.href !== "/catalogue");
}

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

export const syncedCategories = ${JSON.stringify(categories ?? [], null, 2)};

export const syncedProducts = ${JSON.stringify(products ?? [], null, 2)};
`;

await fs.writeFile(OUTPUT, source, "utf8");

console.log(`✅  Snapshot written to src/cms/synced-content.ts`);
console.log(`   siteSettings: ${siteSettings ? "✓" : "empty"}`);
console.log(`   categories:   ${categories?.length ?? 0}`);
console.log(`   products:     ${products?.length ?? 0}\n`);
