// This file provides shared TypeScript types used by components.
// All runtime content (products, categories, brands, stores, etc.)
// comes exclusively from Sanity via SiteContentProvider.
// The FAMILY_FILTERS constant is a stable UI enum that intentionally
// lives here — it maps to the CategoryFamily type values.

export type CategoryFamily =
  | "furniture"
  | "materials"
  | "services";

export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  badge?: string;
  categoryId: string;
  categoryTitle: string;
  family: CategoryFamily;
  type: string;
  summary: string;
  description: string;
  features: string[];
  specs: ProductSpec[];
  tags: string[];
  images: string[];
};

export type Category = {
  id: string;
  slug: string;
  code: string;
  title: string;
  subtitle: string;
  summary: string;
  badge?: string;
  accent: string;
  tone: string;
  family: CategoryFamily;
  items: string[];
  images: string[];
};

export type Store = {
  name: string;
  type: string;
  address: string;
  city: string;
  mapsUrl: string;
};

// Static UI filter labels — these map to CategoryFamily values
// and are intentionally hardcoded since the family taxonomy is
// defined in the Sanity schema, not user-editable content.
export const FAMILY_FILTERS: { id: CategoryFamily | "all"; label: string }[] = [
  { id: "all",        label: "All categories" },
  { id: "furniture",  label: "Furniture" },
  { id: "materials",  label: "Materials & Frames" },
  { id: "services",   label: "Services" },
];
