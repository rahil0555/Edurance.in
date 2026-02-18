"use client";

import { useEffect, useState } from "react";

type Slide = {
  title: string;
  content: string[];
};

export default function LessonPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className="p-6">Loading lesson…</p>;

  if (!slides.length)
    return <p className="p-6">No slides found.</p>;

  const slide = slides[current];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{slide.title}</h1>

      <ul className="list-disc pl-6 space-y-2 mb-6">
        {slide.content.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Slide {current + 1} of {slides.length}
        </span>

        <button
          onClick={() =>
            setCurrent((c) =>
              Math.min(slides.length - 1, c + 1)
            )
          }
          disabled={current === slides.length - 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
