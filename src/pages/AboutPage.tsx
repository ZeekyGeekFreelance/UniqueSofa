import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useSiteContent } from "../cms/SiteContentProvider";
import { AnimatedCount } from "../components/AnimatedCount";
import { BrandMarquee } from "../components/BrandMarquee";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { SectionHeading } from "../components/SectionHeading";
import { usePageTitle } from "../hooks/usePageTitle";
import { useReveal } from "../hooks/useReveal";
import { ui } from "../lib/ui";

export function AboutPage() {
  const { content } = useSiteContent();
  const { brand, stats, specializations, brands, copy } = content;

  usePageTitle(`About | ${brand.name}`);
  useReveal();

  return (
    <div className={ui.pageTop}>
      <section className={ui.sectionGapIntro}>
        <div className={ui.containerWide}>
          <Breadcrumbs current="About" />
          <div className="mt-9 grid gap-9 max-[780px]:gap-[1.6rem] xl:grid-cols-[1.05fr_0.95fr]">
            <div>
              <SectionHeading
                eyebrow={copy.about.heroEyebrow}
                title={copy.about.heroTitle}
                description={copy.about.heroDescription}
              />
              <div className="flex flex-wrap gap-[0.85rem] max-[780px]:gap-[0.9rem]" data-reveal>
                <Link href="/products" className={`${ui.buttonBase} ${ui.buttonPrimary}`}>
                  {copy.about.primaryCtaLabel} <ArrowRight size={16} />
                </Link>
                <Link href="/contact" className={`${ui.buttonBase} ${ui.buttonSecondary}`}>
                  {copy.about.secondaryCtaLabel}
                </Link>
              </div>
            </div>
            <div className="mt-9 grid grid-cols-2 gap-5 max-[780px]:mt-8 max-[780px]:gap-[1.25rem] max-[560px]:gap-[1.1rem]" data-reveal="right">
              {stats.map((stat) => (
                <article key={stat.label} className="transform-gpu rounded-3xl border border-[color:var(--border)] bg-white/60 p-[1.3rem] px-[1.35rem] [backface-visibility:hidden] [will-change:transform] transition-[transform,box-shadow,border-color,background-color] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(39,24,12,0.08)] max-[780px]:p-4 max-[780px]:px-[1.05rem]">
                  <strong className="block font-display text-[clamp(3.35rem,5.05vw,5.8rem)] leading-[0.9] max-[780px]:text-[clamp(2.92rem,10.2vw,4.12rem)]">
                    <AnimatedCount value={stat.value} />
                  </strong>
                  <span className="mt-[0.35rem] block text-[clamp(0.96rem,1.2vw,1.18rem)] leading-[1.6] text-[color:var(--text-faint)] max-[780px]:text-[0.95rem]">
                    {stat.label}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={ui.sectionGap}>
        <div className={ui.containerWide}>
          <SectionHeading
            eyebrow={copy.about.modelEyebrow}
            title={copy.about.modelTitle}
            description={copy.about.modelDescription}
          />
          <div className="grid gap-6 max-[780px]:gap-[1.3rem] max-[560px]:gap-[1.15rem] lg:grid-cols-3">
            {specializations.map((spec, index) => (
              <article key={spec.title}
                className="flex h-full transform-gpu flex-col gap-[0.85rem] rounded-[1.6rem] border border-[color:var(--border)] bg-white/80 p-[1.55rem] [backface-visibility:hidden] [will-change:transform] shadow-[0_24px_70px_rgba(39,24,12,0.08)] transition-[transform,box-shadow,border-color,background-color] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.014] max-[780px]:rounded-[1.5rem] max-[780px]:p-4 max-[560px]:rounded-[1.25rem] max-[560px]:p-[0.88rem] max-[380px]:p-[0.82rem]"
                data-reveal style={{ transitionDelay: `${index * 80}ms` }}>
                <p className="m-0 text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-[color:var(--text-faint)]">Supply role</p>
                <h3 className="m-0 font-display text-[clamp(1.45rem,1.8vw,1.75rem)] leading-[1.06]">{spec.title}</h3>
                <p className="m-0 line-clamp-3 text-[color:var(--text-soft)] max-[780px]:text-[0.92rem] max-[780px]:leading-[1.55]">{spec.summary}</p>
                <ul className="mt-auto list-disc pl-4 marker:text-[color:var(--accent)]">
                  {spec.items.map((item) => <li key={item} className="mt-[0.34rem]">{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${ui.sectionGap} pb-[1.45rem] max-[780px]:pt-12 max-[780px]:pb-[1.2rem]`}>
        <div className={ui.containerWide}>
          <SectionHeading
            eyebrow={copy.about.brandsEyebrow}
            title={copy.about.brandsTitle}
            description={copy.about.brandsDescription}
          />
          <div className="my-[2.2rem] mt-[1.2rem] overflow-hidden border-y border-[rgba(80,48,22,0.16)] py-[0.46rem]" data-reveal>
            <BrandMarquee
              items={brands}
              durationSeconds={20}
              className="my-[0.95rem]"
              itemClassName="inline-flex max-w-[19.8rem] items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-[rgba(80,48,22,0.24)] bg-white/85 px-[0.84rem] py-[0.48rem] font-display text-[clamp(0.84rem,1.2vw,1.06rem)] uppercase tracking-[0.055em] text-[rgba(53,31,17,0.9)] hover:cursor-pointer hover:border-[rgba(80,48,22,0.4)] hover:bg-white/95 max-[780px]:max-w-[14.8rem] max-[780px]:px-[0.62rem] max-[780px]:py-[0.42rem] max-[780px]:text-[0.73rem] max-[780px]:tracking-[0.04em]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
