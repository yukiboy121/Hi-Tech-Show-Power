"use client";

import { useEffect, useState } from "react";
import InstallAppButton from "@/components/install-app-button";
import { usePwaInstall } from "@/components/pwa-install-provider";
import { business } from "@/lib/business";

export default function InstallAppBanner() {
  const { canPromptInstall, isIOS, isStandalone } = usePwaInstall();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isStandalone) return;

    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) return;

    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, [isStandalone]);

  if (!show || isStandalone) return null;

  function dismiss() {
    localStorage.setItem("pwa-install-dismissed", "1");
    setShow(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[55] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:bottom-4 md:left-auto md:right-4 md:max-w-sm md:p-0">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl ring-1 ring-black/5">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">
            HP
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-brand-900">Install App</p>
            <p className="mt-0.5 text-xs text-slate-600">
              {canPromptInstall
                ? "One tap to add to your home screen"
                : isIOS
                  ? "Tap below — we’ll show you how"
                  : `Add ${business.shortName} to your phone`}
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="shrink-0 text-slate-400 hover:text-slate-600"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
        <div className="mt-3">
          <InstallAppButton variant="primary" fullWidth className="!bg-brand-600 !text-white hover:!bg-brand-700" />
        </div>
      </div>
    </div>
  );
}
