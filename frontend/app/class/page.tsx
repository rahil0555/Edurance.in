"use client";

import { useRouter } from "next/navigation";

const CLASSES = ["Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];

export default function ClassPage() {
  const router = useRouter();

  return (
    <div className="w-full px-6 py-16">
      {/* Header */}
      <div className="mb-14 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Choose Your Class
        </h1>
        <p className="mt-3 text-gray-400">
          This helps us tailor lessons to your level.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-6">
        {CLASSES.map((cls) => (
          <button
            key={cls}
            onClick={() => {
              sessionStorage.setItem("selected_class", cls);
              router.push("/subject");
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
            {cls}
          </button>
        ))}
      </div>
    </div>
  );
}
