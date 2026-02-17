"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";

export default function ChapterPage() {
  const router = useRouter();
  const [subject, setSubject] = useState<string | null>(null);

  // Example chapters (static for now)
  const chaptersBySubject: Record<string, string[]> = {
    Science: [
      "Motion and Force",
      "Light",
      "Human Body",
      "Plants and Animals",
    ],
    "Social Studies": [
      "History of India",
      "Geography Basics",
      "Civics and Government",
    ],
  };

  useEffect(() => {
    const storedSubject = sessionStorage.getItem("selected_subject");

    if (!storedSubject) {
      router.replace("/subject");
      return;
    }

    setSubject(storedSubject);
  }, [router]);

  const handleChapterSelect = (chapter: string) => {
    sessionStorage.setItem("selected_chapter", chapter);
    router.push("/lesson");
  };

  if (!subject) return null;

  return (
    <Card>
      <h1 className="text-3xl font-bold mb-2">
        {subject} — Chapters
      </h1>

      <p className="text-gray-500 mb-6">
        Choose a chapter to start learning
      </p>

      <div className="space-y-3">
        {chaptersBySubject[subject]?.map((chapter) => (
          <button
            key={chapter}
            onClick={() => handleChapterSelect(chapter)}
            className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 transition"
          >
            {chapter}
          </button>
        ))}
      </div>
    </Card>
  );
}
