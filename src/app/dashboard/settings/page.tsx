"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import AppCropModal from "@/components/app/app-crop-modal";
import { IconCamera, IconCheck } from "@/components/icons";

type UserProfile = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: "admin" | "user";
};

export default function SettingsPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  async function loadProfile() {
    const res = await fetch("/api/user/profile");
    if (res.status === 401) {
      router.push("/login");
      return;
    }
    const data = await res.json();
    if (data.user) {
      setProfile(data.user);
      setName(data.user.name);
      setPhone(data.user.phone || "");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadProfile();
  }, []);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result as string);
      setCropOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function handleCropDone(blob: Blob) {
    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const fd = new FormData();
      fd.append("avatar", blob, "avatar.jpg");
      const res = await fetch("/api/user/avatar", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }
      setProfile((prev) => (prev ? { ...prev, avatarUrl: data.avatarUrl } : prev));
      setSuccess("Photo updated");
      setCropOpen(false);
      setCropSrc(null);
      setTimeout(() => setSuccess(null), 2500);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleCropCancel() {
    setCropOpen(false);
    setCropSrc(null);
  }

  async function handleSave() {
    setError(null);
    setSuccess(null);
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() || "" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save");
        return;
      }
      setProfile(data.user);
      setSuccess("Profile updated");
      setTimeout(() => setSuccess(null), 2500);
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-separator" />
        <div className="mt-8 space-y-4">
          <div className="h-20 w-20 animate-pulse rounded-full bg-separator" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-separator" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-separator" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="text-2xl font-bold tracking-tight text-label">Settings</h1>
      <p className="mt-1 text-sm tracking-[-0.012em] text-secondary-label">
        Manage your profile information
      </p>

      {error && (
        <p className="mt-4 rounded-xl bg-system-red/10 px-4 py-3 text-sm font-medium text-system-red">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-4 rounded-xl bg-system-green/10 px-4 py-3 text-sm font-medium text-system-green flex items-center gap-2">
          <IconCheck className="h-4 w-4" />
          {success}
        </p>
      )}

      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="relative">
          {profile?.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt=""
              className="h-20 w-20 rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-500 text-2xl font-bold text-white shadow-md">
              {profile?.name.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface-elevated bg-brand-500 text-white shadow-sm active:bg-brand-600 disabled:opacity-50"
          >
            {uploading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <IconCamera className="h-4 w-4" />
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {cropOpen && cropSrc && (
        <AppCropModal
          src={cropSrc}
          onCancel={handleCropCancel}
          onDone={handleCropDone}
        />
      )}

      <div className="mt-8 space-y-5">
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold tracking-[-0.008em] text-secondary-label">
            Email
          </label>
          <div className="flex items-center rounded-2xl border border-separator bg-surface-elevated px-4 py-3.5">
            <span className="text-[15px] text-tertiary-label">{profile?.email}</span>
          </div>
          <p className="mt-1 text-[11px] text-tertiary-label">Email cannot be changed</p>
        </div>

        <div>
          <label htmlFor="name" className="mb-1.5 block text-[13px] font-semibold tracking-[-0.008em] text-secondary-label">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-separator bg-surface-elevated px-4 py-3.5 text-[15px] tracking-[-0.022em] text-label outline-none placeholder:text-tertiary-label focus:border-brand-500"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-[13px] font-semibold tracking-[-0.008em] text-secondary-label">
            Contact Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-2xl border border-separator bg-surface-elevated px-4 py-3.5 text-[15px] tracking-[-0.022em] text-label outline-none placeholder:text-tertiary-label focus:border-brand-500"
            placeholder="+94 77 123 4567"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-500 py-3.5 text-[16px] font-semibold tracking-[-0.022em] text-white shadow-lg shadow-brand-500/25 active:bg-brand-600 disabled:opacity-50 transition-all"
        >
          {saving ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <IconCheck className="h-5 w-5" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
