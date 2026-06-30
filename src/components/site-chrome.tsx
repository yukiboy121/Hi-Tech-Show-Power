"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import InstallAppBanner from "@/components/install-app-banner";
import AppShell from "@/components/app/app-shell";
import { usePwaInstall } from "@/components/pwa-install-provider";

type NavUser = { name: string; email?: string; phone?: string | null; avatarUrl?: string | null; role: "admin" | "user" } | null;

const BARE_ROUTES = ["/admin"];

export default function SiteChrome({
  user,
  children,
}: {
  user: NavUser;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { isAppMode, isAppModeReady } = usePwaInstall();

  if (BARE_ROUTES.some((r) => pathname.startsWith(r))) {
    return <>{children}</>;
  }

  if (!isAppModeReady) {
    return (
      <>
        <SiteHeader user={user} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </>
    );
  }

  if (isAppMode) {
    return <AppShell user={user}>{children}</AppShell>;
  }

  return (
    <>
      <SiteHeader user={user} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <InstallAppBanner />
    </>
  );
}
