"use client";

import { useEffect, useState, useMemo } from "react";
import { business } from "@/lib/business";

const messages = [
  "Preparing your experience",
  "Getting everything ready",
  "Loading your workspace",
  "Just a moment",
  "Almost there",
];

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

export default function AppPreloader({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const reduced = useReducedMotion();

  const message = useMemo(
    () => messages[Math.floor(Math.random() * messages.length)],
    []
  );

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadingOut(true), 1400);
    const hideTimer = setTimeout(() => setVisible(false), 1900);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return <>{children}</>;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] transition-opacity duration-500 ${
        fadingOut ? "opacity-0 scale-[1.02]" : "opacity-100 scale-100"
      }`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        background: "var(--preloader-bg, #f7f7f8)",
      }}
      role="status"
      aria-label="Loading application"
    >
      <style>{`
        :root { --preloader-bg: #f7f7f8; }
        @media (prefers-color-scheme: dark) {
          :root { --preloader-bg: #1c1c1e; }
          .preloader-text { color: #f5f5f7; }
          .preloader-secondary { color: #98989d; }
          .preloader-ring-bg { stroke: #2c2c2e; }
        }
        @media (prefers-color-scheme: light) {
          .preloader-text { color: #1c1c1e; }
          .preloader-secondary { color: #8e8e93; }
          .preloader-ring-bg { stroke: #e5e5ea; }
        }
        @media (prefers-reduced-motion: reduce) {
          .preloader-icon { animation: none !important; }
          .preloader-ring { animation: none !important; }
          .preloader-particle { display: none !important; }
          .preloader-message { animation: none !important; opacity: 1 !important; }
          .preloader-bar { animation: none !important; transform: scaleX(0.7) !important; }
        }
      `}</style>

      <div className="relative flex flex-col items-center">
        {/* Floating particles */}
        {!reduced && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            {[0, 1.2, 2.4].map((delay) => (
              <span
                key={delay}
                className="preloader-particle absolute h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: "var(--color-brand-500, #d32f2f)",
                  opacity: 0,
                  animation: `float-up 2.4s ease-in-out ${delay}s infinite`,
                }}
              />
            ))}
            <span
              className="preloader-particle absolute h-2 w-2 rounded-full"
              style={{
                backgroundColor: "var(--color-accent-500, #facc15)",
                opacity: 0,
                animation: "float-up 2.8s ease-in-out 3.6s infinite",
                width: 6,
                height: 6,
              }}
            />
          </div>
        )}

        {/* App icon with glow */}
        <div className="preloader-icon relative mb-7" style={reduced ? {} : { animation: "breathe 2.8s ease-in-out infinite" }}>
          <div
            className="relative flex h-22 w-22 items-center justify-center rounded-[26px] bg-brand-500 shadow-xl"
            style={
              reduced
                ? {}
                : { animation: "glow-pulse 2.8s ease-in-out infinite" }
            }
          >
            {/* Glass shine overlay */}
            <div
              className="absolute inset-0 rounded-[26px] opacity-30"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 50%, transparent 100%)",
              }}
            />
            <span
              className="relative text-3xl font-bold tracking-tight text-white select-none"
              style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}
            >
              {business.shortName.slice(0, 2).toUpperCase()}
            </span>
          </div>
        </div>

        {/* App name */}
        <h1
          className="preloader-text text-[28px] font-bold tracking-[-0.03em] select-none animate-[fadeInUp_0.5s_cubic-bezier(0.16,1,0.3,1)_0.1s_both]"
          style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}
        >
          {business.shortName}
        </h1>

        {/* Tagline */}
        <p
          className="preloader-secondary mt-1.5 text-[15px] tracking-[-0.018em] select-none animate-[fadeInUp_0.5s_cubic-bezier(0.16,1,0.3,1)_0.2s_both]"
          style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif" }}
        >
          {business.tagline}
        </p>
      </div>

      {/* Loading indicator */}
      <div className="absolute bottom-[max(120px,env(safe-area-inset-bottom)+80px)] flex flex-col items-center gap-4">
        {/* Animated ring */}
        <div
          className="preloader-ring relative flex items-center justify-center"
          style={reduced ? {} : { animation: "ring-rotate 2s linear infinite" }}
        >
          <svg width="40" height="40" viewBox="0 0 100 100" className="-rotate-90">
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              className="preloader-ring-bg"
              strokeWidth="5"
            />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="var(--color-brand-500, #d32f2f)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset="200"
              style={
                reduced
                  ? { strokeDashoffset: "200" }
                  : { animation: "ring-fill 2s ease-in-out infinite alternate" }
              }
            />
          </svg>
        </div>

        {/* Rotating message */}
        <p
          className="preloader-message preloader-secondary text-[13px] tracking-[-0.008em] select-none animate-[message-fade_3s_ease-in-out_infinite]"
          style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif" }}
        >
          {message}
        </p>

        {/* Progress bar */}
        <div className="h-[3px] w-40 overflow-hidden rounded-full bg-separator">
          <div
            className="preloader-bar h-full rounded-full bg-brand-500"
            style={
              reduced
                ? { width: "70%" }
                : {
                    animation: "progress-grow 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                    transformOrigin: "left center",
                  }
            }
          />
        </div>
      </div>
    </div>
  );
}
