"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentType } from "react";
import AdminNotifications from "./admin-notifications";
import { business } from "@/lib/business";
import {
  IconChart,
  IconClipboard,
  IconMenu,
  IconSettings,
  IconWrench,
  IconMapPin,
  IconChevronLeft,
} from "@/components/icons";

type IconComponent = ComponentType<{ className?: string }>;

const links: {
  href: string;
  label: string;
  icon: IconComponent;
  exact?: boolean;
}[] = [
  { href: "/admin", label: "Overview", icon: IconChart, exact: true },
  { href: "/admin/orders", label: "Orders", icon: IconClipboard },
  { href: "/admin/repairs", label: "Repairs", icon: IconWrench },
  { href: "/admin/sites", label: "Sites", icon: IconMapPin },
  { href: "/admin/settings", label: "Settings", icon: IconSettings },
];

const bottomTabs = links.slice(0, 4);

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
      {links.map((l) => {
        const Icon = l.icon;
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm transition-all active:scale-[0.98] ${
              isActive(l.href, l.exact)
                ? "bg-brand-600 font-semibold text-white shadow-md shadow-brand-600/20"
                : "text-slate-700 hover:bg-slate-100 active:bg-slate-100"
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span>{l.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  const currentPage = links.find((l) =>
    l.exact ? pathname === l.href : pathname.startsWith(l.href)
  );
  const CurrentIcon = currentPage?.icon;
  const moreActive = links.slice(4).some((l) =>
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
      <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white lg:block">
        <div className="sticky top-0 flex h-screen flex-col p-4">
          <div className="mb-6 rounded-xl bg-brand-600 p-4 text-white">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-100">Admin Panel</p>
                <p className="mt-1 text-sm font-semibold">{business.shortName}</p>
              </div>
              <AdminNotifications />
            </div>
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

      <div className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => history.back()}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white active:bg-slate-50"
              aria-label="Go back"
            >
              <IconChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white active:bg-slate-50"
              aria-label="Open admin menu"
            >
              <IconMenu className="h-5 w-5" />
            </button>
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5">
            {CurrentIcon && <CurrentIcon className="h-4 w-4 shrink-0 text-brand-600" />}
            <p className="truncate text-sm font-bold text-brand-900">
              {currentPage?.label || "Admin"}
            </p>
          </div>
          <AdminNotifications />
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute bottom-0 left-0 top-0 flex w-[min(85vw,320px)] animate-[slideInLeft_0.25s_ease-out] flex-col bg-white shadow-2xl">
            <div className="border-b border-slate-100 bg-brand-600 px-5 py-5 text-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-red-100">Admin Menu</p>
                  <p className="mt-1 text-base font-semibold">{business.shortName}</p>
                  <p className="mt-0.5 text-xs text-red-100">{business.serviceHours}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 active:bg-white/25"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <NavLinks onNavigate={() => setDrawerOpen(false)} className="flex flex-col gap-1.5" />
            </div>
            <div className="border-t border-slate-100 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
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

      <nav className="fixed inset-x-0 bottom-0 z-[70] flex border-t border-slate-200 bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] lg:hidden">
        {bottomTabs.map((l) => {
          const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors active:bg-slate-50 ${
                active ? "text-brand-600" : "text-slate-500"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "scale-110" : ""}`} />
              {l.label}
              {active && <span className="h-1 w-1 rounded-full bg-brand-600" />}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors active:bg-slate-50 ${
            moreActive ? "text-brand-600" : "text-slate-500"
          }`}
        >
          <IconMenu className={`h-5 w-5 ${moreActive ? "scale-110" : ""}`} />
          More
          {moreActive && <span className="h-1 w-1 rounded-full bg-brand-600" />}
        </button>
      </nav>
    </>
  );
}
