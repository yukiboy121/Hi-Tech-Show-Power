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
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close menu"
      />
      <div className="absolute bottom-0 left-0 top-0 flex w-[min(85vw,320px)] animate-[slideInLeft_0.25s_ease-out] flex-col bg-white shadow-2xl">
        <div className="border-b border-slate-100 bg-brand-600 px-5 py-6 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-red-100">
                Navigation
              </p>
              <p className="mt-1 text-lg font-bold">{business.shortName}</p>
              <p className="mt-0.5 text-xs text-red-100">{business.serviceHours}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 active:bg-white/25"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {user ? (
            <div className="px-3 pb-2">
              <Link
                href="/dashboard"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl bg-brand-50 px-4 py-3.5 text-sm transition-all active:scale-[0.98]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-base text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="font-semibold text-brand-900">{user.name}</p>
                  <p className="text-xs text-slate-500">My Account</p>
                </div>
              </Link>
            </div>
          ) : null}

          <div className="px-3 py-1">
            <p className="px-4 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Menu
            </p>
            <Link
              href="/about"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all active:scale-[0.98] active:bg-slate-100"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-base">
                ℹ️
              </span>
              <div>
                <p className="font-semibold text-slate-800">About Us</p>
                <p className="text-xs text-slate-400">Company info & contact</p>
              </div>
            </Link>
          </div>

          {user?.role === "admin" && (
            <div className="px-3 py-1">
              <p className="px-4 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Admin
              </p>
              <Link
                href="/admin"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl bg-brand-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md active:scale-[0.98]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-base">
                  ⚙️
                </span>
                <div>
                  <p>Admin Panel</p>
                  <p className="text-xs font-normal text-red-100">Orders, sites & settings</p>
                </div>
              </Link>
            </div>
          )}

          <div className="mt-2 border-t border-slate-100 px-3 pt-3">
            {user ? (
              <form action="/api/auth/logout" method="post">
                <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition-all active:scale-[0.98] active:bg-slate-100">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-base">
                    🚪
                  </span>
                  Logout
                </button>
              </form>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 active:bg-slate-50"
                >
                  🔑 Login
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white active:bg-brand-700"
                >
                  📝 Register
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 border-t border-slate-100 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {user?.role !== "admin" && (
            <a
              href={`tel:${business.hotlineTel}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-accent-500 py-3.5 text-sm font-bold text-brand-900 active:bg-accent-400"
            >
              📞 Emergency: {business.hotline}
            </a>
          )}
          <div className="rounded-xl bg-brand-900 px-4 py-3.5 text-white">
            <p className="text-[11px] font-bold uppercase tracking-wider text-accent-400">
              {business.serviceHours}
            </p>
            <p className="mt-1 text-sm text-red-100">{business.location}</p>
            <a
              href={`mailto:${business.email}`}
              className="mt-1 block text-sm font-medium text-accent-400"
            >
              {business.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
