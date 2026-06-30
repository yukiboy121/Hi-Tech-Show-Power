"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import InstallAppButton from "@/components/install-app-button";
import { usePwaInstall } from "@/components/pwa-install-provider";
import { business } from "@/lib/business";
import { IconPhone, IconMenu, IconClose, IconArrowRight } from "@/components/icons";

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
  const { isStandalone } = usePwaInstall();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const hideCallBar = pathname.startsWith("/admin");

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Top promo bar */}
      <div className="bg-brand-500 px-4 py-2.5 text-center text-[12px] font-medium text-white sm:text-[13px]">
        <span className="font-bold uppercase tracking-wide">{business.serviceHours}</span>
        <span className="mx-2 opacity-40">|</span>
        <a href={`tel:${business.hotlineTel}`} className="hover:underline">
          Hot Line: <strong>{business.hotline}</strong>
        </a>
        <span className="mx-2 hidden opacity-40 sm:inline">|</span>
        <a href={`tel:${business.mobileTel}`} className="hidden hover:underline sm:inline">
          {business.mobile}
        </a>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-separator bg-surface-elevated/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-brand-500 text-[12px] font-bold tracking-tight text-white shadow-sm">
              {business.shortName.slice(0, 2).toUpperCase()}
            </span>
            <span className="truncate text-[15px] font-bold tracking-tight text-label">
              {business.shortName}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {publicLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-[10px] px-3.5 py-2 text-[14px] font-medium transition-colors ${
                  isActive(l.href)
                    ? "bg-brand-500/10 text-brand-500"
                    : "text-secondary-label hover:bg-surface hover:text-label"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="rounded-[10px] border border-separator px-3.5 py-2 text-[13px] font-medium text-brand-500 hover:bg-brand-500/10 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="rounded-[10px] px-3.5 py-2 text-[13px] font-medium text-secondary-label hover:bg-surface transition-colors"
                >
                  Dashboard
                </Link>
                <form action="/api/auth/logout" method="post">
                  <button className="rounded-[10px] bg-label px-3.5 py-2 text-[13px] font-medium text-white hover:opacity-90 transition-opacity">
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-[10px] px-3.5 py-2 text-[13px] font-medium text-secondary-label hover:bg-surface transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-[10px] bg-brand-500 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm hover:bg-brand-600 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen(true)}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-separator active:bg-surface md:hidden transition-colors"
          >
            <IconMenu className="h-5 w-5 text-label" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-hidden rounded-t-[28px] bg-surface-elevated shadow-2xl shadow-black/10">
            <div className="flex items-center justify-between border-b border-separator px-5 py-4">
              <p className="text-[17px] font-bold text-label">{business.shortName}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-surface active:bg-separator transition-colors"
              >
                <IconClose className="h-4 w-4 text-secondary-label" />
              </button>
            </div>
            <nav className="overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="grid grid-cols-2 gap-2.5 py-4">
                {publicLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-[16px] px-4 py-4 text-[14px] font-semibold text-center transition-all active:scale-[0.97] ${
                      isActive(l.href)
                        ? "bg-brand-500 text-white shadow-sm"
                        : "bg-surface text-label active:bg-brand-500/10"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>

              <a
                href={`tel:${business.hotlineTel}`}
                className="flex items-center justify-center gap-2 rounded-[14px] bg-brand-500 py-3.5 text-[14px] font-semibold text-white shadow-sm active:scale-[0.97] transition-all"
              >
                <IconPhone className="h-4 w-4" />
                Call {business.hotline}
              </a>

              {!isStandalone && (
                <div className="mt-2.5">
                  <InstallAppButton variant="primary" fullWidth className="!rounded-[14px] !bg-surface !text-brand-500 !border !border-separator hover:!bg-surface transition-all" />
                </div>
              )}

              <div className="mt-3 space-y-2 border-t border-separator py-4">
                {user ? (
                  <>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between rounded-[14px] bg-brand-500 px-4 py-3.5 text-[14px] font-semibold text-white active:scale-[0.97] transition-all"
                      >
                        Admin Panel
                        <IconArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-[14px] bg-surface px-4 py-3.5 text-[14px] font-medium text-label active:bg-brand-500/10 transition-colors"
                    >
                      Dashboard
                      <IconArrowRight className="h-4 w-4 text-tertiary-label" />
                    </Link>
                    <form action="/api/auth/logout" method="post">
                      <button className="w-full rounded-[14px] bg-label px-4 py-3.5 text-[14px] font-semibold text-white active:opacity-90 transition-opacity">
                        Logout
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="rounded-[14px] border border-separator py-3.5 text-center text-[14px] font-medium text-label active:bg-surface transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className="rounded-[14px] bg-brand-500 py-3.5 text-center text-[14px] font-semibold text-white active:bg-brand-600 transition-colors"
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

      {/* Floating call button */}
      {!hideCallBar && (
        <a
          href={`tel:${business.hotlineTel}`}
          className="fixed bottom-6 right-5 z-50 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/30 active:scale-90 transition-all"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
          aria-label={`Call hotline ${business.hotline}`}
        >
          <IconPhone className="h-6 w-6" />
        </a>
      )}
    </>
  );
}
