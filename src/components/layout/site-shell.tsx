import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--ck-bg)] text-[var(--ck-text)]">
      <SiteHeader />

      <div className="flex-1">{children}</div>

      <SiteFooter />
    </div>
  );
}
