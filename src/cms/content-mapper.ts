import type {
  Category,
  CategoryFamily,
  Product,
  SiteContent,
  SiteContentQueryResult,
} from "./types";

const knownFamilies: CategoryFamily[] = [
  "sofas", "beds", "recliners", "chairs", "dining", "tables",
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

function mapCategories(
  rawCategories: Array<Record<string, unknown>>,
): Category[] {
  return rawCategories.map((entry) => {
    const family = asString(entry.family) as CategoryFamily;
    const safeFamily = knownFamilies.includes(family) ? family : "sofas";
    return {
      id:       asString(entry.id),
      slug:     asString(entry.slug),
      code:     asString(entry.code),
      title:    asString(entry.title),
      subtitle: asString(entry.subtitle),
      summary:  asString(entry.summary),
      badge:    asString(entry.badge),
      accent:   asString(entry.accent, "#bf622c"),
      tone:     asString(entry.tone,   "#f9ece3"),
      family:   safeFamily,
      items:    asStringArray(entry.items),
      images:   asStringArray(entry.images),
    } satisfies Category;
  });
}

function mapProducts(rawProducts: Array<Record<string, unknown>>): Product[] {
  return rawProducts.map((entry) => {
    const family = asString(entry.family) as CategoryFamily;
    const safeFamily = knownFamilies.includes(family) ? family : "sofas";
    const specs = Array.isArray(entry.specs)
      ? entry.specs
          .map((item) => {
            const row = asRecord(item);
            return { label: asString(row.label), value: asString(row.value) };
          })
          .filter((item) => item.label && item.value)
      : [];
    const rawImages = Array.isArray(entry.images)
      ? (entry.images as unknown[]).map((img) => asString(img)).filter(Boolean)
      : [];
    return {
      id:            asString(entry.id),
      slug:          asString(entry.slug),
      name:          asString(entry.name),
      brand:         asString(entry.brand),
      badge:         asString(entry.badge),
      categoryId:    asString(entry.categoryId),
      categoryTitle: asString(entry.categoryTitle),
      family:        safeFamily,
      type:          asString(entry.type),
      summary:       asString(entry.summary),
      description:   asString(entry.description),
      features:      asStringArray(entry.features),
      specs,
      tags:          asStringArray(entry.tags),
      images:        rawImages,
    } satisfies Product;
  });
}

export function mapSiteContent(queryResult?: SiteContentQueryResult | null): SiteContent {
  const raw = asRecord(queryResult?.siteSettings);

  const categories = Array.isArray(queryResult?.categories) && queryResult!.categories!.length > 0
    ? mapCategories(queryResult!.categories as Array<Record<string, unknown>>)
    : [];

  const products = Array.isArray(queryResult?.products) && queryResult!.products!.length > 0
    ? mapProducts(queryResult!.products as Array<Record<string, unknown>>)
    : [];

  // If a category has no images uploaded yet, fall back to the first image
  // from any of its products. This keeps category cards populated while
  // dedicated category images are being added in Sanity Studio.
  if (categories.length > 0 && products.length > 0) {
    // Build a map: categoryId → first product image found
    const productImageByCategory = new Map<string, string>();
    for (const p of products) {
      if (p.images.length > 0 && !productImageByCategory.has(p.categoryId)) {
        productImageByCategory.set(p.categoryId, p.images[0]);
      }
    }
    for (const cat of categories) {
      if (cat.images.length === 0) {
        const fallback = productImageByCategory.get(cat.id);
        if (fallback) cat.images = [fallback];
      }
    }
  }

  const featuredCategoryIds = Array.isArray(raw.featuredCategoryIds)
    ? (raw.featuredCategoryIds as Array<Record<string, unknown>>).map((i) => asString(i.id)).filter(Boolean)
    : [];

  const featuredProductIds = Array.isArray(raw.featuredProductIds)
    ? (raw.featuredProductIds as Array<Record<string, unknown>>).map((i) => asString(i.id)).filter(Boolean)
    : [];

  const stats = Array.isArray(raw.stats)
    ? (raw.stats as Array<Record<string, unknown>>)
        .map((s) => ({ value: asString(s.value), label: asString(s.label) }))
        .filter((s) => s.value && s.label)
    : [];

  const heroMedia = Array.isArray(raw.heroMedia)
    ? (raw.heroMedia as Array<Record<string, unknown>>).map((item) => ({
        eyebrow:     asString(item.eyebrow),
        title:       asString(item.title),
        description: asString(item.description),
        image:       asString(item.image),
      }))
    : [];

  return {
    brand: {
      name:         asString(raw.brandName),
      shortName:    asString(raw.brandShortName),
      supportLabel: asString(raw.brandSupportLabel),
      logoUrl:      asString(raw.brandLogoUrl) || undefined,
      phone:        asString(raw.phoneDisplay),
      phoneRaw:     asString(raw.phoneRaw),
      phoneHref:    asString(raw.phoneHref),
      email:        asString(raw.email),
      emailHref:    asString(raw.emailHref),
      whatsappHref: asString(raw.whatsappHref),
      city:         asString(raw.city),
      intro:        asString(raw.intro),
    },
    stats,
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
      : [],
    brands: asStringArray(raw.brands),
    specializations: Array.isArray(raw.specializations)
      ? (raw.specializations as Array<Record<string, unknown>>).map((item) => ({
          title:   asString(item.title),
          summary: asString(item.summary),
          items:   asStringArray(item.items),
        }))
      : [],
    heroMedia,
    categories,
    products,
    featuredCategoryIds,
    featuredProductIds,
    copy: {
      headerNavItems: Array.isArray(raw.navItems)
        ? (raw.navItems as Array<Record<string, unknown>>)
            .map((i) => ({ href: asString(i.href), label: asString(i.label) }))
            .filter((i) => i.href && i.label && i.href !== "/catalogue")
        : [],
      headerCtaLabel: asString(raw.headerCtaLabel),
      home: {
        heroHappyCustomersCount:     asString(raw.heroHappyCustomersCount),
        heroHappyCustomersLabel:     asString(raw.heroHappyCustomersLabel),
        heroFloatingCardTitle:       asString(raw.heroFloatingCardTitle),
        heroFloatingCardImage:       asString(raw.heroFloatingCardImage),
        featuredRangesEyebrow:       asString(raw.homeFeaturedRangesEyebrow),
        featuredRangesTitle:         asString(raw.homeFeaturedRangesTitle),
        featuredRangesDescription:   asString(raw.homeFeaturedRangesDescription),
        featuredProductsEyebrow:     asString(raw.homeFeaturedProductsEyebrow),
        featuredProductsTitle:       asString(raw.homeFeaturedProductsTitle),
        featuredProductsDescription: asString(raw.homeFeaturedProductsDescription),
        whyEyebrow:                  asString(raw.homeWhyEyebrow),
        whyTitle:                    asString(raw.homeWhyTitle),
        whyDescription:              asString(raw.homeWhyDescription),
        brandsEyebrow:               asString(raw.homeBrandsEyebrow),
        brandsTitle:                 asString(raw.homeBrandsTitle),
        brandsDescription:           asString(raw.homeBrandsDescription),
      },
      products: {
        heroEyebrow:         asString(raw.productsHeroEyebrow),
        heroTitle:           asString(raw.productsHeroTitle),
        heroDescription:     asString(raw.productsHeroSubtitle),
        summaryTitle:        asString(raw.productsSummaryTitle),
        summaryDescription:  asString(raw.productsSummaryDescription),
        noResultEyebrow:     asString(raw.productsNoResultEyebrow),
        noResultTitle:       asString(raw.productsNoResultTitle),
        noResultDescription: asString(raw.productsNoResultDescription),
        noResultResetLabel:  asString(raw.productsNoResultResetLabel),
        filterFamilyLabel:   asString(raw.productsFilterFamilyLabel),
        filterRangeLabel:    asString(raw.productsFilterRangeLabel),
        filterBrandLabel:    asString(raw.productsFilterBrandLabel),
      },
      about: {
        heroEyebrow:       asString(raw.aboutHeroEyebrow),
        heroTitle:         asString(raw.aboutHeroTitle),
        heroDescription:   asString(raw.aboutHeroSubtitle),
        primaryCtaLabel:   asString(raw.aboutPrimaryCtaLabel),
        secondaryCtaLabel: asString(raw.aboutSecondaryCtaLabel),
        modelEyebrow:      asString(raw.aboutModelEyebrow),
        modelTitle:        asString(raw.aboutModelTitle),
        modelDescription:  asString(raw.aboutModelDescription),
        brandsEyebrow:     asString(raw.aboutBrandsEyebrow),
        brandsTitle:       asString(raw.aboutBrandsTitle),
        brandsDescription: asString(raw.aboutBrandsDescription),
      },
      contact: {
        heroEyebrow:            asString(raw.contactHeroEyebrow),
        heroTitle:              asString(raw.contactHeroTitle),
        heroDescription:        asString(raw.contactHeroSubtitle),
        quickContactEyebrow:    asString(raw.contactQuickContactEyebrow),
        whatsappTitle:          asString(raw.contactWhatsappTitle),
        whatsappDescription:    asString(raw.contactWhatsappDescription),
        enquiryEyebrow:         asString(raw.contactEnquiryEyebrow),
        enquiryTitle:           asString(raw.contactEnquiryTitle),
        enquiryDescription:     asString(raw.contactEnquiryDescription),
        enquirySentTitle:       asString(raw.contactEnquirySentTitle),
        enquirySentDescription: asString(raw.contactEnquirySentDescription),
        enquirySubmitLabel:     asString(raw.contactEnquirySubmitLabel),
        businessHoursWeekday:   asString(raw.contactBusinessHoursWeekday),
        businessHoursSunday:    asString(raw.contactBusinessHoursSunday),
      },
      footer: {
        navigateTitle: asString(raw.footerNavigateTitle),
        storesTitle:   asString(raw.footerStoresTitle),
        contactTitle:  asString(raw.footerContactTitle),
        bottomCaption: asString(raw.footerBottomCaption),
      },
    },
  };
}
