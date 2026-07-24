/**
 * seed-sanity-content.mjs
 *
 * Pushes the local site.ts data into Sanity so the CMS fields are populated.
 * Run once:  node scripts/seed-sanity-content.mjs
 *
 * Requires SANITY_API_TOKEN with write access set in .env
 */

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@sanity/client";

const MANIFEST_PATH = path.resolve(process.cwd(), "src/cms/asset-manifest.json");
let assetManifest = {};
try { assetManifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8")); } catch { /* no manifest */ }

function sanityImageRef(publicPath, key) {
  const entry = assetManifest[publicPath];
  if (!entry?.sanityAssetId) {
    console.warn(`  ⚠️  No Sanity asset for ${publicPath} — run migrate-assets-to-sanity.mjs first`);
    return null;
  }
  const ref = { _type: "image", asset: { _type: "reference", _ref: entry.sanityAssetId } };
  if (key !== undefined) ref._key = key;
  return ref;
}

// ── Load .env manually ────────────────────────────────────────────────────────
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
  } catch { /* ignore missing file */ }
}

await loadEnv(".env");
await loadEnv(".env.local");

const projectId = process.env.VITE_SANITY_PROJECT_ID || "";
const dataset   = process.env.VITE_SANITY_DATASET || "production";
const apiVersion = process.env.VITE_SANITY_API_VERSION || "2025-01-01";
const token     = process.env.SANITY_API_TOKEN || "";

if (!projectId) { console.error("❌  Missing VITE_SANITY_PROJECT_ID in .env"); process.exit(1); }
if (!token)     { console.error("❌  Missing SANITY_API_TOKEN in .env\n    Add a token with write access from sanity.io/manage → API → Tokens"); process.exit(1); }

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

// ── Site data ─────────────────────────────────────────────────────────────────

const BRAND = {
  name: "Unique Sofa World Furniture",
  shortName: "Unique Sofa World",
  supportLabel: "Crafting Comfortable Living Spaces",
  phone: "+91 95911 67804",
  phoneHref: "tel:+919591167804",
  phoneRaw: "919591167804",
  email: "uniquesofaworldfurniture@gmail.com",
  emailHref: "mailto:uniquesofaworldfurniture@gmail.com",
  whatsappHref: "https://wa.me/919591167804?text=Hello%2C%20I%27m%20interested%20in%20your%20furniture%20and%20sofa%20services.%20Could%20you%20please%20assist%20me%3F",
  city: "Bengaluru, India",
  intro: "Unique Sofa World Furniture is a trusted custom furniture manufacturer and dealer in Bengaluru. We specialize in premium sofas, beds, dining tables, modular furniture, and offer expert sofa repair and upholstery services for residential, commercial, and industrial spaces.",
};

const STATS = [
  { value: "2021", label: "Established" },
  { value: "500+", label: "Products & Projects" },
  { value: "1", label: "Store location" },
  { value: "5K+", label: "Happy customers" },
];

const STORES = [
  { name: "Unique Sofa World Furniture", type: "Main Store & Workshop", address: "Sri Sai Himaja Apartment, 307/2, Nyanappana Halli Main Rd, 11th Cross Rd, Devarachikkana Halli", city: "Bengaluru 560114", mapsUrl: "https://maps.app.goo.gl/Lohwr2jbq6ZcmedM9" },
];

const BRANDS = ["Unique Sofa World", "Custom Craft", "Premium Wood", "Steel Masters", "Luxury Comfort"];

const SPECIALIZATIONS = [
  { title: "Custom Furniture Manufacturing", summary: "Bespoke furniture crafted to your exact specifications. We build sofas, beds, dining tables, and office furniture tailored to your space.", items: ["Custom Sofas & Sofa Sets", "Bed Manufacturing", "Wooden & Steel Furniture", "Modular Furniture"] },
  { title: "Sofa Repair & Restoration", summary: "Expert repair and re-upholstery services to bring your worn-out sofas and furniture back to life with premium materials.", items: ["Sofa & Sofa Set Repair", "Fabric & Leather Re-upholstery", "Frame Structural Repair", "Cushion Refill"] },
  { title: "Residential & Commercial Furniture", summary: "Providing complete furniture solutions for homes, hotels, restaurants, offices, hospitals, and corporate spaces.", items: ["Living & Bedroom Furniture", "Office & Corporate Desks", "Outdoor Furniture Solutions", "Hotel & Restaurant Seating"] },
];

const HERO_MEDIA = [
  { eyebrow: "New Collection",  title: "Modern",  description: "Discover our premium selection of modern seating designed for unparalleled comfort and style.",    image: "/heroChair.png" },
  { eyebrow: "Luxury Living",   title: "Comfort", description: "Handcrafted sofas built to elevate your living spaces with premium fabrics and timeless design.", image: "/sofa.png"      },
  { eyebrow: "Premium Beds",    title: "Serene",  description: "Elegant bed frames crafted for restful spaces - where quality meets lasting style.",               image: "/bed.png"       },
];

const CATEGORIES = [
  {
    id: "sofas", code: "SF", title: "Sofas", subtitle: "Comfortable seating for every home",
    summary: "Premium handcrafted sofas in modern, luxury, sectional, and custom designs.",
    badge: "Best Seller", accent: "#bf622c", tone: "#f9ece3", family: "sofas",
    items: ["3-Seater", "L-Shape", "Sectional", "Chesterfield", "Modern", "Luxury", "Wooden"],
    images: ["/catalogue/page-001.jpg", "/catalogue/page-002.jpg", "/catalogue/page-003.jpg"],
  },
  {
    id: "beds", code: "BD", title: "Beds", subtitle: "Crafted for comfort and style",
    summary: "Custom wooden and upholstered beds designed for durability and elegant bedrooms.",
    badge: "Popular", accent: "#2563eb", tone: "#e9f1ff", family: "beds",
    items: ["King Size", "Queen Size", "Storage", "Upholstered", "Wooden"],
    images: ["/catalogue/page-008.jpg", "/catalogue/page-009.jpg", "/catalogue/page-010.jpg"],
  },
  {
    id: "recliners", code: "RC", title: "Recliners", subtitle: "Relax in premium comfort",
    summary: "Manual and premium recliners with ergonomic support and luxurious cushioning.",
    badge: "Premium", accent: "#7c3aed", tone: "#f1eaff", family: "recliners",
    items: ["Manual", "Rocker", "Swivel", "Premium"],
    images: ["/catalogue/page-004.jpg", "/catalogue/page-005.jpg", "/catalogue/page-006.jpg"],
  },
  {
    id: "chairs", code: "CH", title: "Chairs", subtitle: "Stylish seating solutions",
    summary: "Wooden, accent, dining, and sofa chairs handcrafted for homes and offices.",
    badge: "", accent: "#1f8f56", tone: "#eaf7ef", family: "seating",
    items: ["Sofa Chairs", "Wooden Chairs", "Accent Chairs", "Lounge Chairs"],
    images: ["/catalogue/page-011.jpg", "/catalogue/page-012.jpg", "/catalogue/page-013.jpg"],
  },
  {
    id: "dining-tables", code: "DT", title: "Dining Tables", subtitle: "Elegant dining experiences",
    summary: "Modern and classic dining tables available in multiple sizes and finishes.",
    badge: "New", accent: "#d62e63", tone: "#ffe8f0", family: "dining",
    items: ["4-Seater", "6-Seater", "8-Seater", "Marble Top"],
    images: ["/catalogue/page-014.jpg", "/catalogue/page-015.jpg", "/catalogue/page-016.jpg"],
  },
  {
    id: "center-tables", code: "CT", title: "Center Tables", subtitle: "Complete your living space",
    summary: "Contemporary center and coffee tables crafted from premium materials.",
    badge: "", accent: "#1186a0", tone: "#e7f8fb", family: "furniture",
    items: ["Center Tables", "Coffee Tables", "Side Tables", "Nesting Tables"],
    images: ["/catalogue/page-017.jpg", "/catalogue/page-018.jpg", "/catalogue/page-019.jpg"],
  },
];

const FEATURED_CATEGORY_IDS = ["sofas", "beds", "recliners", "chairs", "dining-tables", "center-tables"];

// image pool per category — cycles through available catalogue pages
const CAT_IMAGES = {
  "sofas":         ["/catalogue/page-001.jpg","/catalogue/page-002.jpg","/catalogue/page-003.jpg","/catalogue/page-007.jpg"],
  "beds":          ["/catalogue/page-008.jpg","/catalogue/page-009.jpg","/catalogue/page-010.jpg","/catalogue/page-015.jpg"],
  "recliners":     ["/catalogue/page-004.jpg","/catalogue/page-005.jpg","/catalogue/page-006.jpg","/catalogue/page-011.jpg"],
  "chairs":        ["/catalogue/page-011.jpg","/catalogue/page-012.jpg","/catalogue/page-013.jpg","/catalogue/page-006.jpg"],
  "dining-tables": ["/catalogue/page-014.jpg","/catalogue/page-015.jpg","/catalogue/page-016.jpg","/catalogue/page-005.jpg"],
  "center-tables": ["/catalogue/page-017.jpg","/catalogue/page-018.jpg","/catalogue/page-019.jpg","/catalogue/page-012.jpg"],
};

const PRODUCT_SPECS = {
  "sofas":         { brand: "Unique Sofa World", availability: "Custom Made to Order", services: "Delivery, Setup, Repair" },
  "beds":          { brand: "Unique Sofa World", availability: "Custom Made to Order", services: "Delivery, Setup, Repair" },
  "recliners":     { brand: "Unique Sofa World", availability: "In Stock & Custom",    services: "Delivery, Setup" },
  "chairs":        { brand: "Unique Sofa World", availability: "Custom Made to Order", services: "Delivery, Setup, Repair" },
  "dining-tables": { brand: "Unique Sofa World", availability: "Custom Made to Order", services: "Delivery, Setup" },
  "center-tables": { brand: "Unique Sofa World", availability: "Custom Made to Order", services: "Delivery, Setup" },
};

const PRODUCTS = CATEGORIES.flatMap((cat) =>
  cat.items.map((item, idx) => {
    const pool = CAT_IMAGES[cat.id];
    const imgs = [pool[idx % pool.length], pool[(idx + 1) % pool.length], pool[(idx + 2) % pool.length]];
    const spec = PRODUCT_SPECS[cat.id];
    return {
      id: `${cat.id}-${item.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
      name: item,
      brand: spec.brand,
      badge: idx === 0 ? (cat.badge || "") : "",
      categoryId: cat.id,
      categoryTitle: cat.title,
      family: cat.family,
      type: cat.subtitle,
      summary: `Premium ${item} by Unique Sofa World — handcrafted for quality and lasting comfort.`,
      description: `Our ${item} is part of the ${cat.title} collection. Designed for ${cat.subtitle.toLowerCase()}, each piece is built to order using premium materials suited for residential and commercial spaces across Bengaluru.`,
      features: [
        `Handcrafted ${item} built to your exact size and fabric preference.`,
        `Suitable for residential homes, offices, hotels, and commercial spaces.`,
        `Available for custom orders, quick visits, and doorstep delivery.`,
      ],
      specs: [
        { label: "Category",     value: cat.title },
        { label: "Brand",        value: spec.brand },
        { label: "Availability", value: spec.availability },
        { label: "Application",  value: cat.subtitle },
        { label: "Services",     value: spec.services },
      ],
      tags: [cat.title, item, spec.brand],
      images: imgs,
    };
  })
);

const FEATURED_PRODUCT_IDS = [
  "sofas-3-seater", "sofas-l-shape", "sofas-luxury",
  "beds-king-size", "beds-upholstered",
  "recliners-premium",
  "chairs-lounge-chairs",
  "dining-tables-6-seater",
].slice(0, 8);

// ── Seed ──────────────────────────────────────────────────────────────────────

async function upsert(doc) { return client.createOrReplace(doc); }

async function seedSiteSettings() {
  console.log("  Seeding siteSettings...");
  await upsert({
    _id: "site-settings-v1", _type: "siteSettings",
    brandName: BRAND.name, brandShortName: BRAND.shortName, brandSupportLabel: BRAND.supportLabel,
    phoneDisplay: BRAND.phone, phoneRaw: BRAND.phoneRaw, phoneHref: BRAND.phoneHref,
    email: BRAND.email, emailHref: BRAND.emailHref, whatsappHref: BRAND.whatsappHref,
    city: BRAND.city, intro: BRAND.intro,
    brands: BRANDS,
    navItems: [
      { _key: "nav-0", href: "/", label: "Home" },
      { _key: "nav-1", href: "/products", label: "Products" },
      { _key: "nav-3", href: "/about", label: "About" },
      { _key: "nav-4", href: "/contact", label: "Contact" },
    ],
    stats: STATS.map((s, i) => ({ _key: `stat-${i}`, value: s.value, label: s.label })),
    stores: STORES.map((s, i) => ({
      _key: `store-${i}`,
      name: s.name,
      type: s.type,
      address: s.address,
      city: s.city,
      mapsUrl: s.mapsUrl,
    })),
    specializations: SPECIALIZATIONS.map((s, i) => ({
      _key: `spec-${i}`,
      title: s.title,
      summary: s.summary,
      items: s.items,
    })),
    heroMedia: HERO_MEDIA.map((h, i) => ({
      _key: `hero-${i}`,
      eyebrow: h.eyebrow,
      title: h.title,
      description: h.description,
      image: sanityImageRef(h.image),
    })).filter((h) => h.image !== null),
    featuredCategories: FEATURED_CATEGORY_IDS.map((id, i) => ({
      _key: `fc-${i}`, _type: "reference", _weak: true, _ref: `category-${id}`,
    })),
    featuredProducts: FEATURED_PRODUCT_IDS.map((id, i) => ({
      _key: `fp-${i}`, _type: "reference", _weak: true, _ref: `product-${id}`,
    })),
    headerCtaLabel: "Request a Visit",
    heroHappyCustomersCount: "5K+",
    heroHappyCustomersLabel: "Happy Customers",
    heroFloatingCardTitle: "Custom Sofas",
    heroFloatingCardImage: sanityImageRef("/catalogue/hero-sofa.png"),
    homeFeaturedRangesEyebrow: "Furniture categories",
    homeFeaturedRangesTitle: "Designed for every space in your life.",
    homeFeaturedRangesDescription: "From residential homes to hotels and corporate spaces, explore our carefully categorized furniture solutions.",
    homeFeaturedProductsEyebrow: "Our specialties",
    homeFeaturedProductsTitle: "Premium products and expert repair.",
    homeFeaturedProductsDescription: "View our custom manufactured pieces and learn about our dedicated sofa and furniture repair services.",
    homeWhyEyebrow: "Why Unique Sofa World",
    homeWhyTitle: "Custom built. Expertly repaired. Beautifully designed.",
    homeWhyDescription: "As a premier furniture dealer and custom manufacturer, we offer exceptional sofa manufacturing, bed manufacturing, and comprehensive repair & restoration services.",
    homeBrandsEyebrow: "Our Clients & Reach",
    homeBrandsTitle: "Serving homes, offices, and commercial spaces.",
    homeBrandsDescription: "We provide furniture solutions for Residential Homes, Hotels, Restaurants, Offices, Hospitals, and Industrial Facilities with guaranteed service and delivery.",
    productsHeroEyebrow: "Furniture collection",
    productsHeroTitle: "Browse our extensive furniture range.",
    productsHeroSubtitle: "Discover sofas, beds, dining sets, modular units, and designer pieces crafted to perfection.",
    productsSummaryTitle: "Filter by category and style.",
    productsSummaryDescription: "Browse all Unique Sofa World products, from luxury designer pieces to sturdy office setups and custom outdoor furniture.",
    productsNoResultEyebrow: "No results",
    productsNoResultTitle: "No products match your filters.",
    productsNoResultDescription: "Try adjusting the family, range, or brand filter to find what you need.",
    productsNoResultResetLabel: "Clear filters",
    productsFilterFamilyLabel: "Family",
    productsFilterRangeLabel: "Range",
    productsFilterBrandLabel: "Collection",
    aboutHeroEyebrow: "About Unique Sofa World",
    aboutHeroTitle: "Your Trusted Custom Furniture Manufacturer & Dealer.",
    aboutHeroSubtitle: "We specialize in custom furniture, sofa manufacturing, bed manufacturing, and expert repair services across Bengaluru.",
    aboutPrimaryCtaLabel: "View our work",
    aboutSecondaryCtaLabel: "Contact us",
    aboutModelEyebrow: "Our core services",
    aboutModelTitle: "Manufacturing, Supply, and Restoration.",
    aboutModelDescription: "We don't just sell furniture. We are a custom furniture manufacturer, a reliable office furniture supplier, and specialists in sofa repair and restoration.",
    aboutBrandsEyebrow: "Materials & Quality",
    aboutBrandsTitle: "Built with the best Wood, Steel, and Frame Materials.",
    aboutBrandsDescription: "Our furniture features premium wooden frames and cane frames, crafted to ensure durability for residential, corporate, and commercial use.",
    contactHeroEyebrow: "Contact Us",
    contactHeroTitle: "Get in touch for custom orders, repairs, or a quick visit.",
    contactHeroSubtitle: "Reach out to Unique Sofa World for your furniture needs. We offer a shop-in-store experience and reliable delivery services.",
    contactQuickContactEyebrow: "Quick connect",
    contactWhatsappTitle: "WhatsApp us",
    contactWhatsappDescription: "Fast replies for custom quotes, repair queries, and site visits.",
    contactEnquiryEyebrow: "Send an enquiry",
    contactEnquiryTitle: "Discuss your project",
    contactEnquiryDescription: "Tell us about your home or commercial furniture requirements, or share pictures of the sofa you need repaired.",
    contactEnquirySentTitle: "WhatsApp ready",
    contactEnquirySentDescription: "If WhatsApp didn't launch, please message us directly.",
    contactEnquirySubmitLabel: "Send via WhatsApp",
    contactBusinessHoursWeekday: "Daily: 10:00 AM – 9:00 PM",
    contactBusinessHoursSunday: "Daily: 10:00 AM – 9:00 PM",
    footerNavigateTitle: "Navigate",
    footerStoresTitle: "Visit Us",
    footerContactTitle: "Get in Touch",
    footerBottomCaption: "Unique Sofa World Furniture | Custom Sofas, Beds & Repair Services.",
  });
  console.log("  ✓ siteSettings");
}

async function seedCategories() {
  console.log("  Seeding categories...");
  for (const [i, cat] of CATEGORIES.entries()) {
    await upsert({
      _id: `category-${cat.id}`, _type: "category",
      id: cat.id,
      slug: { _type: "slug", current: cat.id },
      code: cat.code, title: cat.title, subtitle: cat.subtitle, summary: cat.summary,
      badge: cat.badge || "", accent: cat.accent, tone: cat.tone, family: cat.family,
      items: cat.items,
      images: cat.images.map((img, ii) => sanityImageRef(img, `img-${ii}`)).filter(Boolean),
      sortOrder: (i + 1) * 10, isPublished: true,
    });
    process.stdout.write(`    ${i + 1}/${CATEGORIES.length} ${cat.title}          \r`);
  }
  console.log(`\n  ✓ ${CATEGORIES.length} categories`);
}

async function seedProducts() {
  console.log("  Seeding products...");
  for (const [i, p] of PRODUCTS.entries()) {
    await upsert({
      _id: `product-${p.id}`, _type: "product",
      name: p.name, brand: p.brand, badge: p.badge || "",
      category: { _type: "reference", _weak: true, _ref: `category-${p.categoryId}` },
      type: p.type, summary: p.summary, description: p.description,
      features: p.features,
      specs: p.specs.map((s, si) => ({ _key: `spec-${si}`, label: s.label, value: s.value })),
      tags: p.tags,
      images: p.images.map((img, ii) => sanityImageRef(img, `img-${ii}`)).filter(Boolean),
      sortOrder: (i + 1) * 10, isPublished: true,
    });
    process.stdout.write(`    ${i + 1}/${PRODUCTS.length} ${p.name}          \r`);
  }
  console.log(`\n  ✓ ${PRODUCTS.length} products`);
}

async function seedContactDetails() {
  console.log("  Seeding contactDetails...");
  await upsert({
    _id: "contact-details-v1", _type: "contactDetails",
    studioName: BRAND.name,
    phone: BRAND.phone,
    email: BRAND.email,
    whatsappRaw: BRAND.phoneRaw,
    whatsappTemplate: BRAND.whatsappHref.split("text=")[1] || "Hello, I'm interested in your furniture and sofa services.",
    addressArea: "Devarachikkana Halli, Bengaluru",
    businessHoursWeekday: "Daily: 10:00 AM – 9:00 PM",
    businessHoursSunday: "Daily: 10:00 AM – 9:00 PM",
  });
  console.log("  ✓ contactDetails");
}

async function seedMapLocation() {
  console.log("  Seeding mapLocation...");
  await upsert({
    _id: "map-location-v1", _type: "mapLocation",
    label: "Unique Sofa World Furniture, Devarachikkana Halli, Bengaluru",
    googleMapsUrl: "https://maps.app.goo.gl/Lohwr2jbq6ZcmedM9",
    embedUrl: "https://www.google.com/maps?q=12.8711681,77.6163365&output=embed",
  });
  console.log("  ✓ mapLocation");
}

console.log(`\n🌱  Seeding Sanity — project: ${projectId}  dataset: ${dataset}\n`);
try {
  await seedSiteSettings();
  await seedContactDetails();
  await seedMapLocation();
  await seedCategories();
  await seedProducts();
  console.log("\n✅  Seed complete. Open /admin to verify the content.\n");
} catch (err) {
  console.error("\n❌  Seed failed:", err.message);
  process.exit(1);
}
