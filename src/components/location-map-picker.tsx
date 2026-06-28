"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";

const DEFAULT_LAT = 7.8731;
const DEFAULT_LNG = 80.7718;

type Props = {
  latitude: string;
  longitude: string;
  onChange: (coords: { latitude: string; longitude: string }) => void;
};

export default function LocationMapPicker({ latitude, longitude, onChange }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (cancelled || !mapRef.current || mapInstance.current) return;

      const lat = parseFloat(latitude) || DEFAULT_LAT;
      const lng = parseFloat(longitude) || DEFAULT_LNG;

      const map = L.map(mapRef.current, { scrollWheelZoom: true }).setView([lat, lng], latitude ? 13 : 8);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const icon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      const marker = L.marker([lat, lng], { draggable: true, icon }).addTo(map);

      function updatePosition(pos: { lat: number; lng: number }) {
        onChange({
          latitude: pos.lat.toFixed(6),
          longitude: pos.lng.toFixed(6),
        });
      }

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        updatePosition(pos);
      });

      map.on("click", (e) => {
        marker.setLatLng(e.latlng);
        updatePosition(e.latlng);
      });

      mapInstance.current = map;
      markerRef.current = marker;
    }

    initMap();

    return () => {
      cancelled = true;
      mapInstance.current?.remove();
      mapInstance.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-2">
      <p className="text-xs text-slate-500">Tap the map or drag the pin to set location</p>
      <div ref={mapRef} className="z-0 h-56 w-full overflow-hidden rounded-xl border border-slate-200 sm:h-64" />
      {(latitude || longitude) && (
        <p className="text-xs text-slate-500">
          Coordinates: {latitude || "—"}, {longitude || "—"}
        </p>
      )}
    </div>
  );
}
