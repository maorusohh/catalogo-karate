import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--ck-bg)] text-[var(--ck-text)]">
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-full bg-white px-4 py-3 text-sm font-semibold text-neutral-950 shadow-xl focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al contenido principal
      </a>

      <SiteHeader />

      <div id="main-content" tabIndex={-1} className="flex-1">
        {children}
      </div>

      <SiteFooter />
    </div>
  );
}
