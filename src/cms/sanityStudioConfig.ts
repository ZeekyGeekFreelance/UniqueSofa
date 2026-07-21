import { deskTool } from "sanity/desk";
import { schemaTypes } from "../sanity/schemaTypes";
import { getSanityConnection } from "./runtimeConfig";

export const SITE_SETTINGS_DOCUMENT_ID = "site-settings-v1";
export const CONTACT_DETAILS_DOCUMENT_ID = "contact-details-v1";
export const MAP_LOCATION_DOCUMENT_ID = "map-location-v1";

const SINGLETON_TYPES = new Set(["siteSettings", "contactDetails", "mapLocation"]);

function singletonListItem(
  S: any,
  title: string,
  schemaType: string,
  documentId: string,
) {
  return S.listItem()
    .title(title)
    .id(documentId)
    .child(
      S.editor()
        .id(documentId)
        .schemaType(schemaType)
        .documentId(documentId)
        .title(title),
    );
}

function structure(S: any) {
  return S.list()
    .title("Content")
    .items([
      singletonListItem(S, "Site Settings", "siteSettings", SITE_SETTINGS_DOCUMENT_ID),
      singletonListItem(S, "Contact Details", "contactDetails", CONTACT_DETAILS_DOCUMENT_ID),
      singletonListItem(S, "Map Location", "mapLocation", MAP_LOCATION_DOCUMENT_ID),
      S.divider(),
      S.documentTypeListItem("category").title("Categories"),
      S.documentTypeListItem("product").title("Products"),
    ]);
}

export function getSanityStudioConfig(source: Record<string, unknown> = {}) {
  const sanity = getSanityConnection(source);
  return {
    name: "default",
    title: sanity.studioTitle,
    basePath: sanity.studioBasePath,
    projectId: sanity.projectId,
    dataset: sanity.dataset,
    plugins: [deskTool({ structure })],
    schema: {
      types: schemaTypes,
    },
    document: {
      newDocumentOptions: (prev: Array<{ templateId: string }>, context: { creationContext?: { type?: string } }) => {
        if (context.creationContext?.type !== "global") return prev;
        return prev.filter((item) => !SINGLETON_TYPES.has(item.templateId));
      },
      actions: (prev: Array<{ action?: string }>, context: { schemaType: string }) => {
        if (!SINGLETON_TYPES.has(context.schemaType)) return prev;
        return prev.filter((item) => !["duplicate", "delete"].includes(item.action || ""));
      },
    },
  };
}
