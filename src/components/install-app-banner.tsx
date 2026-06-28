"use client";

import { useEffect, useState } from "react";
import { business } from "@/lib/business";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallAppBanner() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    const dismissed = localStorage.getItem("pwa-install-dismissed");
    const inCapacitor =
      typeof window !== "undefined" &&
      !!(window as Window & { Capacitor?: unknown }).Capacitor;
    if (standalone || dismissed || inCapacitor) return;

    const timer = setTimeout(() => setShow(true), 4000);

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
    };
  }, []);

  if (!show || isStandalone) return null;

  async function handleInstall() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setShow(false);
      return;
    }
    setShow(false);
  }

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
              {isIOS
                ? "Tap Share → Add to Home Screen for quick access"
                : `Add ${business.shortName} to your home screen`}
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
        {!isIOS && deferredPrompt && (
          <button
            type="button"
            onClick={handleInstall}
            className="mt-3 w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white active:bg-brand-700"
          >
            Install Now
          </button>
        )}
        {isIOS && (
          <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-center text-xs text-slate-600">
            Safari → <strong>Share</strong> → <strong>Add to Home Screen</strong>
          </p>
        )}
      </div>
    </div>
  );
}
