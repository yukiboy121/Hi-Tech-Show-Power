"use client";

import { Suspense } from "react";
import { usePwaInstall } from "@/components/pwa-install-provider";
import AppContact from "@/components/app/app-contact";
import WebContact from "@/components/web/web-contact";

function ContactSwitch() {
  const { isAppMode, isAppModeReady } = usePwaInstall();
  if (!isAppModeReady) return <WebContact />;
  return isAppMode ? <AppContact /> : <WebContact />;
}

export default function ContactView() {
  return (
    <Suspense fallback={<div className="py-10 text-center text-sm text-slate-500">Loading...</div>}>
      <ContactSwitch />
    </Suspense>
  );
}
