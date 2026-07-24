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

const catalogueMeta = [
  { id: "01", title: "Cover", section: "Brand identity" },
  { id: "02", title: "Sofas", section: "Living Room" },
  { id: "03", title: "Sofa Sets", section: "Living Room" },
  { id: "04", title: "Beds", section: "Bedroom" },
  { id: "05", title: "Dining Tables", section: "Dining Room" },
  { id: "06", title: "Chairs", section: "Seating" },
  { id: "07", title: "Modular Furniture", section: "Modern Living" },
  { id: "08", title: "Designer Furniture", section: "Luxury" },
  { id: "09", title: "Kids Furniture", section: "Bedroom" },
  { id: "10", title: "Wood & Steel Materials", section: "Materials" },
  { id: "11", title: "Wooden & Cane Frames", section: "Frames" },
  { id: "12", title: "Office Furniture", section: "Commercial" },
  { id: "13", title: "Outdoor Furniture", section: "Exterior" },
  { id: "14", title: "Sofa Repair Services", section: "Services" },
  { id: "15", title: "Custom Manufacturing", section: "Services" },
  { id: "16", title: "Contact and Info", section: "Company details" },
];

const CATALOGUE_PAGES = catalogueMeta.map((p, i) => ({
  ...p,
  image: `/catalogue/page-${String(i).padStart(3, "0")}.jpg`,
}));

const CATEGORIES = [
  { id: "living-room", code: "LR", title: "Living Room Furniture", subtitle: "Sofas, Chairs, and Tables", summary: "Premium living room furniture including single sofas, large sofa sets, and stylish chairs.", badge: "Best seller", accent: "#bf622c", tone: "#f9ece3", family: "furniture", cataloguePageIds: ["02","03","06"], items: ["Sofas", "Sofa Sets", "Living Room Chairs"] },
  { id: "bedroom", code: "BR", title: "Bedroom Furniture", subtitle: "Beds and Kids Furniture", summary: "Comfortable and stylish bedroom furniture including custom beds and safe kids furniture.", badge: "Custom", accent: "#2563eb", tone: "#e9f1ff", family: "furniture", cataloguePageIds: ["04","09"], items: ["Custom Beds", "Kids Furniture", "Bedroom Wardrobes"] },
  { id: "dining", code: "DN", title: "Dining Furniture", subtitle: "Dining Tables and Chairs", summary: "Elegant dining tables and chairs for residential and commercial dining spaces.", badge: "", accent: "#7c3aed", tone: "#f1eaff", family: "furniture", cataloguePageIds: ["05","06"], items: ["Dining Tables", "Dining Chairs", "Dining Sets"] },
  { id: "office", code: "OF", title: "Office Furniture", subtitle: "Workspaces and Desks", summary: "Professional office furniture including desks, ergonomic chairs, and modular setups.", badge: "", accent: "#1f8f56", tone: "#eaf7ef", family: "furniture", cataloguePageIds: ["12","07"], items: ["Office Desks", "Executive Chairs", "Conference Tables"] },
  { id: "luxury-designer", code: "LD", title: "Luxury & Designer", subtitle: "Premium bespoke pieces", summary: "Exclusive luxury and designer furniture customized to your exact requirements and premium aesthetic.", badge: "Premium", accent: "#d62e63", tone: "#ffe8f0", family: "furniture", cataloguePageIds: ["08"], items: ["Luxury Sofas", "Designer Chairs", "Statement Beds"] },
  { id: "modular-outdoor", code: "MO", title: "Modular & Outdoor", subtitle: "Modern and Patio Furniture", summary: "Durable outdoor furniture solutions and smart modular furniture for modern spaces.", badge: "", accent: "#ce6a2c", tone: "#fdf0e6", family: "furniture", cataloguePageIds: ["07","13"], items: ["Modular Storage", "Outdoor Seating", "Patio Sets"] },
  { id: "materials-frames", code: "MF", title: "Materials & Frames", subtitle: "Wood, Steel, and Cane", summary: "High-quality raw materials and sturdy frames ensuring longevity and structural integrity.", badge: "", accent: "#1186a0", tone: "#e7f8fb", family: "materials", cataloguePageIds: ["10","11"], items: ["Premium Wood", "Steel Components", "Wooden Frames", "Cane Frames"] },
  { id: "services", code: "SV", title: "Expert Services", subtitle: "Manufacturing and Repair", summary: "Comprehensive services including custom manufacturing, sofa repair, delivery, and quick visits.", badge: "Core", accent: "#5b3fd1", tone: "#eee8ff", family: "services", cataloguePageIds: ["14","15"], items: ["Custom Furniture Manufacturing", "Sofa & Sofa Set Repair", "Delivery & Installation"] },
];

const FEATURED_CATEGORY_IDS = ["living-room", "bedroom", "luxury-designer", "services", "office", "dining"];

const CATEGORY_BRANDS = {
  "living-room": ["Unique Sofa World", "Luxury Comfort"],
  "bedroom": ["Unique Sofa World", "Custom Craft"],
  "dining": ["Unique Sofa World", "Premium Wood"],
  "office": ["Unique Sofa World", "Steel Masters"],
  "luxury-designer": ["Custom Craft", "Luxury Comfort"],
  "modular-outdoor": ["Unique Sofa World", "Steel Masters"],
  "materials-frames": ["Premium Wood", "Steel Masters"],
  "services": ["Unique Sofa World"],
};

function slugify(v) { return v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
function imageForPage(pageId) {
  const i = catalogueMeta.findIndex((p) => p.id === pageId);
  return `/catalogue/page-${String(i < 0 ? 0 : i).padStart(3, "0")}.jpg`;
}

const PRODUCTS = CATEGORIES.flatMap((cat) => {
  const brands = CATEGORY_BRANDS[cat.id] || [BRANDS[0]];
  return cat.items.map((item, idx) => {
    const brand = brands[idx % brands.length];
    const pageIds = cat.cataloguePageIds.length > 2
      ? [cat.cataloguePageIds[idx % cat.cataloguePageIds.length], cat.cataloguePageIds[(idx+1) % cat.cataloguePageIds.length], cat.cataloguePageIds[(idx+2) % cat.cataloguePageIds.length]]
      : [cat.cataloguePageIds[idx % cat.cataloguePageIds.length], cat.cataloguePageIds[(idx+1) % cat.cataloguePageIds.length], cat.cataloguePageIds[idx % cat.cataloguePageIds.length]];
    return {
      id: `${cat.id}-${slugify(item)}`,
      slug: slugify(`${cat.id}-${item}`),
      name: item, brand,
      badge: idx === 0 ? (cat.badge || "") : "",
      categoryId: cat.id, categoryTitle: cat.title, family: cat.family, type: cat.subtitle,
      summary: `Premium ${item} crafted by Unique Sofa World for ${cat.title.toLowerCase()} requirements.`,
      description: `${item} from our ${cat.title} range. We provide top-quality ${cat.subtitle.toLowerCase()} suitable for Residential Homes, Hotels, Restaurants, Offices, Hospitals, Corporate Spaces, and Commercial Properties.`,
      features: [`High-quality ${item} suited for modern spaces.`, `Suitable for: Residential, Commercial, and Corporate use.`, `Available for custom sizing, quick visits, and delivery.`],
      specs: [{ label: "Range", value: cat.title }, { label: "Family", value: cat.family }, { label: "Manufacturer", value: brand }, { label: "Availability", value: "Custom Made to Order" }, { label: "Application", value: cat.subtitle }, { label: "Services", value: "Delivery, Setup, Repair" }],
      tags: [brand, cat.title, item.split(" ").slice(-1)[0] || cat.code],
      images: pageIds.map(imageForPage),
      referencePageIds: pageIds,
    };
  });
});

const FEATURED_PRODUCT_IDS = PRODUCTS
  .filter((p) => p.badge || ["living-room", "luxury-designer", "services", "bedroom"].includes(p.categoryId))
  .slice(0, 8).map((p) => p.id);

// ── Seed ──────────────────────────────────────────────────────────────────────

async function upsert(doc) { return client.createOrReplace(doc); }

async function seedHomepageCurators() {
  console.log("  Seeding homepage curators...");
  await upsert({
    _id: "homepage-featured-ranges-v1", _type: "homepageFeaturedRanges",
    eyebrow: "Featured categories",
    title: "Discover our core furniture collections.",
    description: "Explore our premium living room sofas, custom bedroom setups, and luxury designer pieces crafted just for you.",
    categories: FEATURED_CATEGORY_IDS.map((id) => ({
      _key: `cat-ref-${id}`,
      _type: "reference",
      _weak: true,
      _ref: `category-${id}`,
    })),
  });
  
  await upsert({
    _id: "homepage-featured-products-v1", _type: "homepageFeaturedProducts",
    eyebrow: "Featured furniture & services",
    title: "Selected highlights and popular items.",
    description: "Browse our most requested furniture sets and specialized services including sofa repair and custom manufacturing.",
    products: FEATURED_PRODUCT_IDS.map((id) => ({
      _key: `prod-ref-${id}`,
      _type: "reference",
      _weak: true,
      _ref: `product-${id}`,
    })),
  });
  console.log("  ✓ homepage curators");
}

async function seedSiteSettings() {
  console.log("  Seeding siteSettings...");
  await upsert({
    _id: "site-settings-v1", _type: "siteSettings",
    brandName: BRAND.name, brandShortName: BRAND.shortName, brandSupportLabel: BRAND.supportLabel,
    phoneDisplay: BRAND.phone, phoneRaw: BRAND.phoneRaw, phoneHref: BRAND.phoneHref,
    email: BRAND.email, emailHref: BRAND.emailHref, whatsappHref: BRAND.whatsappHref,
    city: BRAND.city, intro: BRAND.intro,
    catalogueFile: "/catalogue/dtc-catalogue.pdf",
    brands: BRANDS,
    navItems: [
      { _key: "nav-0", href: "/", label: "Home" },
      { _key: "nav-1", href: "/products", label: "Products" },
      { _key: "nav-2", href: "/catalogue", label: "Catalogue" },
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
    cataloguePages: CATALOGUE_PAGES.map((p, i) => ({
      _key: `catpage-${i}`,
      id: p.id,
      title: p.title,
      section: p.section,
      image: sanityImageRef(p.image),
    })).filter((p) => p.image !== null),
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
    catalogueHeroEyebrow: "Catalogue",
    catalogueHeroTitle: "Explore our full range of offerings.",
    catalogueHeroDescription: "Browse through our collection of premium sofas, custom beds, materials, and comprehensive repair services.",
    catalogueFocusEyebrow: "Focus view",
    catalogueBrowseEyebrow: "Browse pages",
    catalogueDownloadLabel: "Download brochure",
    catalogueCallLabel: "Call for consultation",
    catalogueEmailLabel: "Email your requirements",
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
      items: cat.items, cataloguePageIds: cat.cataloguePageIds,
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
      id: p.id,
      slug: { _type: "slug", current: p.slug },
      name: p.name, brand: p.brand, badge: p.badge || "",
      category: { _type: "reference", _weak: true, _ref: `category-${p.categoryId}` },
      type: p.type, summary: p.summary, description: p.description,
      features: p.features,
      specs: p.specs.map((s, si) => ({ _key: `spec-${si}`, label: s.label, value: s.value })),
      tags: p.tags,
      images: p.images.map((img, ii) => sanityImageRef(img, `img-${ii}`)).filter(Boolean),
      referencePageIds: p.referencePageIds,
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
  await seedHomepageCurators();
  console.log("\n✅  Seed complete. Open /admin to verify the content.\n");
} catch (err) {
  console.error("\n❌  Seed failed:", err.message);
  process.exit(1);
}
