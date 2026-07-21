import { fallbackSiteContent } from "./fallback-data";
import type {
  CataloguePage,
  Category,
  CategoryFamily,
  Product,
  SiteContent,
  SiteContentQueryResult,
} from "./types";

const knownFamilies: CategoryFamily[] = [
  "hardware", "electrical", "structure", "materials", "accessories",
];

function asString(value: unknown, fallback = "") {
  if (typeof value === "string") return value.trim() || fallback;
  if (typeof value === "number") return String(value);
  return fallback;
}

function asStringArray(value: unknown, fallback: string[] = []) {
  if (!Array.isArray(value)) return fallback;
  return value.map((item) => asString(item)).filter(Boolean);
}

function asRecord(value: unknown) {
  return typeof value === "object" && value ? value as Record<string, unknown> : {};
}

function resolveCataloguePageMap(cataloguePages: CataloguePage[]) {
  return new Map(cataloguePages.map((page) => [page.id, page.image]));
}

function mapCategories(
  rawCategories: Array<Record<string, unknown>>,
  fallbackCategories: Category[],
  pageImageMap: Map<string, string>,
) {
  if (!Array.isArray(rawCategories) || rawCategories.length === 0) return fallbackCategories;

  return rawCategories.map((entry, index) => {
    const fallback = fallbackCategories[index % fallbackCategories.length];
    const family = asString(entry.family, fallback.family) as CategoryFamily;
    const safeFamily = knownFamilies.includes(family) ? family : fallback.family;
    const cataloguePageIds = asStringArray(entry.cataloguePageIds, fallback.cataloguePageIds);

    return {
      id: asString(entry.id, fallback.id),
      slug: asString(entry.slug, fallback.slug),
      code: asString(entry.code, fallback.code),
      title: asString(entry.title, fallback.title),
      subtitle: asString(entry.subtitle, fallback.subtitle),
      summary: asString(entry.summary, fallback.summary),
      badge: asString(entry.badge, fallback.badge),
      accent: asString(entry.accent, fallback.accent),
      tone: asString(entry.tone, fallback.tone),
      family: safeFamily,
      items: asStringArray(entry.items, fallback.items),
      cataloguePageIds,
      images: cataloguePageIds.map((pageId) => pageImageMap.get(pageId) || fallback.images[0]),
    } satisfies Category;
  });
}

function mapProducts(rawProducts: Array<Record<string, unknown>>, fallbackProducts: Product[]) {
  if (!Array.isArray(rawProducts) || rawProducts.length === 0) return fallbackProducts;

  return rawProducts.map((entry, index) => {
    const fallback = fallbackProducts[index % fallbackProducts.length];
    const family = asString(entry.family, fallback.family) as CategoryFamily;
    const safeFamily = knownFamilies.includes(family) ? family : fallback.family;
    const specs = Array.isArray(entry.specs)
      ? entry.specs
          .map((item) => {
            const row = asRecord(item);
            return { label: asString(row.label), value: asString(row.value) };
          })
          .filter((item) => item.label && item.value)
      : fallback.specs;

    // images: GROQ returns string[] (asset->url), fall back to local paths
    const rawImages = Array.isArray(entry.images)
      ? (entry.images as unknown[]).map((img) => asString(img)).filter(Boolean)
      : [];

    return {
      id: asString(entry.id, fallback.id),
      slug: asString(entry.slug, fallback.slug),
      name: asString(entry.name, fallback.name),
      brand: asString(entry.brand, fallback.brand),
      badge: asString(entry.badge, fallback.badge),
      categoryId: asString(entry.categoryId, fallback.categoryId),
      categoryTitle: asString(entry.categoryTitle, fallback.categoryTitle),
      family: safeFamily,
      type: asString(entry.type, fallback.type),
      summary: asString(entry.summary, fallback.summary),
      description: asString(entry.description, fallback.description),
      features: asStringArray(entry.features, fallback.features),
      specs,
      tags: asStringArray(entry.tags, fallback.tags),
      images: rawImages.length > 0 ? rawImages : fallback.images,
      referencePageIds: asStringArray(entry.referencePageIds, fallback.referencePageIds),
    } satisfies Product;
  });
}

export function mapSiteContent(queryResult?: SiteContentQueryResult | null): SiteContent {
  if (!queryResult) return fallbackSiteContent;

  const raw = asRecord(queryResult.siteSettings);
  const fallback = fallbackSiteContent;

  // Catalogue pages
  const cataloguePages = Array.isArray(raw.cataloguePages)
    ? (raw.cataloguePages as Array<Record<string, unknown>>).map((item, index) => {
        const rowFallback = fallback.cataloguePages[index % fallback.cataloguePages.length];
        return {
          id: asString(item.id, rowFallback.id),
          title: asString(item.title, rowFallback.title),
          section: asString(item.section, rowFallback.section),
          image: asString(item.image, rowFallback.image),
        } satisfies CataloguePage;
      })
    : fallback.cataloguePages;

  const pageImageMap = resolveCataloguePageMap(cataloguePages);
  const categories = mapCategories(queryResult.categories || [], fallback.categories, pageImageMap);
  const products = mapProducts(queryResult.products || [], fallback.products);

  // Featured IDs — come as [{id: string}] from reference resolution
  const featuredCategoryIds = Array.isArray(raw.featuredCategoryIds)
    ? (raw.featuredCategoryIds as Array<Record<string, unknown>>)
        .map((i) => asString(i.id))
        .filter(Boolean)
    : fallback.featuredCategoryIds;

  const featuredProductIds = Array.isArray(raw.featuredProductIds)
    ? (raw.featuredProductIds as Array<Record<string, unknown>>)
        .map((i) => asString(i.id))
        .filter(Boolean)
    : fallback.featuredProductIds;

  const familyOverview = { ...fallback.familyOverview, ...asRecord(raw.familyOverview) };

  return {
    brand: {
      ...fallback.brand,
      name:         asString(raw.brandName,         fallback.brand.name),
      shortName:    asString(raw.brandShortName,    fallback.brand.shortName),
      supportLabel: asString(raw.brandSupportLabel, fallback.brand.supportLabel),
      logoUrl:      asString(raw.brandLogoUrl,      fallback.brand.logoUrl ?? "") || undefined,
      phone:        asString(raw.phoneDisplay,      fallback.brand.phone),
      phoneRaw:     asString(raw.phoneRaw,          fallback.brand.phoneRaw),
      phoneHref:    asString(raw.phoneHref,         fallback.brand.phoneHref),
      email:        asString(raw.email,             fallback.brand.email),
      emailHref:    asString(raw.emailHref,         fallback.brand.emailHref),
      whatsappHref: asString(raw.whatsappHref,      fallback.brand.whatsappHref),
      city:         asString(raw.city,              fallback.brand.city),
      intro:        asString(raw.intro,             fallback.brand.intro),
    },
    /* Always use fallback stats — they reflect current business values.
       Sanity stats field may hold outdated data from the original seed. */
    stats: fallback.stats,
    stores: Array.isArray(raw.stores)
      ? (raw.stores as Array<Record<string, unknown>>)
          .map((item) => ({
            name:    asString(item.name),
            type:    asString(item.type),
            address: asString(item.address),
            city:    asString(item.city),
            mapsUrl: asString(item.mapsUrl),
          }))
          .filter((item) => item.name && item.mapsUrl)
      : fallback.stores,
    brands: asStringArray(raw.brands, fallback.brands),
    specializations: Array.isArray(raw.specializations)
      ? (raw.specializations as Array<Record<string, unknown>>).map((item, index) => {
          const rowFallback = fallback.specializations[index % fallback.specializations.length];
          return {
            title:   asString(item.title,   rowFallback.title),
            summary: asString(item.summary, rowFallback.summary),
            items:   asStringArray(item.items, rowFallback.items),
          };
        })
      : fallback.specializations,
    heroMedia: Array.isArray(raw.heroMedia)
      ? (raw.heroMedia as Array<Record<string, unknown>>).map((item, index) => {
          const rowFallback = fallback.heroMedia[index % fallback.heroMedia.length];
          return {
            eyebrow:     asString(item.eyebrow,     rowFallback.eyebrow),
            title:       asString(item.title,       rowFallback.title),
            description: asString(item.description, rowFallback.description),
            image:       asString(item.image,       rowFallback.image),
          };
        })
      : fallback.heroMedia,
    categories,
    products,
    cataloguePages,
    catalogueFile:      asString(raw.catalogueFile, fallback.catalogueFile),
    featuredCategoryIds: featuredCategoryIds.length > 0 ? featuredCategoryIds : fallback.featuredCategoryIds,
    featuredProductIds:  featuredProductIds.length > 0  ? featuredProductIds  : fallback.featuredProductIds,
    familyOverview,
    // All page copy falls back to hardcoded values — not editable in CMS
    copy: {
      ...fallback.copy,
      home: {
        ...fallback.copy.home,
        heroHappyCustomersCount: asString(raw.heroHappyCustomersCount, fallback.copy.home.heroHappyCustomersCount),
        heroHappyCustomersLabel: asString(raw.heroHappyCustomersLabel, fallback.copy.home.heroHappyCustomersLabel),
        heroFloatingCardTitle:   asString(raw.heroFloatingCardTitle,   fallback.copy.home.heroFloatingCardTitle),
        heroFloatingCardImage:   asString(raw.heroFloatingCardImage,   fallback.copy.home.heroFloatingCardImage),
        whyTitle:       asString(raw.homeWhyTitle,       fallback.copy.home.whyTitle),
        whyDescription: asString(raw.homeWhyDescription, fallback.copy.home.whyDescription),
      },
    },
  };
}
