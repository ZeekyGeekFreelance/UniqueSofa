import { defineField, defineType } from "sanity";

export default defineType({
  name: "mapLocation",
  title: "Map Location",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Location Label",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "googleMapsUrl",
      title: "Google Maps URL",
      type: "url",
      validation: (R) => R.required().uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "embedUrl",
      title: "Embed URL",
      description: "Google Maps embed URL for the iframe on the contact page.",
      type: "url",
      validation: (R) => R.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "coordinates",
      title: "Coordinates",
      type: "geopoint",
    }),
  ],
});
