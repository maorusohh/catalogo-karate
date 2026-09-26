import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "neutral" | "accent" | "success" | "warning";
  className?: string;
};

export function Badge({ children, tone = "neutral", className = "" }: BadgeProps) {
  const tones = {
    neutral: "bg-neutral-100 text-neutral-700",
    accent: "bg-[#b31322]/10 text-[#8d0f1b]",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-800",
  };

  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full px-3 text-[11px] font-semibold tracking-[0.08em] uppercase ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
