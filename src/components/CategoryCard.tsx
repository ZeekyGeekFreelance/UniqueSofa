import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { Category } from "../data/site";
import { ui } from "../lib/ui";

type CategoryCardProps = {
  category: Category;
  compact?: boolean;
};

export function CategoryCard({
  category,
  compact = false,
}: CategoryCardProps) {
  return (
    <article
      id={category.slug}
      className={`${ui.surfaceCard} h-full overflow-hidden`}
      data-reveal
    >
      <div
        className="p-6 md:p-7"
        style={{
          background: `linear-gradient(135deg, ${category.tone} 0%, rgba(255,255,255,0.9) 100%)`,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span
              className={ui.chip}
              style={{
                background: "rgba(255,255,255,0.72)",
                color: category.accent,
                borderColor: `${category.accent}22`,
              }}
            >
              {category.code}
            </span>
            <h3 className="mt-5 text-balance font-display text-2xl">
              {category.title}
            </h3>
            <p className="mt-1 text-sm font-semibold text-[color:var(--text-faint)]">
              {category.subtitle}
            </p>
          </div>
          {category.badge ? (
            <span
              className={ui.chip}
              style={{
                background: `${category.accent}12`,
                color: category.accent,
                borderColor: `${category.accent}26`,
              }}
            >
              {category.badge}
            </span>
          ) : null}
        </div>
        <p className="mt-5 leading-7 text-[color:var(--text-soft)]">
          {category.summary}
        </p>
      </div>

      <div className="p-6 md:p-7 bg-white/80">
        <div className="flex flex-wrap gap-2">
          {category.items.slice(0, compact ? 4 : category.items.length).map((item) => (
            <span key={item} className={ui.chip}>
              {item}
            </span>
          ))}
        </div>

        <Link
          href="/contact"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold"
          style={{ color: category.accent }}
        >
          Ask about this range
          <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}

