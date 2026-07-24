import { ChevronLeft, ChevronRight, MessageCircle, Phone, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "../data/site";
import { useSwipe } from "../hooks/useSwipe";
import { ui } from "../lib/ui";

type ProductModalProps = {
  product: Product;
  relatedProducts: Product[];
  phoneHref: string;
  phoneRaw: string;
  onClose: () => void;
  onOpenProduct: (product: Product) => void;
};

const SWIPE_THRESHOLD = 40;

export function ProductModal({ product, relatedProducts, phoneHref, phoneRaw, onClose, onOpenProduct }: ProductModalProps) {
  function buildWhatsappUrl(p: Product) {
    const message = `Hello, I want details about ${p.name} from the ${p.categoryTitle} range.`;
    return `https://wa.me/${phoneRaw}?text=${encodeURIComponent(message)}`;
  }
  const media = useMemo(
    () => (product.images.length ? product.images : ["/placeholder.jpg"]),
    [product.images],
  );
  const [activeImage, setActiveImage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [relatedIndex, setRelatedIndex] = useState(0);
  const relatedPaused = useRef(false);
  const swipeStartX = useRef<number | null>(null);
  const swipeDeltaX = useRef(0);

  useEffect(() => {
    setActiveImage(0);
    setFullscreen(false);
    setRelatedIndex(0);
  }, [product.id]);

  // Auto-advance related products
  useEffect(() => {
    if (relatedProducts.length < 2) return;
    const id = setInterval(() => {
      if (!relatedPaused.current) {
        setRelatedIndex((c) => (c + 1) % relatedProducts.length);
      }
    }, 3000);
    return () => clearInterval(id);
  }, [relatedProducts.length]);

  // Lock body scroll
  useEffect(() => {
    const scrollY = window.scrollY;
    const prev = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overscroll: document.body.style.overscrollBehavior,
      htmlOverflow: document.documentElement.style.overflow,
      htmlOverscroll: document.documentElement.style.overscrollBehavior,
    };
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = prev.overflow;
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.left = prev.left;
      document.body.style.right = prev.right;
      document.body.style.width = prev.width;
      document.body.style.overscrollBehavior = prev.overscroll;
      document.documentElement.style.overflow = prev.htmlOverflow;
      document.documentElement.style.overscrollBehavior = prev.htmlOverscroll;
      window.scrollTo(0, scrollY);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { if (fullscreen) { setFullscreen(false); return; } onClose(); }
      if (media.length > 1 && e.key === "ArrowRight") setActiveImage((c) => (c + 1) % media.length);
      if (media.length > 1 && e.key === "ArrowLeft")  setActiveImage((c) => (c - 1 + media.length) % media.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen, media.length, onClose]);

  const move = (dir: number) => setActiveImage((c) => (c + dir + media.length) % media.length);
  const beginSwipe = (x: number) => { swipeStartX.current = x; swipeDeltaX.current = 0; };
  const trackSwipe = (x: number) => { if (swipeStartX.current !== null) swipeDeltaX.current = x - swipeStartX.current; };
  const finishSwipe = () => {
    if (swipeStartX.current === null) return;
    const d = swipeDeltaX.current;
    swipeStartX.current = null; swipeDeltaX.current = 0;
    if (media.length > 1 && Math.abs(d) >= SWIPE_THRESHOLD) move(d < 0 ? 1 : -1);
  };

  // Swipe for related products carousel
  const relatedSwipe = useSwipe(
    () => { relatedPaused.current = true; setRelatedIndex((c) => (c + 1) % relatedProducts.length); },
    () => { relatedPaused.current = true; setRelatedIndex((c) => (c - 1 + relatedProducts.length) % relatedProducts.length); },
  );


  return (
    <>
      {/* ── Fullscreen image viewer ─────────────────────────────────── */}
      {fullscreen && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/96" onClick={() => setFullscreen(false)}>
          <button type="button" className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm" onClick={() => setFullscreen(false)} aria-label="Exit full screen"><X size={18} /></button>
          {media.length > 1 && <>
            <button type="button" className="absolute left-4 top-1/2 z-10 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); move(-1); }} aria-label="Previous"><ChevronLeft size={20} /></button>
            <button type="button" className="absolute right-4 top-1/2 z-10 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); move(1); }} aria-label="Next"><ChevronRight size={20} /></button>
          </>}
          <img src={media[activeImage]} alt={product.name} className="max-h-full max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* ── Backdrop ───────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-[130] flex items-end justify-center bg-[rgba(10,6,4,0.65)] sm:items-center sm:p-5"
        onClick={onClose}
      >
        {/*
          MOBILE  → full-height bottom sheet, single scroll, no splits
          DESKTOP → centered dialog, two-column side-by-side
        */}
        <div
          className={[
            // shared
            "relative w-full overflow-hidden bg-[#faf6f1]",
            // mobile: full-height sheet
            "h-[100dvh] rounded-none",
            // desktop: centered card
            "sm:flex sm:h-[min(90vh,820px)] sm:max-w-[min(1280px,calc(100%-2.5rem))] sm:rounded-2xl",
          ].join(" ")}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} details`}
        >
          {/* Close button — always top-right */}
          <button
            type="button"
            className="absolute right-4 top-4 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-black/8 backdrop-blur-sm text-[color:var(--text)]"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>


          {/* ════════════════════════════════════════════════════════════
              MOBILE  → single scrollable column (image → info)
              DESKTOP → left image panel  |  right info panel
          ════════════════════════════════════════════════════════════ */}

          {/* ── MOBILE scroll container ─────────────────────────────── */}
          <div className="h-full w-full overflow-y-auto overscroll-contain sm:hidden">

            {/* Image carousel — square-ish, full-width */}
            <div
              className="relative w-full overflow-hidden bg-[#ede3d8]"
              style={{ aspectRatio: "4/3" }}
              onTouchStart={(e) => beginSwipe(e.changedTouches[0].clientX)}
              onTouchMove={(e) => trackSwipe(e.changedTouches[0].clientX)}
              onTouchEnd={finishSwipe}
              onTouchCancel={finishSwipe}
            >
              {/* Slides — absolute fill so the flex track doesn't push width */}
              <div
                className="absolute inset-0 flex transition-transform duration-400 ease-out"
                style={{ transform: `translateX(-${activeImage * 100}%)` }}
              >
                {media.map((img, i) => (
                  <div key={`m-img-${i}`} className="h-full w-full shrink-0">
                    <button type="button" className="h-full w-full border-0 bg-transparent p-0" onClick={() => setFullscreen(true)} aria-label={`Image ${i + 1}, tap to enlarge`}>
                      <img src={img} alt={`${product.name} ${i + 1}`} className="h-full w-full object-contain" loading={i === 0 ? "eager" : "lazy"} draggable={false} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Dot indicators */}
              {media.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-[6px]">
                  {media.map((_, i) => (
                    <button key={`mdot-${i}`} type="button" onClick={() => setActiveImage(i)} aria-label={`Image ${i + 1}`}
                      className="h-[7px] rounded-full border-0 transition-all duration-200"
                      style={{
                        width: i === activeImage ? "20px" : "7px",
                        backgroundColor: i === activeImage ? "var(--accent)" : "rgba(80,48,22,0.3)",
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Counter badge */}
              {media.length > 1 && (
                <span className="absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[0.68rem] font-bold text-white backdrop-blur-sm">
                  {activeImage + 1} / {media.length}
                </span>
              )}
            </div>


            {/* Info — flows below the image, no height cap */}
            <div className="flex flex-col bg-[#faf6f1] pb-[6.5rem] pt-5 px-5">

              {/* Brand · Category */}
              <p className="m-0 text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--accent)]">
                {product.brand}&ensp;·&ensp;{product.categoryTitle}
              </p>

              {/* Name */}
              <h2 className="m-0 mt-2 font-display text-[1.75rem] leading-[1.05]">
                {product.name}
              </h2>

              {/* Description */}
              <p className="m-0 mt-3 text-[0.9rem] leading-[1.75] text-[color:var(--text-soft)]">
                {product.description}
              </p>

              {/* Divider */}
              <div className="my-5 h-px bg-[rgba(80,48,22,0.1)]" />

              {/* Specs */}
              <p className="m-0 mb-3 text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--text-faint)]">Specifications</p>
              <div className="overflow-hidden rounded-xl border border-[rgba(80,48,22,0.1)] bg-white">
                {product.specs.map((spec, i) => (
                  <div key={spec.label} className={`flex items-center justify-between gap-3 px-4 py-3 ${i > 0 ? "border-t border-[rgba(80,48,22,0.06)]" : ""}`}>
                    <span className="text-[0.8rem] text-[color:var(--text-faint)]">{spec.label}</span>
                    <span className="text-right text-[0.85rem] font-semibold text-[color:var(--text)]">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* Highlights */}
              <p className="m-0 mb-3 mt-6 text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--text-faint)]">Highlights</p>
              <ul className="m-0 list-none p-0 flex flex-col gap-[0.5rem]">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[0.88rem] leading-[1.7] text-[color:var(--text-soft)]">
                    <span className="mt-[0.42rem] inline-block h-[5px] w-[5px] shrink-0 rounded-full bg-[color:var(--accent)]" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Tags */}
              <div className="mt-5 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={`mt-${tag}`} className="rounded-full bg-[rgba(92,117,86,0.1)] px-3 py-1 text-[0.7rem] font-bold text-[color:var(--sage)]">{tag}</span>
                ))}
              </div>

              {/* Related — single card auto-scroll */}
              {relatedProducts.length > 0 && (
                <div className="mt-7">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="m-0 text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--text-faint)]">You may also like</p>
                    {relatedProducts.length > 1 && (
                      <div className="flex items-center gap-1.5">
                        {relatedProducts.map((_, i) => (
                          <button key={i} type="button" onClick={() => { relatedPaused.current = true; setRelatedIndex(i); }} aria-label={`Go to ${i + 1}`}
                            className="h-[6px] rounded-full border-0 transition-all duration-300"
                            style={{ width: i === relatedIndex ? "18px" : "6px", backgroundColor: i === relatedIndex ? "var(--accent)" : "rgba(80,48,22,0.22)" }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {/* overflow-hidden on a block container prevents width blowout */}
                  <div className="relative w-full overflow-hidden rounded-xl"
                    onMouseEnter={() => { relatedPaused.current = true; }}
                    onMouseLeave={() => { relatedPaused.current = false; }}
                    onTouchStart={(e) => { relatedPaused.current = true; relatedSwipe.onTouchStart(e); }}
                    onTouchEnd={(e) => { relatedSwipe.onTouchEnd(e); setTimeout(() => { relatedPaused.current = false; }, 2000); }}
                  >
                    <div
                      className="flex w-full transition-transform duration-500 [transition-timing-function:cubic-bezier(0.32,1,0.36,1)]"
                      style={{ transform: `translateX(-${relatedIndex * 100}%)` }}
                    >
                      {relatedProducts.map((item) => (
                        <button key={item.id} type="button"
                          className="flex w-full shrink-0 items-center gap-4 border border-[rgba(80,48,22,0.1)] bg-white p-3 text-left active:bg-[rgba(80,48,22,0.04)]"
                          onClick={() => onOpenProduct(item)}>
                          <img src={item.images[0]} alt={item.name} className="h-16 w-16 shrink-0 rounded-lg object-cover" loading="lazy" />
                          <div className="min-w-0">
                            <span className="block text-[0.6rem] font-extrabold uppercase tracking-[0.14em] text-[color:var(--text-faint)]">{item.brand} · {item.categoryTitle}</span>
                            <strong className="mt-0.5 block truncate text-[0.9rem] leading-snug">{item.name}</strong>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CTA — fixed to bottom of the sheet on mobile */}
            <div className="fixed bottom-0 left-0 right-0 z-20 flex gap-2.5 border-t border-[rgba(80,48,22,0.1)] bg-[#faf6f1]/95 px-5 pb-[max(env(safe-area-inset-bottom),0.85rem)] pt-3 backdrop-blur-md sm:hidden">
              <a href={phoneHref} className={`${ui.buttonBase} ${ui.buttonSecondary} px-4`}>
                <Phone size={15} />
                Call
              </a>
              <a href={buildWhatsappUrl(product)} target="_blank" rel="noreferrer" className={`${ui.buttonBase} ${ui.buttonPrimary} flex-1 justify-center`}>
                <MessageCircle size={15} />
                WhatsApp
              </a>
            </div>
          </div>
          {/* ── end MOBILE scroll container ─────────────────────────── */}


          {/* ══════════════════════════════════════════════════════════
              DESKTOP two-column layout (hidden on mobile)
          ══════════════════════════════════════════════════════════ */}
          <div className="hidden h-full w-full sm:grid sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">

            {/* Left — image viewer */}
            <div className="flex min-h-0 flex-col border-r border-[rgba(80,48,22,0.08)] bg-[linear-gradient(160deg,#ede3d8,#dbc7b5)]">
              <div className="relative flex min-h-0 flex-1 overflow-hidden">
                <div
                  className="h-full w-full overflow-hidden [touch-action:pan-y]"
                  onTouchStart={(e) => beginSwipe(e.changedTouches[0].clientX)}
                  onTouchMove={(e) => trackSwipe(e.changedTouches[0].clientX)}
                  onTouchEnd={finishSwipe}
                  onTouchCancel={finishSwipe}
                >
                  <div className="flex h-full transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]" style={{ transform: `translateX(-${activeImage * 100}%)` }}>
                    {media.map((img, i) => (
                      <div key={`d-img-${i}`} className="h-full min-w-full shrink-0">
                        <button type="button" className="h-full w-full border-0 bg-transparent p-0" onClick={() => setFullscreen(true)} aria-label={`Image ${i + 1}, tap to enlarge`}>
                          <img src={img} alt={`${product.name} ${i + 1}`} className="h-full w-full object-contain" loading={i === 0 ? "eager" : "lazy"} draggable={false} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {media.length > 1 && <>
                  <button type="button" className="absolute left-4 top-1/2 z-10 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm" onClick={() => move(-1)} aria-label="Previous"><ChevronLeft size={18} /></button>
                  <button type="button" className="absolute right-4 top-1/2 z-10 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm" onClick={() => move(1)} aria-label="Next"><ChevronRight size={18} /></button>
                </>}

                {/* Dots */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {media.map((_, i) => (
                    <button key={`ddot-${i}`} type="button" onClick={() => setActiveImage(i)} aria-label={`Image ${i + 1}`}
                      className="h-2 rounded-full border-0 transition-all duration-200"
                      style={{ width: i === activeImage ? "20px" : "8px", backgroundColor: i === activeImage ? "var(--accent)" : "rgba(255,255,255,0.45)" }}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnails */}
              {media.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto bg-white/60 px-4 py-3" role="tablist">
                  {media.map((img, i) => (
                    <button key={`dthumb-${i}`} type="button" role="tab" aria-selected={i === activeImage}
                      className={`h-16 w-20 min-w-20 overflow-hidden rounded-xl border bg-white transition-all ${i === activeImage ? "border-[color:var(--accent)] ring-2 ring-[rgba(191,98,44,0.18)]" : "border-[rgba(80,48,22,0.14)] opacity-70 hover:opacity-100"}`}
                      onClick={() => setActiveImage(i)}>
                      <img src={img} alt={`Thumb ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}

              <button type="button" className="mb-3 ml-4 mt-2 self-start border-0 bg-transparent p-0 text-[0.72rem] font-bold uppercase tracking-widest text-[color:var(--accent-dark)] opacity-80 hover:opacity-100" onClick={() => setFullscreen(true)}>
                Full screen
              </button>
            </div>


            {/* Right — product info */}
            <div className="flex min-h-0 flex-col bg-[rgba(255,251,246,0.96)]">

              {/* Header */}
              <div className="px-8 pb-4 pt-8">
                <p className="m-0 text-[0.7rem] font-extrabold uppercase tracking-[0.22em] text-[color:var(--accent)]">
                  {product.brand}&ensp;·&ensp;{product.categoryTitle}
                </p>
                <h2 className="m-0 mt-2 font-display text-[clamp(2rem,2.8vw,3rem)] leading-[1]">
                  {product.name}
                </h2>
                <p className="m-0 mt-3 text-[0.88rem] leading-[1.78] text-[color:var(--text-soft)]">
                  {product.description}
                </p>
              </div>

              <div className="mx-8 h-px bg-[rgba(80,48,22,0.09)]" />

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-8 pb-5 pt-5">

                <p className="m-0 mb-3 text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--text-faint)]">Specifications</p>
                <div className="overflow-hidden rounded-xl border border-[rgba(80,48,22,0.1)] bg-white">
                  {product.specs.map((spec, i) => (
                    <div key={spec.label} className={`flex items-center justify-between gap-4 px-4 py-[0.68rem] ${i > 0 ? "border-t border-[rgba(80,48,22,0.06)]" : ""}`}>
                      <span className="text-[0.78rem] text-[color:var(--text-faint)]">{spec.label}</span>
                      <span className="text-right text-[0.85rem] font-semibold text-[color:var(--text)]">{spec.value}</span>
                    </div>
                  ))}
                </div>

                <p className="m-0 mb-3 mt-6 text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--text-faint)]">Highlights</p>
                <ul className="m-0 list-none p-0 flex flex-col gap-[0.45rem]">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[0.87rem] leading-[1.72] text-[color:var(--text-soft)]">
                      <span className="mt-[0.42rem] h-[5px] w-[5px] shrink-0 rounded-full bg-[color:var(--accent)]" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span key={`dt-${tag}`} className="rounded-full bg-[rgba(92,117,86,0.1)] px-3 py-1 text-[0.68rem] font-bold text-[color:var(--sage)]">{tag}</span>
                  ))}
                </div>

                {relatedProducts.length > 0 && (
                  <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="m-0 text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--text-faint)]">You may also like</p>
                      {relatedProducts.length > 1 && (
                        <div className="flex items-center gap-1.5">
                          {relatedProducts.map((_, i) => (
                            <button key={i} type="button" onClick={() => { relatedPaused.current = true; setRelatedIndex(i); }} aria-label={`Go to ${i + 1}`}
                              className="h-[5px] rounded-full border-0 transition-all duration-300"
                              style={{ width: i === relatedIndex ? "16px" : "5px", backgroundColor: i === relatedIndex ? "var(--accent)" : "rgba(80,48,22,0.22)" }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="relative w-full overflow-hidden rounded-xl"
                      onMouseEnter={() => { relatedPaused.current = true; }}
                      onMouseLeave={() => { relatedPaused.current = false; }}
                      {...relatedSwipe}
                    >
                      <div
                        className="flex w-full transition-transform duration-500 [transition-timing-function:cubic-bezier(0.32,1,0.36,1)]"
                        style={{ transform: `translateX(-${relatedIndex * 100}%)` }}
                      >
                        {relatedProducts.map((item) => (
                          <button key={item.id} type="button"
                            className="flex w-full shrink-0 items-center gap-3 border border-[rgba(80,48,22,0.1)] bg-white p-3 text-left transition-colors hover:border-[color:var(--accent)]"
                            onClick={() => onOpenProduct(item)}>
                            <img src={item.images[0]} alt={item.name} className="h-14 w-14 shrink-0 rounded-lg object-cover" loading="lazy" />
                            <div className="min-w-0">
                              <span className="block text-[0.6rem] font-extrabold uppercase tracking-[0.14em] text-[color:var(--text-faint)]">{item.brand} · {item.categoryTitle}</span>
                              <strong className="mt-0.5 block truncate text-[0.86rem] leading-snug">{item.name}</strong>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="flex gap-2.5 border-t border-[rgba(80,48,22,0.08)] bg-white/70 px-8 pb-6 pt-4 backdrop-blur-sm">
                <a href={phoneHref} className={`${ui.buttonBase} ${ui.buttonSecondary} px-4`}>
                  <Phone size={15} />
                  Call
                </a>
                <a href={buildWhatsappUrl(product)} target="_blank" rel="noreferrer" className={`${ui.buttonBase} ${ui.buttonPrimary} flex-1 justify-center`}>
                  <MessageCircle size={15} />
                  WhatsApp
                </a>
              </div>
            </div>

          </div>
          {/* ── end DESKTOP layout ──────────────────────────────────── */}

        </div>
      </div>
    </>
  );
}
