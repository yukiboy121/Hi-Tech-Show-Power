"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IconCamera, IconUpload } from "@/components/icons";

export default function UploadImages({ siteId }: { siteId: number }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string[]>([]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files;
    setFiles(selected);
    setError(null);
    preview.forEach((url) => URL.revokeObjectURL(url));
    if (selected) {
      setPreview(Array.from(selected).map((f) => URL.createObjectURL(f)));
    } else {
      setPreview([]);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!files || files.length === 0) {
      setError("Select images first");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));
      const res = await fetch(`/api/sites/${siteId}/images`, { method: "POST", body: fd, credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setFiles(null);
      preview.forEach((url) => URL.revokeObjectURL(url));
      setPreview([]);
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 transition-colors hover:border-brand-400 hover:bg-brand-50/50 active:bg-brand-50">
        <IconCamera className="h-10 w-10 text-brand-600" />
        <span className="mt-2 text-sm font-medium text-slate-700">Tap to select photos</span>
        <span className="mt-1 text-xs text-slate-500">JPG, PNG — multiple allowed</span>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/*"
          onChange={handleFileChange}
          className="sr-only"
        />
      </label>

      {preview.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {preview.map((url, i) => (
            <div key={url} className="aspect-square overflow-hidden rounded-lg border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Preview ${i + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !files?.length}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50 sm:w-auto"
      >
        <IconUpload className="h-4 w-4" />
        {loading ? "Uploading..." : `Upload ${files?.length || ""} photo${files && files.length > 1 ? "s" : ""}`}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
