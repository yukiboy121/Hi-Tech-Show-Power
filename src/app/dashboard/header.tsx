"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
};

export default function Header({ user }: { user: User | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold text-slate-900">
          Hi Tech Show Power
        </Link>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-900">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>
        <nav className="hidden items-center gap-4 text-sm md:flex">
          <Link href="/" className={`text-slate-700 hover:text-slate-900 ${pathname === "/" ? "font-semibold" : ""}`}>Home</Link>
          {user ? (
            <>
              <Link href="/dashboard" className={`text-slate-700 hover:text-slate-900 ${pathname === "/dashboard" ? "font-semibold" : ""}`}>Dashboard</Link>
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
      {isMenuOpen && (
        <div className="bg-white md:hidden">
          <nav className="flex flex-col items-start gap-1 px-4 pb-4 text-sm">
            <Link href="/" className="w-full rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100">Home</Link>
            {user ? (
              <>
                <Link href="/dashboard" className="w-full rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100">Dashboard</Link>
                <form action="/api/auth/logout" method="post" className="w-full"><button className="w-full rounded-md bg-slate-900 px-3 py-2 text-left text-white">Logout</button></form>
              </>
            ) : (
              <><Link href="/login" className="w-full rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100">Login</Link><Link href="/register" className="w-full rounded-md bg-slate-900 px-3 py-2 text-white">Register</Link></>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}