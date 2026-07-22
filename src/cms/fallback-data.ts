import {
  BRAND,
  BRANDS,
  CATALOGUE_FILE,
  CATALOGUE_PAGES,
  CATEGORIES,
  FEATURED_CATEGORY_IDS,
  FEATURED_PRODUCT_IDS,
  FAMILY_OVERVIEW,
  HERO_MEDIA,
  PRODUCTS,
  SPECIALIZATIONS,
  STATS,
  STORES,
} from "../data/site";
import type { PageCopy, SiteContent } from "./types";

const fallbackCopy: PageCopy = {
  headerNavItems: [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/catalogue", label: "Catalogue" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  headerCtaLabel: "Get a quote",
  home: {
    heroHappyCustomersCount: "5M+",
    heroHappyCustomersLabel: "Happy Customers",
    heroFloatingCardTitle: "New Collection",
    heroFloatingCardImage: "/catalogue/hero-chair-orange.png",
    featuredRangesEyebrow: "Featured ranges",
    featuredRangesTitle: "Core ranges buyers check first.",
    featuredRangesDescription:
      "Quick visual access to sofas, recliners, custom furniture, and upholstery essentials.",
    featuredProductsEyebrow: "Featured products",
    featuredProductsTitle: "Selected stock highlights.",
    featuredProductsDescription:
      "Open key items for photos, features, and direct enquiry details.",
    whyEyebrow: "Why Unique Sofa World Furniture",
    whyTitle: "Crafted for comfort, built to last.",
    whyDescription:
      "Unique Sofa World Furniture is a trusted destination in Bengaluru for premium sofas, custom furniture, sofa repair, upholstery solutions, and handcrafted furniture designed to combine comfort, quality, and lasting style.",
    brandsEyebrow: "Brands and locations",
    brandsTitle: "Trusted lines with our Bengaluru touchpoint.",
    brandsDescription:
      "Unique Sofa World Furniture serves walk-in customers, home and office projects, and custom furniture enquiries from our Bengaluru store.",
  },
  products: {
    heroEyebrow: "Product catalogue",
    heroTitle: "Browse by range, brand, and application.",
    heroDescription:
      "Explore premium sofas, custom furniture, sofa repair, and upholstery solutions from Unique Sofa World Furniture.",
    summaryTitle: "Browse our range by category and style.",
    summaryDescription:
      "Review the full Unique Sofa World Furniture range, filter by type, and open any item for photos, features, and enquiry details.",
    noResultEyebrow: "No matches",
    noResultTitle: "Try a broader selection.",
    noResultDescription:
      "No products match this combination. Clear one or more filters to return to the wider stocked range.",
    noResultResetLabel: "Reset and view all",
    filterFamilyLabel: "Family",
    filterRangeLabel: "Range",
    filterBrandLabel: "Brand",
  },
  catalogue: {
    heroEyebrow: "Catalogue",
    heroTitle: "Browse the printed range from cover to contact details.",
    heroDescription:
      "Browse our full furniture and sofa range from the Unique Sofa World Furniture brochure before you download or enquire.",
    focusEyebrow: "Focus spread",
    browseEyebrow: "Browse spreads",
    downloadLabel: "Download brochure",
    callLabel: "Call for stock check",
    emailLabel: "Email enquiry",
  },
  about: {
    heroEyebrow: "About USW Furniture",
    heroTitle: "Crafting Comfortable Living Spaces with Quality Furniture Since 2021.",
    heroDescription:
      "Unique Sofa World Furniture is a trusted destination in Bengaluru for premium sofas, custom furniture, sofa repair, upholstery solutions, and handcrafted furniture designed to combine comfort, quality, and lasting style.",
    primaryCtaLabel: "Explore products",
    secondaryCtaLabel: "Contact us",
    modelEyebrow: "Business model",
    modelTitle: "Three supply roles that shape the business.",
    modelDescription:
      "These strengths define how Unique Sofa World Furniture delivers custom sofas, furniture manufacturing, and upholstery services to homes and businesses across Bengaluru.",
    brandsEyebrow: "Stocked brands",
    brandsTitle: "Trusted names already familiar to furniture workshops.",
    brandsDescription:
      "The Unique Sofa World Furniture range covers premium sofa materials, quality fabrics, and trusted hardware brands used in every piece we craft.",
  },
  contact: {
    heroEyebrow: "Contact Us",
    heroTitle: "Speak with us for custom orders, product guidance, and store visits.",
    heroDescription:
      "Reach Unique Sofa World Furniture by Phone, WhatsApp, or Email for custom orders, sofa repair, upholstery enquiries, and store visits.",
    quickContactEyebrow: "Quick contact",
    whatsappTitle: "WhatsApp enquiries",
    whatsappDescription: "Quick checks for stock, brands, and product photos.",
    enquiryEyebrow: "WhatsApp enquiry",
    enquiryTitle: "Send an enquiry",
    enquiryDescription:
      "Share your sofa or furniture requirement, preferred style, size, and any custom finish notes.",
    enquirySentTitle: "WhatsApp message ready",
    enquirySentDescription:
      "If WhatsApp did not open, you can still message us directly.",
    enquirySubmitLabel: "Send WhatsApp enquiry",
    businessHoursWeekday: "Daily: 10:00 AM – 9:00 PM",
    businessHoursSunday: "Daily: 10:00 AM – 9:00 PM",
  },
  footer: {
    navigateTitle: "Navigate",
    storesTitle: "Stores",
    contactTitle: "Contact",
    bottomCaption: "Premium Sofas, Custom Furniture & Upholstery Services | Bengaluru.",
  },
};

export const fallbackSiteContent: SiteContent = {
  brand: BRAND,
  stats: STATS,
  stores: STORES,
  brands: BRANDS,
  specializations: SPECIALIZATIONS,
  heroMedia: HERO_MEDIA,
  categories: CATEGORIES,
  products: PRODUCTS,
  cataloguePages: CATALOGUE_PAGES,
  catalogueFile: CATALOGUE_FILE,
  featuredCategoryIds: FEATURED_CATEGORY_IDS,
  featuredProductIds: FEATURED_PRODUCT_IDS,
  familyOverview: FAMILY_OVERVIEW,
  copy: fallbackCopy,
};

