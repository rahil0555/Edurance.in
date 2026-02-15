"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CHAPTERS: Record<string, string[]> = {
  Science: [
    "Nutrition in Plants",
    "Respiration",
    "Transportation in Animals",
  ],
  "Social Studies": [
    "History of India",
    "Geography Basics",
    "Civics and Government",
  ],
  Physics: [
    "Light – Reflection and Refraction",
    "Electricity",
    "Magnetism",
  ],
  Biology: [
    "Life Processes",
    "Control and Coordination",
    "Reproduction",
  ],
};

export default function ChapterPage() {
  const router = useRouter();
  const [subject, setSubject] = useState<string | null>(null);
  const [chapters, setChapters] = useState<string[]>([]);

  useEffect(() => {
    const selectedSubject = sessionStorage.getItem("selected_subject");

    if (!selectedSubject) {
      router.replace("/subject");
      return;
    }

    setSubject(selectedSubject);
    setChapters(CHAPTERS[selectedSubject] || []);
  }, [router]);

  if (!subject) return <p>Loading chapters...</p>;

  return (
    <main>
      <h1>{subject} — Chapters</h1>

      <ul>
        {chapters.map((chapter) => (
          <li key={chapter}>
            <button
              onClick={() => {
                sessionStorage.setItem("selected_chapter", chapter);
                router.replace("/lesson");
              }}
              style={{ margin: "8px" }}
            >
              {chapter}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
