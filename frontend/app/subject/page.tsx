"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SubjectPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubjects = async () => {
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

      if (!data || data.selected_class === null) {
        router.replace("/class");
        return;
      }

      const cls = data.selected_class;

      if (cls >= 5 && cls <= 9) {
        setSubjects(["Science", "Social Studies"]);
      } else if (cls === 10) {
        setSubjects(["Physics", "Biology", "Social Studies"]);
      }

      setLoading(false);
    };

    loadSubjects();
  }, [router]);

  if (loading) return <p>Loading subjects...</p>;

  return (
    <main>
      <h1>Select Subject</h1>

      <div>
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => {
              sessionStorage.setItem("selected_subject", subject);
              router.replace("/chapter");
            }}
            style={{
              padding: "12px",
              margin: "8px",
            }}
          >
            {subject}
          </button>
        ))}
      </div>
    </main>
  );
}
