import "dotenv/config";
import { defineConfig } from "sanity";
import { assertSanityProjectId } from "./src/cms/runtimeConfig";
import { getSanityStudioConfig } from "./src/cms/sanityStudioConfig";

const studioConfig = getSanityStudioConfig(process.env as unknown as Record<string, unknown>);
assertSanityProjectId(studioConfig);

export default defineConfig(studioConfig);

