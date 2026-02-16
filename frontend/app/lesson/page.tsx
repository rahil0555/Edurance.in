"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Slide = {
  title: string;
  content: string[];
};

export default function LessonPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [presentationUrl, setPresentationUrl] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLesson = async () => {
      try {
        /* 1️⃣ Get logged-in user */
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        /* 2️⃣ Get selected class */
        const { data: userRow } = await supabase
          .from("users")
          .select("selected_class")
          .eq("id", user.id)
          .single();

        if (!userRow) {
          setError("User data not found");
          setLoading(false);
          return;
        }

        /* 3️⃣ Get subject & chapter */
        const subject = sessionStorage.getItem("selected_subject");
        const chapter = sessionStorage.getItem("selected_chapter");

        if (!subject || !chapter) {
          setError("Missing subject or chapter");
          setLoading(false);
          return;
        }

        /* 4️⃣ Call backend API */
        const res = await fetch("/api/lesson", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            classLevel: userRow.selected_class,
            subject,
            chapter,
          }),
        });

        const json = await res.json();

        if (!res.ok) {
          setError(json.error || "Lesson generation failed");
          setLoading(false);
          return;
        }

        /* 5️⃣ Save response */
        setSlides(json.slides || []);
        setPresentationUrl(json.presentationUrl || null);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Unexpected error");
        setLoading(false);
      }
    };

    loadLesson();
  }, []);

  if (loading) return <p>Generating lesson…</p>;
  if (error) return <p>{error}</p>;
  if (slides.length === 0) return <p>No slides available</p>;

  const slide = slides[currentSlide];

  return (
    <main style={{ maxWidth: "800px", margin: "40px auto" }}>
      <h1>Lesson</h1>

      {/* 🎥 Gamma Presentation */}
      {presentationUrl && (
        <div style={{ marginBottom: "30px" }}>
          <h2>Presentation</h2>
          <iframe
            src={presentationUrl}
            style={{ width: "100%", height: "600px", border: "1px solid #ddd" }}
            allowFullScreen
          />
        </div>
      )}

      {/* 📘 Slide Viewer */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h2>{slide.title}</h2>
        <ul>
          {slide.content.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>

      {/* ⬅️➡️ Navigation */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setCurrentSlide((s) => s - 1)}
          disabled={currentSlide === 0}
        >
          Previous
        </button>

        <span style={{ margin: "0 12px" }}>
          Slide {currentSlide + 1} of {slides.length}
        </span>

        <button
          onClick={() => setCurrentSlide((s) => s + 1)}
          disabled={currentSlide === slides.length - 1}
        >
          Next
        </button>
      </div>
    </main>
  );
}
