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
  referencePageIds: string[];
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
  cataloguePageIds: string[];
  images: string[];
};

export type Store = {
  name: string;
  type: string;
  address: string;
  city: string;
  mapsUrl: string;
};

export type CataloguePage = {
  id: string;
  title: string;
  section: string;
  image: string;
};

export const BRAND = {
  name: "Unique Sofa World Furniture",
  shortName: "Unique Sofa World",
  supportLabel: "Crafted your realm",
  phone: "+91 95911 67804",
  phoneHref: "tel:+919591167804",
  phoneRaw: "919591167804",
  email: "uniquesofaworldfurniture@gmail.com",
  emailHref: "mailto:uniquesofaworldfurniture@gmail.com",
  whatsappHref:
    "https://wa.me/919591167804?text=Hello%2C%20I%27m%20interested%20in%20your%20furniture%20and%20sofa%20services.%20Could%20you%20please%20assist%20me%3F",
  city: "Bengaluru, India",
  intro:
    "Unique Sofa World Furniture is a trusted destination in Bengaluru for premium sofas, custom furniture, sofa repair, upholstery solutions, and handcrafted furniture designed to combine comfort, quality, and lasting style.",
};

export const STATS = [
  { value: "5K+",   label: "Happy Clients" },
  { value: "200+",  label: "Premium Brands" },
  { value: "6+",    label: "Years Experience" },
];

export const STORES: Store[] = [
  {
    name: "Unique Sofa World Furniture",
    type: "Main Store",
    address: "Sri Sai Himaja Apartment, 307/2, Nyanappana Halli Main Rd, 11th Cross Rd, Devarachikkana Halli",
    city: "Bengaluru 560114",
    mapsUrl: "https://maps.app.goo.gl/Lohwr2jbq6ZcmedM9",
  },
];

export const BRANDS = [
  "Century Foam",
  "Madura Coats",
  "Vardhman A&E",
  "KAYMO",
  "Miles",
  "Polygrip",
  "Innfix",
  "Groz-Beckert",
  "Veer",
  "Rapid",
];

export const SPECIALIZATIONS = [
  {
    title: "Premium Sofas",
    summary:
      "Handcrafted sofas built for comfort and longevity, available in a wide range of styles, fabrics, and custom configurations.",
    items: [
      "L-shape, sectional, and classic designs",
      "Custom fabric and leather upholstery",
      "Made-to-order sizing and finish",
    ],
  },
  {
    title: "Sofa Repair & Restoration",
    summary:
      "Bringing worn sofas back to life with professional repair, re-upholstery, and structural restoration services.",
    items: [
      "Frame and spring repair",
      "Fabric and leather re-upholstery",
      "Foam replacement and cushion refill",
    ],
  },
  {
    title: "Custom Furniture",
    summary:
      "Bespoke furniture crafted to your space, style, and budget - from concept to delivery across Bengaluru.",
    items: [
      "Home and office furniture",
      "Custom beds, chairs, and ottomans",
      "On-site measurement and consultation",
    ],
  },
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

export const CATALOGUE_PAGES: CataloguePage[] = catalogueMeta.map((page, index) => ({
  ...page,
  image: `/catalogue/page-${String(index).padStart(3, "0")}.jpg`,
}));

export const CATALOGUE_FILE = "/catalogue/dtc-catalogue.pdf";

const cataloguePageMap = new Map(CATALOGUE_PAGES.map((page) => [page.id, page]));

function imageForPage(pageId: string) {
  return cataloguePageMap.get(pageId)?.image ?? CATALOGUE_PAGES[0].image;
}

function rotateImages(pageIds: string[], offset: number) {
  if (pageIds.length <= 1) {
    return pageIds.map(imageForPage);
  }

  return pageIds.map((_, index) => imageForPage(pageIds[(index + offset) % pageIds.length]));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const rawCategories = [
  {
    id: "recliners",
    slug: "recliners",
    code: "RC",
    title: "Recliners",
    subtitle: "Mechanisms and frames",
    summary:
      "Complete recliner frames, push-back systems, wall-hugger mechanisms, and structural recliner hardware.",
    badge: "Best seller",
    accent: "#bf622c",
    tone: "#f9ece3",
    family: "hardware" as const,
    cataloguePageIds: ["02", "03", "04"],
    items: [
      "Push-back frame",
      "Manual recliner mechanism",
      "Wall hugger system",
      "Cup holder insert",
      "Headrest bracket",
      "Footrest assembly",
    ],
  },
  {
    id: "recliner-accessories",
    slug: "recliner-accessories",
    code: "EL",
    title: "Recliner Accessories",
    subtitle: "Power and electronics",
    summary:
      "Electric motors, hand controls, power units, chargers, wireless remotes, and control modules.",
    accent: "#2563eb",
    tone: "#e9f1ff",
    family: "electrical" as const,
    cataloguePageIds: ["03", "04", "18"],
    items: [
      "Dual motor set",
      "Hand control keypad",
      "USB charging port",
      "Control box unit",
      "Wireless remote receiver",
      "LED cup holder light",
    ],
  },
  {
    id: "chairs-frames",
    slug: "chairs-frames",
    code: "FR",
    title: "Chairs and Frames",
    subtitle: "Structural components",
    summary:
      "Swivel bases, chair frames, ottoman frames, back assemblies, and connector hardware.",
    accent: "#7c3aed",
    tone: "#f1eaff",
    family: "structure" as const,
    cataloguePageIds: ["05", "06"],
    items: [
      "Swivel base plate",
      "Chair shell frame",
      "Ottoman base frame",
      "Rotation disc",
      "Frame connector set",
      "Back support assembly",
    ],
  },
  {
    id: "fancy-legs",
    slug: "fancy-legs",
    code: "FL",
    title: "Fancy Legs",
    subtitle: "Decorative furniture legs",
    summary:
      "Decorative sofa and furniture legs from 3 inch to 7 inch in chrome, gold, black, and brushed finishes.",
    badge: "New arrivals",
    accent: "#ce6a2c",
    tone: "#fdf0e6",
    family: "hardware" as const,
    cataloguePageIds: ["09", "10", "11"],
    items: [
      "Chrome leg set",
      "Gold finish leg",
      "Matte black leg",
      "Rose gold corner leg",
      "Hairpin leg",
      "Sled base leg",
    ],
  },
  {
    id: "sofa-legs",
    slug: "sofa-legs",
    code: "SL",
    title: "Sofa Legs",
    subtitle: "Premium metal legs",
    summary:
      "Polished and brushed metal legs in multiple sizes, including Y-shape, tapered, and trumpet designs.",
    accent: "#1f8f56",
    tone: "#eaf7ef",
    family: "hardware" as const,
    cataloguePageIds: ["19", "10", "11"],
    items: [
      "Y-shape sofa leg",
      "Cross base leg",
      "Tapered metal leg",
      "Trumpet leg",
      "Adjustable glide leg",
      "Brushed finish leg",
    ],
  },
  {
    id: "accessories",
    slug: "accessories",
    code: "AX",
    title: "Accessories",
    subtitle: "Decorative hardware",
    summary:
      "Handles, knobs, rosettes, knockers, tufting buttons, trim clips, and decorative details.",
    accent: "#d62e63",
    tone: "#ffe8f0",
    family: "accessories" as const,
    cataloguePageIds: ["07", "12", "18"],
    items: [
      "Decorative handle",
      "Metal rosette",
      "Tufting button",
      "Lion head knocker",
      "Trim clip",
      "Stud strip",
    ],
  },
  {
    id: "fancy-items",
    slug: "fancy-items",
    code: "FI",
    title: "Fancy Items",
    subtitle: "Trim and piping",
    summary:
      "Decorative piping, welt cord, corner pieces, metal trims, and finishing details for upholstery work.",
    accent: "#1186a0",
    tone: "#e7f8fb",
    family: "accessories" as const,
    cataloguePageIds: ["08", "07"],
    items: [
      "Decorative piping",
      "Welt cord roll",
      "Gimp braid trim",
      "Metal trim strip",
      "Corner angle piece",
      "Decorative nail set",
    ],
  },
  {
    id: "springs-staples",
    slug: "springs-staples",
    code: "SS",
    title: "Springs and Staples",
    subtitle: "Structural support",
    summary:
      "Staple pins, zig-zag springs, pocket springs, and hog rings for upholstery and furniture production.",
    badge: "Manufactured",
    accent: "#a65b24",
    tone: "#f7e9de",
    family: "structure" as const,
    cataloguePageIds: ["12", "14"],
    items: [
      "80 series staples",
      "100 series staples",
      "Pocket spring unit",
      "Zig-zag spring",
      "C hog ring pack",
      "C24 pin box",
    ],
  },
  {
    id: "tools",
    slug: "tools",
    code: "TL",
    title: "Tools",
    subtitle: "Workshop equipment",
    summary:
      "Staplers, tackers, scissors, regulators, tack pullers, and upholstery workshop tools.",
    accent: "#5b3fd1",
    tone: "#eee8ff",
    family: "structure" as const,
    cataloguePageIds: ["13", "14"],
    items: [
      "Pneumatic stapler",
      "Manual tacker",
      "Upholstery scissors",
      "Regulator tool",
      "Tack puller",
      "Web stretcher",
    ],
  },
  {
    id: "elastic-fabric",
    slug: "elastic-fabric",
    code: "EF",
    title: "Elastic and Fabric",
    subtitle: "Upholstery materials",
    summary:
      "Elastic webbing, seat ribbons, adhesives, and supporting materials for professional upholstery.",
    accent: "#2f9d60",
    tone: "#ebf8f0",
    family: "materials" as const,
    cataloguePageIds: ["16", "17"],
    items: [
      "Elastic webbing roll",
      "Seat ribbon",
      "Polygrip adhesive",
      "Innfix adhesive",
      "Foam bonding glue",
      "Cambric base cloth",
    ],
  },
  {
    id: "threads",
    slug: "threads",
    code: "TH",
    title: "Threads and Accessories",
    subtitle: "Sewing supplies",
    summary:
      "Madura Coats, Vardhman A&E, nylon thread counts, needles, bobbins, and sewing support items.",
    accent: "#c83660",
    tone: "#ffeaf1",
    family: "materials" as const,
    cataloguePageIds: ["17", "16"],
    items: [
      "Madura upholstery thread",
      "Vardhman A&E thread",
      "Nylon Tkt 20 cone",
      "Nylon Tkt 40 cone",
      "Upholstery needle pack",
      "Industrial bobbin set",
    ],
  },
  {
    id: "zip-runners",
    slug: "zip-runners",
    code: "ZR",
    title: "Zip and Runners",
    subtitle: "Closures and fasteners",
    summary:
      "Industrial zippers, runners, hook-and-eye tape, zipper tools, and closure hardware for covers and cushions.",
    accent: "#137f99",
    tone: "#e6f8fb",
    family: "accessories" as const,
    cataloguePageIds: ["15", "17"],
    items: [
      "Industrial zipper roll",
      "Zip runner set",
      "Continuous zip tape",
      "Hook-and-eye tape",
      "Zip plier",
      "End clip set",
    ],
  },
];

export const CATEGORIES: Category[] = rawCategories.map((category) => ({
  ...category,
  images: category.cataloguePageIds.map(imageForPage),
}));

const CATEGORY_BRANDS: Record<string, string[]> = {
  recliners: ["Miles", "Veer", "Rapid"],
  "recliner-accessories": ["Miles", "Rapid", "Veer"],
  "chairs-frames": ["Miles", "Veer", "Rapid"],
  "fancy-legs": ["Veer", "Rapid", "Miles"],
  "sofa-legs": ["Veer", "Rapid", "Miles"],
  accessories: ["Rapid", "Miles", "Veer"],
  "fancy-items": ["Rapid", "Innfix", "Polygrip"],
  "springs-staples": ["Rapid", "Veer", "Miles"],
  tools: ["KAYMO", "Miles", "Rapid"],
  "elastic-fabric": ["Polygrip", "Innfix", "Century Foam"],
  threads: ["Madura Coats", "Vardhman A&E", "Groz-Beckert"],
  "zip-runners": ["Groz-Beckert", "Rapid", "Veer"],
};

function buildProductDescription(category: Category, item: string, brand: string) {
  return `${item} from the ${category.title} range, supplied through ${brand} for ${category.subtitle.toLowerCase()} work. Suitable for workshop restocking, custom builds, and ongoing furniture production.`;
}

function buildProductFeatures(category: Category, item: string, pageIds: string[]) {
  return [
    `${item} suited to ${category.subtitle.toLowerCase()} work and repeat fabrication demand.`,
    `Referenced across catalogue pages ${pageIds.join(", ")} for quick visual matching during enquiry.`,
    `Available for walk-in purchase, phone confirmation, and bulk requirement planning from both Bengaluru locations.`,
  ];
}

function buildProductSpecs(category: Category, brand: string, pageIds: string[]) {
  return [
    { label: "Range", value: category.title },
    { label: "Family", value: category.family },
    { label: "Brand line", value: brand },
    { label: "Catalogue ref", value: pageIds.join(", ") },
    { label: "Application", value: category.subtitle },
    { label: "Supply mode", value: "Retail, repeat orders, and project enquiries" },
  ];
}

function buildProductTags(category: Category, brand: string, item: string) {
  return [brand, category.title, item.split(" ").slice(-1)[0] ?? category.code];
}

export const PRODUCTS: Product[] = CATEGORIES.flatMap((category) => {
  const brands = CATEGORY_BRANDS[category.id] ?? [BRANDS[0]];

  return category.items.map((item, index) => {
    const brand = brands[index % brands.length];
    const referencePageIds = category.cataloguePageIds.length > 2
      ? [
          category.cataloguePageIds[index % category.cataloguePageIds.length],
          category.cataloguePageIds[(index + 1) % category.cataloguePageIds.length],
          category.cataloguePageIds[(index + 2) % category.cataloguePageIds.length],
        ]
      : [
          category.cataloguePageIds[index % category.cataloguePageIds.length],
          category.cataloguePageIds[(index + 1) % category.cataloguePageIds.length],
          category.cataloguePageIds[index % category.cataloguePageIds.length],
        ];

    return {
      id: `${category.id}-${slugify(item)}`,
      slug: slugify(`${category.id}-${item}`),
      name: item,
      brand,
      badge: index === 0 ? category.badge : undefined,
      categoryId: category.id,
      categoryTitle: category.title,
      family: category.family,
      type: category.subtitle,
      summary: `${item} for ${category.title.toLowerCase()} work, stocked for repeat workshop demand and active replacement cycles.`,
      description: buildProductDescription(category, item, brand),
      features: buildProductFeatures(category, item, referencePageIds),
      specs: buildProductSpecs(category, brand, referencePageIds),
      tags: buildProductTags(category, brand, item),
      images: rotateImages(referencePageIds, index),
      referencePageIds,
    };
  });
});

export const FEATURED_CATEGORY_IDS = [
  "recliners",
  "fancy-legs",
  "sofa-legs",
  "springs-staples",
  "tools",
  "accessories",
];

export const FEATURED_PRODUCT_IDS = PRODUCTS.filter(
  (product) => product.badge || ["recliners", "fancy-legs", "tools", "sofa-legs"].includes(product.categoryId),
)
  .slice(0, 8)
  .map((product) => product.id);

export const FAMILY_FILTERS: { id: CategoryFamily | "all"; label: string }[] = [
  { id: "all", label: "All families" },
  { id: "hardware", label: "Hardware" },
  { id: "electrical", label: "Electrical" },
  { id: "structure", label: "Structure" },
  { id: "materials", label: "Materials" },
  { id: "accessories", label: "Accessories" },
];

export const HERO_MEDIA = [
  {
    eyebrow: "New Collection",
    title: "Modern",
    description: "Discover our premium selection of modern seating designed for unparalleled comfort and style.",
    image: "/heroChair.png",
  },
  {
    eyebrow: "Exclusive Range",
    title: "Luxury",
    description: "Handcrafted pieces built to elevate your living spaces with premium fabrics and timeless design.",
    image: "/sofa.png",
  },
  {
    eyebrow: "Sleep Elegance",
    title: "Comfort",
    description: "Transform your bedroom into a sanctuary of peace with our artisan-crafted beds.",
    image: "/bed.png",
  },
];

export const PRODUCT_PAGE_SUMMARY = {
  eyebrow: "Product catalogue",
  title: "Browse by range, brand, and application.",
  description:
    "Explore recliner hardware, legs, trims, tools, springs, and workshop supplies from Unique Sofa World Furniture with photo-led product detail views.",
};


