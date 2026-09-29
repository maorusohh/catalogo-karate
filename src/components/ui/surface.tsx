import type { ReactNode } from "react";

type SurfaceProps = {
  children: ReactNode;
  variant?: "default" | "soft" | "dark";
  className?: string;
};

export function Surface({ children, variant = "default", className = "" }: SurfaceProps) {
  const variants = {
    default: "site-surface",
    soft: "site-surface-soft",
    dark: "site-surface-dark",
  };

  return <div className={`${variants[variant]} ${className}`}>{children}</div>;
}
