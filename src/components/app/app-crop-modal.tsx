"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Cropper, { type Area } from "react-easy-crop";

type CropModalProps = {
  src: string;
  onCancel: () => void;
  onDone: (blob: Blob) => Promise<void>;
};

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
  });
}

async function getCroppedBlob(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const img = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.drawImage(
    img,
    pixelCrop.x, pixelCrop.y,
    pixelCrop.width, pixelCrop.height,
    0, 0,
    pixelCrop.width, pixelCrop.height
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas toBlob failed"));
    }, "image/jpeg", 0.9);
  });
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export default function AppCropModal({ src, onCancel, onDone }: CropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const reduced = useReducedMotion();
  const lastTapRef = useRef(0);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  function handleDoubleTap() {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setZoom((z) => (z > 1.5 ? 1 : 2.5));
    }
    lastTapRef.current = now;
  }

  function handleReset() {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }

  async function handleDone() {
    if (!croppedAreaPixels || saving) return;
    setSaving(true);
    try {
      const blob = await getCroppedBlob(src, croppedAreaPixels);
      await onDone(blob);
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    if (saving) return;
    setClosing(true);
    setTimeout(onCancel, 250);
  }

  const anim = reduced
    ? {}
    : {
        animation: "spring-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        opacity: 0 as const,
      };

  const closingAnim = closing ? { opacity: 0, transform: "scale(0.95)", transition: "opacity 0.2s, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)" } : {};

  return (
    <div
      className="fixed inset-0 z-[9998] flex flex-col"
      style={{
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        ...(mounted && !reduced ? { animation: "fade-blur-in 0.4s ease-out forwards" } : {}),
        ...closingAnim,
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      role="dialog"
      aria-label="Crop photo"
    >
      {/* Skip link for screen readers */}
      <button
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-xl focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-white"
        onClick={handleDone}
      >
        Skip to Done
      </button>

      {/* --- Top navigation bar --- */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          ...anim,
          animationDelay: "0.05s",
          ...closingAnim,
        }}
      >
        <button
          type="button"
          onClick={handleClose}
          disabled={saving}
          className="text-[15px] font-normal tracking-[-0.02em] text-white/70 active:text-white transition-colors disabled:opacity-30"
        >
          Cancel
        </button>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" style={{ boxShadow: "0 0 4px rgba(211,47,47,0.5)" }} />
          <p className="text-[15px] font-semibold tracking-[-0.02em] text-white/90">
            Crop Photo
          </p>
        </div>
        <button
          type="button"
          onClick={handleDone}
          disabled={saving || !croppedAreaPixels}
          className="text-[15px] font-semibold tracking-[-0.02em] text-brand-300 active:text-brand-200 transition-colors disabled:opacity-30"
        >
          {saving ? (
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 animate-spin rounded-full border-[2px] border-brand-300 border-t-transparent" />
              Saving
            </span>
          ) : (
            "Done"
          )}
        </button>
      </div>

      {/* --- Crop area --- */}
      <div
        className="relative flex-1 overflow-hidden"
        style={{
          ...anim,
          animationDelay: "0.1s",
          ...closingAnim,
        }}
        onDoubleClick={handleDoubleTap}
      >
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          minZoom={1}
          maxZoom={4}
          classes={{
            containerClassName: "!bg-transparent",
            cropAreaClassName:
              "!border !border-white/60 !shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] !rounded-full !transition-[border,box-shadow] !duration-200",
            mediaClassName: "!cursor-grab !active:cursor-grabbing",
          }}
        />
      </div>

      {/* --- Bottom toolbar --- */}
      <div
        className="flex items-center justify-center gap-8 border-t border-white/10 px-4 py-2.5"
        style={{
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          ...anim,
          animationDelay: "0.15s",
          ...closingAnim,
        }}
      >
        {/* Reset */}
        <button
          type="button"
          onClick={handleReset}
          className="flex flex-col items-center gap-1 text-white/50 active:text-white/90 transition-colors"
          aria-label="Reset crop"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          <span className="text-[9px] font-medium tracking-[0.04em] uppercase">Reset</span>
        </button>

        {/* Aspect ratio indicator */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
            <span className="text-[12px] font-bold tracking-[-0.02em] text-white">1:1</span>
          </div>
          <span className="text-[9px] font-medium tracking-[0.04em] uppercase text-white/40">Square</span>
        </div>

        {/* Zoom toggle */}
        <button
          type="button"
          onClick={() => setZoom((z) => (z > 1.5 ? 1 : 2.5))}
          className="flex flex-col items-center gap-1 text-white/50 active:text-white/90 transition-colors"
          aria-label="Toggle zoom"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          <span className="text-[9px] font-medium tracking-[0.04em] uppercase">Zoom</span>
        </button>
      </div>
    </div>
  );
}
