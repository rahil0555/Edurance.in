"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Flow stays EXACTLY as you defined
    router.replace("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[700px] h-[700px] rounded-full bg-purple-600/20 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-pink-600/20 blur-[160px]" />
      </div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md glass hover-lift p-10 fade-up">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            Begin your AI-powered learning experience
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-6">
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
              placeholder="Create a strong password"
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
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-[var(--text-muted)]">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-purple-400 hover:text-purple-300 transition"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
