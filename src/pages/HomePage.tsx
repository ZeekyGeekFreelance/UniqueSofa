import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useSiteContent } from "../cms/SiteContentProvider";
import { AnimatedCount } from "../components/AnimatedCount";
import { BrandMarquee } from "../components/BrandMarquee";
import { Hero } from "../components/Hero";
import { MediaCarousel } from "../components/MediaCarousel";
import { ProductCard } from "../components/ProductCard";
import { SectionHeading } from "../components/SectionHeading";
import { useSwipe } from "../hooks/useSwipe";
import { usePageTitle } from "../hooks/usePageTitle";
import { useReveal } from "../hooks/useReveal";
import { ui } from "../lib/ui";

const RANGE_PAGE_SIZE = 3;
const PRODUCT_PAGE_SIZE = 3;

function buildWhatsappUrl(phoneRaw: string, productName: string) {
  return `https://wa.me/${phoneRaw}?text=${encodeURIComponent(`Hello, I want to enquire about ${productName}.`)}`;
}

function getLoopedPageItems<T>(items: T[], page: number, pageSize: number) {
  if (!items.length) return [];
  return Array.from({ length: pageSize }, (_, offset) => {
    const index = (page * pageSize + offset) % items.length;
    return items[index];
  });
}

export function HomePage() {
  const { content } = useSiteContent();
  const { brand, categories, products, featuredCategoryIds, featuredProductIds, stores, brands, specializations, copy, stats } = content;
  const [, navigate] = useLocation();
  const [rangePage, setRangePage] = useState(0);
  const [productPage, setProductPage] = useState(0);

  usePageTitle(`${brand.name} | Sofa Hardware Specialists`);
  useReveal();

  const featuredRanges = categories.filter((c) => featuredCategoryIds.includes(c.id));
  const featuredProducts = products.filter((p) => featuredProductIds.includes(p.id));
  const rangePageCount = Math.max(1, Math.ceil(featuredRanges.length / RANGE_PAGE_SIZE));
  const productPageCount = Math.max(1, Math.ceil(featuredProducts.length / PRODUCT_PAGE_SIZE));

  useEffect(() => {
    if (rangePageCount <= 1) return;
    const timer = window.setInterval(() => setRangePage((c) => (c + 1) % rangePageCount), 4600);
    return () => window.clearInterval(timer);
  }, [rangePageCount]);

  useEffect(() => {
    if (productPageCount <= 1) return;
    const timer = window.setInterval(() => setProductPage((c) => (c + 1) % productPageCount), 5200);
    return () => window.clearInterval(timer);
  }, [productPageCount]);

  const rangeItems = getLoopedPageItems(featuredRanges, rangePage, RANGE_PAGE_SIZE);
  const productItems = getLoopedPageItems(featuredProducts, productPage, PRODUCT_PAGE_SIZE);

  const rangeSwipe = useSwipe(
    () => setRangePage((c) => (c + 1) % rangePageCount),
    () => setRangePage((c) => (c - 1 + rangePageCount) % rangePageCount),
  );
  const productSwipe = useSwipe(
    () => setProductPage((c) => (c + 1) % productPageCount),
    () => setProductPage((c) => (c - 1 + productPageCount) % productPageCount),
  );

  return (
    <div className="[--home-range-card-height:36rem] [--home-product-card-height:38.5rem] max-[780px]:[--home-product-card-height:34rem]">
      <Hero />

      {/* ── STATS BELT ─────────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--forest)" }}>
        <div className={`${ui.containerWide} py-12 max-[780px]:py-9`}>
          <div className="grid grid-cols-3">
            {stats.slice(0, 3).map((stat, i) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 text-center"
                style={{
                  borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.12)" : "none",
                  padding: "0 clamp(1rem, 4vw, 3rem)",
                }}
                data-reveal
              >
                <strong
                  className="font-display font-black text-white leading-none"
                  style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
                >
                  <AnimatedCount value={stat.value} />
                </strong>
                <span
                  className="text-[0.78rem] font-medium"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE BELT ───────────────────────────────────────── */}
      <div
        className="overflow-hidden py-5"
        style={{ backgroundColor: "var(--forest-mid)", borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: "2.5rem" }}
      >
        <BrandMarquee
          items={brands}
          durationSeconds={22}
          itemClassName="inline-flex items-center gap-4 whitespace-nowrap font-display font-bold text-[0.95rem] uppercase tracking-[0.06em] px-6"
          className=""
        />
      </div>

      {/* Featured Ranges */}
      <section className={ui.sectionGap} style={{ backgroundColor: "#ffffff" }}>
        <div className={ui.containerWide}>
          <SectionHeading
            eyebrow={copy.home.featuredRangesEyebrow}
            title={copy.home.featuredRangesTitle}
            description={copy.home.featuredRangesDescription}
          />
          <div className="grid items-stretch gap-5 lg:grid-cols-3 max-[780px]:gap-4" data-reveal-stagger="100" {...rangeSwipe}>
            {rangeItems.map((category, index) => (
              <article
                key={`range-slot-${index}`}
                className="card-lift shimmer grid h-[var(--home-range-card-height)] min-h-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)] grid-rows-[minmax(0,48%)_minmax(0,52%)] max-[780px]:rounded-xl"
                data-reveal style={{ transitionDelay: `${index * 90}ms` }}
              >
                <div className="min-h-0 border-b border-[var(--border)]">
                  <MediaCarousel images={category.images} alt={category.title} autoPlay showArrows showDots showCount={false} className="h-full aspect-auto" />
                </div>
                <div className="grid min-h-0 grid-rows-[auto_auto_minmax(0,1fr)_auto_auto] gap-3 overflow-hidden p-5 max-[780px]:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={ui.chip}>{category.code}</span>
                    <span className="truncate whitespace-nowrap text-right text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-faint)]">{category.subtitle}</span>
                  </div>
                  <h3 className="m-0 line-clamp-2 font-display text-[clamp(1.55rem,2vw,1.95rem)] leading-[1.04] tracking-[-0.02em] max-[780px]:text-[clamp(1.4rem,7vw,1.9rem)]">{category.title}</h3>
                  <p className="m-0 line-clamp-3 min-h-0 text-[0.9rem] leading-[1.75] text-[var(--text-soft)] max-[780px]:text-[0.88rem]">{category.summary}</p>
                  <div className="flex min-w-0 flex-wrap items-center gap-2 overflow-hidden max-h-[1.9rem]">
                    {category.items.slice(0, 3).map((item) => (
                      <span key={`${category.id}-${item}`} className="inline-flex items-center whitespace-nowrap rounded-md border border-[var(--border)] bg-[#f3f4f6] px-[0.6rem] py-[0.22rem] text-[0.7rem] font-semibold text-[var(--text-soft)]">{item}</span>
                    ))}
                  </div>
                  <Link href={`/products#${category.id}`} className={`${ui.buttonBase} ${ui.buttonSecondary} min-w-0 self-end`}>
                    Open this range <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className={`${ui.sectionIndex} ${ui.sectionIndexWithArrows}`} data-reveal>
            <div className={ui.sectionIndexPager}>
              <button type="button" className={ui.iconButton} onPointerDown={(e) => e.stopPropagation()} aria-label="Previous featured ranges" onClick={() => setRangePage((c) => (c - 1 + rangePageCount) % rangePageCount)}><ChevronLeft size={17} /></button>
              <div className={ui.sectionIndexDots}>
                {Array.from({ length: rangePageCount }).map((_, index) => (
                  <button key={`rp-${index}`} type="button" className={`${ui.sectionIndexDot} ${index === rangePage ? "scale-110" : ""}`.trim()} style={{ backgroundColor: index === rangePage ? "var(--accent)" : "#d1d5db" }} onClick={() => setRangePage(index)} aria-label={`Range page ${index + 1}`} />
                ))}
              </div>
              <button type="button" className={ui.iconButton} onPointerDown={(e) => e.stopPropagation()} aria-label="Next featured ranges" onClick={() => setRangePage((c) => (c + 1) % rangePageCount)}><ChevronRight size={17} /></button>
            </div>
            <span>{String(rangePage + 1).padStart(2, "0")} / {String(rangePageCount).padStart(2, "0")}</span>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={ui.sectionGap} style={{ backgroundColor: "#f3f4f6" }}>
        <div className={ui.containerWide}>
          <SectionHeading
            eyebrow={copy.home.featuredProductsEyebrow}
            title={copy.home.featuredProductsTitle}
            description={copy.home.featuredProductsDescription}
          />
          <div className="grid items-stretch gap-5 max-[780px]:gap-4 lg:grid-cols-3" data-reveal-stagger="100" {...productSwipe}>
            {productItems.map((product, index) => (
              <div key={`product-slot-${index}`} className="flex min-w-0" style={{ transitionDelay: `${index * 80}ms` }}>
                <ProductCard
                  product={product}
                  onOpen={() => navigate(`/products#${product.id}`)}
                  whatsappUrl={buildWhatsappUrl(brand.phoneRaw, product.name)}
                  className="h-[var(--home-product-card-height)] w-full"
                />
              </div>
            ))}
          </div>
          <div className={`${ui.sectionIndex} ${ui.sectionIndexWithArrows}`} data-reveal>
            <div className={ui.sectionIndexPager}>
              <button type="button" className={ui.iconButton} onPointerDown={(e) => e.stopPropagation()} aria-label="Previous featured products" onClick={() => setProductPage((c) => (c - 1 + productPageCount) % productPageCount)}><ChevronLeft size={17} /></button>
              <div className={ui.sectionIndexDots}>
                {Array.from({ length: productPageCount }).map((_, index) => (
                  <button key={`pp-${index}`} type="button" className={`${ui.sectionIndexDot} ${index === productPage ? "scale-110" : ""}`.trim()} style={{ backgroundColor: index === productPage ? "var(--accent)" : "#d1d5db" }} onClick={() => setProductPage(index)} aria-label={`Product page ${index + 1}`} />
                ))}
              </div>
              <button type="button" className={ui.iconButton} onPointerDown={(e) => e.stopPropagation()} aria-label="Next featured products" onClick={() => setProductPage((c) => (c + 1) % productPageCount)}><ChevronRight size={17} /></button>
            </div>
            <span>{String(productPage + 1).padStart(2, "0")} / {String(productPageCount).padStart(2, "0")}</span>
          </div>
        </div>
      </section>

      {/* Why USW */}
      <section className={ui.sectionGap} style={{ backgroundColor: "var(--forest)" }}>
        <div className={ui.containerWide}>
          <SectionHeading
            eyebrow={copy.home.whyEyebrow}
            title={copy.home.whyTitle}
            description={copy.home.whyDescription}
            inverted
          />
          <div className="flex items-stretch overflow-hidden rounded-xl max-[780px]:flex-col max-[780px]:rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
            {specializations.map((spec, index) => (
              <div key={spec.title} className="flex flex-1 items-stretch">
                {index > 0 && <div className="w-px shrink-0 self-stretch max-[780px]:hidden" style={{ backgroundColor: "rgba(255,255,255,0.15)" }} />}
                <article className="flex flex-1 flex-col gap-4 p-7 max-[780px]:p-5" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} data-reveal>
                  <p className="m-0 text-[0.68rem] font-bold uppercase tracking-[0.16em]" style={{ color: "rgba(255,255,255,0.55)" }}>Our services</p>
                  <h3 className="m-0 font-display text-[clamp(1.45rem,1.8vw,1.75rem)] leading-[1.06]" style={{ color: "#ffffff" }}>{spec.title}</h3>
                  <p className="m-0 text-[0.9rem] leading-[1.7] max-[780px]:text-[0.88rem]" style={{ color: "rgba(255,255,255,0.75)" }}>{spec.summary}</p>
                  <ul className="mt-auto grid gap-2">
                    {spec.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-[0.88rem]" style={{ color: "rgba(255,255,255,0.75)" }}>
                        <span aria-hidden="true" className="mt-[0.45rem] h-[0.32rem] w-[0.32rem] shrink-0 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands & Locations */}
      <section className={ui.sectionGap} style={{ backgroundColor: "#ffffff" }}>
        <div className={ui.containerWide}>
          <div className="grid gap-10 xl:grid-cols-[0.88fr_1.12fr] xl:items-start">
            <div>
              <SectionHeading
                eyebrow={copy.home.brandsEyebrow}
                title={copy.home.brandsTitle}
                description={copy.home.brandsDescription}
              />
              <div className="flex flex-wrap gap-2" data-reveal>
                {brands.map((b) => <span key={b} className={ui.chip}>{b}</span>)}
              </div>
            </div>
            <div className="grid gap-5 max-[780px]:gap-4">
              {stores.map((store, index) => (
                <article key={store.name}
                  className="card-lift shimmer flex h-full min-h-[16rem] flex-col gap-3 overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)] max-[780px]:min-h-0 max-[780px]:rounded-xl max-[780px]:p-5"
                  data-reveal="right" style={{ transitionDelay: `${index * 80}ms` }}>
                  <span className={ui.chip}>{store.type}</span>
                  <h3 className="m-0 font-display text-[clamp(1.5rem,2vw,1.85rem)] leading-[1.04]" style={{ color: "var(--text)" }}>{store.name}</h3>
                  <p className="grid gap-1 text-[0.9rem] leading-[1.75] text-[var(--text-soft)]">
                    <span>{store.address}</span>
                    <span>{store.city}</span>
                  </p>
                  <a href={store.mapsUrl} target="_blank" rel="noreferrer"
                    className="mt-auto inline-flex items-center gap-2 text-[0.88rem] font-semibold transition-colors duration-150"
                    style={{ color: "var(--accent)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent-dark)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}>
                    <MapPin size={14} /> Open in Maps
                  </a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
