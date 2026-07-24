import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CustomSelect } from "../components/CustomSelect";
import { ProductCard } from "../components/ProductCard";
import { ProductModal } from "../components/ProductModal";
import { SectionHeading } from "../components/SectionHeading";
import { useSiteContent } from "../cms/SiteContentProvider";
import type { Product } from "../data/site";
import { usePageTitle } from "../hooks/usePageTitle";
import { useReveal } from "../hooks/useReveal";
import { ui } from "../lib/ui";

const PAGE_SIZE = 9;

export function ProductsPage() {
  const { content } = useSiteContent();
  const { categories, products, brand, copy } = content;
  const pc = copy.products;

  const familyFilters = useMemo(() => {
    const seen = new Set<string>();
    const opts: { id: string; label: string }[] = [{ id: "all", label: "All families" }];
    for (const cat of categories) {
      if (!seen.has(cat.family)) {
        seen.add(cat.family);
        opts.push({ id: cat.family, label: cat.family.charAt(0).toUpperCase() + cat.family.slice(1) });
      }
    }
    return opts;
  }, [categories]);

  const resultsTopRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState("");
  const [family, setFamily] = useState("all");
  const [range, setRange] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  usePageTitle("Products | Unique Sofa World Furniture");
  useReveal();

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.replace("#", ""));
    if (!hash) return;
    const categoryMatch = categories.find((c) => c.id === hash);
    if (categoryMatch) { setRange(categoryMatch.id); return; }
    const productMatch = products.find((p) => p.id === hash || p.slug === hash);
    if (productMatch) {
      setSelectedProduct(productMatch);
      setRange(productMatch.categoryId);
      setBrandFilter(productMatch.brand);
      setFamily(productMatch.family);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Cascade: reset child filters when parent changes and child is no longer valid
  useEffect(() => {
    if (family === "all") return;
    const validRanges = new Set(products.filter((p) => p.family === family).map((p) => p.categoryId));
    if (range !== "all" && !validRanges.has(range)) setRange("all");
  }, [family]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const base = products.filter((p) =>
      (family === "all" || p.family === family) && (range === "all" || p.categoryId === range)
    );
    const validBrands = new Set(base.map((p) => p.brand));
    if (brandFilter !== "all" && !validBrands.has(brandFilter)) setBrandFilter("all");
  }, [family, range]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { setPage(0); }, [search, family, range, brandFilter]);

  const rangeOptions = useMemo(() => {
    const validIds = new Set(
      family === "all" ? products.map((p) => p.categoryId) : products.filter((p) => p.family === family).map((p) => p.categoryId)
    );
    return [
      { id: "all", label: "All ranges" },
      ...categories.filter((c) => validIds.has(c.id)).map((c) => ({ id: c.id, label: c.title })),
    ];
  }, [family, categories, products]);

  const brandOptions = useMemo(() => {
    const base = products.filter((p) =>
      (family === "all" || p.family === family) && (range === "all" || p.categoryId === range)
    );
    const seen = new Set<string>();
    const opts: { id: string; label: string }[] = [{ id: "all", label: "All brands" }];
    for (const p of base) {
      if (!seen.has(p.brand)) { seen.add(p.brand); opts.push({ id: p.brand, label: p.brand }); }
    }
    return opts;
  }, [family, range, products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesFamily = family === "all" || product.family === family;
      const matchesRange = range === "all" || product.categoryId === range;
      const matchesBrand = brandFilter === "all" || product.brand === brandFilter;
      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.categoryTitle.toLowerCase().includes(query) ||
        product.type.toLowerCase().includes(query) ||
        product.tags.some((tag) => tag.toLowerCase().includes(query));
      return matchesFamily && matchesRange && matchesBrand && matchesQuery;
    });
  }, [brandFilter, family, range, search, products]);

  const [pageSize, setPageSize] = useState(() => window.innerWidth <= 780 ? 6 : PAGE_SIZE);

  useEffect(() => {
    const update = () => setPageSize(window.innerWidth <= 780 ? 6 : PAGE_SIZE);
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const hasResults = filteredProducts.length > 0;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);

  useEffect(() => { if (page !== safePage) setPage(safePage); }, [page, safePage]);

  const currentRange = categories.find((c) => c.id === range);
  const rangeDescription = currentRange?.summary ?? "";

  const paginatedProducts = filteredProducts.slice(safePage * pageSize, safePage * pageSize + pageSize);

  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return products.filter(
      (p) => p.id !== selectedProduct.id &&
        (p.categoryId === selectedProduct.categoryId || p.brand === selectedProduct.brand),
    ).slice(0, 4);
  }, [selectedProduct, products]);

  const activeFilterLabels = [
    family !== "all" ? familyFilters.find((o) => o.id === family)?.label : null,
    range !== "all" ? rangeOptions.find((o) => o.id === range)?.label : null,
    brandFilter !== "all" ? brandOptions.find((o) => o.id === brandFilter)?.label : null,
  ].filter(Boolean) as string[];

  function buildWhatsappUrl(product: Product) {
    const message = `Hello, I want to enquire about ${product.name} from the ${product.categoryTitle} range.`;
    return `https://wa.me/${brand.phoneRaw}?text=${encodeURIComponent(message)}`;
  }

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    window.history.replaceState(null, "", `#${product.id}`);
  };

  const closeProduct = () => {
    setSelectedProduct(null);
    window.history.replaceState(null, "", window.location.pathname);
  };

  const resetFilters = () => {
    setSearch("");
    setFamily("all");
    setRange("all");
    setBrandFilter("all");
    setFiltersOpen(false);
  };

  const goToPage = (nextPage: number) => {
    const resolvedPage = Math.max(0, Math.min(totalPages - 1, nextPage));
    setPage(resolvedPage);
    window.setTimeout(() => {
      resultsTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const hasActiveFilters = family !== "all" || range !== "all" || brandFilter !== "all" || search !== "";

  return (
    <div className={ui.pageTop}>
      {selectedProduct ? (
        <ProductModal
          product={selectedProduct}
          relatedProducts={relatedProducts}
          phoneHref={brand.phoneHref}
          phoneRaw={brand.phoneRaw}
          onClose={closeProduct}
          onOpenProduct={openProduct}
        />
      ) : null}

      {/* Page header */}
      <section className={ui.sectionGapIntro} style={{ backgroundColor: "#ffffff" }}>
        <div className={ui.containerWide}>
          <Breadcrumbs current="Products" />
          <div className="grid gap-6 min-[1101px]:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)]">
            <div className="max-[1100px]:hidden">
              <SectionHeading
                eyebrow={pc.heroEyebrow}
                title={pc.heroTitle}
                description={rangeDescription}
              />
            </div>
            <div
              className="h-full rounded-2xl border p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)] max-[780px]:rounded-xl max-[780px]:p-5"
              style={{ borderColor: "#e5e7eb", backgroundColor: "#ffffff" }}
              data-reveal="right"
            >
              <span className={ui.chip}>{filteredProducts.length} products</span>
              <h2 className="m-0 mt-4 font-display text-[clamp(1.9rem,2.8vw,2.5rem)] leading-[1.04] max-[780px]:text-[clamp(1.65rem,7vw,2.2rem)]"
                style={{ color: "var(--text)" }}>
                {pc.summaryTitle}
              </h2>
              <p className="m-0 mt-3 text-[0.92rem] leading-[1.8]" style={{ color: "#374151" }}>
                {pc.summaryDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products + filter bar */}
      <section className={ui.sectionGapNoTop} style={{ backgroundColor: "#f9fafb" }}>
        <div className={ui.containerWide}>

          {/* ── Sticky filter bar ── */}
          <div className="relative z-40 mb-7 w-full min-[781px]:sticky min-[781px]:top-[5rem]">
            <div
              className="rounded-xl border p-4 max-[780px]:rounded-xl"
              style={{
                borderColor: "#e5e7eb",
                backgroundColor: "rgba(255,255,255,0.96)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 8px_24px rgba(0,0,0,0.06)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Desktop: search (fixed width) + 3 selects + reset — all one row */}
              <div className="flex items-end gap-3 max-[1080px]:hidden">
                <div className="relative w-[220px] shrink-0">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9ca3af" }} />
                  <input
                    className={ui.field}
                    style={{ paddingLeft: "2.25rem", paddingRight: search ? "2.25rem" : undefined }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search…"
                    aria-label="Search products"
                  />
                  {search && (
                    <button type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-full"
                      style={{ backgroundColor: "#f3f4f6" }}
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                    >
                      <X size={13} style={{ color: "#6b7280" }} />
                    </button>
                  )}
                </div>

                <div className="flex flex-1 items-end gap-3">
                  <div className="flex-1 min-w-0">
                    <CustomSelect label={pc.filterFamilyLabel || "Family"} options={familyFilters} value={family} onChange={setFamily} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CustomSelect label={pc.filterRangeLabel || "Range"} options={rangeOptions} value={range} onChange={setRange} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CustomSelect label={pc.filterBrandLabel || "Brand"} options={brandOptions} value={brandFilter} onChange={setBrandFilter} />
                  </div>
                </div>

                <button
                  type="button"
                  className={`${ui.buttonBase} ${ui.buttonSecondary} shrink-0`}
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                >
                  Reset
                </button>
              </div>

              {/* Tablet / Mobile */}
              <div className="min-[1081px]:hidden">
                <div className="flex items-center gap-3 max-[560px]:flex-col">
                  <div className="relative flex-1 min-w-0">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9ca3af" }} />
                    <input
                      className={ui.field}
                      style={{ paddingLeft: "2.25rem", paddingRight: search ? "2.25rem" : undefined }}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search products, brands, or tags"
                      aria-label="Search products"
                    />
                    {search && (
                      <button type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-full"
                        style={{ backgroundColor: "#f3f4f6" }}
                        onClick={() => setSearch("")}
                        aria-label="Clear search"
                      >
                        <X size={13} style={{ color: "#6b7280" }} />
                      </button>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2 max-[560px]:w-full">
                    <button
                      type="button"
                      className={`${ui.buttonBase} ${ui.buttonSecondary} flex-1`}
                      onClick={() => setFiltersOpen((c) => !c)}
                      aria-expanded={filtersOpen}
                    >
                      <SlidersHorizontal size={14} />
                      {filtersOpen ? "Hide" : "Filters"}
                    </button>
                    <button
                      type="button"
                      className={`${ui.buttonBase} ${ui.buttonSecondary} flex-1`}
                      onClick={resetFilters}
                      disabled={!hasActiveFilters}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {filtersOpen && (
                  <div className="mt-4 grid gap-3 min-[561px]:grid-cols-3 max-[560px]:grid-cols-1">
                    <CustomSelect label={pc.filterFamilyLabel || "Family"} options={familyFilters} value={family} onChange={setFamily} />
                    <CustomSelect label={pc.filterRangeLabel || "Range"} options={rangeOptions} value={range} onChange={setRange} />
                    <CustomSelect label={pc.filterBrandLabel || "Brand"} options={brandOptions} value={brandFilter} onChange={setBrandFilter} />
                  </div>
                )}
              </div>

              {activeFilterLabels.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeFilterLabels.map((label) => (
                    <span key={label} className={ui.chip}>{label}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results count */}
          <div
            ref={resultsTopRef}
            className="mb-6 flex items-center justify-between gap-4 text-[0.85rem] font-medium max-[780px]:flex-col max-[780px]:items-start max-[780px]:gap-1"
            style={{ color: "#6b7280" }}
          >
            <p className="m-0">Showing <strong style={{ color: "#111827" }}>{filteredProducts.length}</strong> products</p>
            <p className="m-0">Page {String(safePage + 1).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}</p>
          </div>

          {/* Product grid */}
          {hasResults ? (
            <>
              <div className="grid items-stretch gap-5 max-[780px]:gap-4 md:grid-cols-2 xl:grid-cols-3" data-reveal-stagger="80">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpen={openProduct}
                    whatsappUrl={buildWhatsappUrl(product)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-2" data-reveal>
                  <button type="button" className={ui.iconButton} onClick={() => goToPage(safePage - 1)} aria-label="Previous page" disabled={safePage === 0}>
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={`page-${index}`}
                      type="button"
                      className="inline-flex h-11 min-w-[2.75rem] items-center justify-center rounded-lg border px-3 text-[0.88rem] font-semibold transition-[background-color,border-color,color,box-shadow] duration-150"
                      style={index === safePage ? {
                        backgroundColor: "var(--accent)",
                        borderColor: "var(--accent)",
                        color: "#ffffff",
                        boxShadow: "0 2px 8px rgba(249,107,8,0.35)",
                      } : {
                        backgroundColor: "#ffffff",
                        borderColor: "#e5e7eb",
                        color: "#374151",
                      }}
                      onClick={() => goToPage(index)}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </button>
                  ))}
                  <button type="button" className={ui.iconButton} onClick={() => goToPage(safePage + 1)} aria-label="Next page" disabled={safePage === totalPages - 1}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={`${ui.surfaceCard} p-10 text-center max-[780px]:p-7`} data-reveal>
              <p className="inline-flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--accent)" }}>
                <span style={{ display: "inline-block", width: "1.75rem", height: "1px", background: "currentColor" }} />
                {pc.noResultEyebrow}
              </p>
              <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)]" style={{ color: "var(--text)" }}>
                {pc.noResultTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-[38rem] text-[0.92rem] leading-[1.8]" style={{ color: "#374151" }}>
                {pc.noResultDescription}
              </p>
              <button type="button" className={`${ui.buttonBase} ${ui.buttonPrimary} mt-6`} onClick={resetFilters}>
                {pc.noResultResetLabel}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
