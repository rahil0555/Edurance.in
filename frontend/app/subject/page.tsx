"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ---------- SUBJECT MAP ---------- */
const SUBJECTS_BY_CLASS: Record<number, {
  name: string;
  gradient: string;
  description: string;
}[]> = {
  5: [
    { name: "Science", gradient: "from-blue-500 to-cyan-400", description: "Explore the natural world and basic scientific ideas" },
    { name: "Social Studies", gradient: "from-purple-500 to-pink-500", description: "Understand society, civics, and human systems" },
  ],
  6: [
    { name: "Science", gradient: "from-blue-500 to-cyan-400", description: "Build scientific thinking and experimentation" },
    { name: "Social Studies", gradient: "from-purple-500 to-pink-500", description: "History, geography, and governance foundations" },
  ],
  7: [
    { name: "Science", gradient: "from-blue-500 to-cyan-400", description: "Scientific concepts with deeper explanations" },
    { name: "Social Studies", gradient: "from-purple-500 to-pink-500", description: "Social, political, and historical systems" },
  ],
  8: [
    { name: "Science", gradient: "from-blue-500 to-cyan-400", description: "Advanced scientific reasoning and experiments" },
    { name: "Social Studies", gradient: "from-purple-500 to-pink-500", description: "Geography, civics, and economics" },
  ],
  9: [
    { name: "Science", gradient: "from-blue-500 to-cyan-400", description: "Foundation for higher scientific studies" },
    { name: "Social Studies", gradient: "from-purple-500 to-pink-500", description: "Political science, economics, and history" },
  ],
  10: [
    { name: "Physics", gradient: "from-blue-400 to-indigo-500", description: "Laws of motion, energy, and the universe" },
    { name: "Biology", gradient: "from-emerald-400 to-teal-500", description: "Life, systems, and biological intelligence" },
    { name: "Social Studies", gradient: "from-purple-500 to-pink-500", description: "Society, economics, and political systems" },
  ],
};

export default function SubjectPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<typeof SUBJECTS_BY_CLASS[5]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedClass = sessionStorage.getItem("selected_class");

    if (!storedClass) {
      router.replace("/class");
      return;
    }

    const classNumber = Number(storedClass.replace("Class", "").trim());
    const mapped = SUBJECTS_BY_CLASS[classNumber];

    if (!mapped) {
      console.error("No subjects for class:", classNumber);
      router.replace("/class");
      return;
    }

    setSubjects(mapped);
    setLoading(false);
  }, [router]);

  if (loading) return <p className="text-center mt-20">Loading subjects…</p>;

  return (
    <div className="min-h-screen px-8 py-20">
      <div className="text-center mb-20">
        <h1 className="text-3xl font-semibold tracking-tight">Choose a Subject</h1>
        <p className="mt-3 text-sm text-gray-400">
          Each subject unlocks a different way of thinking
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {subjects.map((subject) => (
          <div
            key={subject.name}
            onClick={() => {
              sessionStorage.setItem("selected_subject", subject.name);
              router.push("/chapter");
            }}
            className="relative group cursor-pointer glass p-10 rounded-3xl transition-all hover:-translate-y-2"
          >
            <div
              className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${subject.gradient} opacity-0 group-hover:opacity-100 blur-2xl transition`}
              style={{ zIndex: -1 }}
            />

            <h2 className="text-2xl font-medium mb-4">{subject.name}</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              {subject.description}
            </p>

            <div className="mt-10 text-purple-400 opacity-0 group-hover:opacity-100 transition">
              Enter →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
