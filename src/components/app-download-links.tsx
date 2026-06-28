import type { ReactNode } from "react";
import { business } from "@/lib/business";

type AppDownloadLinksProps = {
  layout?: "row" | "column";
  className?: string;
};

function StoreBadge({
  href,
  label,
  sublabel,
  icon,
}: {
  href: string;
  label: string;
  sublabel: string;
  icon: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-w-[10.5rem] items-center gap-3 rounded-xl border border-white/20 bg-black px-4 py-2.5 text-white transition hover:bg-black/90 active:scale-[0.98]"
    >
      <span className="shrink-0 text-2xl leading-none">{icon}</span>
      <span className="text-left leading-tight">
        <span className="block text-[10px] uppercase tracking-wide opacity-80">{sublabel}</span>
        <span className="block text-sm font-semibold">{label}</span>
      </span>
    </a>
  );
}

export default function AppDownloadLinks({ layout = "row", className = "" }: AppDownloadLinksProps) {
  const { ios, android } = business.appDownloads;
  const hasStoreLinks = Boolean(ios || android);

  return (
    <div className={className}>
      {hasStoreLinks ? (
        <div className={`flex flex-wrap gap-3 ${layout === "column" ? "flex-col items-stretch" : "items-center"}`}>
          {ios ? (
            <StoreBadge href={ios} sublabel="Download on the" label="App Store" icon="🍎" />
          ) : null}
          {android ? (
            <StoreBadge href={android} sublabel="Get it on" label="Google Play" icon="▶" />
          ) : null}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/30 bg-white/5 px-4 py-3 text-sm text-red-100">
          <p className="font-medium text-white">Install on your phone</p>
          <p className="mt-1 text-xs leading-relaxed opacity-90">
            <strong>Android:</strong> Chrome menu → Install app
            <br />
            <strong>iPhone:</strong> Safari → Share → Add to Home Screen
          </p>
        </div>
      )}
    </div>
  );
}
