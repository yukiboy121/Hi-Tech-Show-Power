"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5">
        {tabs.map((t) => {
          const active = isActive(t.href, t.exact);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors ${
                active ? "text-brand-600" : "text-slate-500"
              }`}
            >
              <span className={`text-xl ${active ? "scale-110" : ""}`}>{t.icon}</span>
              {t.label}
            </Link>
          );
        })}
        <a
          href={`tel:${business.hotlineTel}`}
          className="flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold text-slate-500"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-base text-white">
            📞
          </span>
          Hotline
        </a>
        <button
          type="button"
          onClick={onOpenMore}
          className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold ${
            pathname === "/about" || pathname === "/login" || pathname === "/register"
              ? "text-brand-600"
              : "text-slate-500"
          }`}
        >
          <span className="text-xl">☰</span>
          More
        </button>
      </div>
    </nav>
  );
}
