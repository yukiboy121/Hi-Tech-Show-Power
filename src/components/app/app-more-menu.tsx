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
        <div className="border-b border-slate-100 bg-brand-600 px-5 py-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-red-100">Menu</p>
              <p className="mt-1 text-base font-semibold">{business.shortName}</p>
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

        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          <Link
            href="/about"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm transition-all active:scale-[0.98] active:bg-slate-100"
          >
            <span className="text-xl">ℹ️</span>
            <div>
              <p className="font-semibold text-slate-900">About Us</p>
              <p className="text-xs text-slate-500">Company info & contact</p>
            </div>
          </Link>

          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl bg-brand-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-brand-600/20 active:scale-[0.98] active:bg-brand-700"
                >
                  <span className="text-xl">⚙️</span>
                  <div>
                    <p>Admin Panel</p>
                    <p className="text-xs font-normal text-red-100">Orders, sites & settings</p>
                  </div>
                </Link>
              )}
              <Link
                href="/dashboard"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm transition-all active:scale-[0.98] active:bg-slate-100"
              >
                <span className="text-xl">👤</span>
                <div>
                  <p className="font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">My account</p>
                </div>
              </Link>
              <form action="/api/auth/logout" method="post">
                <button className="w-full rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white active:bg-slate-700">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={onClose}
                className="rounded-xl border border-slate-200 py-3.5 text-center text-sm font-semibold active:bg-slate-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="rounded-xl bg-brand-600 py-3.5 text-center text-sm font-semibold text-white active:bg-brand-700"
              >
                Register
              </Link>
            </div>
          )}

          {user?.role !== "admin" && (
            <a
              href={`tel:${business.hotlineTel}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-accent-500 py-3.5 text-sm font-bold text-brand-900 active:bg-accent-400"
            >
              📞 Emergency: {business.hotline}
            </a>
          )}

          <div className="rounded-xl bg-brand-900 p-4 text-white">
            <p className="text-xs font-bold uppercase text-accent-400">{business.serviceHours}</p>
            <p className="mt-1 text-sm text-red-100">{business.location}</p>
            <a href={`mailto:${business.email}`} className="mt-2 block text-sm text-accent-400">
              {business.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
