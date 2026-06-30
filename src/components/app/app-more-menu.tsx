"use client";

import Link from "next/link";
import { useEffect } from "react";
import { business } from "@/lib/business";

type NavUser = { name: string; email?: string; role: "admin" | "user" } | null;

export default function AppMoreMenu({
  user,
  onClose,
}: {
  user: NavUser;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[65] lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-label="Close menu"
      />
      <div className="absolute bottom-0 left-0 top-0 flex w-[min(85vw,320px)] animate-[slideInLeft_0.35s_cubic-bezier(0.16,1,0.3,1)] flex-col bg-surface-elevated">
        <div className="flex items-center justify-between px-5 pt-[max(3rem,env(safe-area-inset-top))] pb-5">
          <div className="flex items-center gap-3">
            {user ? (
              <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-brand-500 text-[15px] font-semibold text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-surface text-base">
                👤
              </span>
            )}
            <div>
              <p className="text-[17px] font-semibold leading-5 tracking-[-0.022em] text-label">
                {business.shortName}
              </p>
              <p className="mt-0.5 text-[11px] font-medium tracking-[-0.008em] text-tertiary-label">
                {business.serviceHours}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-surface text-[13px] text-secondary-label active:bg-separator"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-2">
          {user ? (
            <Link
              href="/dashboard"
              onClick={onClose}
              className="group relative mb-[10px] flex items-center gap-3.5 overflow-hidden rounded-2xl bg-brand-50 px-4 py-[14px] active:opacity-80"
            >
              <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-brand-500 text-[15px] font-semibold text-white shadow-sm">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <div className="flex-1">
                <p className="text-[15px] font-semibold tracking-[-0.022em] text-label">
                  {user.name}
                </p>
                <p className="mt-0.5 text-[13px] tracking-[-0.012em] text-secondary-label">
                  My Account
                </p>
              </div>
              <span className="text-[15px] text-tertiary-label">›</span>
            </Link>
          ) : null}

          <div className="mb-[6px] flex items-center gap-2 px-4 pb-1 pt-2">
            <span className="h-[3px] w-[3px] rounded-full bg-tertiary-label" />
            <p className="text-[12px] font-medium uppercase tracking-[0.02em] text-tertiary-label">
              Menu
            </p>
          </div>

          <Link
            href="/about"
            onClick={onClose}
            className="flex items-center gap-3.5 rounded-[14px] px-4 py-[13px] active:bg-surface"
          >
            <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-surface text-[15px]">
              ℹ️
            </span>
            <div className="flex-1">
              <p className="text-[15px] font-normal tracking-[-0.022em] text-label">
                About Us
              </p>
              <p className="mt-0.5 text-[12px] tracking-[-0.008em] text-tertiary-label">
                Company info & contact
              </p>
            </div>
            <span className="text-[15px] text-tertiary-label">›</span>
          </Link>

          {user?.role === "admin" && (
            <>
              <div className="mb-[6px] mt-2 flex items-center gap-2 px-4 pb-1 pt-2">
                <span className="h-[3px] w-[3px] rounded-full bg-tertiary-label" />
                <p className="text-[12px] font-medium uppercase tracking-[0.02em] text-tertiary-label">
                  Admin
                </p>
              </div>
              <Link
                href="/admin"
                onClick={onClose}
                className="flex items-center gap-3.5 rounded-[14px] bg-brand-500 px-4 py-[14px] active:bg-brand-600"
              >
                <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-white/20 text-[15px]">
                  ⚙️
                </span>
                <div className="flex-1">
                  <p className="text-[15px] font-semibold tracking-[-0.022em] text-white">
                    Admin Panel
                  </p>
                  <p className="mt-0.5 text-[12px] tracking-[-0.008em] text-white/70">
                    Orders, sites & settings
                  </p>
                </div>
                <span className="text-[15px] text-white/50">›</span>
              </Link>
            </>
          )}
        </div>

        <div className="border-t border-separator px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {user ? (
            <form action="/api/auth/logout" method="post">
              <button className="flex w-full items-center gap-3.5 rounded-[14px] px-4 py-[13px] active:bg-surface">
                <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-surface text-[15px]">
                  🚪
                </span>
                <span className="text-[15px] font-normal tracking-[-0.022em] text-system-red">
                  Logout
                </span>
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-2 px-4 py-2">
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-[14px] border border-separator py-[13px] text-[15px] font-semibold tracking-[-0.022em] text-label active:bg-surface"
              >
                🔑 Login
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-[14px] bg-brand-500 py-[13px] text-[15px] font-semibold tracking-[-0.022em] text-white active:bg-brand-600"
              >
                📝 Register
              </Link>
            </div>
          )}

          {user?.role !== "admin" && (
            <div className="px-4 pt-2">
              <a
                href={`tel:${business.hotlineTel}`}
                className="flex items-center justify-center gap-2 rounded-full bg-system-green/10 py-3 text-[14px] font-semibold tracking-[-0.012em] text-system-green active:bg-system-green/15"
              >
                📞 Emergency: {business.hotline}
              </a>
            </div>
          )}

          <div className="mt-3 rounded-2xl bg-surface px-5 py-[14px]">
            <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-brand-500">
              {business.serviceHours}
            </p>
            <p className="mt-1 text-[14px] tracking-[-0.012em] text-secondary-label">
              {business.location}
            </p>
            <a
              href={`mailto:${business.email}`}
              className="mt-1 block text-[14px] font-medium tracking-[-0.012em] text-brand-500"
            >
              {business.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
