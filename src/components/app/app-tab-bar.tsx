"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { business } from "@/lib/business";

const tabs = [
  { href: "/", label: "Home", icon: "🏠", exact: true },
  { href: "/services", label: "Services", icon: "🔧" },
  { href: "/contact", label: "Request", icon: "📋" },
];

export default function AppTabBar({ onOpenMore }: { onOpenMore: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const moreActive =
    pathname === "/about" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/dashboard" ||
    pathname.startsWith("/admin");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[70] border-t border-slate-200 bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4">
        {tabs.map((t) => {
          const active = isActive(t.href, t.exact);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors active:bg-slate-50 ${
                active ? "text-brand-600" : "text-slate-500"
              }`}
            >
              <span className={`text-xl ${active ? "scale-110" : ""}`}>{t.icon}</span>
              {t.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={onOpenMore}
          className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors active:bg-slate-50 ${
            moreActive ? "text-brand-600" : "text-slate-500"
          }`}
        >
          <span className="text-xl">☰</span>
          More
        </button>
      </div>
    </nav>
  );
}
