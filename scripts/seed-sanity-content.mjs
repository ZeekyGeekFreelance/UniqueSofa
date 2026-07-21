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

// ── Site data (mirrors src/data/site.ts) ──────────────────────────────────────

const BRAND = {
  name: "Unique Sofa World Furniture",
  shortName: "Unique Sofa World",
  supportLabel: "Crafted your realm",
  phone: "+91 95911 67804",
  phoneHref: "tel:+919591167804",
  phoneRaw: "919591167804",
  email: "uniquesofaworldfurniture@gmail.com",
  emailHref: "mailto:uniquesofaworldfurniture@gmail.com",
  whatsappHref: "https://wa.me/919591167804?text=Hello%2C%20I%27m%20interested%20in%20your%20furniture%20and%20sofa%20services.%20Could%20you%20please%20assist%20me%3F",
  city: "Bengaluru, India",
  intro: "Unique Sofa World Furniture is a trusted destination in Bengaluru for premium sofas, custom furniture, sofa repair, upholstery solutions, and handcrafted furniture designed to combine comfort, quality, and lasting style.",
};

const STATS = [
  { value: "2021", label: "Established" },
  { value: "500+", label: "Products & Services" },
  { value: "1", label: "Store location" },
  { value: "1000+", label: "Happy customers" },
];

const STORES = [
  { name: "Unique Sofa World Furniture", type: "Main Store", address: "Sri Sai Himaja Apartment, 307/2, Nyanappana Halli Main Rd, 11th Cross Rd, Devarachikkana Halli", city: "Bengaluru 560114", mapsUrl: "https://maps.app.goo.gl/Lohwr2jbq6ZcmedM9" },
];

const BRANDS = ["Century Foam","Madura Coats","Vardhman A&E","KAYMO","Miles","Polygrip","Innfix","Groz-Beckert","Veer","Rapid"];

const SPECIALIZATIONS = [
  { title: "Manufacturer", summary: "Staple pins, hog rings, and zig-zag springs are part of the in-house supply backbone.", items: ["80 / 100 / 90 / 23-8 staple series", "C hog rings and C24 pins", "Black and gold zig-zag springs"] },
  { title: "Stockist", summary: "Core materials and dependable brands are kept moving for repeat workshop demand.", items: ["Pocket springs", "Century Foam grades", "Madura Coats and Vardhman A&E threads"] },
  { title: "Dealer", summary: "A broad working range for sofa makers, upholsterers, carpenters, and designers.", items: ["Professional upholstery tools", "Sofa hardware and accessories", "Thread, zipper, and trim supplies"] },
];

const HERO_MEDIA = [
  { eyebrow: "New Collection",  title: "Modern",  description: "Discover our premium selection of modern seating designed for unparalleled comfort and style.",    image: "/heroChair.png" },
  { eyebrow: "Luxury Living",   title: "Comfort", description: "Handcrafted sofas built to elevate your living spaces with premium fabrics and timeless design.", image: "/sofa.png"      },
  { eyebrow: "Premium Beds",    title: "Serene",  description: "Elegant bed frames crafted for restful spaces — where quality meets lasting style.",               image: "/bed.png"       },
];

const catalogueMeta = [
  { id: "01", title: "Cover", section: "Brand identity" },
  { id: "02", title: "Recliners", section: "Mechanisms" },
  { id: "03", title: "Recliners and Accessories", section: "Components" },
  { id: "04", title: "Recliner Accessories", section: "Power and controls" },
  { id: "05", title: "Chairs and Frames", section: "Structural components" },
  { id: "06", title: "Chairs and Frames", section: "Bases and swivels" },
  { id: "07", title: "Accessories", section: "Decorative hardware" },
  { id: "08", title: "Fancy Items", section: "Trim and piping" },
  { id: "09", title: "Fancy Legs", section: "Leg collection one" },
  { id: "10", title: "Fancy Legs", section: "Leg collection two" },
  { id: "11", title: "Fancy Legs", section: "Corner legs" },
  { id: "12", title: "Accessories", section: "Springs and rings" },
  { id: "13", title: "Tools", section: "Workshop tools" },
  { id: "14", title: "Staple Pins and Springs", section: "Fasteners" },
  { id: "15", title: "Zip and Runners", section: "Closures" },
  { id: "16", title: "Elastic and Fabric", section: "Materials" },
  { id: "17", title: "Threads and Accessories", section: "Sewing supplies" },
  { id: "18", title: "Accessories", section: "Electronics" },
  { id: "19", title: "Sofa Legs", section: "Premium metal legs" },
  { id: "20", title: "Contact and Info", section: "Company details" },
];

const CATALOGUE_PAGES = catalogueMeta.map((p, i) => ({
  ...p,
  image: `/catalogue/page-${String(i).padStart(3, "0")}.jpg`,
}));

const CATEGORIES = [
  { id: "recliners", code: "RC", title: "Recliners", subtitle: "Mechanisms and frames", summary: "Complete recliner frames, push-back systems, wall-hugger mechanisms, and structural recliner hardware.", badge: "Best seller", accent: "#bf622c", tone: "#f9ece3", family: "hardware", cataloguePageIds: ["02","03","04"], items: ["Push-back frame","Manual recliner mechanism","Wall hugger system","Cup holder insert","Headrest bracket","Footrest assembly"] },
  { id: "recliner-accessories", code: "EL", title: "Recliner Accessories", subtitle: "Power and electronics", summary: "Electric motors, hand controls, power units, chargers, wireless remotes, and control modules.", badge: "", accent: "#2563eb", tone: "#e9f1ff", family: "electrical", cataloguePageIds: ["03","04","18"], items: ["Dual motor set","Hand control keypad","USB charging port","Control box unit","Wireless remote receiver","LED cup holder light"] },
  { id: "chairs-frames", code: "FR", title: "Chairs and Frames", subtitle: "Structural components", summary: "Swivel bases, chair frames, ottoman frames, back assemblies, and connector hardware.", badge: "", accent: "#7c3aed", tone: "#f1eaff", family: "structure", cataloguePageIds: ["05","06"], items: ["Swivel base plate","Chair shell frame","Ottoman base frame","Rotation disc","Frame connector set","Back support assembly"] },
  { id: "fancy-legs", code: "FL", title: "Fancy Legs", subtitle: "Decorative furniture legs", summary: "Decorative sofa and furniture legs from 3 inch to 7 inch in chrome, gold, black, and brushed finishes.", badge: "New arrivals", accent: "#ce6a2c", tone: "#fdf0e6", family: "hardware", cataloguePageIds: ["09","10","11"], items: ["Chrome leg set","Gold finish leg","Matte black leg","Rose gold corner leg","Hairpin leg","Sled base leg"] },
  { id: "sofa-legs", code: "SL", title: "Sofa Legs", subtitle: "Premium metal legs", summary: "Polished and brushed metal legs in multiple sizes, including Y-shape, tapered, and trumpet designs.", badge: "", accent: "#1f8f56", tone: "#eaf7ef", family: "hardware", cataloguePageIds: ["19","10","11"], items: ["Y-shape sofa leg","Cross base leg","Tapered metal leg","Trumpet leg","Adjustable glide leg","Brushed finish leg"] },
  { id: "accessories", code: "AX", title: "Accessories", subtitle: "Decorative hardware", summary: "Handles, knobs, rosettes, knockers, tufting buttons, trim clips, and decorative details.", badge: "", accent: "#d62e63", tone: "#ffe8f0", family: "accessories", cataloguePageIds: ["07","12","18"], items: ["Decorative handle","Metal rosette","Tufting button","Lion head knocker","Trim clip","Stud strip"] },
  { id: "fancy-items", code: "FI", title: "Fancy Items", subtitle: "Trim and piping", summary: "Decorative piping, welt cord, corner pieces, metal trims, and finishing details for upholstery work.", badge: "", accent: "#1186a0", tone: "#e7f8fb", family: "accessories", cataloguePageIds: ["08","07"], items: ["Decorative piping","Welt cord roll","Gimp braid trim","Metal trim strip","Corner angle piece","Decorative nail set"] },
  { id: "springs-staples", code: "SS", title: "Springs and Staples", subtitle: "Structural support", summary: "Staple pins, zig-zag springs, pocket springs, and hog rings for upholstery and furniture production.", badge: "Manufactured", accent: "#a65b24", tone: "#f7e9de", family: "structure", cataloguePageIds: ["12","14"], items: ["80 series staples","100 series staples","Pocket spring unit","Zig-zag spring","C hog ring pack","C24 pin box"] },
  { id: "tools", code: "TL", title: "Tools", subtitle: "Workshop equipment", summary: "Staplers, tackers, scissors, regulators, tack pullers, and upholstery workshop tools.", badge: "", accent: "#5b3fd1", tone: "#eee8ff", family: "structure", cataloguePageIds: ["13","14"], items: ["Pneumatic stapler","Manual tacker","Upholstery scissors","Regulator tool","Tack puller","Web stretcher"] },
  { id: "elastic-fabric", code: "EF", title: "Elastic and Fabric", subtitle: "Upholstery materials", summary: "Elastic webbing, seat ribbons, adhesives, and supporting materials for professional upholstery.", badge: "", accent: "#2f9d60", tone: "#ebf8f0", family: "materials", cataloguePageIds: ["16","17"], items: ["Elastic webbing roll","Seat ribbon","Polygrip adhesive","Innfix adhesive","Foam bonding glue","Cambric base cloth"] },
  { id: "threads", code: "TH", title: "Threads and Accessories", subtitle: "Sewing supplies", summary: "Madura Coats, Vardhman A&E, nylon thread counts, needles, bobbins, and sewing support items.", badge: "", accent: "#c83660", tone: "#ffeaf1", family: "materials", cataloguePageIds: ["17","16"], items: ["Madura upholstery thread","Vardhman A&E thread","Nylon Tkt 20 cone","Nylon Tkt 40 cone","Upholstery needle pack","Industrial bobbin set"] },
  { id: "zip-runners", code: "ZR", title: "Zip and Runners", subtitle: "Closures and fasteners", summary: "Industrial zippers, runners, hook-and-eye tape, zipper tools, and closure hardware for covers and cushions.", badge: "", accent: "#137f99", tone: "#e6f8fb", family: "accessories", cataloguePageIds: ["15","17"], items: ["Industrial zipper roll","Zip runner set","Continuous zip tape","Hook-and-eye tape","Zip plier","End clip set"] },
];

const FEATURED_CATEGORY_IDS = ["recliners","fancy-legs","sofa-legs","springs-staples","tools","accessories"];

const CATEGORY_BRANDS = {
  "recliners": ["Miles","Veer","Rapid"],
  "recliner-accessories": ["Miles","Rapid","Veer"],
  "chairs-frames": ["Miles","Veer","Rapid"],
  "fancy-legs": ["Veer","Rapid","Miles"],
  "sofa-legs": ["Veer","Rapid","Miles"],
  "accessories": ["Rapid","Miles","Veer"],
  "fancy-items": ["Rapid","Innfix","Polygrip"],
  "springs-staples": ["Rapid","Veer","Miles"],
  "tools": ["KAYMO","Miles","Rapid"],
  "elastic-fabric": ["Polygrip","Innfix","Century Foam"],
  "threads": ["Madura Coats","Vardhman A&E","Groz-Beckert"],
  "zip-runners": ["Groz-Beckert","Rapid","Veer"],
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
      summary: `${item} for ${cat.title.toLowerCase()} work, stocked for repeat workshop demand.`,
      description: `${item} from the ${cat.title} range, supplied through ${brand} for ${cat.subtitle.toLowerCase()} work.`,
      features: [`${item} suited to ${cat.subtitle.toLowerCase()} work.`, `Referenced across catalogue pages ${pageIds.join(", ")}.`, `Available for walk-in purchase and bulk requirement planning.`],
      specs: [{ label: "Range", value: cat.title }, { label: "Family", value: cat.family }, { label: "Brand line", value: brand }, { label: "Catalogue ref", value: pageIds.join(", ") }, { label: "Application", value: cat.subtitle }, { label: "Supply mode", value: "Retail, repeat orders, and project enquiries" }],
      tags: [brand, cat.title, item.split(" ").slice(-1)[0] || cat.code],
      images: pageIds.map(imageForPage),
      referencePageIds: pageIds,
    };
  });
});

const FEATURED_PRODUCT_IDS = PRODUCTS
  .filter((p) => p.badge || ["recliners","fancy-legs","tools","sofa-legs"].includes(p.categoryId))
  .slice(0, 8).map((p) => p.id);

// ── Seed ──────────────────────────────────────────────────────────────────────

async function upsert(doc) { return client.createOrReplace(doc); }

async function seedHomepageCurators() {
  console.log("  Seeding homepage curators...");
  await upsert({
    _id: "homepage-featured-ranges-v1", _type: "homepageFeaturedRanges",
    eyebrow: "Featured ranges",
    title: "Core ranges buyers check first.",
    description: "Quick visual access to recliners, leg collections, trims, and workshop essentials.",
    categories: ["recliners","fancy-legs","sofa-legs","springs-staples","tools","accessories"].map((id) => ({
      _key: `cat-ref-${id}`,
      _type: "reference",
      _weak: true,
      _ref: `category-${id}`,
    })),
  });
  const featuredProductIds = PRODUCTS
    .filter((p) => p.badge || ["recliners","fancy-legs","tools","sofa-legs"].includes(p.categoryId))
    .slice(0, 8).map((p) => p.id);
  await upsert({
    _id: "homepage-featured-products-v1", _type: "homepageFeaturedProducts",
    eyebrow: "Featured products",
    title: "Selected stock highlights.",
    description: "Open key items for photos, features, and contact-ready product details.",
    products: featuredProductIds.map((id) => ({
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
      items: s.items, // plain string array — no _key needed for primitive arrays
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
    featuredCategories: ["recliners","fancy-legs","sofa-legs","springs-staples","tools","accessories"].map((id, i) => ({
      _key: `fc-${i}`, _type: "reference", _weak: true, _ref: `category-${id}`,
    })),
    featuredProducts: FEATURED_PRODUCT_IDS.map((id, i) => ({
      _key: `fp-${i}`, _type: "reference", _weak: true, _ref: `product-${id}`,
    })),
    familyOverview: {
      hardware: "Metal hardware for frames, legs, mechanisms, and daily assembly work.",
      electrical: "Power-ready recliner controls and motion accessories for modern seating.",
      structure: "Workshop essentials for frame support, fastening, and upholstery production.",
      materials: "Consumables and upholstery materials used in repeat workshop purchasing.",
      accessories: "Decorative and finishing components for trims, closures, and visible detailing.",
    },
    headerCtaLabel: "Get a quote",
    heroHappyCustomersCount: "5M+",
    heroHappyCustomersLabel: "Happy Customers",
    heroFloatingCardTitle: "New Collection",
    heroFloatingCardImage: sanityImageRef("/catalogue/hero-sofa.png"),
    homeFeaturedRangesEyebrow: "Featured ranges",
    homeFeaturedRangesTitle: "Core ranges buyers check first.",
    homeFeaturedRangesDescription: "Quick visual access to recliners, leg collections, trims, and workshop essentials.",
    homeFeaturedProductsEyebrow: "Featured products",
    homeFeaturedProductsTitle: "Selected stock highlights.",
    homeFeaturedProductsDescription: "Open key items for photos, features, and contact-ready product details.",
    homeWhyEyebrow: "Why Unique Sofa World Furniture",
    homeWhyTitle: "A supply partner built around custom demand.",
    homeWhyDescription: "Unique Sofa World Furniture delivers custom-made sofas, furniture manufacturing, upholstery, and expert repair services with a commitment to quality craftsmanship, personalized designs, and customer satisfaction for homes, offices, and commercial spaces across Bengaluru.",
    homeBrandsEyebrow: "Brands and locations",
    homeBrandsTitle: "Trusted lines with our Bengaluru touchpoint.",
    homeBrandsDescription: "Unique Sofa World Furniture serves walk-in buyers, workshop restocking, and project enquiries from our store location.",
    productsHeroEyebrow: "Product catalogue",
    productsHeroTitle: "Browse by range, brand, and application.",
    productsHeroSubtitle: "Explore premium sofas, custom furniture, sofa repair, and upholstery solutions from Unique Sofa World Furniture.",
    productsSummaryTitle: "Browse stock by family, range, and brand.",
    productsSummaryDescription: "Review the live Unique Sofa World Furniture range, narrow by application, and open any item for photos, features, and enquiry details.",
    productsNoResultEyebrow: "No results",
    productsNoResultTitle: "No products match your filters.",
    productsNoResultDescription: "Try adjusting the family, range, or brand filter to find what you need.",
    productsNoResultResetLabel: "Clear filters",
    productsFilterFamilyLabel: "Family",
    productsFilterRangeLabel: "Range",
    productsFilterBrandLabel: "Brand",
    catalogueHeroEyebrow: "Catalogue",
    catalogueHeroTitle: "Browse the printed range from cover to contact details.",
    catalogueHeroDescription: "Review recliners, trims, tools, legs, and workshop supplies from the Unique Sofa World Furniture brochure.",
    catalogueFocusEyebrow: "Focus spread",
    catalogueBrowseEyebrow: "Browse spreads",
    catalogueDownloadLabel: "Download brochure",
    catalogueCallLabel: "Call for stock check",
    catalogueEmailLabel: "Email enquiry",
    aboutHeroEyebrow: "About USW Furniture",
    aboutHeroTitle: "Crafting Comfortable Living Spaces with Quality Furniture Since 2021.",
    aboutHeroSubtitle: "Unique Sofa World Furniture serves homes, offices, and repeat buyers with custom ranges, quality products, and direct support.",
    aboutPrimaryCtaLabel: "Explore products",
    aboutSecondaryCtaLabel: "Contact the team",
    aboutModelEyebrow: "Business model",
    aboutModelTitle: "Three supply roles that shape the business.",
    aboutModelDescription: "These strengths define how Unique Sofa World Furniture manages working inventory, stocked brands, and day-to-day service for repeat buyers.",
    aboutBrandsEyebrow: "Stocked brands",
    aboutBrandsTitle: "Trusted names already familiar to furniture workshops.",
    aboutBrandsDescription: "The Unique Sofa World Furniture range covers everyday upholstery materials alongside specialist hardware, fittings, and support products.",
    contactHeroEyebrow: "Contact Us",
    contactHeroTitle: "Speak with the team for custom orders, product guidance, and store visits.",
    contactHeroSubtitle: "Reach Unique Sofa World Furniture by Phone, WhatsApp, Email, or an enquiry message with the product range you need.",
    contactQuickContactEyebrow: "Quick contact",
    contactWhatsappTitle: "WhatsApp enquiries",
    contactWhatsappDescription: "Quick checks for stock, brands, and product photos.",
    contactEnquiryEyebrow: "WhatsApp enquiry",
    contactEnquiryTitle: "Send an enquiry",
    contactEnquiryDescription: "Share the product range, quantity, and any sizing or finish notes.",
    contactEnquirySentTitle: "WhatsApp message ready",
    contactEnquirySentDescription: "If WhatsApp did not open, you can still message the team directly.",
    contactEnquirySubmitLabel: "Send WhatsApp enquiry",
    contactBusinessHoursWeekday: "Daily: 10:00 AM – 9:00 PM",
    contactBusinessHoursSunday: "Daily: 10:00 AM – 9:00 PM",
    footerNavigateTitle: "Navigate",
    footerStoresTitle: "Stores",
    footerContactTitle: "Contact",
    footerBottomCaption: "Custom Sofas, Furniture Manufacturing & Upholstery Services | Bengaluru.",
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
    whatsappTemplate: "Hello, I'm interested in your furniture and sofa services. Could you please assist me?",
    addressArea: "Begur Road, Bangalore",
    businessHoursWeekday: "Daily: 10:00 AM – 9:00 PM",
    businessHoursSunday: "Daily: 10:00 AM – 9:00 PM",
  });
  console.log("  ✓ contactDetails");
}

async function seedMapLocation() {
  console.log("  Seeding mapLocation...");
  await upsert({
    _id: "map-location-v1", _type: "mapLocation",
    label: "Unique Sofa World Furniture, Begur Road, Bengaluru",
    googleMapsUrl: "https://maps.app.goo.gl/Lohwr2jbq6ZcmedM9",
    embedUrl: "https://www.google.com/maps?q=12.8711681,77.6163365&output=embed", // Approximate coordinates for embed if standard url isn't direct
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
