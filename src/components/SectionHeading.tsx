type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  inverted?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  inverted = false,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={`mb-12 max-w-[48rem] max-[780px]:mb-10 max-[560px]:mb-8 ${centered ? "mx-auto text-center" : ""}`.trim()}
    >
      {/* Eyebrow — line grows in on reveal */}
      <p
        className="inline-flex items-center gap-3 text-[0.7rem] font-bold tracking-[0.2em] uppercase"
        style={{ color: "var(--accent)" }}
        data-reveal="fade"
      >
        <span
          className="eyebrow-line shrink-0"
          style={{ display: "inline-block", height: "1px", background: "currentColor", width: "1.75rem" }}
        />
        {eyebrow}
      </p>

      {/* Heading — slides up */}
      <h2
        className="mt-4 text-balance font-display text-[clamp(2.2rem,3.8vw,4.2rem)] leading-[1.0] tracking-[-0.03em] max-[780px]:mt-4 max-[780px]:text-[clamp(1.8rem,7vw,2.4rem)] max-[780px]:leading-[1.05]"
        style={{ color: inverted ? "#ffffff" : "var(--text)" }}
        data-reveal
      >
        {title}
      </h2>

      {/* Description — fades in slightly after */}
      <p
        className={`mt-5 max-w-[42rem] text-[0.95rem] leading-[1.85] max-[780px]:mt-3 max-[780px]:text-[0.9rem] max-[780px]:leading-[1.75] ${centered ? "mx-auto" : ""}`.trim()}
        style={{
          color: inverted ? "rgba(255,255,255,0.72)" : "#374151",
          transitionDelay: "120ms",
        }}
        data-reveal="fade"
      >
        {description}
      </p>
    </div>
  );
}
