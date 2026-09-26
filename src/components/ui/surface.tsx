import type { ReactNode } from "react";

type SurfaceProps = {
  children: ReactNode;
  variant?: "default" | "soft" | "dark";
  className?: string;
};

export function Surface({ children, variant = "default", className = "" }: SurfaceProps) {
  const variants = {
    default: "border border-black/10 bg-white",
    soft: "border border-black/5 bg-[#f3f1ec]",
    dark: "bg-neutral-950 text-white",
  };

  return <div className={`rounded-3xl ${variants[variant]} ${className}`}>{children}</div>;
}
