import { createClient } from "@sanity/client";
import fs from "node:fs/promises";
import path from "node:path";

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
  } catch { /* ignore */ }
}

await loadEnv(".env");

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET || "production",
  apiVersion: process.env.VITE_SANITY_API_VERSION || "2025-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const KEEP_CATS = [
  "category-sofas", "category-beds", "category-recliners",
  "category-chairs", "category-dining-tables", "category-center-tables",
];

const KEEP_PRODS = [
  "sofas-3-seater","sofas-l-shape","sofas-sectional","sofas-chesterfield","sofas-modern","sofas-luxury","sofas-wooden",
  "beds-king-size","beds-queen-size","beds-storage","beds-upholstered","beds-wooden",
  "recliners-manual","recliners-rocker","recliners-swivel","recliners-premium",
  "chairs-sofa-chairs","chairs-wooden-chairs","chairs-accent-chairs","chairs-lounge-chairs",
  "dining-tables-4-seater","dining-tables-6-seater","dining-tables-8-seater","dining-tables-marble-top",
  "center-tables-center-tables","center-tables-coffee-tables","center-tables-side-tables","center-tables-nesting-tables",
].map(id => `product-${id}`);

const allCats  = await client.fetch('*[_type == "category"]{ _id }');
const allProds = await client.fetch('*[_type == "product"]{ _id }');

const delCats  = allCats.filter(d => !KEEP_CATS.includes(d._id)).map(d => d._id);
const delProds = allProds.filter(d => !KEEP_PRODS.includes(d._id)).map(d => d._id);

console.log(`Deleting ${delCats.length} old categories, ${delProds.length} old products...`);

const tx = client.transaction();
[...delCats, ...delProds].forEach(id => tx.delete(id));
await tx.commit({ returnDocuments: false });

console.log("✓ Done");
