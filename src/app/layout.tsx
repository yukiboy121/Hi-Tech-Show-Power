import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import SiteChrome from "@/components/site-chrome";
import PwaInstallProvider from "@/components/pwa-install-provider";
import { cookies } from "next/headers";
import { getCurrentUser, SESSION_COOKIE, type SessionUser } from "@/lib/auth";
import { business } from "@/lib/business";

export const metadata: Metadata = {
  title: business.name,
  description: business.description,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: business.shortName,
  },
  applicationName: business.shortName,
  icons: {
    icon: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#d32f2f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const store = cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  let navUser: SessionUser | null = null;
  if (token) {
    try {
      navUser = await getCurrentUser();
    } catch {
      // DB unavailable — render as guest
    }
  }
  const displayUser = navUser ? { name: navUser.name, email: navUser.email, role: navUser.role } : null;

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased">
        <PwaInstallProvider>
          <SiteChrome user={displayUser}>{children}</SiteChrome>
        </PwaInstallProvider>
      </body>
    </html>
  );
}
