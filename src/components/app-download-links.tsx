"use client";

import InstallAppButton from "@/components/install-app-button";
import { usePwaInstall } from "@/components/pwa-install-provider";

type AppDownloadLinksProps = {
  layout?: "row" | "column";
  className?: string;
};

export default function AppDownloadLinks({ layout = "row", className = "" }: AppDownloadLinksProps) {
  const { isIOS, isAndroid, isStandalone } = usePwaInstall();

  if (isStandalone) return null;

  const showBoth = !isIOS && !isAndroid;

  return (
    <div className={className}>
      <div
        className={`flex flex-wrap gap-3 ${layout === "column" ? "flex-col items-stretch" : "items-center"}`}
      >
        {(showBoth || isIOS) && (
          <InstallAppButton platform={showBoth ? "ios" : "auto"} variant="store" fullWidth={layout === "column"} />
        )}
        {(showBoth || isAndroid) && (
          <InstallAppButton
            platform={showBoth ? "android" : "auto"}
            variant="primary"
            fullWidth={layout === "column"}
          />
        )}
      </div>
      <p className="mt-3 text-xs text-red-200/80">
        Tap the button — Android opens install instantly. iPhone shows quick steps.
      </p>
    </div>
  );
}
