"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // subtle cinematic entrance
    document.body.classList.add("motion-fade-in");
    return () => {
      document.body.classList.remove("motion-fade-in");
    };
  }, []);

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center px-6">
      {/* HERO */}
      <section className="max-w-4xl text-center mb-32">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
          The Future of Learning
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Starts Here
          </span>
        </h1>

        <p className="mt-8 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          Edurance is an AI-powered learning environment designed to
          help students understand deeply, learn faster, and stay
          curious every day.
        </p>

        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            onClick={() => router.push("/login")}
            className="
              px-8 py-4 rounded-xl
              bg-gradient-to-r from-blue-500 to-purple-500
              text-white font-medium
              transition
              hover:shadow-[0_0_40px_rgba(120,160,255,0.5)]
              hover:scale-[1.03]
              active:scale-[0.97]
            "
          >
            Get Started
          </button>

          <button
            onClick={() => router.push("/signup")}
            className="
              px-8 py-4 rounded-xl
              border border-white/15
              text-gray-300
              transition
              hover:bg-white/5
              hover:text-white
            "
          >
            Create Account
          </button>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
        {[
          {
            title: "AI-Powered Lessons",
            desc: "Every lesson is generated and adapted to help you truly understand concepts, not memorize them.",
          },
          {
            title: "Distraction-Free Focus",
            desc: "A calm, immersive environment designed to keep you engaged without overwhelming you.",
          },
          {
            title: "Built for Daily Learning",
            desc: "Edurance is crafted to be something you return to every day — effortlessly.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="glass hover-lift p-6 text-left"
          >
            <h3 className="text-xl font-medium">
              {item.title}
            </h3>
            <p className="mt-3 text-sm text-gray-400">
              {item.desc}
            </p>
          </div>
        ))}
      </section>

      {/* CLOSING INVITATION */}
      <section className="text-center max-w-2xl mb-20">
        <h2 className="text-3xl font-semibold tracking-tight">
          Learning, reimagined.
        </h2>
        <p className="mt-4 text-gray-400">
          Built with care, precision, and intelligence —
          Edurance is where focused minds grow.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="text-xs text-gray-500 pb-10">
        © {new Date().getFullYear()} Edurance. All rights reserved.
      </footer>
    </main>
  );
}
