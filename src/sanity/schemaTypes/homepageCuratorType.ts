import { defineArrayMember, defineField, defineType } from "sanity";

export const HOMEPAGE_FEATURED_RANGES_ID  = "homepage-featured-ranges-v1";
export const HOMEPAGE_FEATURED_PRODUCTS_ID = "homepage-featured-products-v1";

export const homepageFeaturedRangesType = defineType({
  name: "homepageFeaturedRanges",
  title: "Homepage — Featured Ranges",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow Label",
      type: "string",
      initialValue: "Featured ranges",
    }),
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      initialValue: "Core ranges buyers check first.",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "description",
      title: "Section Description",
      type: "text",
      rows: 2,
      initialValue: "Quick visual access to recliners, leg collections, trims, and workshop essentials.",
    }),
    defineField({
      name: "categories",
      title: "Categories to feature",
      type: "array",
      description: "Pick categories from the catalogue. Drag to reorder. Deleted categories are automatically removed.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "category" }],
          weak: true,
          options: {
            disableNew: true,
            filter: "coalesce(isPublished, true) == true",
          },
        }),
      ],
      validation: (R) => R.unique(),
    }),
  ],
  preview: { select: { title: "title" } },
});

export const homepageFeaturedProductsType = defineType({
  name: "homepageFeaturedProducts",
  title: "Homepage — Featured Products",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow Label",
      type: "string",
      initialValue: "Featured products",
    }),
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      initialValue: "Selected stock highlights.",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "description",
      title: "Section Description",
      type: "text",
      rows: 2,
      initialValue: "Open key items for photos, features, and contact-ready product details.",
    }),
    defineField({
      name: "products",
      title: "Products to feature",
      type: "array",
      description: "Pick products from the catalogue. Drag to reorder. Deleted products are automatically removed.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "product" }],
          weak: true,
          options: {
            disableNew: true,
            filter: "coalesce(isPublished, true) == true",
          },
        }),
      ],
      validation: (R) => R.unique(),
    }),
  ],
  preview: { select: { title: "title" } },
});

export default [homepageFeaturedRangesType, homepageFeaturedProductsType];
