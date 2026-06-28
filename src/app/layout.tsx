import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hi Tech Show Power Engineering",
  description: "Repairing, sites, and orders management platform.",
};

import { getCurrentUser } from "@/lib/auth";
import Header from "./ui/header";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 antialiased">
        <Header user={user} />
        <main className="min-h-[calc(100vh-56px)]">{children}</main>
      </body>
    </html>
  );
}
