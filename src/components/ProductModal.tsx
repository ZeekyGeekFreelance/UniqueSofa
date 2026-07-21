import { ChevronLeft, ChevronRight, MessageCircle, Phone, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BRAND, type Product } from "../data/site";
import { ui } from "../lib/ui";

type ProductModalProps = {
  product: Product;
  relatedProducts: Product[];
  onClose: () => void;
  onOpenProduct: (product: Product) => void;
};

const SWIPE_THRESHOLD = 36;

function buildWhatsappUrl(product: Product) {
  const message = `Hello, I want details about ${product.name} from the ${product.categoryTitle} range. Catalogue ref: ${product.referencePageIds.join(", ")}.`;
  return `https://wa.me/${BRAND.phoneRaw}?text=${encodeURIComponent(message)}`;
}

export function ProductModal({
  product,
  relatedProducts,
  onClose,
  onOpenProduct,
}: ProductModalProps) {
  const media = useMemo(
    () => (product.images.length ? product.images : ["/catalogue/page-000.jpg"]),
    [product.images],
  );
  const [activeImage, setActiveImage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const swipeStartX = useRef<number | null>(null);
  const swipeDeltaX = useRef(0);

  useEffect(() => {
    setActiveImage(0);
    setFullscreen(false);
    setDescriptionExpanded(false);
  }, [product.id]);

  useEffect(() => {
    const scrollY = window.scrollY;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyLeft = document.body.style.left;
    const previousBodyRight = document.body.style.right;
    const previousBodyWidth = document.body.style.width;
    const previousBodyOverscroll = document.body.style.overscrollBehavior;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousHtmlOverscroll = document.documentElement.style.overscrollBehavior;

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
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.left = previousBodyLeft;
      document.body.style.right = previousBodyRight;
      document.body.style.width = previousBodyWidth;
      document.body.style.overscrollBehavior = previousBodyOverscroll;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.documentElement.style.overscrollBehavior = previousHtmlOverscroll;
      window.scrollTo(0, scrollY);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (fullscreen) {
          setFullscreen(false);
          return;
        }
        onClose();
      }
      if (media.length > 1 && event.key === "ArrowRight") {
        setActiveImage((current) => (current + 1) % media.length);
      }
      if (media.length > 1 && event.key === "ArrowLeft") {
        setActiveImage((current) => (current - 1 + media.length) % media.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullscreen, media.length, onClose]);

  const move = (direction: number) => {
    setActiveImage((current) => (current + direction + media.length) % media.length);
  };

  const beginSwipe = (clientX: number) => {
    swipeStartX.current = clientX;
    swipeDeltaX.current = 0;
  };

  const trackSwipe = (clientX: number) => {
    if (swipeStartX.current === null) {
      return;
    }

    swipeDeltaX.current = clientX - swipeStartX.current;
  };

  const finishSwipe = () => {
    if (swipeStartX.current === null) {
      return;
    }

    const delta = swipeDeltaX.current;
    swipeStartX.current = null;
    swipeDeltaX.current = 0;

    if (media.length <= 1 || Math.abs(delta) < SWIPE_THRESHOLD) {
      return;
    }

    move(delta < 0 ? 1 : -1);
  };

  return (
    <>
      {fullscreen ? (
        <div
          className="fixed inset-0 z-[210] flex items-center justify-center bg-[rgba(0,0,0,0.96)] p-6"
          onClick={() => setFullscreen(false)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white"
            onClick={() => setFullscreen(false)}
            aria-label="Exit full screen image"
          >
            <X size={18} />
          </button>

          {media.length > 1 ? (
            <button
              type="button"
              className="absolute left-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white"
              onClick={(event) => {
                event.stopPropagation();
                move(-1);
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
          ) : null}

          <img
            src={media[activeImage]}
            alt={`${product.name} full view ${activeImage + 1}`}
            className="h-full w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />

          {media.length > 1 ? (
            <button
              type="button"
              className="absolute right-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white"
              onClick={(event) => {
                event.stopPropagation();
                move(1);
              }}
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          ) : null}
        </div>
      ) : null}

      <div
        className="fixed inset-0 z-[130] flex items-center justify-center overflow-y-auto overscroll-contain bg-[rgba(17,11,8,0.72)] p-5 max-[780px]:items-stretch max-[780px]:p-0"
        onClick={onClose}
      >
        <div
          className="relative flex h-[min(92vh,860px)] w-[min(1360px,calc(100%-1.5rem))] overflow-hidden rounded-[1.9rem] bg-[#f5ede4] max-[1180px]:h-[min(94vh,860px)] max-[1180px]:w-[min(58rem,calc(100%-1rem))] max-[780px]:h-[100dvh] max-[780px]:w-full max-[780px]:rounded-none"
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} details`}
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-20 inline-flex h-[2.85rem] w-[2.85rem] items-center justify-center rounded-full border border-[rgba(36,22,13,0.12)] bg-white/90 text-[color:var(--text)] max-[780px]:right-[0.8rem] max-[780px]:top-[0.8rem] max-[560px]:h-[2.7rem] max-[560px]:w-[2.7rem]"
            onClick={onClose}
            aria-label="Close product details"
          >
            <X size={18} />
          </button>

          <div className="grid h-full w-full grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] max-[1180px]:grid-cols-1 max-[780px]:grid-rows-[minmax(20rem,48dvh)_minmax(0,1fr)] max-[560px]:grid-rows-[minmax(19rem,50dvh)_minmax(0,1fr)]">
            <div className="flex min-h-0 min-w-0 flex-col border-r border-[rgba(80,48,22,0.08)] bg-[linear-gradient(180deg,#e6d4c2_0%,#dbc7b5_100%)] max-[1180px]:border-b max-[1180px]:border-r-0">
              <div className="relative flex min-h-0 flex-1 flex-col bg-white/45">
                <div
                  className="h-full w-full overflow-hidden [touch-action:pan-y]"
                  onTouchStart={(event) => beginSwipe(event.changedTouches[0].clientX)}
                  onTouchMove={(event) => trackSwipe(event.changedTouches[0].clientX)}
                  onTouchEnd={finishSwipe}
                  onTouchCancel={finishSwipe}
                >
                  <div
                    className="flex h-full transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
                    style={{ transform: `translateX(-${activeImage * 100}%)` }}
                  >
                    {media.map((image, index) => (
                      <div key={`${product.id}-image-${index}`} className="h-full min-w-full">
                        <button
                          type="button"
                          className="h-full w-full border-0 bg-transparent p-0"
                          onClick={() => setFullscreen(true)}
                          aria-label={`Open image ${index + 1} in full screen`}
                        >
                          <img
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            className="h-full w-full object-contain max-[780px]:object-contain"
                            loading={index === 0 ? "eager" : "lazy"}
                            draggable={false}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {media.length > 1 ? (
                  <>
                    <button
                      type="button"
                      className="absolute left-4 top-1/2 z-10 inline-flex h-[2.85rem] w-[2.85rem] -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(17,12,9,0.6)] text-white max-[560px]:h-[2.7rem] max-[560px]:w-[2.7rem] max-[380px]:h-[2.45rem] max-[380px]:w-[2.45rem]"
                      onClick={() => move(-1)}
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 z-10 inline-flex h-[2.85rem] w-[2.85rem] -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(17,12,9,0.6)] text-white max-[560px]:h-[2.7rem] max-[560px]:w-[2.7rem] max-[380px]:h-[2.45rem] max-[380px]:w-[2.45rem]"
                      onClick={() => move(1)}
                      aria-label="Next image"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                ) : null}

                <div className="absolute inset-x-4 bottom-4 z-10 flex items-center justify-between gap-3 max-[780px]:inset-x-[0.72rem] max-[780px]:bottom-[0.68rem]">
                  <div className="flex gap-2">
                    {media.map((_, index) => {
                      const active = index === activeImage;
                      return (
                        <button
                          key={`${product.id}-dot-${index}`}
                          type="button"
                          className={`h-[0.62rem] w-[0.62rem] rounded-full border-0 transition-[transform,background-color] duration-200 ${
                            active ? "scale-110" : ""
                          }`.trim()}
                          style={{
                            backgroundColor: active
                              ? "var(--accent)"
                              : "rgba(255,255,255,0.4)",
                          }}
                          aria-label={`Go to image ${index + 1}`}
                          onClick={() => setActiveImage(index)}
                        />
                      );
                    })}
                  </div>
                  <span className="text-[0.76rem] font-extrabold tracking-[0.14em] text-[color:var(--accent)]">
                    {String(activeImage + 1).padStart(2, "0")} /{" "}
                    {String(media.length).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {media.length > 1 ? (
                <div
                  className="flex min-h-[5.75rem] gap-[0.7rem] overflow-x-auto overflow-y-hidden bg-white/70 px-4 py-4 max-[780px]:min-h-[4.45rem] max-[780px]:gap-[0.5rem] max-[780px]:px-[0.72rem] max-[780px]:py-[0.62rem]"
                  role="tablist"
                  aria-label="Product images"
                >
                  {media.map((image, index) => (
                    <button
                      key={`${product.id}-thumb-${index}`}
                      type="button"
                      role="tab"
                      aria-selected={index === activeImage}
                      className={`h-[4.5rem] w-24 min-w-24 overflow-hidden rounded-[0.95rem] border bg-white ${
                        index === activeImage
                          ? "border-[color:var(--accent)] ring-[3px] ring-[rgba(191,98,44,0.14)]"
                          : "border-[rgba(80,48,22,0.16)]"
                      } max-[780px]:h-[3.1rem] max-[780px]:w-[4.15rem] max-[780px]:min-w-[4.15rem]`.trim()}
                      onClick={() => setActiveImage(index)}
                    >
                      <img
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              ) : null}

              <button
                type="button"
                className="mb-4 ml-4 mt-3 self-start border-0 bg-transparent p-0 text-[0.82rem] font-extrabold uppercase tracking-[0.08em] text-[color:var(--accent-dark)] max-[780px]:mb-[0.45rem] max-[780px]:ml-[0.72rem] max-[780px]:mt-[0.3rem] max-[780px]:text-[0.68rem] max-[560px]:mb-[0.35rem] max-[560px]:ml-[0.62rem] max-[560px]:mt-[0.2rem] max-[560px]:text-[0.62rem]"
                onClick={() => setFullscreen(true)}
              >
                Open full screen image
              </button>
            </div>

            <div className="flex min-h-0 min-w-0 flex-col overflow-hidden bg-[rgba(255,250,244,0.92)]">
              <div className="px-8 pb-4 pt-8 max-[780px]:px-4 max-[780px]:pb-2 max-[780px]:pt-[0.95rem]">
                <p className="m-0 text-[0.76rem] font-extrabold uppercase tracking-[0.18em] text-[color:var(--accent)]">
                  {product.brand} / {product.categoryTitle}
                </p>
                <h2 className="m-0 mt-[0.7rem] font-display text-[clamp(2.2rem,3.4vw,3.55rem)] leading-[0.96] max-[780px]:text-[clamp(1.75rem,7vw,2.35rem)] max-[780px]:leading-[1.05]">
                  {product.name}
                </h2>
                <p
                  className={`m-0 mt-[0.9rem] leading-[1.82] text-[color:var(--text-soft)] max-[780px]:text-[0.93rem] max-[780px]:leading-[1.65] ${
                    descriptionExpanded
                      ? ""
                      : "max-[780px]:overflow-hidden max-[780px]:text-ellipsis max-[780px]:[display:-webkit-box] max-[780px]:[-webkit-line-clamp:1] max-[780px]:[-webkit-box-orient:vertical]"
                  }`.trim()}
                >
                  {product.description}
                </p>
                <button
                  type="button"
                  className="mt-[0.45rem] hidden border-0 bg-transparent p-0 text-[0.66rem] font-bold tracking-[0.03em] text-[color:var(--accent-dark)] opacity-90 max-[780px]:inline-flex"
                  onClick={() => setDescriptionExpanded((current) => !current)}
                >
                  {descriptionExpanded ? "Show less" : "Read more"}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-8 pb-6 max-[780px]:px-4 max-[780px]:pb-4">
                <div className="grid grid-cols-2 gap-4 max-[780px]:grid-cols-1 max-[780px]:gap-3">
                  {product.specs.map((spec) => (
                    <article
                      key={`${product.id}-${spec.label}`}
                      className="rounded-[1.3rem] border border-[color:var(--border)] bg-white/80 p-4 max-[780px]:p-[0.95rem]"
                    >
                      <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-[color:var(--text-faint)]">
                        {spec.label}
                      </span>
                      <strong className="mt-[0.45rem] block text-[0.98rem]">{spec.value}</strong>
                    </article>
                  ))}
                </div>

                <div className="mt-4 flex flex-col gap-4">
                  <section className="rounded-[1.3rem] border border-[color:var(--border)] bg-white/80 p-[1.2rem] max-[780px]:p-[0.95rem]">
                    <h3 className="m-0 font-display text-[1.4rem]">Highlights</h3>
                    <ul className="m-0 mt-[0.85rem] pl-4 leading-[1.78] text-[color:var(--text-soft)]">
                      {product.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </section>

                  <section className="rounded-[1.3rem] border border-[color:var(--border)] bg-white/80 p-[1.2rem] max-[780px]:p-[0.95rem]">
                    <h3 className="m-0 font-display text-[1.4rem]">Catalogue reference</h3>
                    <div className="mt-[0.85rem] flex flex-wrap gap-[0.6rem]">
                      {product.referencePageIds.map((pageId) => (
                        <span
                          key={`${product.id}-page-${pageId}`}
                          className="rounded-full bg-[color:var(--accent-pale)] px-[0.72rem] py-[0.5rem] text-[0.74rem] font-bold text-[color:var(--accent-dark)] max-[780px]:px-[0.64rem] max-[780px]:py-[0.34rem] max-[780px]:text-[0.7rem]"
                        >
                          Page {pageId}
                        </span>
                      ))}
                    </div>
                    <h3 className="m-0 mt-4 font-display text-[1.4rem]">Tags</h3>
                    <div className="mt-[0.85rem] flex flex-wrap gap-[0.6rem]">
                      {product.tags.map((tag) => (
                        <span
                          key={`${product.id}-tag-${tag}`}
                          className="rounded-full bg-[rgba(92,117,86,0.08)] px-[0.72rem] py-[0.5rem] text-[0.74rem] font-bold text-[color:var(--sage)] max-[780px]:px-[0.64rem] max-[780px]:py-[0.34rem] max-[780px]:text-[0.7rem]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>

                {relatedProducts.length ? (
                  <section className="mt-[1.2rem]">
                    <div className="flex justify-between gap-4 max-[780px]:flex-col max-[780px]:items-start">
                      <h3 className="m-0 font-display text-[1.4rem]">Related products</h3>
                      <p className="m-0 leading-[1.7] text-[color:var(--text-faint)]">
                        Open nearby matches from the same range or brand.
                      </p>
                    </div>
                    <div className="mt-[0.85rem] grid grid-cols-2 gap-[0.8rem] max-[780px]:grid-cols-1 max-[780px]:gap-[0.72rem]">
                      {relatedProducts.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className="grid grid-cols-[4.3rem_minmax(0,1fr)] gap-[0.8rem] rounded-[1.3rem] border border-[color:var(--border)] bg-white/80 p-[0.65rem] text-left"
                          onClick={() => onOpenProduct(item)}
                        >
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="h-full w-full rounded-[0.85rem] object-cover"
                            loading="lazy"
                          />
                          <div>
                            <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-[color:var(--text-faint)]">
                              {item.brand}
                            </span>
                            <strong className="mt-[0.35rem] block text-[0.94rem]">{item.name}</strong>
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>

              <div className="flex gap-3 border-t border-[rgba(80,48,22,0.08)] bg-white/80 px-8 pb-6 pt-4 max-[780px]:gap-2 max-[780px]:px-4 max-[780px]:pb-[0.72rem] max-[780px]:pt-[0.55rem]">
                <a
                  href={BRAND.phoneHref}
                  className={`${ui.buttonBase} ${ui.buttonSecondary} max-[780px]:min-w-0 max-[780px]:flex-1 max-[780px]:px-[0.68rem] max-[780px]:text-[0.81rem] max-[560px]:text-[0.75rem] max-[560px]:tracking-0`}
                >
                  <Phone size={15} />
                  Call now
                </a>
                <a
                  href={buildWhatsappUrl(product)}
                  target="_blank"
                  rel="noreferrer"
                  className={`${ui.buttonBase} ${ui.buttonPrimary} max-[780px]:min-w-0 max-[780px]:flex-1 max-[780px]:px-[0.68rem] max-[780px]:text-[0.81rem] max-[560px]:text-[0.75rem] max-[560px]:tracking-0`}
                >
                  <MessageCircle size={15} />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

