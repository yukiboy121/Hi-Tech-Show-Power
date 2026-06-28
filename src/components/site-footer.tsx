import Link from "next/link";
import { business } from "@/lib/business";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-brand-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <p className="text-lg font-semibold text-white">{business.name}</p>
          <p className="mt-2 text-sm font-medium uppercase tracking-wide text-accent-400">
            {business.tagline}
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
            {business.description}
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Quick Links</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/services" className="hover:text-white">Services</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Contact</p>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>
              <span className="text-slate-500">Hot Line: </span>
              <a href={`tel:${business.hotlineTel}`} className="font-semibold text-accent-400 hover:text-accent-300">
                {business.hotline}
              </a>
            </li>
            <li>
              <span className="text-slate-500">Mobile: </span>
              <a href={`tel:${business.mobileTel}`} className="hover:text-white">{business.mobile}</a>
            </li>
            <li>
              <a href={`mailto:${business.email}`} className="hover:text-white">{business.email}</a>
            </li>
            <li className="pt-1 text-xs font-bold uppercase text-brand-500">{business.serviceHours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {business.name}. All rights reserved.
      </div>
    </footer>
  );
}
