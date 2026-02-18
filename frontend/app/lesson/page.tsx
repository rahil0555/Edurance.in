"use client";

import { useEffect, useRef, useState } from "react";

type Slide = {
  title: string;
  content: string[];
};

export default function LessonPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadLesson() {
      const classLevel = sessionStorage.getItem("selected_class");
      const subject = sessionStorage.getItem("selected_subject");
      const chapter = sessionStorage.getItem("selected_chapter");

      if (!classLevel || !subject || !chapter) {
        setLoading(false);
        return;
      }

      const res = await fetch("/api/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classLevel, subject, chapter }),
      });

      const data = await res.json();
      setSlides(data.slides || []);
      setLoading(false);
    }

    loadLesson();
  }, []);

  /* ---------- FULLSCREEN HANDLERS ---------- */
  const enterFullscreen = () => {
    if (!containerRef.current) return;
    containerRef.current.requestFullscreen();
    setIsFullscreen(true);
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsFullscreen(false);
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener(
      "fullscreenchange",
      onFullscreenChange
    );
    return () =>
      document.removeEventListener(
        "fullscreenchange",
        onFullscreenChange
      );
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Preparing lesson…
      </div>
    );
  }

  if (!slides.length) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        No lesson found.
      </div>
    );
  }

  const slide = slides[current];
  const progress = ((current + 1) / slides.length) * 100;

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex flex-col items-center justify-center px-6"
    >
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-white/5 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Fullscreen toggle */}
      <button
        onClick={
          isFullscreen ? exitFullscreen : enterFullscreen
        }
        className="
          fixed top-4 right-4 z-50
          px-3 py-2 rounded-lg
          bg-white/5 border border-white/10
          text-sm text-gray-300
          transition
          hover:bg-white/10 hover:text-white
        "
      >
        {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      </button>

      {/* Slide Canvas */}
      <div className="w-full max-w-5xl aspect-[16/9] glass p-10 flex flex-col justify-center">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
          {slide.title}
        </h1>

        <ul className="space-y-4 text-lg text-gray-300">
          {slide.content.map((point, i) => (
            <li key={i} className="leading-relaxed">
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center gap-6">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="
            px-5 py-2 rounded-lg
            bg-white/5 border border-white/10
            text-gray-300
            transition
            hover:bg-white/10 hover:text-white
            disabled:opacity-40
          "
        >
          Previous
        </button>

        <span className="text-sm text-gray-400">
          {current + 1} / {slides.length}
        </span>

        <button
          onClick={() =>
            setCurrent((c) =>
              Math.min(slides.length - 1, c + 1)
            )
          }
          disabled={current === slides.length - 1}
          className="
            px-5 py-2 rounded-lg
            bg-gradient-to-r from-blue-500 to-purple-500
            text-white
            transition
            hover:shadow-[0_0_30px_rgba(120,160,255,0.45)]
            hover:scale-[1.03]
            disabled:opacity-40
          "
        >
          Next
        </button>
      </div>
    </div>
  );
}
