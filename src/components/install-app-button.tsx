"use client";

import { useState } from "react";
import { usePwaInstall } from "@/components/pwa-install-provider";
import { business } from "@/lib/business";

type InstallAppButtonProps = {
  variant?: "primary" | "store" | "outline";
  platform?: "auto" | "ios" | "android";
  className?: string;
  fullWidth?: boolean;
};

export default function InstallAppButton({
  variant = "primary",
  platform = "auto",
  className = "",
  fullWidth = false,
}: InstallAppButtonProps) {
  const { canPromptInstall, isIOS, isAndroid, isStandalone, install } = usePwaInstall();
  const [loading, setLoading] = useState(false);

  const { ios, android } = business.appDownloads;
  const storeUrl =
    platform === "ios" ? ios : platform === "android" ? android : isIOS ? ios : isAndroid ? android : "";

  if (isStandalone) return null;

  if (storeUrl) {
    const label = platform === "ios" || (platform === "auto" && isIOS) ? "App Store" : "Google Play";
    const sublabel = label === "App Store" ? "Download on the" : "Get it on";
    const icon = label === "App Store" ? "🍎" : "▶";

    return (
      <a
        href={storeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex min-w-[10.5rem] items-center gap-3 rounded-xl border border-white/20 bg-black px-4 py-2.5 text-white transition hover:bg-black/90 active:scale-[0.98] ${fullWidth ? "w-full justify-center" : ""} ${className}`}
      >
        <span className="shrink-0 text-2xl leading-none">{icon}</span>
        <span className="text-left leading-tight">
          <span className="block text-[10px] uppercase tracking-wide opacity-80">{sublabel}</span>
          <span className="block text-sm font-semibold">{label}</span>
        </span>
      </a>
    );
  }

  const label =
    platform === "ios"
      ? "Install on iPhone"
      : platform === "android"
        ? "Install on Android"
        : canPromptInstall
          ? "Install App"
          : isIOS
            ? "Install on iPhone"
            : "Install App";

  const styles = {
    primary:
      "bg-accent-500 text-brand-900 hover:bg-accent-400 active:bg-accent-300 font-bold",
    store: "bg-black text-white border border-white/20 hover:bg-black/90 font-semibold",
    outline:
      "border border-white/40 text-white hover:bg-white/10 active:bg-white/20 font-semibold",
  };

  async function handleClick() {
    setLoading(true);
    try {
      await install();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm transition active:scale-[0.98] disabled:opacity-70 ${styles[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      <span className="text-lg">📲</span>
      {loading ? "Opening…" : label}
    </button>
  );
}
