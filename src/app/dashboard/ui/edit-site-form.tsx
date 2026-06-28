"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { IconMapPin } from "@/components/icons";

const LocationMapPicker = dynamic(() => import("@/components/location-map-picker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-56 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500">
      Loading map...
    </div>
  ),
});

type SiteValues = {
  name: string;
  location: string;
  latitude: string;
  longitude: string;
  description: string;
};

export default function EditSiteForm({
  siteId,
  initial,
  onClose,
}: {
  siteId: number;
  initial: SiteValues;
  onClose?: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [location, setLocation] = useState(initial.location);
  const [latitude, setLatitude] = useState(initial.latitude);
  const [longitude, setLongitude] = useState(initial.longitude);
  const [description, setDescription] = useState(initial.description);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const isDirty =
    name !== initial.name ||
    location !== initial.location ||
    latitude !== initial.latitude ||
    longitude !== initial.longitude ||
    description !== initial.description;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setLoading(true);
    try {
      const res = await fetch(`/api/sites/${siteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, location, latitude, longitude, description }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setSaved(true);
      router.refresh();
      onClose?.();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 border-t border-slate-100 pt-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSaved(false);
          }}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <div>
        <label className="mb-1 flex items-center gap-1.5 text-sm font-medium">
          <IconMapPin className="h-4 w-4 text-brand-600" />
          Location / Address
        </label>
        <input
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            setSaved(false);
          }}
          placeholder="City, address, or landmark"
          className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <LocationMapPicker
        latitude={latitude}
        longitude={longitude}
        onChange={({ latitude: lat, longitude: lng }) => {
          setLatitude(lat);
          setLongitude(lng);
          setSaved(false);
        }}
      />
      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setSaved(false);
          }}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-green-600">Site details saved.</p>}
      <div className="flex gap-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !isDirty}
          className="flex-1 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
