import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type MediaCarouselProps = {
  images: string[];
  alt: string;
  aspect?: "portrait" | "landscape" | "square" | "wide";
  className?: string;
  autoPlay?: boolean;
  autoPlayMs?: number;
  showArrows?: boolean;
  showDots?: boolean;
  showCount?: boolean;
};

const aspectClassMap: Record<NonNullable<MediaCarouselProps["aspect"]>, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
  wide: "aspect-[16/10]",
};

const SWIPE_THRESHOLD = 36;

export function MediaCarousel({
  images,
  alt,
  aspect = "landscape",
  className = "",
  autoPlay = false,
  autoPlayMs = 3600,
  showArrows = true,
  showDots = true,
  showCount = true,
}: MediaCarouselProps) {
  const safeImages = useMemo(
    () => (images.length ? images : ["/placeholder.jpg"]),
    [images],
  );
  const hasLoop = safeImages.length > 1;
  const extendedImages = useMemo(
    () =>
      hasLoop
        ? [safeImages[safeImages.length - 1], ...safeImages, safeImages[0]]
        : safeImages,
    [hasLoop, safeImages],
  );
  const [activeIndex, setActiveIndex] = useState(hasLoop ? 1 : 0);
  const [animateTrack, setAnimateTrack] = useState(true);
  const minLoopIndex = 0;
  const maxLoopIndex = safeImages.length + 1;
  const swipeStartX = useRef<number | null>(null);
  const swipeDeltaX = useRef(0);
  const visibleIndex = hasLoop
    ? (activeIndex - 1 + safeImages.length) % safeImages.length
    : activeIndex;

  useEffect(() => {
    setActiveIndex(hasLoop ? 1 : 0);
    setAnimateTrack(true);
  }, [hasLoop, safeImages]);

  useEffect(() => {
    if (animateTrack) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setAnimateTrack(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [animateTrack]);

  useEffect(() => {
    if (!autoPlay || !hasLoop) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        const next = current + 1;
        return next > maxLoopIndex ? maxLoopIndex : next;
      });
    }, autoPlayMs);

    return () => window.clearInterval(timer);
  }, [autoPlay, autoPlayMs, hasLoop, maxLoopIndex]);

  const handleTransitionEnd = () => {
    if (!hasLoop) {
      return;
    }

    if (activeIndex <= minLoopIndex) {
      setAnimateTrack(false);
      setActiveIndex(safeImages.length);
      return;
    }

    if (activeIndex >= maxLoopIndex) {
      setAnimateTrack(false);
      setActiveIndex(1);
    }
  };

  const step = (delta: number) => {
    setActiveIndex((current) => {
      if (!hasLoop) {
        return 0;
      }

      const next = current + delta;
      if (next < minLoopIndex) {
        return minLoopIndex;
      }
      if (next > maxLoopIndex) {
        return maxLoopIndex;
      }
      return next;
    });
  };

  const goTo = (index: number) => {
    if (!hasLoop) {
      setActiveIndex(0);
      return;
    }

    setActiveIndex(index + 1);
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

    if (!hasLoop || Math.abs(delta) < SWIPE_THRESHOLD) {
      return;
    }

    step(delta < 0 ? 1 : -1);
  };

  return (
    <div
      className={`relative overflow-hidden bg-[#e9dccf] transform-gpu [backface-visibility:hidden] [contain:layout_paint] [will-change:transform] ${aspectClassMap[aspect]} ${className}`.trim()}
      onTouchStart={(event) => beginSwipe(event.changedTouches[0].clientX)}
      onTouchMove={(event) => trackSwipe(event.changedTouches[0].clientX)}
      onTouchEnd={finishSwipe}
    >
      <div
        className="flex h-full w-full transform-gpu [backface-visibility:hidden] [will-change:transform] [transition:transform_640ms_cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: `translate3d(-${activeIndex * 100}%, 0, 0)`,
          transition: animateTrack ? undefined : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedImages.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="min-w-full flex-[0_0_100%] [backface-visibility:hidden]"
          >
            <img
              src={image}
              alt={`${alt} ${index + 1}`}
              className="h-full w-full object-cover transform-gpu [backface-visibility:hidden]"
              loading={index <= 1 ? "eager" : "lazy"}
              draggable={false}
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,transparent_0%,rgba(12,7,4,0.32)_100%)]" />

      {showArrows && safeImages.length > 1 ? (
        <>
          <button
            type="button"
            className="absolute left-[0.7rem] top-1/2 z-30 inline-flex h-[3.05rem] min-h-[3.05rem] w-[3.05rem] min-w-[3.05rem] -translate-y-1/2 transform-gpu items-center justify-center rounded-full border border-white/20 bg-[rgba(18,12,8,0.52)] text-white touch-manipulation [backface-visibility:hidden] [will-change:transform] transition-[transform,background-color] duration-200 hover:scale-105 hover:bg-[rgba(17,12,9,0.78)] max-[560px]:h-[2.7rem] max-[560px]:w-[2.7rem] max-[560px]:min-h-[2.7rem] max-[560px]:min-w-[2.7rem] max-[380px]:h-[2.45rem] max-[380px]:w-[2.45rem] max-[380px]:min-h-[2.45rem] max-[380px]:min-w-[2.45rem]"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => step(-1)}
            aria-label="Previous image"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="absolute right-[0.7rem] top-1/2 z-30 inline-flex h-[3.05rem] min-h-[3.05rem] w-[3.05rem] min-w-[3.05rem] -translate-y-1/2 transform-gpu items-center justify-center rounded-full border border-white/20 bg-[rgba(18,12,8,0.52)] text-white touch-manipulation [backface-visibility:hidden] [will-change:transform] transition-[transform,background-color] duration-200 hover:scale-105 hover:bg-[rgba(17,12,9,0.78)] max-[560px]:h-[2.7rem] max-[560px]:w-[2.7rem] max-[560px]:min-h-[2.7rem] max-[560px]:min-w-[2.7rem] max-[380px]:h-[2.45rem] max-[380px]:w-[2.45rem] max-[380px]:min-h-[2.45rem] max-[380px]:min-w-[2.45rem]"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => step(1)}
            aria-label="Next image"
          >
            <ChevronRight size={18} />
          </button>
        </>
      ) : null}

      {(showDots || showCount) && safeImages.length > 1 ? (
        <div className="absolute inset-x-[1rem] bottom-[0.9rem] flex items-center justify-between gap-[0.8rem] max-[780px]:inset-x-[0.72rem] max-[780px]:bottom-[0.68rem]">
          {showDots ? (
            <div className="flex gap-2" aria-label="Carousel pages">
              {safeImages.map((_, index) => {
                const active = index === visibleIndex;
                return (
                  <button
                    key={`dot-${index}`}
                    type="button"
                    className={`h-[0.62rem] w-[0.62rem] rounded-full border-0 transition-[transform,background-color] duration-200 ${active ? "scale-110" : ""}`.trim()}
                    style={{
                      backgroundColor: active
                        ? "var(--accent)"
                        : "rgba(255,255,255,0.36)",
                    }}
                    aria-label={`Go to image ${index + 1}`}
                    onClick={() => goTo(index)}
                  />
                );
              })}
            </div>
          ) : (
            <span />
          )}

          {showCount ? (
            <span className="text-[0.76rem] font-extrabold tracking-[0.14em] text-[color:var(--accent)]">
              {String(visibleIndex + 1).padStart(2, "0")} / {String(safeImages.length).padStart(2, "0")}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

