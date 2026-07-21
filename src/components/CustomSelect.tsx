import { Check, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export type SelectOption = {
  id: string;
  label: string;
};

type CustomSelectProps = {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function CustomSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Choose an option",
  className = "",
}: CustomSelectProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  const activeOption = useMemo(() => options.find((o) => o.id === value), [options, value]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className={`relative ${open ? "z-[120]" : "z-auto"} ${className}`.trim()}>
      {label && (
        <span className="mb-[0.45rem] block text-[0.7rem] font-semibold uppercase tracking-[0.12em]"
          style={{ color: "#6b7280" }}>
          {label}
        </span>
      )}

      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-[0.72rem] text-[0.88rem] font-medium transition-[border-color,box-shadow] duration-150"
        style={{
          backgroundColor: "#ffffff",
          borderColor: open ? "var(--accent)" : "#d1d5db",
          color: "#111827",
          boxShadow: open ? "0 0 0 3px rgba(249,107,8,0.15)" : "0 1px 2px rgba(0,0,0,0.05)",
          minHeight: "2.85rem",
        }}
        onClick={() => setOpen((c) => !c)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="truncate whitespace-nowrap">{activeOption?.label ?? placeholder}</span>
        <ChevronDown
          size={15}
          style={{
            color: "#9ca3af",
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 200ms ease",
          }}
        />
      </button>

      {open && (
        <div
          className="absolute inset-x-0 top-[calc(100%+0.4rem)] z-[130] max-h-[16rem] overflow-y-auto rounded-lg border"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "#e5e7eb",
            boxShadow: "0 4px 6px rgba(0,0,0,0.06), 0 12px_32px rgba(0,0,0,0.12)",
          }}
          role="listbox"
          aria-label={label ?? placeholder}
        >
          {options.map((option) => {
            const active = option.id === value;
            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={active}
                className="flex w-full items-center justify-between gap-3 border-b px-3 py-[0.72rem] text-left text-[0.88rem] font-medium last:border-b-0 transition-colors duration-100"
                style={{
                  borderColor: "#f3f4f6",
                  backgroundColor: active ? "rgba(249,107,8,0.08)" : "transparent",
                  color: active ? "var(--accent)" : "#111827",
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                }}
                onClick={() => { onChange(option.id); setOpen(false); }}
              >
                <span>{option.label}</span>
                {active && <Check size={13} style={{ color: "var(--accent)", flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
