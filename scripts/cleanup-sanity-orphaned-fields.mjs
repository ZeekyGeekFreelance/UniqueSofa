/**
 * cleanup-sanity-orphaned-fields.mjs
 *
 * Removes fields from live Sanity documents that no longer exist in the
 * schema, and patches stale product content that references catalogue pages.
 *
 * Run once:  npm run cms:cleanup
 * Then:      npm run cms:pull   (to refresh the local snapshot)
 */

import path from "node:path";
import fs from "node:fs/promises";
import { createClient } from "@sanity/client";

// ── env loading ───────────────────────────────────────────────────────────────

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
await loadEnv(".env.local");

const projectId  = process.env.VITE_SANITY_PROJECT_ID || "";
const dataset    = process.env.VITE_SANITY_DATASET || "production";
const apiVersion = process.env.VITE_SANITY_API_VERSION || "2025-01-01";
const token      = process.env.SANITY_API_TOKEN || "";

if (!projectId) {
  console.error("❌  Missing VITE_SANITY_PROJECT_ID in .env");
  process.exit(1);
}
if (!token) {
  console.error("❌  Missing SANITY_API_TOKEN in .env — write token required for mutations");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

console.log("\n🔧  Cleaning up orphaned fields in Sanity...\n");

// ── 1. siteSettings — remove all catalogue-related fields ────────────────────

const SITE_SETTINGS_ORPHANS = [
  "catalogueFile",
  "cataloguePages",
  "catalogueHeroEyebrow",
  "catalogueHeroTitle",
  "catalogueHeroDescription",
  "catalogueFocusEyebrow",
  "catalogueBrowseEyebrow",
  "catalogueDownloadLabel",
  "catalogueCallLabel",
  "catalogueEmailLabel",
];

const CATEGORY_ORPHANS = ["cataloguePageIds"];
const PRODUCT_ORPHANS  = ["id", "slug", "referencePageIds"];

console.log("  [1/4] siteSettings — unsetting catalogue fields");
try {
  const doc = await client.fetch(
    `*[_type == "siteSettings" && _id == "site-settings-v1"][0]{ ${SITE_SETTINGS_ORPHANS.join(", ")} }`
  );
  const presentFields = SITE_SETTINGS_ORPHANS.filter(
    (f) => doc && doc[f] !== undefined && doc[f] !== null
  );
  if (presentFields.length === 0) {
    console.log("     ✓ Already clean");
  } else {
    console.log(`     Removing: ${presentFields.join(", ")}`);
    await client.patch("site-settings-v1").unset(presentFields).commit({ returnDocuments: false });
    console.log(`     ✓ Removed ${presentFields.length} fields`);
  }
} catch (err) {
  console.error("     ❌ Failed:", err.message);
}

// ── 2. siteSettings — remove /catalogue nav item ─────────────────────────────

console.log("\n  [2/4] siteSettings — removing /catalogue nav item if present");
try {
  const doc = await client.fetch(
    `*[_type == "siteSettings" && _id == "site-settings-v1"][0]{ navItems }`
  );
  const navItems = doc?.navItems ?? [];
  const hasIt = navItems.some((i) => i.href === "/catalogue");
  if (!hasIt) {
    console.log("     ✓ Already clean");
  } else {
    const filtered = navItems.filter((i) => i.href !== "/catalogue");
    await client.patch("site-settings-v1").set({ navItems: filtered }).commit({ returnDocuments: false });
    console.log("     ✓ Removed /catalogue from navItems");
  }
} catch (err) {
  console.error("     ❌ Failed:", err.message);
}

// ── 3. category — remove id + cataloguePageIds ───────────────────────────────

console.log("\n  [3/4] category — unsetting id, cataloguePageIds");
try {
  const categories = await client.fetch(
    `*[_type == "category"]{ _id, title, ${CATEGORY_ORPHANS.join(", ")} }`
  );
  const dirty = categories.filter((c) =>
    CATEGORY_ORPHANS.some((f) => c[f] !== undefined && c[f] !== null)
  );
  if (dirty.length === 0) {
    console.log("     ✓ Already clean");
  } else {
    console.log(`     Found ${dirty.length} categories with orphaned fields`);
    const tx = client.transaction();
    for (const cat of dirty) {
      const fields = CATEGORY_ORPHANS.filter((f) => cat[f] !== undefined && cat[f] !== null);
      tx.patch(cat._id, (p) => p.unset(fields));
    }
    await tx.commit({ returnDocuments: false });
    console.log(`     ✓ Cleaned ${dirty.length} category documents`);
  }
} catch (err) {
  console.error("     ❌ Failed:", err.message);
}

// ── 4. product — remove id, slug, referencePageIds + clean stale features/specs

console.log("\n  [4/4] product — unsetting id, slug, referencePageIds and cleaning stale content");

// Patterns in features/specs that were auto-generated from catalogue data
const STALE_FEATURE_PATTERNS = [
  /^Referenced across catalogue pages[\s\S]*\.$/,
  /^Available for walk-in purchase, phone confirmation, and bulk requirement planning from both Bengaluru locations\.$/,
];

const STALE_SPEC_LABEL = "Catalogue ref";

function cleanFeatures(features) {
  if (!Array.isArray(features)) return { changed: false, value: features };
  const cleaned = features.filter(
    (f) => !STALE_FEATURE_PATTERNS.some((re) => re.test(f))
  );
  return { changed: cleaned.length !== features.length, value: cleaned };
}

function cleanSpecs(specs) {
  if (!Array.isArray(specs)) return { changed: false, value: specs };
  const cleaned = specs.filter((s) => s?.label !== STALE_SPEC_LABEL);
  return { changed: cleaned.length !== specs.length, value: cleaned };
}

try {
  const BATCH = 50;
  let offset = 0;
  let totalPatched = 0;
  let totalRefRemoved = 0;

  while (true) {
    const batch = await client.fetch(
      `*[_type == "product"] | order(_id) [${offset}...${offset + BATCH}]{
        _id,
        ${PRODUCT_ORPHANS.join(", ")},
        features,
        specs[]{ label, value, _key }
      }`
    );

    if (batch.length === 0) break;

    const tx = client.transaction();
    let patchCount = 0;

    for (const prod of batch) {
      const unsetFields = [];
      const setFields = {};
      let needsPatch = false;

      // Remove orphaned fields (id, slug, referencePageIds)
      for (const f of PRODUCT_ORPHANS) {
        if (prod[f] !== undefined && prod[f] !== null) {
          unsetFields.push(f);
          if (f === "referencePageIds") totalRefRemoved++;
          needsPatch = true;
        }
      }

      // Clean stale features
      const { changed: featChanged, value: cleanedFeatures } = cleanFeatures(prod.features);
      if (featChanged) {
        setFields.features = cleanedFeatures;
        needsPatch = true;
      }

      // Clean stale specs
      const { changed: specsChanged, value: cleanedSpecs } = cleanSpecs(prod.specs);
      if (specsChanged) {
        setFields.specs = cleanedSpecs;
        needsPatch = true;
      }

      if (needsPatch) {
        let p = tx.patch(prod._id, (patch) => {
          let q = patch;
          if (unsetFields.length) q = q.unset(unsetFields);
          if (Object.keys(setFields).length) q = q.set(setFields);
          return q;
        });
        patchCount++;
      }
    }

    if (patchCount > 0) {
      await tx.commit({ returnDocuments: false });
      totalPatched += patchCount;
    }

    offset += BATCH;
    if (batch.length < BATCH) break;
  }

  const parts = [];
  if (totalRefRemoved > 0) parts.push(`referencePageIds removed from ${totalRefRemoved} products`);
  if (totalPatched > 0) parts.push(`${totalPatched} products had stale features/specs cleaned`);

  const idSlugRemoved = totalPatched - totalRefRemoved;
  if (idSlugRemoved > 0) parts.unshift(`id/slug removed from products`);
  if (parts.length === 0) {
    console.log("     ✓ Already clean");
  } else {
    console.log(`     ✓ ${parts.join(", ")}`);
  }
} catch (err) {
  console.error("     ❌ Failed:", err.message);
}

console.log("\n✅  Cleanup complete. Run `npm run cms:pull` to refresh the local snapshot.\n");
