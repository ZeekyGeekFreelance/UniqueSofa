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
    copy: {
      headerNavItems: Array.isArray(raw.navItems) && (raw.navItems as Array<Record<string, unknown>>).length > 0
        ? (raw.navItems as Array<Record<string, unknown>>).map((i) => ({ href: asString(i.href), label: asString(i.label) })).filter((i) => i.href && i.label)
        : fallback.copy.headerNavItems,
      headerCtaLabel: asString(raw.headerCtaLabel, fallback.copy.headerCtaLabel),
      home: {
        heroHappyCustomersCount:    asString(raw.heroHappyCustomersCount,           fallback.copy.home.heroHappyCustomersCount),
        heroHappyCustomersLabel:    asString(raw.heroHappyCustomersLabel,           fallback.copy.home.heroHappyCustomersLabel),
        heroFloatingCardTitle:      asString(raw.heroFloatingCardTitle,             fallback.copy.home.heroFloatingCardTitle),
        heroFloatingCardImage:      asString(raw.heroFloatingCardImage,             fallback.copy.home.heroFloatingCardImage),
        featuredRangesEyebrow:      asString(raw.homeFeaturedRangesEyebrow,        fallback.copy.home.featuredRangesEyebrow),
        featuredRangesTitle:        asString(raw.homeFeaturedRangesTitle,          fallback.copy.home.featuredRangesTitle),
        featuredRangesDescription:  asString(raw.homeFeaturedRangesDescription,    fallback.copy.home.featuredRangesDescription),
        featuredProductsEyebrow:    asString(raw.homeFeaturedProductsEyebrow,      fallback.copy.home.featuredProductsEyebrow),
        featuredProductsTitle:      asString(raw.homeFeaturedProductsTitle,        fallback.copy.home.featuredProductsTitle),
        featuredProductsDescription:asString(raw.homeFeaturedProductsDescription,  fallback.copy.home.featuredProductsDescription),
        whyEyebrow:                 asString(raw.homeWhyEyebrow,                   fallback.copy.home.whyEyebrow),
        whyTitle:                   asString(raw.homeWhyTitle,                     fallback.copy.home.whyTitle),
        whyDescription:             asString(raw.homeWhyDescription,               fallback.copy.home.whyDescription),
        brandsEyebrow:              asString(raw.homeBrandsEyebrow,                fallback.copy.home.brandsEyebrow),
        brandsTitle:                asString(raw.homeBrandsTitle,                  fallback.copy.home.brandsTitle),
        brandsDescription:          asString(raw.homeBrandsDescription,            fallback.copy.home.brandsDescription),
      },
      products: {
        heroEyebrow:         asString(raw.productsHeroEyebrow,          fallback.copy.products.heroEyebrow),
        heroTitle:           asString(raw.productsHeroTitle,            fallback.copy.products.heroTitle),
        heroDescription:     asString(raw.productsHeroSubtitle,         fallback.copy.products.heroDescription),
        summaryTitle:        asString(raw.productsSummaryTitle,         fallback.copy.products.summaryTitle),
        summaryDescription:  asString(raw.productsSummaryDescription,   fallback.copy.products.summaryDescription),
        noResultEyebrow:     asString(raw.productsNoResultEyebrow,      fallback.copy.products.noResultEyebrow),
        noResultTitle:       asString(raw.productsNoResultTitle,        fallback.copy.products.noResultTitle),
        noResultDescription: asString(raw.productsNoResultDescription,  fallback.copy.products.noResultDescription),
        noResultResetLabel:  asString(raw.productsNoResultResetLabel,   fallback.copy.products.noResultResetLabel),
        filterFamilyLabel:   asString(raw.productsFilterFamilyLabel,    fallback.copy.products.filterFamilyLabel),
        filterRangeLabel:    asString(raw.productsFilterRangeLabel,     fallback.copy.products.filterRangeLabel),
        filterBrandLabel:    asString(raw.productsFilterBrandLabel,     fallback.copy.products.filterBrandLabel),
      },
      catalogue: {
        heroEyebrow:     asString(raw.catalogueHeroEyebrow,     fallback.copy.catalogue.heroEyebrow),
        heroTitle:       asString(raw.catalogueHeroTitle,       fallback.copy.catalogue.heroTitle),
        heroDescription: asString(raw.catalogueHeroDescription, fallback.copy.catalogue.heroDescription),
        focusEyebrow:    asString(raw.catalogueFocusEyebrow,    fallback.copy.catalogue.focusEyebrow),
        browseEyebrow:   asString(raw.catalogueBrowseEyebrow,   fallback.copy.catalogue.browseEyebrow),
        downloadLabel:   asString(raw.catalogueDownloadLabel,   fallback.copy.catalogue.downloadLabel),
        callLabel:       asString(raw.catalogueCallLabel,       fallback.copy.catalogue.callLabel),
        emailLabel:      asString(raw.catalogueEmailLabel,      fallback.copy.catalogue.emailLabel),
      },
      about: {
        heroEyebrow:          asString(raw.aboutHeroEyebrow,          fallback.copy.about.heroEyebrow),
        heroTitle:            asString(raw.aboutHeroTitle,            fallback.copy.about.heroTitle),
        heroDescription:      asString(raw.aboutHeroSubtitle,         fallback.copy.about.heroDescription),
        primaryCtaLabel:      asString(raw.aboutPrimaryCtaLabel,      fallback.copy.about.primaryCtaLabel),
        secondaryCtaLabel:    asString(raw.aboutSecondaryCtaLabel,    fallback.copy.about.secondaryCtaLabel),
        modelEyebrow:         asString(raw.aboutModelEyebrow,         fallback.copy.about.modelEyebrow),
        modelTitle:           asString(raw.aboutModelTitle,           fallback.copy.about.modelTitle),
        modelDescription:     asString(raw.aboutModelDescription,     fallback.copy.about.modelDescription),
        brandsEyebrow:        asString(raw.aboutBrandsEyebrow,        fallback.copy.about.brandsEyebrow),
        brandsTitle:          asString(raw.aboutBrandsTitle,          fallback.copy.about.brandsTitle),
        brandsDescription:    asString(raw.aboutBrandsDescription,    fallback.copy.about.brandsDescription),
      },
      contact: {
        heroEyebrow:              asString(raw.contactHeroEyebrow,              fallback.copy.contact.heroEyebrow),
        heroTitle:                asString(raw.contactHeroTitle,                fallback.copy.contact.heroTitle),
        heroDescription:          asString(raw.contactHeroSubtitle,             fallback.copy.contact.heroDescription),
        quickContactEyebrow:      asString(raw.contactQuickContactEyebrow,      fallback.copy.contact.quickContactEyebrow),
        whatsappTitle:            asString(raw.contactWhatsappTitle,            fallback.copy.contact.whatsappTitle),
        whatsappDescription:      asString(raw.contactWhatsappDescription,      fallback.copy.contact.whatsappDescription),
        enquiryEyebrow:           asString(raw.contactEnquiryEyebrow,           fallback.copy.contact.enquiryEyebrow),
        enquiryTitle:             asString(raw.contactEnquiryTitle,             fallback.copy.contact.enquiryTitle),
        enquiryDescription:       asString(raw.contactEnquiryDescription,       fallback.copy.contact.enquiryDescription),
        enquirySentTitle:         asString(raw.contactEnquirySentTitle,         fallback.copy.contact.enquirySentTitle),
        enquirySentDescription:   asString(raw.contactEnquirySentDescription,   fallback.copy.contact.enquirySentDescription),
        enquirySubmitLabel:       asString(raw.contactEnquirySubmitLabel,       fallback.copy.contact.enquirySubmitLabel),
        businessHoursWeekday:     asString(raw.contactBusinessHoursWeekday,     fallback.copy.contact.businessHoursWeekday),
        businessHoursSunday:      asString(raw.contactBusinessHoursSunday,      fallback.copy.contact.businessHoursSunday),
      },
      footer: {
        navigateTitle: asString(raw.footerNavigateTitle, fallback.copy.footer.navigateTitle),
        storesTitle:   asString(raw.footerStoresTitle,   fallback.copy.footer.storesTitle),
        contactTitle:  asString(raw.footerContactTitle,  fallback.copy.footer.contactTitle),
        bottomCaption: asString(raw.footerBottomCaption, fallback.copy.footer.bottomCaption),
      },
    },
  };
}
