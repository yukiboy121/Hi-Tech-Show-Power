"use client";

import Image from "next/image";
import { useState } from "react";
import { generatorShowcase } from "@/lib/business";

function GeneratorCard({
  title,
  subtitle,
  image,
  gradient,
}: {
  title: string;
  subtitle: string;
  image: string;
  gradient: string;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg active:scale-[0.98]">
      <div className={`relative aspect-[4/3] overflow-hidden ${imgError ? gradient : "bg-slate-100"}`}>
        {!imgError ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 25vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-4 text-center text-white">
            <span className="text-4xl">⚡</span>
            <p className="mt-2 text-xs font-medium opacity-80">Add image to</p>
            <p className="text-[10px] opacity-60">public/generators/</p>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
          <p className="text-sm font-bold text-white">{title}</p>
          <p className="text-[11px] text-white/80">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default function GeneratorGallery() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {generatorShowcase.map((g) => (
        <GeneratorCard key={g.title} {...g} />
      ))}
    </div>
  );
}
