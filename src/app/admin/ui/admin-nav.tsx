"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview", icon: "📊", exact: true },
  { href: "/admin/orders", label: "Orders", icon: "📋" },
  { href: "/admin/repairs", label: "Repairs", icon: "🔧" },
  { href: "/admin/sites", label: "Sites", icon: "📍" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminNav() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white md:block">
        <div className="sticky top-[57px] p-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Admin Panel</p>
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive(l.href, l.exact)
                    ? "bg-brand-50 font-medium text-brand-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>{l.icon}</span> {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-slate-200 bg-white md:hidden">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] ${
              isActive(l.href, l.exact) ? "text-brand-700 font-medium" : "text-slate-500"
            }`}
          >
            <span className="text-base">{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
