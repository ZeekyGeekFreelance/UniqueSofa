const DEFAULTS = Object.freeze({
  sanityDataset: "production",
  sanityApiVersion: "2025-01-01",
  sanityStudioPath: "/admin",
  sanityStudioTitle: "Dharamdas Trading CMS",
});

function asTrimmedString(value: unknown) {
  if (value == null) return "";
  return String(value).trim();
}

function readFirstValue(
  source: Record<string, unknown>,
  keys: string[],
  fallback = "",
) {
  for (const key of keys) {
    const value = asTrimmedString(source[key]);
    if (value) return value;
  }
  return fallback;
}

function normalizeBasePath(value: string, fallback: string = DEFAULTS.sanityStudioPath) {
  const trimmed = asTrimmedString(value);
  const candidate = trimmed || fallback;

  if (!candidate || candidate === "/") return "/";

  const withLeadingSlash = candidate.startsWith("/") ? candidate : `/${candidate}`;
  return withLeadingSlash.replace(/\/+$/, "");
}

export function getSanityConnection(source: Record<string, unknown> = {}) {
  const projectId = readFirstValue(source, [
    "VITE_SANITY_PROJECT_ID",
    "SANITY_STUDIO_PROJECT_ID",
  ]);

  const dataset = readFirstValue(
    source,
    ["VITE_SANITY_DATASET", "SANITY_STUDIO_DATASET"],
    DEFAULTS.sanityDataset,
  );

  const apiVersion = readFirstValue(
    source,
    ["VITE_SANITY_API_VERSION", "SANITY_STUDIO_API_VERSION"],
    DEFAULTS.sanityApiVersion,
  );

  const studioBasePath = normalizeBasePath(
    readFirstValue(
      source,
      ["VITE_SANITY_STUDIO_PATH", "SANITY_STUDIO_BASE_PATH"],
      DEFAULTS.sanityStudioPath,
    ),
  );

  const studioTitle = readFirstValue(
    source,
    ["VITE_SANITY_STUDIO_TITLE", "SANITY_STUDIO_TITLE"],
    DEFAULTS.sanityStudioTitle,
  );

  return {
    projectId,
    dataset,
    apiVersion,
    studioBasePath,
    studioTitle,
    isConfigured: Boolean(projectId),
  };
}

export function assertSanityProjectId(configOrSource: string | Record<string, unknown>) {
  const projectId = typeof configOrSource === "string"
    ? asTrimmedString(configOrSource)
    : asTrimmedString(
      "projectId" in configOrSource
        ? (configOrSource as { projectId?: string }).projectId
        : getSanityConnection(configOrSource).projectId,
    );

  if (!projectId) {
    throw new Error("Missing Sanity project id. Set VITE_SANITY_PROJECT_ID in .env.");
  }

  return projectId;
}

export function isAdminRoute(pathname: string, basePath = DEFAULTS.sanityStudioPath) {
  const normalizedPathname = normalizeBasePath(pathname, "/");
  const normalizedBasePath = normalizeBasePath(basePath, DEFAULTS.sanityStudioPath);

  if (normalizedBasePath === "/") return normalizedPathname === "/";
  return normalizedPathname === normalizedBasePath
    || normalizedPathname.startsWith(`${normalizedBasePath}/`);
}
