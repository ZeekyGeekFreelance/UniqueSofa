import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { Link } from "wouter";
import { useSiteContent } from "../cms/SiteContentProvider";
import { useSwipe } from "../hooks/useSwipe";

/* ── FitText — measures after mount + on resize, scales from centre ───
   Works for any word/phrase length without ever overflowing.
   On mobile renders stacked fading layers for the "raindrop" effect.  */
function FitText({ text }: { text: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  const measure = () => {
    const wrap = wrapRef.current;
    const span = spanRef.current;
    if (!wrap || !span) return;
    span.style.transform = "scaleX(1)";
    const ratio = wrap.offsetWidth / span.scrollWidth;
    setScale(Math.min(1, ratio - 0.02));
  };

  useLayoutEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 780);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [text]);

  /* Mobile: overlapping echo layers — tight negative margin so they
     read as one stroke-style text, not separate lines.               */
  if (isMobile) {
    const layers = [
      { opacity: 0.90, blur: 0, mt: "0" },   // primary — crisp
      { opacity: 0.45, blur: 0.8, mt: "-0.38em" },   // echo 1
      { opacity: 0.20, blur: 1.5, mt: "-0.38em" },   // echo 2
      { opacity: 0.08, blur: 2.5, mt: "-0.38em" },   // ghost
    ];
    return (
      <div style={{ width: "100%", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {layers.map((l, i) => (
          <span
            key={i}
            style={{
              display: "block",
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "13vw",
              lineHeight: 1,
              letterSpacing: "0.08em",
              color: `rgba(255,255,255,${l.opacity})`,
              whiteSpace: "nowrap",
              transformOrigin: "center center",
              transform: `scaleX(${scale})`,
              filter: l.blur > 0 ? `blur(${l.blur}px)` : "none",
              marginTop: l.mt,
              animation: `wm-in ${400 + i * 60}ms ease both`,
              animationDelay: `${i * 40}ms`,
            }}
          >
            {text}
          </span>
        ))}
      </div>
    );
  }

  /* Desktop: single line, scaleX to fit */
  return (
    <div ref={wrapRef} style={{ width: "100%", overflow: "hidden", textAlign: "center" }}>
      <span
        ref={spanRef}
        style={{
          display: "inline-block",
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: "13vw",
          lineHeight: 1.15,
          paddingBottom: "0.18em",
          letterSpacing: "-0.03em",
          color: "rgba(255,255,255,0.88)",
          whiteSpace: "nowrap",
          transformOrigin: "center center",
          transform: `scaleX(${scale})`,
          animation: "wm-in 400ms ease both",
        }}
      >
        {text}
      </span>
    </div>
  );
}

export function Hero() {
  const { content } = useSiteContent();
  const { copy, heroMedia } = content;

  const happyCustomersCount = copy.home.heroHappyCustomersCount || "5M+";
  const happyCustomersLabel = copy.home.heroHappyCustomersLabel || "Happy Customers";
  const newCollectionLabel = copy.home.heroFloatingCardTitle || "New Collection";
  const newCollectionImage = copy.home.heroFloatingCardImage;

  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const activeItem = heroMedia[activeIndex] ?? heroMedia[0];

  const cardRef = useRef<HTMLDivElement>(null);
  const cur = useRef({ rx: 0, ry: 0 });
  const tgt = useRef({ rx: 0, ry: 0 });
  const raf = useRef(0);

  // Native mouse events — don't conflict with swipe handlers
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width * 2 - 1;
      const ny = (e.clientY - r.top) / r.height * 2 - 1;
      tgt.current = { rx: -ny * 9, ry: nx * 13 };
    };
    const onLeave = () => { tgt.current = { rx: 0, ry: 0 }; };

    card.addEventListener("mousemove", onMove, { passive: true });
    card.addEventListener("mouseleave", onLeave, { passive: true });
    return () => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // RAF tilt loop
  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      cur.current.rx = lerp(cur.current.rx, tgt.current.rx, 0.08);
      cur.current.ry = lerp(cur.current.ry, tgt.current.ry, 0.08);
      if (cardRef.current) {
        cardRef.current.style.setProperty('--tilt-x', `${cur.current.rx.toFixed(3)}deg`);
        cardRef.current.style.setProperty('--tilt-y', `${cur.current.ry.toFixed(3)}deg`);
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const goTo = useCallback((i: number) => {
    const next = (i + heroMedia.length) % heroMedia.length;
    if (next === activeIndex || transitioning) return;
    setPrevIndex(activeIndex);
    setActiveIndex(next);
    setTransitioning(true);
    // After spin animation, cleanup prevIndex
    window.setTimeout(() => {
      setTransitioning(false);
      setPrevIndex(null);
    }, 600);
  }, [activeIndex, transitioning, heroMedia.length]);

  // Slide auto-play
  useEffect(() => {
    if (heroMedia.length <= 1) return;
    const t = window.setInterval(
      () => goTo(activeIndex + 1),
      5000,
    );
    return () => window.clearInterval(t);
  }, [heroMedia.length, activeIndex, goTo]);
  const swipeHandlers = useSwipe(
    () => goTo(activeIndex + 1),
    () => goTo(activeIndex - 1),
  );

  if (!activeItem) return null;

  return (
    <div
      className="w-full pb-5"
      style={{
        paddingLeft: "clamp(0.5rem, 1.5vw, 1.25rem)",
        paddingRight: "clamp(0.5rem, 1.5vw, 1.25rem)",
      }}
    >
      <div
        ref={cardRef}
        className="relative w-full rounded-b-[1.75rem] sm:rounded-b-[2.25rem]"
        style={{
          backgroundColor: "#0d2319",
          height: "clamp(580px, 92vh, 900px)",
          overflow: "hidden",
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
        {...swipeHandlers}
      >

        {/* ── 0. GRID NET ─────────────────────────────────────── */}
        <div className="hero-grid-net" style={{ zIndex: 2 }} aria-hidden="true" />

        {/* ── 1. WATERMARK — stacked layers on mobile, single line desktop ── */}
        <div
          className="hero-wm pointer-events-none select-none absolute inset-x-0 top-0"
          style={{
            zIndex: 1,
            textAlign: "center",
          }}
          aria-hidden="true"
        >
          <FitText text={activeItem.title} />
        </div>

        {/* ── 2. CHAIR — sketch-out transition between slides ─────
            Outgoing: scale down + clip-path wipe (sketch-out).
            Incoming: scale up + clip-path wipe in (sketch-in).      */}
        <div
          className="absolute inset-x-0 bottom-0 flex justify-center items-end"
          style={{ zIndex: 3 }}
        >
          {/* Outgoing image — plays sketch-out animation */}
          {transitioning && prevIndex !== null && heroMedia[prevIndex] && (
            <img
              key={`out-${prevIndex}`}
              src={heroMedia[prevIndex].image}
              alt=""
              aria-hidden="true"
              className={`max-[780px]:!object-center ${
                (heroMedia[prevIndex].image.includes("bed") || heroMedia[prevIndex].image.includes("sofa"))
                  ? "max-[780px]:!max-w-[160%]"
                  : ""
              }`}
              style={{
                position: "absolute",
                height: "clamp(320px, 72vh, 820px)",
                width: "auto",
                maxWidth: "min(90%, 680px)",
                objectFit: "contain",
                objectPosition: "bottom center",
                filter: "drop-shadow(0 32px 72px rgba(0,0,0,0.75))",
                pointerEvents: "none",
                marginBottom: "-4.5%",
                animation: "hero-sketch-out 600ms var(--ease-out-expo) both",
              }}
              loading="eager"
              decoding="async"
            />
          )}

          {/* Active image — plays sketch-in animation */}
          <img
            key={`in-${activeIndex}`}
            src={activeItem.image}
            alt={activeItem.title}
            className={`hero-chair-img block max-[780px]:!object-center ${
              (activeItem.image.includes("bed") || activeItem.image.includes("sofa"))
                ? "max-[780px]:!max-w-[160%]"
                : ""
            }`}
            style={{
              height: "clamp(320px, 72vh, 820px)",
              width: "auto",
              maxWidth: "min(90%, 680px)",
              objectFit: "contain",
              objectPosition: "bottom center",
              filter: "drop-shadow(0 32px 72px rgba(0,0,0,0.75))",
              willChange: "transform",
              transformStyle: "preserve-3d",
              transformOrigin: "50% 100%",
              transform: "perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) scale3d(1.03,1.03,1.03)",
              pointerEvents: "none",
              marginBottom: "-4.5%",
              animation: "hero-sketch-in 600ms var(--ease-out-expo) both",
            }}
            loading="eager"
            decoding="async"
          />
        </div>

        {/* ── 3. BOTTOM-LEFT cluster ───────────────────────────── */}
        <div
          className="absolute bottom-0 left-0 z-[4] flex flex-col gap-2"
          style={{ padding: "clamp(0.75rem, 2.5vw, 2rem)" }}
        >
          {/* Customers chip — always visible */}
          <div
            className="flex flex-col w-fit rounded-full px-3 py-1.5"
            style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(12px)" }}
          >
            <span className="font-display font-black text-white text-[0.85rem] leading-none">{happyCustomersCount}</span>
            <span className="text-[0.58rem] font-medium leading-none mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>{happyCustomersLabel}</span>
          </div>

          {/* Collection card — clickable, links to /products */}
          <Link
            href="/products"
            className="w-[6.5rem] rounded-2xl overflow-hidden shadow-lg hidden sm:block transition-transform duration-200 hover:scale-105 active:scale-95"
            style={{ backgroundColor: "#f4ece3" }}
          >
            <div className="p-2 pb-1">
              <img src={newCollectionImage} alt={newCollectionLabel}
                style={{ width: "100%", aspectRatio: "1/1", objectFit: "contain", display: "block" }} />
            </div>
            <p className="m-0 text-center font-bold pb-2 px-2 text-[0.65rem]" style={{ color: "#1a1a1a" }}>{newCollectionLabel}</p>
          </Link>

          {/* Caption — desktop only */}
          <p className="m-0 text-[0.68rem] leading-[1.6] max-w-[12rem] hidden md:block" style={{ color: "rgba(255,255,255,0.4)" }}>
            Crafted for modern living, this statement piece blends sculptural design, premium comfort, and timeless elegance.
          </p>
        </div>

        {/* ── 4. BOTTOM-RIGHT: < · · > ─────────────────────────── */}
        <div
          className="absolute bottom-0 right-0 z-[4] flex items-center gap-2"
          style={{ padding: "clamp(1rem, 2.5vw, 2rem)" }}
        >
          <button type="button" aria-label="Previous slide" onClick={() => goTo(activeIndex - 1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105 active:scale-95"
            style={{ backgroundColor: "#ffffff", color: "#0d2319" }}>
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>

          <div className="flex items-center gap-1.5 px-1">
            {heroMedia.map((_, i) => (
              <button key={i} type="button" onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
                className="rounded-full border-0 cursor-pointer transition-all duration-300"
                style={{
                  width: i === activeIndex ? "1.4rem" : "0.36rem",
                  height: "0.36rem",
                  backgroundColor: i === activeIndex ? "var(--accent)" : "rgba(255,255,255,0.3)",
                }} />
            ))}
          </div>

          <button type="button" aria-label="Next slide" onClick={() => goTo(activeIndex + 1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105 active:scale-95"
            style={{ backgroundColor: "var(--accent)", color: "#ffffff", boxShadow: "0 4px 14px rgba(249,107,8,0.45)" }}>
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>

      </div>
    </div>
  );
}
