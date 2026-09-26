import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function getButtonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
): string {
  const base =
    "inline-flex items-center justify-center rounded-full font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#b31322] disabled:pointer-events-none disabled:opacity-45";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-[#b31322] text-white hover:bg-[#8d0f1b]",
    secondary: "border border-black/10 bg-white text-neutral-950 hover:border-neutral-950",
    ghost: "text-neutral-700 hover:bg-black/5 hover:text-neutral-950",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "min-h-10 px-4 text-xs",
    md: "min-h-11 px-5 text-sm",
    lg: "min-h-13 px-6 text-sm",
  };

  return `${base} ${variants[variant]} ${sizes[size]}`;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return <button className={`${getButtonClasses(variant, size)} ${className}`} {...props} />;
}
