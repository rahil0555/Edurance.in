"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SubjectPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cls = sessionStorage.getItem("selected_class");

    if (!cls) {
      router.replace("/class");
      return;
    }

    const classNumber = parseInt(cls.replace("Class ", ""));

    if (classNumber >= 5 && classNumber <= 9) {
      setSubjects(["Science", "Social Studies"]);
    } else if (classNumber === 10) {
      setSubjects(["Physics", "Biology", "Social Studies"]);
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Loading subjects…
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-16">
      {/* Header */}
      <div className="mb-14 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Select Subject
        </h1>
        <p className="mt-3 text-gray-400">
          Choose what you want to learn today.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => {
              sessionStorage.setItem("selected_subject", subject);
              router.push("/chapter");
            }}
            className="
              glass hover-lift
              p-8 rounded-xl
              text-lg font-medium
              transition
              hover:shadow-[0_0_30px_rgba(120,160,255,0.35)]
              hover:scale-[1.03]
            "
          >
            {subject}
          </button>
        ))}
      </div>
    </div>
  );
}
