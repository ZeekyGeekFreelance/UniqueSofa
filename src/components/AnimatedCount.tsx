import { useEffect, useMemo, useRef, useState } from "react";

type ParsedValue = {
  decimals: number;
  suffix: string;
  target: number;
};

type AnimatedCountProps = {
  value: string;
  durationMs?: number;
};

function parseCount(value: string): ParsedValue | null {
  const normalized = value.trim();
  const match = normalized.match(/^(\d+(?:\.\d+)?)(.*)$/);

  if (!match) {
    return null;
  }

  const numericPart = match[1];
  const target = Number.parseFloat(numericPart);

  if (!Number.isFinite(target)) {
    return null;
  }

  return {
    target,
    decimals: numericPart.includes(".") ? numericPart.split(".")[1].length : 0,
    suffix: match[2],
  };
}

function prefersReducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AnimatedCount({ value, durationMs = 1800 }: AnimatedCountProps) {
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const parsed = useMemo(() => parseCount(value), [value]);

  // Start slightly below target so the counter feels mid-flight rather than from zero.
  // Uses 15% of the target value (min 1, max 50) so small and large numbers both feel natural.
  const startValue = useMemo(() => {
    if (!parsed) return 0;
    const offset = Math.min(50, Math.max(1, Math.floor(parsed.target * 0.15)));
    return Math.max(0, parsed.target - offset);
  }, [parsed]);

  const [displayValue, setDisplayValue] = useState(() => {
    if (!parsed) return value;
    return `${Math.round(startValue)}${parsed.suffix}`;
  });

  useEffect(() => {
    if (!parsed) {
      setDisplayValue(value);
      return;
    }
    if (isVisible) return;
    setDisplayValue(`${Math.round(startValue)}${parsed.suffix}`);
  }, [isVisible, parsed, startValue, value]);

  useEffect(() => {
    if (isVisible) {
      return;
    }

    const node = elementRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.35,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    if (!parsed || prefersReducedMotion()) {
      setDisplayValue(value);
      return;
    }

    let frame = 0;
    const startTime = performance.now();
    const range = parsed.target - startValue;

    const step = (timestamp: number) => {
      const progress = Math.min(1, (timestamp - startTime) / durationMs);
      const eased = 1 - (1 - progress) ** 3;
      const nextValue = startValue + range * eased;

      const formattedValue = parsed.decimals > 0
        ? nextValue.toFixed(parsed.decimals)
        : String(Math.round(nextValue));

      setDisplayValue(`${formattedValue}${parsed.suffix}`);

      if (progress < 1) {
        frame = window.requestAnimationFrame(step);
      }
    };

    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [durationMs, isVisible, parsed, startValue, value]);

  return <span ref={elementRef}>{displayValue}</span>;
}
