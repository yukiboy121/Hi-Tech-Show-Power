"use client";

import { Suspense } from "react";
import { usePwaInstall } from "@/components/pwa-install-provider";
import AppContact from "@/components/app/app-contact";
import WebContact from "@/components/web/web-contact";

type ContactUser = { name: string; email: string } | null;

function ContactSwitch({ user }: { user: ContactUser }) {
  const { isAppMode, isAppModeReady } = usePwaInstall();
  if (!isAppModeReady) return <WebContact />;
  return isAppMode ? <AppContact user={user} /> : <WebContact />;
}

export default function ContactView({ user }: { user: ContactUser }) {
  return (
    <Suspense fallback={<div className="py-10 text-center text-sm text-slate-500">Loading...</div>}>
      <ContactSwitch user={user} />
    </Suspense>
  );
}
