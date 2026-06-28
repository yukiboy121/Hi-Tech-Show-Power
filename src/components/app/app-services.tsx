"use client";

import Link from "next/link";
import { mainServices } from "@/lib/business";

const serviceKeys: Record<string, string> = {
  "Generator Maintenance": "maintenance",
  "Electrical Installations": "electrical",
  "Air Conditioners": "ac",
  "24 Hour Emergency": "emergency",
};

export default function AppServices() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Tap a service below to send a request. We respond 24 hours a day.
      </p>

      {mainServices.map((s) => (
        <div key={s.title} className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl">
                {s.icon}
              </span>
              <div>
                <h2 className="font-bold text-brand-900">{s.title}</h2>
                <p className="mt-0.5 text-xs text-slate-500">{s.features.join(" · ")}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{s.desc}</p>
          </div>
          <Link
            href={`/contact?service=${serviceKeys[s.title] || "other"}`}
            className="block border-t border-slate-100 bg-slate-50 py-3.5 text-center text-sm font-bold text-brand-600 active:bg-brand-50"
          >
            Request This Service →
          </Link>
        </div>
      ))}
    </div>
  );
}
