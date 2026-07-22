import { ArrowUpRight, MessageCircle } from "lucide-react";
import type { Product } from "../data/site";
import { ui } from "../lib/ui";
import { MediaCarousel } from "./MediaCarousel";

type ProductCardProps = {
  product: Product;
  onOpen: (product: Product) => void;
  whatsappUrl: string;
  className?: string;
};

export function ProductCard({
  product,
  onOpen,
  whatsappUrl,
  className = "",
}: ProductCardProps) {
  return (
    <article
      className={`card-lift shimmer group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)] max-[780px]:rounded-xl ${className}`.trim()}
      data-reveal
    >
      <div className="relative">
        <MediaCarousel
          images={product.images}
          alt={product.name}
          aspect="landscape"
          autoPlay
          showArrows
          showDots
          showCount={false}
          className="aspect-[16/9] w-full"
        />
        <div className="absolute inset-x-3 top-3 z-[2] flex justify-between gap-2">
          <span className="rounded-md bg-[var(--forest)]/80 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-white backdrop-blur-sm">
            {product.brand}
          </span>
          {product.badge ? (
            <span className="rounded-md bg-[var(--accent)] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-white">
              {product.badge}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 max-[780px]:p-4">
        <p className="block text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--text-faint)]">
          {product.categoryTitle}
        </p>
        <h3 className="m-0 line-clamp-2 font-display text-[clamp(1.45rem,2vw,1.75rem)] leading-[1.04] tracking-[-0.02em] max-[780px]:text-[clamp(1.35rem,7vw,1.85rem)]">
          {product.name}
        </h3>
        <p className="m-0 line-clamp-2 text-[0.88rem] leading-[1.75] text-[var(--text-soft)]">
          {product.summary}
        </p>

        <div className="flex min-w-0 items-center justify-between gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.07em] text-[var(--text-faint)]">
          <span className="truncate">{product.type}</span>
          <span className="truncate">Ref {product.referencePageIds.join(" / ")}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={`${product.id}-${tag}`}
              className="inline-flex items-center whitespace-nowrap rounded-md border border-[var(--border)] bg-[#f3f4f6] px-[0.6rem] py-[0.22rem] text-[0.7rem] font-semibold text-[var(--text-soft)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-4 max-[780px]:flex max-[780px]:flex-col-reverse max-[780px]:gap-2">
          <button
            type="button"
            className={`${ui.buttonBase} min-w-0 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] text-white !shadow-none border-transparent hover:opacity-90`}
            onClick={() => onOpen(product)}
          >
            View details
            <ArrowUpRight size={15} />
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className={`${ui.buttonBase} ${ui.buttonSecondary} min-w-0`}
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
