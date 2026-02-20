"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.replace("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-pink-600/20 blur-[140px]" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md glass hover-lift p-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            Sign in to continue your AI-powered learning journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wide mb-2 text-[var(--text-muted)]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@domain.com"
              className="
                w-full rounded-xl px-4 py-3
                bg-black/40
                border border-white/10
                text-white
                outline-none
                transition
                focus:border-purple-400/60
                focus:shadow-[0_0_0_1px_rgba(160,90,255,0.4)]
              "
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide mb-2 text-[var(--text-muted)]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="
                w-full rounded-xl px-4 py-3
                bg-black/40
                border border-white/10
                text-white
                outline-none
                transition
                focus:border-purple-400/60
                focus:shadow-[0_0_0_1px_rgba(160,90,255,0.4)]
              "
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full mt-4 py-3 rounded-xl
              bg-gradient-to-r from-purple-600 to-pink-500
              text-white font-medium
              transition
              hover:shadow-[0_0_40px_rgba(160,90,255,0.55)]
              hover:scale-[1.03]
              active:scale-[0.97]
              disabled:opacity-60
            "
          >
            {loading ? "Authenticating…" : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-[var(--text-muted)]">
          New to Edurance?{" "}
          <a
            href="/signup"
            className="text-purple-400 hover:text-purple-300 transition"
          >
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
}
