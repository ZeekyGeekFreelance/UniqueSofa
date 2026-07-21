import { ChevronLeft, ChevronRight, Download, Mail, Phone } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSiteContent } from "../cms/SiteContentProvider";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { SectionHeading } from "../components/SectionHeading";
import { usePageTitle } from "../hooks/usePageTitle";
import { useReveal } from "../hooks/useReveal";
import { useSwipe } from "../hooks/useSwipe";
import { ui } from "../lib/ui";

const PAGE_GRID_SIZE = 6;

export function CataloguePage() {
  const { content } = useSiteContent();
  const { brand, cataloguePages, catalogueFile, copy } = content;

  const gridBodyRef = useRef<HTMLDivElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [gridPage, setGridPage] = useState(0);

  usePageTitle(`Catalogue | ${brand.name}`);
  useReveal();

  const selectedPage = cataloguePages[selectedIndex];
  const totalGridPages = Math.max(1, Math.ceil(cataloguePages.length / PAGE_GRID_SIZE));

  useEffect(() => {
    setGridPage(Math.floor(selectedIndex / PAGE_GRID_SIZE));
  }, [selectedIndex]);

  const visiblePages = useMemo(
    () => cataloguePages.slice(gridPage * PAGE_GRID_SIZE, gridPage * PAGE_GRID_SIZE + PAGE_GRID_SIZE),
    [cataloguePages, gridPage],
  );

  const goToIndex = (index: number) => {
    setSelectedIndex(Math.max(0, Math.min(cataloguePages.length - 1, index)));
  };

  const pageSwipe = useSwipe(
    () => goToIndex(selectedIndex + 1),
    () => goToIndex(selectedIndex - 1),
  );

  const goToGridPage = (index: number) => {
    const resolvedPage = Math.max(0, Math.min(totalGridPages - 1, index));
    const previousScrollY = window.scrollY;
    setGridPage(resolvedPage);
    setSelectedIndex(resolvedPage * PAGE_GRID_SIZE);
    if (gridBodyRef.current) gridBodyRef.current.scrollTop = 0;
    window.requestAnimationFrame(() => {
      if (Math.abs(window.scrollY - previousScrollY) > 1) window.scrollTo(0, previousScrollY);
    });
  };

  if (!selectedPage) return null;

  return (
    <div className={ui.pageTop}>
      <section className={ui.sectionGapIntro}>
        <div className={ui.containerWide}>
          <Breadcrumbs current="Catalogue" />
          <div className="mt-8">
            <SectionHeading
              eyebrow={copy.catalogue.heroEyebrow}
              title={copy.catalogue.heroTitle}
              description={copy.catalogue.heroDescription}
            />
          </div>
        </div>
      </section>

      <section className={ui.sectionGapNoTopWideBottom}>
        <div className={`${ui.containerWide} grid items-start gap-8 max-[780px]:gap-[1.55rem] min-[1181px]:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)]`}>
          <aside data-reveal>
            <div className={`${ui.surfaceCard} sticky top-28 p-[1.35rem] max-[1180px]:static`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="inline-flex items-center gap-3 text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--accent)] before:h-px before:w-[1.85rem] before:bg-current before:content-['']">
                    {copy.catalogue.focusEyebrow}
                  </p>
                  <h2 className="m-0 mt-[0.8rem] font-display text-[clamp(2.3rem,4vw,3.8rem)] leading-[0.96]">{selectedPage.title}</h2>
                  <p className="m-0 mt-[0.8rem] text-[color:var(--text-soft)] leading-[1.8]">{selectedPage.section}</p>
                </div>
                <span className={ui.chip}>Page {selectedPage.id}</span>
              </div>

              <img src={selectedPage.image} alt={`${selectedPage.title} catalogue page`}
                className="mt-4 w-full rounded-3xl border border-[color:var(--border)] bg-white/85 object-contain" loading="eager"
                {...pageSwipe} />

              <div className="mt-5 flex flex-wrap gap-[0.9rem]">
                <button type="button" className={`${ui.buttonBase} ${ui.buttonSecondary}`} onClick={() => goToIndex(selectedIndex - 1)} disabled={selectedIndex === 0}>
                  <ChevronLeft size={15} /> Previous
                </button>
                <button type="button" className={`${ui.buttonBase} ${ui.buttonSecondary}`} onClick={() => goToIndex(selectedIndex + 1)} disabled={selectedIndex === cataloguePages.length - 1}>
                  Next <ChevronRight size={15} />
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-[0.9rem]">
                <a href={catalogueFile} className={`${ui.buttonBase} ${ui.buttonPrimary}`}>
                  <Download size={15} /> {copy.catalogue.downloadLabel}
                </a>
                <a href={brand.phoneHref} className={`${ui.buttonBase} ${ui.buttonSecondary}`}>
                  <Phone size={15} /> {copy.catalogue.callLabel}
                </a>
                <a href={brand.emailHref} className={`${ui.buttonBase} ${ui.buttonSecondary}`}>
                  <Mail size={15} /> {copy.catalogue.emailLabel}
                </a>
              </div>
            </div>
          </aside>

          <div className={`${ui.surfaceCard} flex min-h-[150vh] flex-col overflow-hidden p-[1.45rem] max-[1180px]:min-h-0`} data-reveal="right">
            <div className="mb-5 flex items-center justify-between gap-4 max-[780px]:mb-4 max-[780px]:flex-col max-[780px]:items-start">
              <div>
                <p className="inline-flex items-center gap-3 text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--accent)] before:h-px before:w-[1.85rem] before:bg-current before:content-['']">
                  {copy.catalogue.browseEyebrow}
                </p>
                <h2 className="m-0 mt-[0.95rem] font-display text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.02] max-[780px]:text-[clamp(1.75rem,7vw,2.35rem)] max-[780px]:leading-[1.05]">
                  {cataloguePages.length} pages in the product catalogue
                </h2>
              </div>
              <span className="m-0 text-[0.76rem] font-extrabold uppercase tracking-[0.18em] text-[color:var(--accent)]">
                {String(gridPage + 1).padStart(2, "0")} / {String(totalGridPages).padStart(2, "0")}
              </span>
            </div>

            <div ref={gridBodyRef} className="flex-1 overflow-y-auto pr-[0.35rem] max-[1180px]:overflow-visible max-[1180px]:pr-0">
              <div className="grid grid-cols-3 gap-5 max-[780px]:grid-cols-1 max-[780px]:gap-[1.25rem]">
                {visiblePages.map((page) => {
                  const pageIndex = cataloguePages.findIndex((entry) => entry.id === page.id);
                  const active = pageIndex === selectedIndex;
                  return (
                    <button key={page.id} type="button"
                      className={`overflow-hidden rounded-[1.6rem] border bg-white/80 text-left shadow-[0_24px_70px_rgba(39,24,12,0.08)] transition-[transform,box-shadow,border-color] duration-200 ${active ? "border-[color:var(--accent)] ring-[4px] ring-[rgba(191,98,44,0.1)]" : "border-[color:var(--border)] hover:-translate-y-[3px]"}`.trim()}
                      onClick={() => setSelectedIndex(pageIndex)}>
                      <img src={page.image} alt={page.title} className="aspect-[3/4] h-full w-full object-cover" loading="lazy" />
                      <div className="flex-1 p-4 max-[780px]:p-[0.88rem]">
                        <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-[color:var(--text-faint)]">Page {page.id}</span>
                        <strong className="mt-[0.35rem] block text-[0.94rem]">{page.title}</strong>
                        <p className="m-0 mt-[0.55rem] line-clamp-2 text-[color:var(--text-soft)] leading-[1.8]">{page.section}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-[0.78rem] border-t border-[rgba(80,48,22,0.08)] pt-5">
              <button type="button" className={ui.iconButton} onClick={(e) => { e.currentTarget.blur(); goToGridPage(gridPage - 1); }} aria-label="Previous catalogue page group" disabled={gridPage === 0}>
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalGridPages }).map((_, index) => (
                <button key={`catalogue-grid-page-${index}`} type="button"
                  className={`inline-flex h-[3rem] min-w-[3rem] items-center justify-center rounded-full border px-[0.9rem] text-[0.9rem] font-extrabold tracking-[0.06em] transition-[transform,background-color,color,border-color,box-shadow] duration-200 ${index === gridPage ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-white shadow-[0_18px_34px_rgba(191,98,44,0.18)]" : "border-[color:var(--border)] bg-white/85 text-[color:var(--text-soft)] hover:-translate-y-[3px] hover:border-[rgba(191,98,44,0.28)] hover:bg-white hover:text-[color:var(--accent-dark)] hover:shadow-[0_18px_34px_rgba(39,24,12,0.08)]"}`.trim()}
                  onClick={(e) => { e.currentTarget.blur(); goToGridPage(index); }}>
                  {String(index + 1).padStart(2, "0")}
                </button>
              ))}
              <button type="button" className={ui.iconButton} onClick={(e) => { e.currentTarget.blur(); goToGridPage(gridPage + 1); }} aria-label="Next catalogue page group" disabled={gridPage === totalGridPages - 1}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
