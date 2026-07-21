import { defineArrayMember, defineField, defineType } from "sanity";

// ── Array members ─────────────────────────────────────────────────────────────

const statMember = defineArrayMember({
  name: "statItem",
  type: "object",
  fields: [
    defineField({ name: "value", title: "Value (e.g. 30+)", type: "string", validation: (R) => R.required() }),
    defineField({ name: "label", title: "Label (e.g. Years in business)", type: "string", validation: (R) => R.required() }),
  ],
  preview: { select: { title: "value", subtitle: "label" } },
});

const storeMember = defineArrayMember({
  name: "storeItem",
  type: "object",
  fields: [
    defineField({ name: "name",    title: "Store Name",      type: "string", validation: (R) => R.required() }),
    defineField({ name: "type",    title: "Store Type",      type: "string", validation: (R) => R.required() }),
    defineField({ name: "address", title: "Street Address",  type: "text", rows: 2, validation: (R) => R.required() }),
    defineField({ name: "city",    title: "City & Pincode",  type: "string", validation: (R) => R.required() }),
    defineField({ name: "mapsUrl", title: "Google Maps URL", type: "url",    validation: (R) => R.required() }),
  ],
  preview: { select: { title: "name", subtitle: "city" } },
});

const specializationMember = defineArrayMember({
  name: "specializationItem",
  type: "object",
  fields: [
    defineField({ name: "title",   title: "Role Title",   type: "string", validation: (R) => R.required() }),
    defineField({ name: "summary", title: "Summary",      type: "text", rows: 3, validation: (R) => R.required() }),
    defineField({
      name: "items",
      title: "Bullet Points",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: { select: { title: "title" } },
});

const heroSlideMember = defineArrayMember({
  name: "heroMediaItem",
  type: "object",
  fields: [
    defineField({ name: "eyebrow",     title: "Eyebrow Label", type: "string", validation: (R) => R.required() }),
    defineField({ name: "title",       title: "Title",         type: "string", validation: (R) => R.required() }),
    defineField({ name: "description", title: "Description",   type: "text", rows: 2, validation: (R) => R.required() }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
      validation: (R) => R.required(),
    }),
  ],
  preview: { select: { title: "title", subtitle: "eyebrow", media: "image" } },
});

const cataloguePageMember = defineArrayMember({
  name: "cataloguePageItem",
  type: "object",
  fields: [
    defineField({ name: "id",      title: "Page ID (01–20)", type: "string", validation: (R) => R.required() }),
    defineField({ name: "title",   title: "Title",           type: "string", validation: (R) => R.required() }),
    defineField({ name: "section", title: "Section Label",   type: "string", validation: (R) => R.required() }),
    defineField({
      name: "image",
      title: "Page Image",
      type: "image",
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),
  ],
  preview: { select: { title: "title", subtitle: "id", media: "image" } },
});

// ── Schema ────────────────────────────────────────────────────────────────────

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",

  groups: [
    { name: "brand",     title: "🏷  Brand",     default: true },
    { name: "home",      title: "🏠  Home Page" },
    { name: "catalogue", title: "📖  Catalogue" },
  ],

  fieldsets: [
    { name: "identity", title: "Identity",       options: { collapsible: true, collapsed: false } },
    { name: "contact",  title: "Contact & Links", options: { collapsible: true, collapsed: false } },
    { name: "hero",     title: "Hero Carousel",   options: { collapsible: true, collapsed: false } },
    { name: "featured", title: "Featured Sections", options: { collapsible: true, collapsed: true } },
    { name: "why",      title: "Why DTC Cards",   options: { collapsible: true, collapsed: true } },
  ],

  fields: [
    // ── Brand — Identity ──────────────────────────────────────────────────
    defineField({ name: "brandName",         title: "Brand Name",                type: "string", group: "brand", fieldset: "identity", validation: (R) => R.required() }),
    defineField({ name: "brandShortName",    title: "Short Name / Initials",     type: "string", group: "brand", fieldset: "identity", validation: (R) => R.required() }),
    defineField({ name: "brandSupportLabel", title: "Sub-header Label",          type: "string", group: "brand", fieldset: "identity" }),
    defineField({
      name: "brandLogo",
      title: "Brand Logo Image",
      description: "Optional. When set, replaces the initials box in the header. Use a transparent PNG or SVG-exported PNG.",
      type: "image",
      options: { hotspot: false },
      group: "brand",
      fieldset: "identity",
    }),
    defineField({ name: "city",              title: "City",                      type: "string", group: "brand", fieldset: "identity", validation: (R) => R.required() }),
    defineField({ name: "intro",             title: "Brand Intro (footer text)", type: "text", rows: 3, group: "brand", fieldset: "identity", validation: (R) => R.required() }),
    defineField({ name: "brands",            title: "Stocked Brands",            type: "array", of: [defineArrayMember({ type: "string" })], group: "brand", fieldset: "identity", validation: (R) => R.required().min(1) }),
    defineField({ name: "stats",             title: "Stats",                     type: "array", of: [statMember], group: "brand", fieldset: "identity", validation: (R) => R.required().min(1) }),

    // ── Brand — Contact & Links ───────────────────────────────────────────
    defineField({ name: "phoneDisplay", title: "Phone (Display)",        type: "string", group: "brand", fieldset: "contact", validation: (R) => R.required() }),
    defineField({ name: "phoneRaw",     title: "Phone (Raw, digits only)", type: "string", group: "brand", fieldset: "contact", validation: (R) => R.required() }),
    defineField({ name: "phoneHref",    title: "Phone Href (tel:…)",     type: "string", group: "brand", fieldset: "contact", validation: (R) => R.required() }),
    defineField({ name: "email",        title: "Email",                  type: "string", group: "brand", fieldset: "contact", validation: (R) => R.required().email() }),
    defineField({ name: "emailHref",    title: "Email Href (mailto:…)",  type: "string", group: "brand", fieldset: "contact", validation: (R) => R.required() }),
    defineField({ name: "whatsappHref", title: "WhatsApp Href",          type: "url",    group: "brand", fieldset: "contact", validation: (R) => R.required() }),

    // ── Brand — Stores & Supply Roles ─────────────────────────────────────
    defineField({ name: "stores",          title: "Store Locations",    type: "array", of: [storeMember],          group: "brand", validation: (R) => R.required().min(1) }),
    defineField({ name: "specializations", title: "Supply Role Cards",  type: "array", of: [specializationMember], group: "brand", validation: (R) => R.required().min(1) }),

    // ── Home — Hero ───────────────────────────────────────────────────────
    defineField({
      name: "heroMedia",
      title: "Hero Carousel Slides",
      type: "array",
      of: [heroSlideMember],
      group: "home",
      fieldset: "hero",
      validation: (R) => R.required().min(1),
    }),
    defineField({ name: "heroHappyCustomersCount", title: "Hero — Happy Customers Count", type: "string", group: "home", fieldset: "hero" }),
    defineField({ name: "heroHappyCustomersLabel", title: "Hero — Happy Customers Label", type: "string", group: "home", fieldset: "hero" }),
    defineField({ name: "heroFloatingCardTitle",   title: "Hero — Floating Card Title",   type: "string", group: "home", fieldset: "hero" }),
    defineField({
      name: "heroFloatingCardImage",
      title: "Hero — Floating Card Image",
      type: "image",
      options: { hotspot: true },
      group: "home",
      fieldset: "hero",
    }),

    // ── Home — Featured pickers ───────────────────────────────────────────
    defineField({
      name: "featuredCategories",
      title: "Featured Ranges",
      description: "Pick categories to show on the home page. Drag to reorder.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "category" }], weak: true, options: { disableNew: true } })],
      group: "home",
      fieldset: "featured",
      validation: (R) => R.unique(),
    }),
    defineField({
      name: "featuredProducts",
      title: "Featured Products",
      description: "Pick products to show on the home page. Drag to reorder.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "product" }], weak: true, options: { disableNew: true } })],
      group: "home",
      fieldset: "featured",
      validation: (R) => R.unique(),
    }),

    // ── Home — Why DTC ────────────────────────────────────────────────────
    defineField({ name: "homeWhyEyebrow",     title: "Why DTC — Eyebrow",             type: "string", group: "home", fieldset: "why" }),
    defineField({ name: "homeWhyTitle",       title: "Why DTC — Section Title",       type: "string", group: "home", fieldset: "why" }),
    defineField({ name: "homeWhyDescription", title: "Why DTC — Section Description", type: "text", rows: 2, group: "home", fieldset: "why" }),
    defineField({ name: "homeFeaturedRangesEyebrow",     title: "Featured Ranges — Eyebrow",     type: "string", group: "home", fieldset: "featured" }),
    defineField({ name: "homeFeaturedRangesTitle",       title: "Featured Ranges — Title",       type: "string", group: "home", fieldset: "featured" }),
    defineField({ name: "homeFeaturedRangesDescription", title: "Featured Ranges — Description", type: "text", rows: 2, group: "home", fieldset: "featured" }),
    defineField({ name: "homeFeaturedProductsEyebrow",     title: "Featured Products — Eyebrow",     type: "string", group: "home", fieldset: "featured" }),
    defineField({ name: "homeFeaturedProductsTitle",       title: "Featured Products — Title",       type: "string", group: "home", fieldset: "featured" }),
    defineField({ name: "homeFeaturedProductsDescription", title: "Featured Products — Description", type: "text", rows: 2, group: "home", fieldset: "featured" }),
    defineField({ name: "homeBrandsEyebrow",     title: "Brands — Eyebrow",     type: "string", group: "home" }),
    defineField({ name: "homeBrandsTitle",       title: "Brands — Title",       type: "string", group: "home" }),
    defineField({ name: "homeBrandsDescription", title: "Brands — Description", type: "text", rows: 2, group: "home" }),

    // ── Catalogue ─────────────────────────────────────────────────────────
    defineField({ name: "catalogueFile",           title: "Catalogue PDF URL",          type: "string", group: "catalogue", validation: (R) => R.required() }),
    defineField({ name: "catalogueHeroEyebrow",    title: "Catalogue — Hero Eyebrow",   type: "string", group: "catalogue" }),
    defineField({ name: "catalogueHeroTitle",      title: "Catalogue — Hero Title",     type: "string", group: "catalogue" }),
    defineField({ name: "catalogueHeroDescription",title: "Catalogue — Hero Description",type: "text", rows: 2, group: "catalogue" }),
    defineField({ name: "catalogueFocusEyebrow",   title: "Catalogue — Focus Eyebrow",  type: "string", group: "catalogue" }),
    defineField({ name: "catalogueBrowseEyebrow",  title: "Catalogue — Browse Eyebrow", type: "string", group: "catalogue" }),
    defineField({ name: "catalogueDownloadLabel",  title: "Catalogue — Download Label", type: "string", group: "catalogue" }),
    defineField({ name: "catalogueCallLabel",      title: "Catalogue — Call Label",     type: "string", group: "catalogue" }),
    defineField({ name: "catalogueEmailLabel",     title: "Catalogue — Email Label",    type: "string", group: "catalogue" }),
    defineField({ name: "cataloguePages",          title: "Catalogue Pages",            type: "array", of: [cataloguePageMember], group: "catalogue", validation: (R) => R.required().min(1) }),

    // ── Nav & Header ──────────────────────────────────────────────────────
    defineField({
      name: "navItems", title: "Nav Items", type: "array",
      of: [defineArrayMember({ type: "object", fields: [
        defineField({ name: "href", type: "string", validation: (R) => R.required() }),
        defineField({ name: "label", type: "string", validation: (R) => R.required() }),
      ]})],
      group: "brand",
    }),
    defineField({ name: "headerCtaLabel", title: "Header CTA Label", type: "string", group: "brand" }),
    defineField({ name: "familyOverview", title: "Family Overview (JSON object)", type: "object",
      fields: [
        defineField({ name: "hardware",    type: "text", rows: 2 }),
        defineField({ name: "electrical",  type: "text", rows: 2 }),
        defineField({ name: "structure",   type: "text", rows: 2 }),
        defineField({ name: "materials",   type: "text", rows: 2 }),
        defineField({ name: "accessories", type: "text", rows: 2 }),
      ],
      group: "brand",
    }),

    // ── Footer ────────────────────────────────────────────────────────────
    defineField({ name: "footerNavigateTitle", title: "Footer — Navigate Title", type: "string", group: "brand" }),
    defineField({ name: "footerStoresTitle",   title: "Footer — Stores Title",   type: "string", group: "brand" }),
    defineField({ name: "footerContactTitle",  title: "Footer — Contact Title",  type: "string", group: "brand" }),
    defineField({ name: "footerBottomCaption", title: "Footer — Bottom Caption", type: "string", group: "brand" }),

    // ── Products page copy ────────────────────────────────────────────────
    defineField({ name: "productsHeroEyebrow",       title: "Products — Hero Eyebrow",        type: "string", group: "home" }),
    defineField({ name: "productsHeroTitle",         title: "Products — Hero Title",          type: "string", group: "home" }),
    defineField({ name: "productsHeroSubtitle",      title: "Products — Hero Subtitle",       type: "text", rows: 2, group: "home" }),
    defineField({ name: "productsSummaryTitle",      title: "Products — Summary Title",       type: "string", group: "home" }),
    defineField({ name: "productsSummaryDescription",title: "Products — Summary Description", type: "text", rows: 2, group: "home" }),
    defineField({ name: "productsNoResultEyebrow",   title: "Products — No Result Eyebrow",   type: "string", group: "home" }),
    defineField({ name: "productsNoResultTitle",     title: "Products — No Result Title",     type: "string", group: "home" }),
    defineField({ name: "productsNoResultDescription",title: "Products — No Result Description",type: "text", rows: 2, group: "home" }),
    defineField({ name: "productsNoResultResetLabel",title: "Products — No Result Reset Label",type: "string", group: "home" }),
    defineField({ name: "productsFilterFamilyLabel", title: "Products — Filter Family Label", type: "string", group: "home" }),
    defineField({ name: "productsFilterRangeLabel",  title: "Products — Filter Range Label",  type: "string", group: "home" }),
    defineField({ name: "productsFilterBrandLabel",  title: "Products — Filter Brand Label",  type: "string", group: "home" }),

    // ── About page copy ───────────────────────────────────────────────────
    defineField({ name: "aboutHeroEyebrow",       title: "About — Hero Eyebrow",       type: "string", group: "home" }),
    defineField({ name: "aboutHeroTitle",         title: "About — Hero Title",         type: "string", group: "home" }),
    defineField({ name: "aboutHeroSubtitle",      title: "About — Hero Subtitle",      type: "text", rows: 2, group: "home" }),
    defineField({ name: "aboutPrimaryCtaLabel",   title: "About — Primary CTA",        type: "string", group: "home" }),
    defineField({ name: "aboutSecondaryCtaLabel", title: "About — Secondary CTA",      type: "string", group: "home" }),
    defineField({ name: "aboutModelEyebrow",      title: "About — Model Eyebrow",      type: "string", group: "home" }),
    defineField({ name: "aboutModelTitle",        title: "About — Model Title",        type: "string", group: "home" }),
    defineField({ name: "aboutModelDescription",  title: "About — Model Description",  type: "text", rows: 2, group: "home" }),
    defineField({ name: "aboutBrandsEyebrow",     title: "About — Brands Eyebrow",     type: "string", group: "home" }),
    defineField({ name: "aboutBrandsTitle",       title: "About — Brands Title",       type: "string", group: "home" }),
    defineField({ name: "aboutBrandsDescription", title: "About — Brands Description", type: "text", rows: 2, group: "home" }),

    // ── Contact page copy ─────────────────────────────────────────────────
    defineField({ name: "contactHeroEyebrow",          title: "Contact — Hero Eyebrow",           type: "string", group: "home" }),
    defineField({ name: "contactHeroTitle",            title: "Contact — Hero Title",             type: "string", group: "home" }),
    defineField({ name: "contactHeroSubtitle",         title: "Contact — Hero Subtitle",          type: "text", rows: 2, group: "home" }),
    defineField({ name: "contactQuickContactEyebrow",  title: "Contact — Quick Contact Eyebrow",  type: "string", group: "home" }),
    defineField({ name: "contactWhatsappTitle",        title: "Contact — WhatsApp Title",         type: "string", group: "home" }),
    defineField({ name: "contactWhatsappDescription",  title: "Contact — WhatsApp Description",   type: "text", rows: 2, group: "home" }),
    defineField({ name: "contactEnquiryEyebrow",       title: "Contact — Enquiry Eyebrow",        type: "string", group: "home" }),
    defineField({ name: "contactEnquiryTitle",         title: "Contact — Enquiry Title",          type: "string", group: "home" }),
    defineField({ name: "contactEnquiryDescription",   title: "Contact — Enquiry Description",    type: "text", rows: 2, group: "home" }),
    defineField({ name: "contactEnquirySentTitle",     title: "Contact — Enquiry Sent Title",     type: "string", group: "home" }),
    defineField({ name: "contactEnquirySentDescription",title: "Contact — Enquiry Sent Description",type: "text", rows: 2, group: "home" }),
    defineField({ name: "contactEnquirySubmitLabel",   title: "Contact — Enquiry Submit Label",   type: "string", group: "home" }),
    defineField({ name: "contactBusinessHoursWeekday", title: "Contact — Business Hours Weekday", type: "string", group: "home" }),
    defineField({ name: "contactBusinessHoursSunday",  title: "Contact — Business Hours Sunday",  type: "string", group: "home" }),
  ],
});
