import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { useSiteContent } from "../cms/SiteContentProvider";
import { ui } from "../lib/ui";

function isActivePath(currentPath: string, href: string) {
  return href === "/" ? currentPath === "/" : currentPath.startsWith(href);
}

export function Header() {
  const { content } = useSiteContent();
  const { brand, copy } = content;
  const navItems = copy.headerNavItems;

  const [menuOpen, setMenuOpen] = useState(false);
  const [closing, setClosing]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuPanelRef  = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const [location] = useLocation();

  const isHome = location === "/";

  useEffect(() => {
    // On the home page: transparent until scrolled past the hero card.
    // Hero height is clamp(560px, 90vh, 860px) — use 80vh as the threshold.
    const threshold = isHome ? Math.min(window.innerHeight * 0.8, 800) : 0;
    const fn = () => setScrolled(window.scrollY > threshold);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [isHome]);

  useEffect(() => { closeMenu(); }, [location]);

  function closeMenu() {
    if (!menuOpen) return;
    setClosing(true);
    setTimeout(() => { setMenuOpen(false); setClosing(false); }, 180);
  }

  function toggleMenu() {
    if (menuOpen) closeMenu();
    else { setMenuOpen(true); setClosing(false); }
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (menuPanelRef.current?.contains(t) || menuButtonRef.current?.contains(t)) return;
      closeMenu();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeMenu(); };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      {/*
       * Header is FIXED white — sits above the hero card.
       * On scroll the shadow deepens slightly but bg is always white.
       */}
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-400"
        style={{
          backgroundColor: scrolled ? "rgba(255,255,255,0.98)" : "transparent",
          backdropFilter:  scrolled ? "blur(16px)" : "none",
          boxShadow:       scrolled ? "0 1px 0 rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div className={`${ui.containerWide} flex min-h-[5rem] items-center justify-between gap-4`}>

          {/* Logo */}
          <Link href="/" className="flex min-w-0 flex-1 items-center gap-2.5 max-[780px]:flex-none">
            {brand.logoUrl ? (
              <img
                src={brand.logoUrl}
                alt={brand.name}
                className="h-8 w-auto max-w-[7rem] shrink-0 object-contain"
                style={{ filter: scrolled ? "none" : "brightness(0) invert(1)" }}
              />
            ) : (
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-display text-[0.85rem] font-black text-white"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {brand.shortName?.slice(0, 2).toUpperCase() || "US"}
              </div>
            )}
            <p
              className="m-0 font-display font-black leading-tight truncate"
              style={{
                color: scrolled ? "var(--forest)" : "#ffffff",
                fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
              }}
            >
              {brand.name}
            </p>
          </Link>

          {/* Desktop nav */}
          <nav className="flex items-center gap-7 max-[780px]:hidden">
            {navItems.map((item) => {
              const active = isActivePath(location, item.href);
              const baseColor = scrolled
                ? (active ? "var(--accent)" : "var(--text)")
                : (active ? "var(--accent)" : "rgba(255,255,255,0.9)");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative text-[0.88rem] font-semibold transition-colors duration-150"
                  style={{ color: baseColor }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
                  onMouseLeave={(e) => {
                    if (!isActivePath(location, item.href))
                      (e.currentTarget as HTMLElement).style.color = scrolled ? "var(--text)" : "rgba(255,255,255,0.9)";
                  }}
                >
                  {item.label}
                  {active && (
                    <span
                      className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full"
                      style={{ backgroundColor: "var(--accent)" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA — pushed right with margin to separate from nav */}
          <div className="flex shrink-0 items-center ml-6 max-[780px]:hidden">
            <Link
              href="/contact"
              className={`${ui.buttonBase} ${ui.buttonPrimary} rounded-full !py-2.5 !px-5 !text-[0.85rem]`}
            >
              {copy.headerCtaLabel}
            </Link>
          </div>

          {/* Hamburger */}
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className={`hidden h-9 w-9 shrink-0 flex-col items-center justify-center gap-[5px] rounded-lg max-[780px]:flex ${menuOpen ? "hamburger-open" : ""}`}
            style={{
              border: `1px solid ${scrolled ? "var(--border-strong)" : "rgba(255,255,255,0.3)"}`,
              color: scrolled ? "var(--text)" : "#ffffff",
            }}
            onClick={toggleMenu}
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className={`nav-backdrop fixed inset-0 z-40 ${closing ? "closing" : ""}`}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={closeMenu}
        >
          <div
            ref={menuPanelRef}
            className={`nav-panel absolute inset-x-3 top-[5.25rem] overflow-hidden rounded-2xl ${closing ? "closing" : ""}`}
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "0 8px 16px rgba(0,0,0,0.08), 0 24px 48px rgba(0,0,0,0.16)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="p-2">
              {navItems.map((item, i) => {
                const active = isActivePath(location, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="nav-item-animated flex items-center justify-between rounded-xl px-4 py-3 text-[0.92rem] font-semibold transition-colors duration-100"
                    style={{
                      animationDelay: `${i * 40}ms`,
                      backgroundColor: active ? "rgba(249,107,8,0.08)" : "transparent",
                      color: active ? "var(--accent)" : "var(--text)",
                    }}
                    onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--surface-warm)"; }}
                    onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                  >
                    {item.label}
                    {active && <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: "var(--accent)" }} />}
                  </Link>
                );
              })}
            </nav>
            <div style={{ height: "1px", backgroundColor: "var(--border)", margin: "0 1rem" }} />
            <div className="p-3">
              <Link href="/contact" className={`${ui.buttonBase} ${ui.buttonPrimary} w-full justify-center rounded-xl`}>
                {copy.headerCtaLabel}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
