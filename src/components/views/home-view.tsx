"use client";

import { usePwaInstall } from "@/components/pwa-install-provider";
import AppHome from "@/components/app/app-home";
import WebHome from "@/components/web/web-home";

export default function HomeView() {
  const { isAppMode, isAppModeReady } = usePwaInstall();
  if (!isAppModeReady) return <WebHome />;
  return isAppMode ? <AppHome /> : <WebHome />;
}
