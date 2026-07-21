import { useLayoutEffect, useRef, useState } from "react";

type BrandMarqueeProps = {
  items: string[];
  className?: string;
  itemClassName?: string;
  durationSeconds?: number;
};

export function BrandMarquee({
  items,
  className = "",
  itemClassName = "",
  durationSeconds = 24,
}: BrandMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    if (!trackRef.current) return;
    // Half the scroll width = width of one set of items
    setDistance(trackRef.current.scrollWidth / 2);
  }, [items]);

  const defaultItem = "px-8 inline-flex items-center whitespace-nowrap font-display font-bold text-[0.95rem] uppercase tracking-[0.06em]";
  const cls = itemClassName || defaultItem;

  return (
    <div className={`overflow-hidden ${className}`.trim()}>
      <div
        ref={trackRef}
        className="brand-marquee-track flex items-center w-max"
        style={{
          "--brand-marquee-distance": `${distance}px`,
          animationDuration: `${durationSeconds}s`,
        } as React.CSSProperties}
      >
        {/* Two full sets so the scroll loops seamlessly */}
        {[...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span className={cls} style={{ color: "var(--forest)" }}>
              {item}
            </span>
            {/* Orange diamond separator */}
            <span
              aria-hidden="true"
              style={{
                display:         "inline-block",
                width:           "0.55rem",
                height:          "0.55rem",
                backgroundColor: "var(--accent)",
                transform:       "rotate(45deg)",
                flexShrink:      0,
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
