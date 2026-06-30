"use client";

import { useEffect, useState } from "react";
import { business } from "@/lib/business";

export default function AppPreloader({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-surface-elevated pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[22px] bg-brand-500 shadow-xl shadow-brand-500/30" style={{ viewTransitionName: "app-icon" }}>
        <span className="text-3xl font-bold tracking-tight text-white">
          {business.shortName.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-label">
        {business.shortName}
      </h1>
      <p className="mt-1 text-sm tracking-[-0.012em] text-secondary-label">
        {business.description}
      </p>
      <div className="mt-8 flex items-center gap-1.5">
        {[0, 0.15, 0.3].map((delay) => (
          <span
            key={delay}
            className="h-2 w-2 rounded-full bg-brand-500 animate-[pulse_0.6s_ease-in-out_infinite]"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </div>
  );
}
