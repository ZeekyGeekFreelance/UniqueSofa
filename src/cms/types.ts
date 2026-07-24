export type CategoryFamily =
  | "hardware"
  | "electrical"
  | "structure"
  | "materials"
  | "accessories";

export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  badge?: string;
  categoryId: string;
  categoryTitle: string;
  family: CategoryFamily;
  type: string;
  summary: string;
  description: string;
  features: string[];
  specs: ProductSpec[];
  tags: string[];
  images: string[];
};

export type Category = {
  id: string;
  slug: string;
  code: string;
  title: string;
  subtitle: string;
  summary: string;
  badge?: string;
  accent: string;
  tone: string;
  family: CategoryFamily;
  items: string[];
  images: string[];
};

export type Store = {
  name: string;
  type: string;
  address: string;
  city: string;
  mapsUrl: string;
};

export type BrandConfig = {
  name: string;
  shortName: string;
  supportLabel: string;
  logoUrl?: string;
  phone: string;
  phoneRaw: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  whatsappHref: string;
  city: string;
  intro: string;
};

export type Specialization = {
  title: string;
  summary: string;
  items: string[];
};

export type HeroMediaItem = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
};

export type StatItem = {
  value: string;
  label: string;
};

export type PageCopy = {
  headerNavItems: Array<{ href: string; label: string }>;
  headerCtaLabel: string;
  home: {
    heroHappyCustomersCount: string;
    heroHappyCustomersLabel: string;
    heroFloatingCardTitle: string;
    heroFloatingCardImage: string;
    featuredRangesEyebrow: string;
    featuredRangesTitle: string;
    featuredRangesDescription: string;
    featuredProductsEyebrow: string;
    featuredProductsTitle: string;
    featuredProductsDescription: string;
    whyEyebrow: string;
    whyTitle: string;
    whyDescription: string;
    brandsEyebrow: string;
    brandsTitle: string;
    brandsDescription: string;
  };
  products: {
    heroEyebrow: string;
    heroTitle: string;
    heroDescription: string;
    summaryTitle: string;
    summaryDescription: string;
    noResultEyebrow: string;
    noResultTitle: string;
    noResultDescription: string;
    noResultResetLabel: string;
    filterFamilyLabel: string;
    filterRangeLabel: string;
    filterBrandLabel: string;
  };
  about: {
    heroEyebrow: string;
    heroTitle: string;
    heroDescription: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    modelEyebrow: string;
    modelTitle: string;
    modelDescription: string;
    brandsEyebrow: string;
    brandsTitle: string;
    brandsDescription: string;
  };
  contact: {
    heroEyebrow: string;
    heroTitle: string;
    heroDescription: string;
    quickContactEyebrow: string;
    whatsappTitle: string;
    whatsappDescription: string;
    enquiryEyebrow: string;
    enquiryTitle: string;
    enquiryDescription: string;
    enquirySentTitle: string;
    enquirySentDescription: string;
    enquirySubmitLabel: string;
    businessHoursWeekday: string;
    businessHoursSunday: string;
  };
  footer: {
    navigateTitle: string;
    storesTitle: string;
    contactTitle: string;
    bottomCaption: string;
  };
};

export type SiteContent = {
  brand: BrandConfig;
  stats: StatItem[];
  stores: Store[];
  brands: string[];
  specializations: Specialization[];
  heroMedia: HeroMediaItem[];
  categories: Category[];
  products: Product[];
  featuredCategoryIds: string[];
  featuredProductIds: string[];
  copy: PageCopy;
};

export type SiteContentQueryResult = {
  siteSettings?: Record<string, unknown> | null;
  categories?: Array<Record<string, unknown>>;
  products?: Array<Record<string, unknown>>;
};
