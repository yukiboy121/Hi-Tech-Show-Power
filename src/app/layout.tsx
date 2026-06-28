import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hi Tech Show Power Engineering",
  description: "Repairing, sites, and orders management platform.",
};

import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 antialiased">
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur border-b border-slate-200">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-semibold text-slate-900">Hi Tech Show Power Engineering</Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/" className="text-slate-700 hover:text-slate-900">Home</Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-slate-700 hover:text-slate-900">Dashboard</Link>
                  <form action="/api/auth/logout" method="post">
                    <button className="rounded-md bg-slate-900 px-3 py-1.5 text-white">Logout</button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-slate-700 hover:text-slate-900">Login</Link>
                  <Link href="/register" className="rounded-md bg-slate-900 px-3 py-1.5 text-white">Register</Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="min-h-[calc(100vh-56px)]">{children}</main>
      </body>
    </html>
  );
}
