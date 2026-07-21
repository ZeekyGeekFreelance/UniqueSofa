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
      "Quick visual access to recliners, leg collections, trims, and workshop essentials.",
    featuredProductsEyebrow: "Featured products",
    featuredProductsTitle: "Selected stock highlights.",
    featuredProductsDescription:
      "Open key items for photos, features, and contact-ready product details.",
    whyEyebrow: "Why Unique Sofa World Furniture",
    whyTitle: "A supply partner built around custom demand.",
    whyDescription:
      "Unique Sofa World Furniture delivers custom-made sofas, furniture manufacturing, upholstery, and expert repair services with a commitment to quality craftsmanship, personalized designs, and customer satisfaction for homes, offices, and commercial spaces across Bengaluru.",
    brandsEyebrow: "Brands and locations",
    brandsTitle: "Trusted lines with our Bengaluru touchpoint.",
    brandsDescription:
      "Unique Sofa World Furniture serves walk-in buyers, workshop restocking, and project enquiries from our store location.",
  },
  products: {
    heroEyebrow: "Product catalogue",
    heroTitle: "Browse by range, brand, and application.",
    heroDescription:
      "Explore premium sofas, custom furniture, sofa repair, and upholstery solutions from Unique Sofa World Furniture with photo-led product detail views.",
    summaryTitle: "Browse stock by family, range, and brand.",
    summaryDescription:
      "Review the live Unique Sofa World Furniture range, narrow by application, and open any item for photos, features, and enquiry details.",
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
      "Review recliners, trims, tools, legs, and workshop supplies from the Unique Sofa World Furniture brochure before you download or enquire.",
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
      "Unique Sofa World Furniture serves homes, offices, and repeat buyers with custom ranges, quality products, and direct support.",
    primaryCtaLabel: "Explore products",
    secondaryCtaLabel: "Contact the team",
    modelEyebrow: "Business model",
    modelTitle: "Three supply roles that shape the business.",
    modelDescription:
      "These strengths define how Unique Sofa World Furniture manages working inventory, stocked brands, and day-to-day service for repeat buyers.",
    brandsEyebrow: "Stocked brands",
    brandsTitle: "Trusted names already familiar to furniture workshops.",
    brandsDescription:
      "The Unique Sofa World Furniture range covers everyday upholstery materials alongside specialist hardware, fittings, and support products.",
  },
  contact: {
    heroEyebrow: "Contact Us",
    heroTitle: "Speak with the team for custom orders, product guidance, and store visits.",
    heroDescription:
      "Reach Unique Sofa World Furniture by Phone, WhatsApp, Email, or an enquiry message with the product range you need.",
    quickContactEyebrow: "Quick contact",
    whatsappTitle: "WhatsApp enquiries",
    whatsappDescription: "Quick checks for stock, brands, and product photos.",
    enquiryEyebrow: "WhatsApp enquiry",
    enquiryTitle: "Send an enquiry",
    enquiryDescription:
      "Share the product range, quantity, and any sizing or finish notes.",
    enquirySentTitle: "WhatsApp message ready",
    enquirySentDescription:
      "If WhatsApp did not open, you can still message the team directly.",
    enquirySubmitLabel: "Send WhatsApp enquiry",
    businessHoursWeekday: "Daily: 10:00 AM – 9:00 PM",
    businessHoursSunday: "Daily: 10:00 AM – 9:00 PM",
  },
  footer: {
    navigateTitle: "Navigate",
    storesTitle: "Stores",
    contactTitle: "Contact",
    bottomCaption: "Custom Sofas, Furniture Manufacturing & Upholstery Services | Bengaluru.",
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

