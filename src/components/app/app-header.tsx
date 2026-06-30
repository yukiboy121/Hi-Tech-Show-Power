"use client";

import { usePathname } from "next/navigation";
import { business } from "@/lib/business";
import { IconChevronLeft, IconPhone } from "@/components/icons";

type NavUser = { name: string; role: "admin" | "user" } | null;

const titles: Record<string, string> = {
  "/": "Home",
  "/services": "Services",
  "/contact": "Request Service",
  "/about": "About Us",
  "/login": "Login",
  "/register": "Register",
  "/dashboard": "My Account",
};

export default function AppHeader({ user }: { user?: NavUser }) {
  const pathname = usePathname();
  const title = titles[pathname] || business.shortName;
  const showBack = pathname !== "/";
  const showHotline = user?.role !== "admin";

  return (
    <header className="sticky top-0 z-50 border-b border-separator bg-surface-elevated/80 shadow-sm backdrop-blur-xl pt-[env(safe-area-inset-top)]">
      <div className="flex h-12 items-center justify-between px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {showBack ? (
            <button
              type="button"
              onClick={() => history.back()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500/10 active:bg-brand-500/20 transition-colors"
              aria-label="Go back"
            >
              <IconChevronLeft className="h-5 w-5 text-brand-500" />
            </button>
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500/10">
              <span className="text-sm font-bold tracking-tight text-brand-500">
                {business.shortName.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold tracking-tight text-label">
              {title}
            </h1>
            {pathname === "/" && (
              <p className="truncate text-[11px] font-medium text-secondary-label">
                {business.serviceHours}
              </p>
            )}
          </div>
        </div>
        {showHotline && (
          <a
            href={`tel:${business.hotlineTel}`}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-brand-500 px-4 text-sm font-semibold text-white shadow-sm active:bg-brand-600 transition-colors"
          >
            <IconPhone className="h-4 w-4" />
            Call
          </a>
        )}
      </div>
    </header>
  );
}
