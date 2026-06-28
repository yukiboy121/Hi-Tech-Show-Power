"use client";

import Link from "next/link";
import { business } from "@/lib/business";

type NavUser = { name: string; role: "admin" | "user" } | null;

export default function AppMoreMenu({
  user,
  onClose,
}: {
  user: NavUser;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[65]">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close menu"
      />
      <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-hidden rounded-t-3xl bg-white shadow-2xl pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Menu</p>
            <p className="text-sm font-semibold text-slate-900">{business.shortName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 active:bg-slate-200"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2 overflow-y-auto p-4">
          <Link
            href="/about"
            onClick={onClose}
            className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4 active:bg-slate-100"
          >
            <span className="text-2xl">ℹ️</span>
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
                  className="flex items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-4 active:bg-brand-100"
                >
                  <span className="text-2xl">⚙️</span>
                  <div>
                    <p className="font-semibold text-brand-900">Admin Panel</p>
                    <p className="text-xs text-brand-600">Orders, sites & settings</p>
                  </div>
                </Link>
              )}
              <Link
                href="/dashboard"
                onClick={onClose}
                className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4 active:bg-slate-100"
              >
                <span className="text-2xl">👤</span>
                <div>
                  <p className="font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">My account</p>
                </div>
              </Link>
              <form action="/api/auth/logout" method="post">
                <button className="w-full rounded-2xl bg-slate-900 px-4 py-4 text-sm font-semibold text-white active:bg-slate-700">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={onClose}
                className="rounded-2xl border border-slate-200 py-4 text-center text-sm font-semibold active:bg-slate-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="rounded-2xl bg-brand-600 py-4 text-center text-sm font-semibold text-white active:bg-brand-700"
              >
                Register
              </Link>
            </div>
          )}

          <div className="rounded-2xl bg-brand-900 p-4 text-white">
            <p className="text-xs font-bold uppercase text-accent-400">{business.serviceHours}</p>
            <p className="mt-1 text-sm text-red-100">{business.location}</p>
            <a
              href={`mailto:${business.email}`}
              className="mt-2 block text-sm text-accent-400"
            >
              {business.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
