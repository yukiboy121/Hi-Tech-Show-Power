"use client";

import { usePwaInstall } from "@/components/pwa-install-provider";
import AppAbout from "@/components/app/app-about";
import WebAbout from "@/components/web/web-about";

export default function AboutView() {
  const { isAppMode, isAppModeReady } = usePwaInstall();
  if (!isAppModeReady) return <WebAbout />;
  return isAppMode ? <AppAbout /> : <WebAbout />;
}
