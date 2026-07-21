export const ui = {
  pageTop: "pt-[6.4rem] max-[780px]:pt-[5.25rem] max-[560px]:pt-[5rem]",
  sectionGap:
    "py-[5.8rem] max-[780px]:py-[4.8rem] max-[560px]:py-[4.2rem] max-[380px]:py-[3.7rem]",
  sectionGapIntro:
    "pt-[5.8rem] pb-[3.2rem] max-[780px]:pt-[4.8rem] max-[780px]:pb-[3.8rem] max-[560px]:pt-[4.2rem] max-[560px]:pb-[3.4rem] max-[380px]:pt-[3.7rem] max-[380px]:pb-[3rem]",
  sectionGapNoTop:
    "pt-0 pb-[5.8rem] max-[780px]:pb-[4.8rem] max-[560px]:pb-[4.2rem] max-[380px]:pb-[3.7rem]",
  sectionGapNoTopWideBottom:
    "pt-0 pb-[5.8rem] max-[780px]:pb-[5rem] max-[560px]:pb-[4.5rem] max-[380px]:pb-[4rem]",
  sectionMuted: "bg-white",
  containerPage:
    "mx-auto w-[min(1140px,calc(100%-2rem))] max-[780px]:w-[min(1320px,calc(100%-2.4rem))] max-[560px]:w-[min(1320px,calc(100%-2rem))] max-[380px]:w-[min(1320px,calc(100%-1.7rem))]",
  containerWide:
    "mx-auto w-[min(1320px,calc(100%-2rem))] max-[780px]:w-[min(1320px,calc(100%-2.4rem))] max-[560px]:w-[min(1320px,calc(100%-2rem))] max-[380px]:w-[min(1320px,calc(100%-1.7rem))]",
  sectionHeadRow:
    "flex items-center justify-between gap-10 max-[780px]:flex-col max-[780px]:items-start max-[780px]:gap-8",
  sectionIndex:
    "mt-[2.2rem] flex items-center justify-between text-[0.82rem] font-medium tracking-[0.1em] text-[color:var(--text-faint)] max-[780px]:mt-[2rem] max-[780px]:text-[0.72rem]",
  sectionIndexWithArrows:
    "items-center gap-[0.85rem] max-[780px]:flex-col max-[780px]:items-center max-[780px]:gap-[0.85rem]",
  sectionIndexPager:
    "mx-auto inline-flex items-center gap-[0.72rem] max-[780px]:w-full max-[780px]:justify-between max-[780px]:gap-[0.9rem]",
  sectionIndexDots: "flex gap-[0.55rem]",
  sectionIndexDot:
    "h-[0.6rem] w-[0.6rem] rounded-full border-0 bg-[#d1d5db] transition-[transform,background-color] duration-200 max-[780px]:h-[0.55rem] max-[780px]:w-[0.55rem]",
  surfaceCard:
    "rounded-2xl border border-[color:var(--border)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)] max-[780px]:rounded-xl max-[560px]:rounded-xl",
  surfaceDark:
    "bg-[var(--navy)] text-white",
  buttonBase:
    "inline-flex min-h-[3rem] transform-gpu items-center justify-center gap-[0.55rem] rounded-lg border border-transparent px-[1.35rem] py-[0.82rem] text-[0.9rem] font-semibold tracking-[0.01em] [backface-visibility:hidden] [will-change:transform] transition-[transform,box-shadow,background-color,border-color,color] duration-200 hover:scale-[1.015] disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none max-[780px]:min-h-[2.85rem] max-[780px]:px-[1.15rem] max-[780px]:py-[0.76rem] max-[780px]:text-[0.88rem] max-[560px]:min-h-[2.75rem] max-[560px]:px-[1.05rem] max-[560px]:text-[0.86rem]",
  buttonPrimary:
    "bg-[var(--accent)] text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(249,107,8,0.4)] hover:bg-[var(--accent-dark)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.12),0_6px_16px_rgba(249,107,8,0.45)]",
  buttonSecondary:
    "border border-[var(--border-strong)] bg-white text-[var(--text)] shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_12px_rgba(200,146,42,0.12)]",
  chip:
    "inline-flex items-center justify-center gap-[0.35rem] rounded-md border border-[color:var(--border)] bg-[#f3f4f6] px-[0.72rem] py-[0.38rem] text-[0.72rem] font-semibold tracking-[0.03em] text-[color:var(--text-soft)] max-[780px]:px-[0.65rem] max-[780px]:py-[0.34rem] max-[780px]:text-[0.68rem]",
  field:
    "w-full rounded-lg border border-[color:var(--border-strong)] bg-white px-4 py-[0.82rem] text-[color:var(--text)] transition-[border-color,box-shadow] duration-150 focus:border-[color:var(--accent)] focus:outline-none focus:ring-[3px] focus:ring-[rgba(200,146,42,0.18)] placeholder:text-[color:var(--text-faint)] max-[780px]:min-h-[3rem] max-[780px]:py-[0.78rem] max-[560px]:min-h-[2.85rem]",
  fieldArea:
    "w-full min-h-40 resize-y rounded-lg border border-[color:var(--border-strong)] bg-white px-4 py-[0.82rem] text-[color:var(--text)] transition-[border-color,box-shadow] duration-150 focus:border-[color:var(--accent)] focus:outline-none focus:ring-[3px] focus:ring-[rgba(200,146,42,0.18)] placeholder:text-[color:var(--text-faint)] max-[780px]:min-h-40 max-[780px]:py-[0.78rem] max-[560px]:min-h-36",
  iconButton:
    "inline-flex h-[2.85rem] min-h-[2.85rem] w-[2.85rem] min-w-[2.85rem] transform-gpu items-center justify-center rounded-lg border border-[color:var(--border-strong)] bg-white [backface-visibility:hidden] [will-change:transform] shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-[transform,border-color,box-shadow] duration-200 hover:scale-[1.04] hover:border-[var(--accent)] hover:shadow-[0_2px_8px_rgba(200,146,42,0.2)] disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-40 max-[560px]:h-[2.65rem] max-[560px]:min-h-[2.65rem] max-[560px]:w-[2.65rem] max-[560px]:min-w-[2.65rem]",
} as const;
