"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { business } from "@/lib/business";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type InstallResult = "installed" | "dismissed" | "guide" | "unavailable";

type PwaInstallContextValue = {
  canPromptInstall: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isStandalone: boolean;
  isAppMode: boolean;
  isAppModeReady: boolean;
  install: () => Promise<InstallResult>;
};

const PwaInstallContext = createContext<PwaInstallContextValue | null>(null);

function detectIOS() {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function detectAndroid() {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

function detectStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function detectInCapacitor() {
  if (typeof window === "undefined") return false;
  return !!(window as Window & { Capacitor?: unknown }).Capacitor;
}

export function usePwaInstall() {
  const ctx = useContext(PwaInstallContext);
  if (!ctx) throw new Error("usePwaInstall must be used within PwaInstallProvider");
  return ctx;
}

function IOSInstallGuide({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="bg-brand-600 px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-lg font-bold">
              HP
            </span>
            <div>
              <p className="font-bold">Install {business.shortName}</p>
              <p className="text-xs text-red-100">2 quick taps in Safari</p>
            </div>
          </div>
        </div>
        <ol className="space-y-4 p-5">
          <li className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
              1
            </span>
            <div>
              <p className="font-semibold text-brand-900">Tap Share</p>
              <p className="mt-0.5 text-sm text-slate-600">
                Bottom of Safari — square with arrow pointing up
              </p>
              <p className="mt-2 rounded-lg bg-slate-100 px-3 py-2 text-center text-2xl">⬆️ 📤</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
              2
            </span>
            <div>
              <p className="font-semibold text-brand-900">Add to Home Screen</p>
              <p className="mt-0.5 text-sm text-slate-600">Scroll down in the menu, then tap Add</p>
            </div>
          </li>
        </ol>
        <div className="border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-brand-600 py-3.5 text-sm font-semibold text-white active:bg-brand-700"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

function AndroidInstallGuide({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="bg-brand-600 px-5 py-4 text-white">
          <p className="font-bold">Install {business.shortName}</p>
          <p className="text-xs text-red-100">Use Chrome menu</p>
        </div>
        <ol className="space-y-4 p-5">
          <li className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
              1
            </span>
            <div>
              <p className="font-semibold text-brand-900">Open Chrome menu</p>
              <p className="mt-0.5 text-sm text-slate-600">Tap ⋮ at the top-right corner</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
              2
            </span>
            <div>
              <p className="font-semibold text-brand-900">Install app</p>
              <p className="mt-0.5 text-sm text-slate-600">Tap &quot;Install app&quot; or &quot;Add to Home screen&quot;</p>
            </div>
          </li>
        </ol>
        <div className="border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-brand-600 py-3.5 text-sm font-semibold text-white active:bg-brand-700"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PwaInstallProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isAppMode, setIsAppMode] = useState(false);
  const [isAppModeReady, setIsAppModeReady] = useState(false);
  const [guide, setGuide] = useState<"ios" | "android" | null>(null);

  useEffect(() => {
    const standalone = detectStandalone();
    const inCapacitor = detectInCapacitor();
    const previewApp =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("app") === "1";

    setIsIOS(detectIOS());
    setIsAndroid(detectAndroid());
    setIsStandalone(standalone || inCapacitor);
    setIsAppMode(standalone || inCapacitor || previewApp);
    setIsAppModeReady(true);

    if (standalone || inCapacitor || previewApp) {
      document.documentElement.classList.add("app-mode");
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const install = useCallback(async (): Promise<InstallResult> => {
    if (isStandalone) return "unavailable";

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      return outcome === "accepted" ? "installed" : "dismissed";
    }

    if (isIOS) {
      setGuide("ios");
      return "guide";
    }

    if (isAndroid) {
      setGuide("android");
      return "guide";
    }

    return "unavailable";
  }, [deferredPrompt, isIOS, isAndroid, isStandalone]);

  const value = useMemo<PwaInstallContextValue>(
    () => ({
      canPromptInstall: Boolean(deferredPrompt) && !isStandalone,
      isIOS,
      isAndroid,
      isStandalone,
      isAppMode,
      isAppModeReady,
      install,
    }),
    [deferredPrompt, isIOS, isAndroid, isStandalone, isAppMode, isAppModeReady, install],
  );

  return (
    <PwaInstallContext.Provider value={value}>
      {children}
      {guide === "ios" && <IOSInstallGuide onClose={() => setGuide(null)} />}
      {guide === "android" && <AndroidInstallGuide onClose={() => setGuide(null)} />}
    </PwaInstallContext.Provider>
  );
}
