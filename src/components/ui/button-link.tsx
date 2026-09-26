import Link from "next/link";
import type { ComponentProps } from "react";

import { getButtonClasses, type ButtonSize, type ButtonVariant } from "@/components/ui/button";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonLinkProps) {
  return <Link className={`${getButtonClasses(variant, size)} ${className}`} {...props} />;
}
