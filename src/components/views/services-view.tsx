"use client";

import { usePwaInstall } from "@/components/pwa-install-provider";
import AppServices from "@/components/app/app-services";
import WebServices from "@/components/web/web-services";

export default function ServicesView() {
  const { isAppMode, isAppModeReady } = usePwaInstall();
  if (!isAppModeReady) return <WebServices />;
  return isAppMode ? <AppServices /> : <WebServices />;
}
