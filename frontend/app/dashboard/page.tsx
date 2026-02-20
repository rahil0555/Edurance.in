"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Play intro only once per session
  useEffect(() => {
    const played = sessionStorage.getItem("dashboard_intro_played");
    if (played) {
      setShowIntro(false);
    }
  }, []);

  const enterDashboard = () => {
    sessionStorage.setItem("dashboard_intro_played", "true");
    setShowIntro(false);

    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Sound */}
      <audio ref={audioRef} src="/sounds/enter.mp3" preload="auto" />

      {/* ===== INTRO OVERLAY ===== */}
      {showIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          {/* Animated background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(160,90,255,0.25),transparent_40%)] animate-pulse" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(220,90,160,0.25),transparent_45%)] animate-pulse delay-200" />
          </div>

          {/* Center content */}
          <div className="relative z-10 text-center fade-up">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Edurance
            </h1>

            <p className="mt-4 text-sm text-[var(--text-muted)]">
              Initializing learning interface
            </p>

            {/* Controls */}
            <div className="mt-10 flex flex-col items-center gap-4">
              <button
                onClick={enterDashboard}
                className="
                  px-8 py-3 rounded-xl
                  bg-gradient-to-r from-purple-600 to-pink-500
                  text-white font-medium
                  transition
                  hover:scale-[1.05]
                  hover:shadow-[0_0_40px_rgba(160,90,255,0.6)]
                  active:scale-[0.97]
                "
              >
                Enter Dashboard
              </button>

              <label className="flex items-center gap-2 text-xs text-[var(--text-muted)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={() => setSoundEnabled(!soundEnabled)}
                />
                Enable sound
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ===== ACTUAL DASHBOARD ===== */}
      {!showIntro && (
        <div className="relative z-10 px-6 py-10 fade-up">
          <h2 className="text-3xl font-semibold">
            Dashboard
          </h2>

          <p className="mt-3 text-[var(--text-muted)] max-w-xl">
            Your AI-powered learning control center.
          </p>

          {/* Primary action */}
          <div className="mt-10">
            <button
              onClick={() => router.push("/class")}
              className="
                px-6 py-3 rounded-xl
                bg-white/5 border border-white/10
                text-white
                transition
                hover:bg-white/10
                hover:shadow-[0_0_25px_rgba(160,90,255,0.35)]
              "
            >
              Start Learning
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
