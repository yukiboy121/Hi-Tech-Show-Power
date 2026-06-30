"use client";

import Link from "next/link";
import { mainServices } from "@/lib/business";
import { IconArrowRight } from "@/components/icons";

const serviceKeys: Record<string, string> = {
  "Generator Maintenance": "maintenance",
  "Electrical Installations": "electrical",
  "Air Conditioners": "ac",
  "24 Hour Emergency": "emergency",
};

export default function AppServices() {
  return (
    <div className="space-y-3 animate-[fadeInUp_0.35s_ease-out]">
      <p className="px-1 text-[15px] leading-relaxed text-secondary-label">
        Tap a service below to send a request. We respond 24 hours a day.
      </p>

      {mainServices.map((s, i) => (
        <div
          key={s.title}
          className="overflow-hidden rounded-[20px] bg-surface-elevated shadow-sm shadow-black/5 transition-all duration-200"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="p-5">
            <div className="flex items-center gap-4">
              <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[16px] bg-brand-500/10 text-2xl">
                {s.icon}
              </span>
              <div className="flex-1">
                <h2 className="text-[17px] font-bold text-label">{s.title}</h2>
                {s.features.length > 0 && (
                  <p className="mt-0.5 text-[13px] text-secondary-label">
                    {s.features.join(" · ")}
                  </p>
                )}
              </div>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-secondary-label">{s.desc}</p>
          </div>
          <Link
            href={`/contact?service=${serviceKeys[s.title] || "other"}`}
            className="flex items-center justify-center gap-1.5 border-t border-separator py-3.5 text-[14px] font-semibold text-brand-500 active:bg-surface transition-colors"
          >
            Request This Service
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ))}
    </div>
  );
}
