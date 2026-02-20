"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ---------- MOCK CHAPTERS (REPLACE LATER FROM DB IF NEEDED) ---------- */
const CHAPTERS = [
  "Introduction",
  "Core Concepts",
  "Key Definitions",
  "Worked Examples",
  "Real World Applications",
  "Summary & Reflection",
];

export default function ChapterPage() {
  const router = useRouter();
  const [entering, setEntering] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const subject = sessionStorage.getItem("selected_subject");
    if (!subject) {
      router.replace("/subject");
    }
  }, [router]);

  const enterChapter = (index: number) => {
    setActive(index);
    setEntering(true);

    setTimeout(() => {
      sessionStorage.setItem("selected_chapter", CHAPTERS[index]);
      router.push("/lesson");
    }, 900); // transition duration
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient space background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(140,90,255,0.18),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(200,90,160,0.12),transparent_45%)]" />
      </div>

      {/* Title */}
      <div
        className={`relative z-10 text-center pt-20 transition-opacity duration-700 ${
          entering ? "opacity-0" : "opacity-100"
        }`}
      >
        <h1 className="text-3xl font-semibold tracking-tight">
          Choose a Chapter
        </h1>
        <p className="mt-3 text-sm text-[var(--text-muted)]">
          You’re stepping deeper into the knowledge space
        </p>
      </div>

      {/* CHAPTER SPACE */}
      <div
        className={`relative z-10 mt-24 flex items-center justify-center transition-transform duration-1000 ${
          entering ? "scale-[1.15]" : "scale-100"
        }`}
      >
        <div className="relative w-full max-w-4xl h-[400px]">
          {CHAPTERS.map((chapter, index) => {
            const offset = index - (active ?? 2);

            return (
              <div
                key={chapter}
                onClick={() => enterChapter(index)}
                className={`
                  absolute left-1/2 top-1/2
                  -translate-x-1/2 -translate-y-1/2
                  cursor-pointer
                  transition-all duration-700 ease-out
                `}
                style={{
                  transform: `
                    translateX(${offset * 120}px)
                    translateY(${Math.abs(offset) * 20}px)
                    scale(${active === index ? 1.2 : 0.9})
                  `,
                  opacity: entering && active !== index ? 0 : 1,
                }}
              >
                <div
                  className={`
                    glass px-8 py-4 rounded-2xl
                    text-center whitespace-nowrap
                    transition
                    hover:shadow-[0_0_35px_rgba(160,90,255,0.45)]
                  `}
                >
                  {chapter}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Forward motion overlay */}
      {entering && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity duration-700" />
      )}
    </div>
  );
}
