"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { IconMapPin, IconNavigation } from "@/components/icons";

const LocationMapPicker = dynamic(() => import("@/components/location-map-picker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-56 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500">
      Loading map...
    </div>
  ),
});

export default function CreateSiteForm({
  redirectTo,
  onSuccess,
  onCancel,
}: {
  redirectTo?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function useMyLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    setError(null);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        })
      );
      const lat = pos.coords.latitude.toFixed(6);
      const lng = pos.coords.longitude.toFixed(6);
      setLatitude(lat);
      setLongitude(lng);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
        { headers: { "User-Agent": "HiTechShowPower/1.0" } }
      );
      const data = await res.json();
      if (data?.display_name) {
        setLocation(data.display_name);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to get location");
    } finally {
      setLocating(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, location, latitude, longitude, description }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to create site");
      setName("");
      setLocation("");
      setLatitude("");
      setLongitude("");
      setDescription("");
      if (data.id) {
        onSuccess?.();
        const basePath = redirectTo || "/admin/sites";
        router.push(`${basePath}/${data.id}`);
      } else if (redirectTo) {
        onSuccess?.();
        router.push(redirectTo);
        router.refresh();
      } else {
        onSuccess?.();
        router.refresh();
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, address, or landmark"
          className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <button
        type="button"
        onClick={useMyLocation}
        disabled={locating}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-3 py-2.5 text-sm font-medium text-brand-700 hover:bg-brand-100 disabled:opacity-50"
      >
        <IconNavigation className="h-4 w-4" />
        {locating ? "Getting location..." : "Use My Current Location"}
      </button>
      <LocationMapPicker
        latitude={latitude}
        longitude={longitude}
        onChange={({ latitude: lat, longitude: lng }) => {
          setLatitude(lat);
          setLongitude(lng);
        }}
      />
      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 active:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60 ${onCancel ? "flex-1" : "w-full"}`}
        >
          {loading ? "Creating..." : "Create Site"}
        </button>
      </div>
    </form>
  );
}
