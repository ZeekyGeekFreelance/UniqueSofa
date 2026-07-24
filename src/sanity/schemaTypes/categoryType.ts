import { defineArrayMember, defineField, defineType } from "sanity";

const familyOptions = [
  { title: "Sofas",       value: "sofas" },
  { title: "Recliners",   value: "recliners" },
  { title: "Beds",        value: "beds" },
  { title: "Dining",      value: "dining" },
  { title: "Seating",     value: "seating" },
  { title: "Hardware",    value: "hardware" },
  { title: "Electrical",  value: "electrical" },
  { title: "Structure",   value: "structure" },
  { title: "Accessories", value: "accessories" },
  { title: "Materials",   value: "materials" },
];

export default defineType({
  name: "category",
  title: "Category",
  type: "document",

  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "display",  title: "Display" },
    { name: "settings", title: "Settings" },
  ],

  fields: [
    defineField({
      name: "id",
      title: "Stable ID",
      description: "Used for deep links and filters. Lowercase, hyphenated. Example: fancy-legs",
      type: "string",
      group: "identity",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "id", maxLength: 96 },
      group: "identity",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "code",
      title: "Code",
      description: "Short 2–4 letter code shown on cards. Example: RC",
      type: "string",
      group: "identity",
      validation: (R) => R.required().max(4),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "identity",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      group: "identity",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 4,
      group: "identity",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "badge",
      title: "Badge",
      description: "Optional label shown on the card. Example: Best seller",
      type: "string",
      group: "identity",
    }),
    defineField({
      name: "family",
      title: "Family",
      type: "string",
      options: { list: familyOptions, layout: "dropdown" },
      group: "identity",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "items",
      title: "Item Labels",
      description: "List of product types in this category shown as chips.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "identity",
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: "images",
      title: "Images",
      description: "Representative images shown on category cards.",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt Text", type: "string" }),
          ],
        }),
      ],
      group: "identity",
    }),
    defineField({
      name: "accent",
      title: "Accent Colour",
      description: "Hex colour for category card accent. Example: #bf622c",
      type: "string",
      group: "display",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "tone",
      title: "Tone Colour",
      description: "Hex colour for category card background tint. Example: #f9ece3",
      type: "string",
      group: "display",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      description: "Controls display order. Lower = first.",
      type: "number",
      initialValue: 100,
      group: "settings",
    }),
    defineField({
      name: "isPublished",
      title: "Show on Website",
      type: "boolean",
      initialValue: true,
      group: "settings",
    }),
  ],

  preview: {
    select: { title: "title", subtitle: "code" },
    prepare({ title, subtitle }) {
      return { title, subtitle: `[${subtitle}]` };
    },
  },
});
