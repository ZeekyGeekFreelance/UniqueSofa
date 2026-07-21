import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",

  groups: [
    { name: "inventory", title: "Inventory",  default: true },
    { name: "content",   title: "Content" },
    { name: "settings",  title: "Settings" },
  ],

  fields: [
    // ── Inventory ─────────────────────────────────────────────────────────
    defineField({
      name: "name",
      title: "Name",
      description: "Shown as the product heading on cards and in the detail modal.",
      type: "string",
      group: "inventory",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      description: "Shown as a dark chip in the top-left corner of every product card, and in the modal header alongside the category.",
      type: "string",
      group: "inventory",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "badge",
      title: "Badge",
      description: "Optional highlight label shown as an accent chip in the top-right corner of the product card. Example: Best seller. Leave blank for no badge.",
      type: "string",
      group: "inventory",
    }),
    defineField({
      name: "category",
      title: "Category",
      description: "Controls which category page this product belongs to, and sets the category label shown on the card and in the modal header.",
      type: "reference",
      to: [{ type: "category" }],
      weak: true,
      options: { disableNew: true },
      group: "inventory",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "images",
      title: "Images",
      description: "Shown in the card carousel and the modal image viewer. First image is the cover. Upload catalogue page scans or product photos.",
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
      group: "inventory",
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: "referencePageIds",
      title: "Catalogue Page References",
      description: "Page numbers from the printed catalogue (01–20). Shown as 'Ref 07 / 12' on the card footer and as page chips in the modal.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "inventory",
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      description: "Shown as small grey chips on the product card and in the modal. Used for search matching on the Products page.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "inventory",
      validation: (R) => R.required().min(1),
    }),

    // ── Content ───────────────────────────────────────────────────────────
    defineField({
      name: "type",
      title: "Type / Application",
      description: "Short descriptor shown in the card footer alongside the catalogue reference. Example: Mechanisms and frames",
      type: "string",
      group: "content",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      description: "Two-line description shown on the product card below the product name.",
      type: "text",
      rows: 3,
      group: "content",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      description: "Full description shown at the top of the product detail modal.",
      type: "text",
      rows: 5,
      group: "content",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "features",
      title: "Highlights",
      description: "Bullet points shown in the Highlights section of the product detail modal.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "content",
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: "specs",
      title: "Specs",
      description: "Label/value pairs shown as a grid of cards in the product detail modal. Example: Range → Accessories, Brand line → Rapid.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (R) => R.required() }),
            defineField({ name: "value", title: "Value", type: "string", validation: (R) => R.required() }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
      group: "content",
      validation: (R) => R.required().min(1),
    }),

    // ── Settings ──────────────────────────────────────────────────────────
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      description: "Controls display order on the Products page. Lower number = appears first. Default 100.",
      type: "number",
      initialValue: 100,
      group: "settings",
    }),
    defineField({
      name: "isPublished",
      title: "Show on Website",
      description: "Uncheck to hide this product from the Products page and all homepage sections without deleting it.",
      type: "boolean",
      initialValue: true,
      group: "settings",
    }),
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "brand",
      categoryTitle: "category.title",
      media: "images.0",
    },
    prepare({ title, subtitle, categoryTitle, media }) {
      return {
        title,
        subtitle: [categoryTitle, subtitle].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
