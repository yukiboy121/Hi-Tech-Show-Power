"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { business } from "@/lib/business";

type NavUser = { name: string; role: "admin" | "user" } | null;

const publicLinks = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/about", label: "About", icon: "ℹ️" },
  { href: "/services", label: "Services", icon: "🔧" },
  { href: "/contact", label: "Contact", icon: "📞" },
];

export default function SiteHeader({ user }: { user: NavUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const hideCallBar = pathname.startsWith("/admin");

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="bg-brand-600 px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
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
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
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
                <Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
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
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 active:bg-slate-50 md:hidden"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-hidden rounded-t-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <p className="font-bold text-brand-900">{business.shortName}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 active:bg-slate-200"
              >
                ✕
              </button>
            </div>
            <nav className="overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="grid grid-cols-2 gap-2">
                {publicLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`flex flex-col items-center gap-1 rounded-2xl p-4 text-sm active:scale-[0.98] ${
                      isActive(l.href)
                        ? "bg-brand-600 font-semibold text-white"
                        : "bg-slate-50 text-slate-700 active:bg-slate-100"
                    }`}
                  >
                    <span className="text-2xl">{l.icon}</span>
                    {l.label}
                  </Link>
                ))}
              </div>

              <a
                href={`tel:${business.hotlineTel}`}
                className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-accent-500 py-4 text-sm font-bold text-brand-900 active:bg-accent-400"
              >
                📞 Call {business.hotline}
              </a>

              <div className="mt-3 space-y-2">
                {user ? (
                  <>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setOpen(false)}
                        className="block rounded-xl border border-brand-200 px-4 py-3.5 text-center text-sm font-medium text-brand-600 active:bg-brand-50"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="block rounded-xl bg-slate-100 px-4 py-3.5 text-center text-sm font-medium text-slate-700 active:bg-slate-200"
                    >
                      Dashboard
                    </Link>
                    <form action="/api/auth/logout" method="post">
                      <button className="w-full rounded-xl bg-brand-900 px-4 py-3.5 text-sm text-white active:bg-brand-700">
                        Logout
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="rounded-xl border border-slate-200 py-3.5 text-center text-sm font-medium active:bg-slate-50"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className="rounded-xl bg-brand-600 py-3.5 text-center text-sm font-semibold text-white active:bg-brand-700"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}

      {!hideCallBar && (
        <a
          href={`tel:${business.hotlineTel}`}
          className="fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-2xl text-white shadow-xl ring-4 ring-brand-600/25 active:scale-95 active:bg-brand-700 md:hidden"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
          aria-label={`Call hotline ${business.hotline}`}
        >
          📞
        </a>
      )}
    </>
  );
}
