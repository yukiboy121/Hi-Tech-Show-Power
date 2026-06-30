"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome, IconMapPin, IconEdit, IconMenu } from "@/components/icons";

const tabs = [
  { href: "/", label: "Home", icon: IconHome, exact: true },
  { href: "/services", label: "Services", icon: IconWrench },
  { href: "/contact", label: "Request", icon: IconEdit },
];

function IconWrench(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

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
    <nav className="fixed inset-x-0 bottom-0 z-[70] border-t border-separator bg-surface-elevated/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around py-1.5">
        {tabs.map((t) => {
          const active = isActive(t.href, t.exact);
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`group relative flex flex-col items-center gap-0.5 px-4 py-1.5 transition-all active:scale-90 ${
                active ? "text-brand-500" : "text-tertiary-label"
              }`}
            >
              <div className={`flex items-center justify-center rounded-full p-1.5 transition-colors ${
                active ? "bg-brand-500/10" : ""
              }`}>
                <Icon className={`h-[22px] w-[22px] transition-transform ${active ? "scale-105" : ""}`} />
              </div>
              <span className={`text-[10px] font-semibold tracking-tight ${active ? "text-brand-500" : ""}`}>
                {t.label}
              </span>
              {active && <span className="absolute -top-1 h-[3px] w-6 rounded-full bg-brand-500" />}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={onOpenMore}
          className={`group relative flex flex-col items-center gap-0.5 px-4 py-1.5 transition-all active:scale-90 ${
            moreActive ? "text-brand-500" : "text-tertiary-label"
          }`}
        >
          <div className={`flex items-center justify-center rounded-full p-1.5 transition-colors ${
            moreActive ? "bg-brand-500/10" : ""
          }`}>
            <IconMenu className={`h-[22px] w-[22px] ${moreActive ? "scale-105" : ""}`} />
          </div>
          <span className={`text-[10px] font-semibold tracking-tight ${moreActive ? "text-brand-500" : ""}`}>
            More
          </span>
        </button>
      </div>
    </nav>
  );
}
