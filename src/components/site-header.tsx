"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { business } from "@/lib/business";

type NavUser = { name: string; role: "admin" | "user" } | null;

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader({ user }: { user: NavUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const hideCallBar = pathname.startsWith("/admin");

  return (
    <>
      <div className="bg-brand-600 px-4 py-1.5 text-center text-xs font-medium text-white sm:text-sm">
        <span className="font-bold uppercase">{business.serviceHours}</span>
        <span className="mx-2 hidden sm:inline">|</span>
        <a href={`tel:${business.hotlineTel}`} className="hover:underline">
          Hot Line: <strong>{business.hotline}</strong>
        </a>
        <span className="mx-2 hidden sm:inline">|</span>
        <a href={`tel:${business.mobileTel}`} className="hidden hover:underline sm:inline">
          {business.mobile}
        </a>
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              HP
            </span>
            <span className="truncate text-sm font-semibold leading-tight text-brand-900 sm:text-base">
              {business.shortName}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {publicLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive(l.href)
                    ? "bg-brand-50 font-medium text-brand-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="rounded-lg border border-brand-200 px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Dashboard
                </Link>
                <form action="/api/auth/logout" method="post">
                  <button className="rounded-lg bg-brand-900 px-3 py-2 text-sm text-white hover:bg-brand-700">
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-accent-500 px-3 py-2 text-sm font-medium text-brand-900 hover:bg-accent-400"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 md:hidden"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
            <nav className="flex flex-col gap-1">
              {publicLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-3 text-sm ${
                    isActive(l.href) ? "bg-brand-50 font-medium text-brand-600" : "text-slate-700"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <a
                href={`tel:${business.hotlineTel}`}
                className="rounded-lg bg-brand-600 px-3 py-3 text-center text-sm font-bold text-white"
              >
                📞 Call {business.hotline}
              </a>
              <hr className="my-2 border-slate-100" />
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link href="/admin" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm text-brand-600">
                      Admin Panel
                    </Link>
                  )}
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm text-slate-700">
                    Dashboard
                  </Link>
                  <form action="/api/auth/logout" method="post">
                    <button className="w-full rounded-lg bg-brand-900 px-3 py-3 text-left text-sm text-white">
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm text-slate-700">
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="rounded-lg bg-accent-500 px-3 py-3 text-sm font-medium text-brand-900"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {!hideCallBar && (
        <a
          href={`tel:${business.hotlineTel}`}
          className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-2xl text-white shadow-lg ring-4 ring-brand-600/30 hover:bg-brand-700 md:hidden"
          aria-label={`Call hotline ${business.hotline}`}
        >
          📞
        </a>
      )}
    </>
  );
}
