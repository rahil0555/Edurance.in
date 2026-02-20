"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const CLASSES = ["Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];

export default function ClassSelectionPage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);

  /* ---------- SCROLL WHEEL ROTATION ---------- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        setActiveIndex((i) => (i + 1) % CLASSES.length);
      } else {
        setActiveIndex((i) => (i - 1 + CLASSES.length) % CLASSES.length);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  /* ---------- DRAG ROTATION ---------- */
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const diff = e.clientX - startX.current;

    if (Math.abs(diff) > 50) {
      setActiveIndex((i) =>
        diff < 0
          ? (i + 1) % CLASSES.length
          : (i - 1 + CLASSES.length) % CLASSES.length
      );
      startX.current = e.clientX;
    }
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  /* ---------- CONFIRM SELECTION ---------- */
  const selectClass = async () => {
    const selectedClass = CLASSES[activeIndex];

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    await supabase
  .from("users")
  .update({ selected_class: selectedClass })
  .eq("id", user.id);

/* ✅ ADD THIS LINE */
sessionStorage.setItem("selected_class", selectedClass);

router.push("/subject");

  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-12">
      {/* Header */}
      <div className="text-center fade-up">
        <h1 className="text-3xl font-semibold tracking-tight">
          Select Your Class
        </h1>
        <p className="mt-3 text-sm text-[var(--text-muted)]">
          Scroll or drag to rotate
        </p>
      </div>

      {/* ROTATION CONTAINER */}
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="
          relative w-full max-w-4xl h-[260px]
          flex items-center justify-center
          cursor-grab active:cursor-grabbing
          select-none
        "
      >
        {CLASSES.map((cls, index) => {
          const offset = index - activeIndex;

          const scale = offset === 0 ? 1.1 : 0.85;
          const opacity = Math.abs(offset) > 2 ? 0 : 0.6;
          const translateX = offset * 220;

          return (
            <div
              key={cls}
              className={`
                absolute transition-all duration-300 ease-out
                ${offset === 0 ? "z-20" : "z-10"}
              `}
              style={{
                transform: `
                  translateX(${translateX}px)
                  scale(${scale})
                `,
                opacity,
              }}
            >
              <div
                className={`
                  glass px-10 py-6 text-xl font-medium
                  ${offset === 0 ? "energy" : ""}
                `}
              >
                {cls}
              </div>
            </div>
          );
        })}
      </div>

      {/* CONFIRM BUTTON */}
      <button
        onClick={selectClass}
        className="
          px-8 py-3 rounded-xl
          bg-gradient-to-r from-purple-600 to-pink-500
          text-white font-medium
          transition
          hover:shadow-[0_0_40px_rgba(160,90,255,0.55)]
          hover:scale-[1.05]
          active:scale-[0.97]
        "
      >
        Continue with {CLASSES[activeIndex]}
      </button>
    </div>
  );
}
