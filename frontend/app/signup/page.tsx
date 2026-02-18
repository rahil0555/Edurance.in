"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="w-full max-w-md mx-auto glass glow hover-lift p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Sign in to continue your learning journey
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm mb-2 text-gray-300">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="
              w-full px-4 py-3 rounded-lg
              bg-black/40 text-white
              border border-white/10
              outline-none
              transition
              focus:border-blue-400/60
              focus:shadow-[0_0_0_1px_rgba(120,160,255,0.4)]
            "
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-300">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="
              w-full px-4 py-3 rounded-lg
              bg-black/40 text-white
              border border-white/10
              outline-none
              transition
              focus:border-blue-400/60
              focus:shadow-[0_0_0_1px_rgba(120,160,255,0.4)]
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
            w-full py-3 mt-2 rounded-lg
            bg-gradient-to-r from-blue-500 to-purple-500
            text-white font-medium
            transition
            hover:shadow-[0_0_30px_rgba(120,160,255,0.45)]
            hover:scale-[1.02]
            active:scale-[0.98]
            disabled:opacity-60
          "
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-400">
        New here?{" "}
        <a
          href="/signup"
          className="text-blue-400 hover:text-blue-300 transition"
        >
          Create an account
        </a>
      </div>
    </div>
  );
}
