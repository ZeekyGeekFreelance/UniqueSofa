import { createClient } from "@sanity/client";
import createImageUrlBuilder from "@sanity/image-url";
import { getSanityConnection } from "./runtimeConfig";

const connection = getSanityConnection(import.meta.env as Record<string, unknown>);

export const sanityConnection = connection;
export const isSanityConfigured = connection.isConfigured;

export const sanityClient = isSanityConfigured
  ? createClient({
    projectId: connection.projectId,
    dataset: connection.dataset,
    apiVersion: connection.apiVersion,
    useCdn: false,
    perspective: "published",
  })
  : null;

const imageBuilder = isSanityConfigured
  ? createImageUrlBuilder({
    projectId: connection.projectId,
    dataset: connection.dataset,
  })
  : null;

export function getSanityImageUrl(imageSource: unknown) {
  if (!imageSource) return "";
  if (typeof imageSource === "string") return imageSource;
  if (!imageBuilder) return "";

  try {
    return imageBuilder.image(imageSource).auto("format").fit("max").url();
  } catch {
    return "";
  }
}

