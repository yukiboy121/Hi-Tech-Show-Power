"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { business } from "@/lib/business";

const links = [
  { href: "/admin", label: "Overview", icon: "📊", exact: true },
  { href: "/admin/orders", label: "Orders", icon: "📋" },
  { href: "/admin/repairs", label: "Repairs", icon: "🔧" },
  { href: "/admin/sites", label: "Sites", icon: "📍" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

function NavLinks({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav className={className}>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm transition-all active:scale-[0.98] ${
            isActive(l.href, l.exact)
              ? "bg-brand-600 font-semibold text-white shadow-md shadow-brand-600/20"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <span className="text-lg">{l.icon}</span>
          <span>{l.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export default function AdminNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  const currentPage = links.find((l) =>
    l.exact ? pathname === l.href : pathname.startsWith(l.href)
  );

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white lg:block">
        <div className="sticky top-0 flex h-screen flex-col p-4">
          <div className="mb-6 rounded-xl bg-brand-600 p-4 text-white">
            <p className="text-xs font-bold uppercase tracking-wider text-red-100">Admin Panel</p>
            <p className="mt-1 text-sm font-semibold">{business.shortName}</p>
          </div>
          <NavLinks className="flex flex-1 flex-col gap-1.5" />
          <Link
            href="/"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            ← Back to Website
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white active:bg-slate-50"
            aria-label="Open admin menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-sm font-bold text-brand-900">
              {currentPage?.icon} {currentPage?.label || "Admin"}
            </p>
          </div>
          <a
            href={`tel:${business.hotlineTel}`}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-lg text-white active:bg-brand-700"
            aria-label="Call hotline"
          >
            📞
          </a>
        </div>
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute bottom-0 left-0 top-0 flex w-[min(85vw,320px)] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Admin Menu</p>
                <p className="text-sm font-semibold text-slate-900">{business.shortName}</p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 active:bg-slate-200"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <NavLinks onNavigate={() => setDrawerOpen(false)} className="flex flex-col gap-1.5" />
            </div>
            <div className="space-y-2 border-t border-slate-100 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <a
                href={`tel:${business.hotlineTel}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-accent-500 py-3.5 text-sm font-bold text-brand-900 active:bg-accent-400"
              >
                📞 Hot Line: {business.hotline}
              </a>
              <Link
                href="/"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-center rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 active:bg-slate-50"
              >
                ← Back to Website
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile bottom quick nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-200 bg-white/95 backdrop-blur-md lg:hidden pb-[env(safe-area-inset-bottom)]">
        {links.slice(0, 4).map((l) => {
          const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
                active ? "text-brand-600" : "text-slate-500"
              }`}
            >
              <span className={`text-lg ${active ? "scale-110" : ""}`}>{l.icon}</span>
              {l.label}
              {active && <span className="h-1 w-1 rounded-full bg-brand-600" />}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium text-slate-500"
        >
          <span className="text-lg">☰</span>
          More
        </button>
      </nav>
    </>
  );
}
