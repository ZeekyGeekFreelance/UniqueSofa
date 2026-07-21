import { Mail, MapPin, Phone } from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "wouter";
import { useSiteContent } from "../cms/SiteContentProvider";
import { ui } from "../lib/ui";

export function Footer() {
  const { content } = useSiteContent();
  const { brand, brands, stores, copy } = content;

  const navItems = copy.headerNavItems;

  return (
    <footer className="mt-8 max-[780px]:mt-0" style={{ backgroundColor: "var(--forest)", color: "#ffffff" }}>
      <div className={`${ui.containerWide} py-16 max-[780px]:py-12`}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,0.87fr))] max-[1100px]:grid-cols-1 max-[1100px]:gap-10">

          <div>
            <div className="flex items-center gap-3">
              {brand.logoUrl ? (
                <img src={brand.logoUrl} alt={brand.name} className="h-10 w-auto max-w-[9rem] shrink-0 object-contain" />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-display text-[1rem] font-bold text-white" style={{ backgroundColor: "var(--accent)" }}>
                  DT
                </div>
              )}
              <p className="m-0 font-display text-[1.2rem]" style={{ color: "#ffffff" }}>{brand.name}</p>
            </div>
            <p className="m-0 mt-5 text-[0.92rem] leading-[1.8]" style={{ color: "rgba(255,255,255,0.65)" }}>
              {brand.intro}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {brands.slice(0, 6).map((b) => (
                <span key={b} className="inline-flex items-center rounded-md px-3 py-[0.35rem] text-[0.72rem] font-medium"
                  style={{ border: "1px solid rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.65)" }}>
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="m-0 text-[0.7rem] font-bold uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.5)" }}>
              {copy.footer.navigateTitle}
            </h3>
            <div className="mt-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}
                  className="inline-flex w-fit py-[0.45rem] text-[0.92rem] font-medium transition-colors duration-150"
                  style={{ color: "rgba(255,255,255,0.72)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#ffffff")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.72)")}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="m-0 text-[0.7rem] font-bold uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.5)" }}>
              {copy.footer.storesTitle}
            </h3>
            <div className="mt-4 grid gap-5">
              {stores.map((store) => (
                <article key={store.name}>
                  <strong className="block text-[0.88rem] font-semibold" style={{ color: "#ffffff" }}>{store.name}</strong>
                  <a href={store.mapsUrl} target="_blank" rel="noreferrer"
                    className="mt-1 block text-[0.85rem] leading-[1.7] transition-colors duration-150"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#ffffff")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)")}
                  >
                    <p className="m-0">{store.address}</p>
                    <p className="m-0">{store.city}</p>
                  </a>
                </article>
              ))}
            </div>
          </div>

          <div>
            <h3 className="m-0 text-[0.7rem] font-bold uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.5)" }}>
              {copy.footer.contactTitle}
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              <a href={brand.phoneHref} className="inline-flex items-center gap-3 text-[0.92rem] font-medium transition-colors duration-150"
                style={{ color: "rgba(255,255,255,0.72)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#ffffff")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.72)")}
              >
                <Phone size={15} className="shrink-0" style={{ color: "var(--accent)" } as CSSProperties} />
                {brand.phone}
              </a>
              <a href={brand.emailHref} className="inline-flex items-center gap-3 text-[0.92rem] font-medium transition-colors duration-150"
                style={{ color: "rgba(255,255,255,0.72)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#ffffff")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.72)")}
              >
                <Mail size={15} className="shrink-0" style={{ color: "var(--accent)" } as CSSProperties} />
                {brand.email}
              </a>
              <div className="inline-flex items-center gap-3 text-[0.92rem] font-medium" style={{ color: "rgba(255,255,255,0.72)" }}>
                <MapPin size={15} className="shrink-0" style={{ color: "var(--accent)" } as CSSProperties} />
                {brand.city}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between gap-4 pt-6 text-[0.82rem] max-[780px]:flex-col max-[780px]:items-start"
          style={{ borderTop: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.45)" }}>
          <p className="m-0">© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
          <p className="m-0">{copy.footer.bottomCaption}</p>
        </div>
      </div>
    </footer>
  );
}
