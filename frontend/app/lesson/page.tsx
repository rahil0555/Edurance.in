"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Slide = {
  title: string;
  content: string[];
};

export default function LessonPage() {
  const router = useRouter();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLesson = async () => {
      const classLevel = sessionStorage.getItem("selected_class");
      const subject = sessionStorage.getItem("selected_subject");
      const chapter = sessionStorage.getItem("selected_chapter");

      if (!classLevel || !subject || !chapter) {
        router.replace("/class");
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const res = await fetch("/api/lesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classLevel,
          subject,
          chapter,
        }),
      });

      const data = await res.json();
      setSlides(data.slides || []);
      setLoading(false);
    };

    loadLesson();
  }, [router]);

  /* ---------- KEYBOARD NAV ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setCurrent((c) => Math.min(c + 1, slides.length - 1));
      }
      if (e.key === "ArrowLeft") {
        setCurrent((c) => Math.max(c - 1, 0));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Initializing lesson…
      </div>
    );
  }

  if (!slides.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No slides generated.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* ENERGY PROGRESS BAR */}
      <div className="absolute top-0 left-0 w-full h-[6px] bg-white/10">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${((current + 1) / slides.length) * 100}%`,
            background:
              "linear-gradient(140deg, rgb(108,30,178), rgb(209,79,160))",
          }}
        />
      </div>

      {/* SLIDE SPACE */}
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="relative w-full max-w-6xl aspect-[16/9]">
          {slides.map((slide, index) => {
            const offset = index - current;

            return (
              <div
                key={index}
                className="absolute inset-0 transition-all duration-700 ease-out"
                style={{
                  opacity: offset === 0 ? 1 : 0,
                  transform: `
                    translateX(${offset * 120}px)
                    scale(${offset === 0 ? 1 : 0.92})
                  `,
                  pointerEvents: offset === 0 ? "auto" : "none",
                }}
              >
                <div className="glass h-full w-full p-16 flex flex-col justify-center">
                  <h1 className="text-4xl font-semibold tracking-tight mb-10">
                    {slide.title}
                  </h1>

                  <ul className="space-y-6 text-lg text-[var(--text-muted)]">
                    {slide.content.map((point, i) => (
                      <li
                        key={i}
                        className="fade-up"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-6">
        <button
          onClick={() => setCurrent((c) => Math.max(c - 1, 0))}
          className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
        >
          Previous
        </button>

        <button
          onClick={() =>
            setCurrent((c) => Math.min(c + 1, slides.length - 1))
          }
          className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
