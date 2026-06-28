"use client";

import { usePathname } from "next/navigation";
import { business } from "@/lib/business";

const titles: Record<string, string> = {
  "/": "Home",
  "/services": "Services",
  "/contact": "Request Service",
  "/about": "About Us",
  "/login": "Login",
  "/register": "Register",
  "/dashboard": "My Account",
};

export default function AppHeader() {
  const pathname = usePathname();
  const title = titles[pathname] || business.shortName;
  const showBack = pathname !== "/";

  return (
    <header className="sticky top-0 z-50 border-b border-brand-700/20 bg-brand-600 text-white pt-[env(safe-area-inset-top)]">
      <div className="flex h-14 items-center gap-3 px-4">
        {showBack ? (
          <button
            type="button"
            onClick={() => history.back()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 active:bg-white/25"
            aria-label="Go back"
          >
            ←
          </button>
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-sm font-bold">
            HP
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold">{title}</p>
          {pathname === "/" && (
            <p className="truncate text-[11px] text-red-100">{business.serviceHours}</p>
          )}
        </div>
        <a
          href={`tel:${business.hotlineTel}`}
          className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-accent-500 px-3 text-xs font-bold text-brand-900 active:bg-accent-400"
        >
          📞 Call
        </a>
      </div>
    </header>
  );
}
