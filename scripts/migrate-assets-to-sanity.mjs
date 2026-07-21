/**
 * migrate-assets-to-sanity.mjs
 *
 * Uploads all catalogue page images from public/catalogue/ to Sanity as real
 * image assets. Writes a manifest file mapping local paths → Sanity asset IDs.
 *
 * Run before seeding:  node scripts/migrate-assets-to-sanity.mjs
 *
 * Requires SANITY_API_TOKEN with write access in .env
 */

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@sanity/client";

// ── Load .env ─────────────────────────────────────────────────────────────────
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

if (!projectId) { console.error("❌  Missing VITE_SANITY_PROJECT_ID in .env"); process.exit(1); }
if (!token)     { console.error("❌  Missing SANITY_API_TOKEN in .env"); process.exit(1); }

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const MANIFEST_PATH  = path.resolve(process.cwd(), "src/cms/asset-manifest.json");
const CATALOGUE_DIR  = path.resolve(process.cwd(), "public/catalogue");
const PUBLIC_DIR     = path.resolve(process.cwd(), "public");

// ── Read existing manifest ────────────────────────────────────────────────────
async function readManifest() {
  try {
    const raw = await fs.readFile(MANIFEST_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeManifest(manifest) {
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
}

// ── Collect all image paths to upload ────────────────────────────────────────
async function collectAssets() {
  const assets = [];

  // All catalogue page images
  const catalogueFiles = await fs.readdir(CATALOGUE_DIR);
  for (const file of catalogueFiles.sort()) {
    if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) continue;
    const absolutePath = path.join(CATALOGUE_DIR, file);
    const publicPath   = `/catalogue/${file}`;
    assets.push({ absolutePath, publicPath });
  }

  return assets;
}

// ── Upload a single asset ─────────────────────────────────────────────────────
async function uploadAsset(absolutePath, publicPath) {
  const buffer   = await fs.readFile(absolutePath);
  const filename = path.basename(absolutePath);
  const ext      = path.extname(filename).toLowerCase();
  const contentType = ext === ".png" ? "image/png"
    : ext === ".webp" ? "image/webp"
    : "image/jpeg";

  const uploaded = await client.assets.upload("image", buffer, {
    filename,
    contentType,
  });

  return {
    publicPath,
    absolutePath: absolutePath.replace(/\\/g, "/"),
    sanityAssetId: uploaded._id,
    sanityAssetUrl: uploaded.url || "",
    filename,
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log(`\n📤  Migrating assets to Sanity — project: ${projectId}  dataset: ${dataset}\n`);

const manifest = await readManifest();
const assets   = await collectAssets();

let uploaded = 0;
let skipped  = 0;
let failed   = 0;

for (const [i, { absolutePath, publicPath }] of assets.entries()) {
  const existing = manifest[publicPath];

  if (existing?.sanityAssetId) {
    process.stdout.write(`  ⏭  ${i + 1}/${assets.length} skipped  ${publicPath}          \r`);
    skipped++;
    continue;
  }

  try {
    const result = await uploadAsset(absolutePath, publicPath);
    manifest[publicPath] = result;
    uploaded++;
    process.stdout.write(`  ✓  ${i + 1}/${assets.length} uploaded ${publicPath}          \r`);
  } catch (err) {
    failed++;
    console.error(`\n  ❌  Failed ${publicPath}: ${err.message}`);
  }
}

await writeManifest(manifest);

console.log(`\n\n✅  Asset migration complete`);
console.log(`   Uploaded: ${uploaded}`);
console.log(`   Skipped:  ${skipped} (already in Sanity)`);
console.log(`   Failed:   ${failed}`);
console.log(`   Manifest: src/cms/asset-manifest.json\n`);

if (failed > 0) {
  console.log("⚠️   Some assets failed. Re-run to retry failed uploads.\n");
}
