// Compatibility exports for components that historically imported these
// types from this module. Runtime content comes exclusively from Sanity.
export type {
  Category,
  CategoryFamily,
  Product,
  ProductSpec,
  Store,
} from "../cms/types";

import type { CategoryFamily } from "../cms/types";

export const FAMILY_FILTERS: { id: CategoryFamily | "all"; label: string }[] = [
  { id: "all",       label: "All categories" },
  { id: "sofas",     label: "Sofas" },
  { id: "beds",      label: "Beds" },
  { id: "recliners", label: "Recliners" },
  { id: "chairs",    label: "Chairs" },
  { id: "dining",    label: "Dining" },
  { id: "tables",    label: "Tables" },
];
