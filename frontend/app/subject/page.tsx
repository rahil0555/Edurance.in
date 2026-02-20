"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

/* ---------- SUBJECT IDENTITY MAP ---------- */
const SUBJECTS_BY_CLASS: Record<string, {
  name: string;
  gradient: string;
  glow: string;
  description: string;
}[]> = {
  "Class 5": [
    {
      name: "Science",
      gradient: "from-blue-500 to-cyan-400",
      glow: "rgba(80,140,255,0.6)",
      description: "Explore the natural world and basic scientific ideas",
    },
    {
      name: "Social Studies",
      gradient: "from-purple-500 to-pink-500",
      glow: "rgba(200,90,160,0.6)",
      description: "Understand society, civics, and human systems",
    },
  ],
  "Class 6": [
    {
      name: "Science",
      gradient: "from-blue-500 to-cyan-400",
      glow: "rgba(80,140,255,0.6)",
      description: "Build scientific thinking and experimentation",
    },
    {
      name: "Social Studies",
      gradient: "from-purple-500 to-pink-500",
      glow: "rgba(200,90,160,0.6)",
      description: "History, geography, and governance foundations",
    },
  ],
  "Class 10": [
    {
      name: "Physics",
      gradient: "from-blue-400 to-indigo-500",
      glow: "rgba(120,160,255,0.6)",
      description: "Laws of motion, energy, and the universe",
    },
    {
      name: "Biology",
      gradient: "from-emerald-400 to-teal-500",
      glow: "rgba(90,200,160,0.6)",
      description: "Life, systems, and biological intelligence",
    },
    {
      name: "Social Studies",
      gradient: "from-purple-500 to-pink-500",
      glow: "rgba(200,90,160,0.6)",
      description: "Society, economics, and political systems",
    },
  ],
};

export default function SubjectPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<typeof SUBJECTS_BY_CLASS["Class 5"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data } = await supabase
        .from("users")
        .select("selected_class")
        .eq("id", user.id)
        .single();

      if (!data?.selected_class) {
        router.replace("/class");
        return;
      }

      setSubjects(SUBJECTS_BY_CLASS[data.selected_class] || []);
      setLoading(false);
    };

    load();
  }, [router]);

  if (loading) {
    return <p className="text-center mt-20">Loading subjects…</p>;
  }

  return (
    <div className="min-h-screen px-6 py-16">
      {/* Header */}
      <div className="text-center mb-16 fade-up">
        <h1 className="text-3xl font-semibold tracking-tight">
          Choose a Subject
        </h1>
        <p className="mt-3 text-sm text-[var(--text-muted)]">
          Each subject unlocks a different way of thinking
        </p>
      </div>

      {/* SUBJECT IDEA CARDS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {subjects.map((subject, index) => (
          <div
            key={subject.name}
            onClick={() => {
              sessionStorage.setItem("selected_subject", subject.name);
              router.push("/chapter");
            }}
            className={`
              relative group cursor-pointer
              glass p-8 rounded-2xl
              transition-all duration-300
              hover:-translate-y-2
            `}
            style={{
              animationDelay: `${index * 80}ms`,
            }}
          >
            {/* Identity Glow */}
            <div
              className={`
                absolute inset-0 rounded-2xl opacity-0
                group-hover:opacity-100 transition
                bg-gradient-to-br ${subject.gradient}
              `}
              style={{
                filter: "blur(60px)",
                zIndex: -1,
              }}
            />

            {/* Content */}
            <h2 className="text-xl font-medium mb-3">
              {subject.name}
            </h2>

            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              {subject.description}
            </p>

            {/* Action Hint */}
            <div className="mt-8 text-sm text-purple-400 opacity-0 group-hover:opacity-100 transition">
              Explore →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
