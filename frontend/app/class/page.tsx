"use client";

import { useRouter } from "next/navigation";

export default function ClassPage() {
  const router = useRouter();

  const classes = [
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
  ];

  function handleSelect(cls: string) {
    // ✅ store class
    sessionStorage.setItem("selected_class", cls);
    console.log("Class stored:", cls);

    // ✅ navigate to subject page
    router.push("/subject");
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Select your class</h1>
      <p>This helps us personalise your lessons</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {classes.map((cls) => (
          <button
            key={cls}
            onClick={() => handleSelect(cls)}
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {cls}
          </button>
        ))}
      </div>
    </div>
  );
}
