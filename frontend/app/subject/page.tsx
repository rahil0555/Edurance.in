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

    // Extract class number from "Class 5"
    const classNumber = parseInt(cls.replace("Class ", ""));

    if (classNumber >= 5 && classNumber <= 9) {
      setSubjects(["Science", "Social Studies"]);
    } else if (classNumber === 10) {
      setSubjects(["Physics", "Biology", "Social Studies"]);
    }

    setLoading(false);
  }, [router]);

  if (loading) return <p>Loading subjects...</p>;

  return (
    <main style={{ padding: 24 }}>
      <h1>Select Subject</h1>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => {
              sessionStorage.setItem("selected_subject", subject);
              router.push("/chapter");
            }}
            style={{
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          >
            {subject}
          </button>
        ))}
      </div>
    </main>
  );
}
