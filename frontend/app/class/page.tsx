"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ClassSelectionPage() {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async () => {
    if (!selectedClass) return;

    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { error } = await supabase
      .from("users")
      .update({ selected_class: selectedClass })
      .eq("id", user.id);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.replace("/dashboard");
  };

  return (
    <main>
      <h1>Select Your Class</h1>

      <div>
        {[5, 6, 7, 8, 9, 10].map((cls) => (
          <button
            key={cls}
            onClick={() => setSelectedClass(cls)}
            style={{
              padding: "12px",
              margin: "8px",
              background: selectedClass === cls ? "black" : "#ddd",
              color: selectedClass === cls ? "white" : "black",
            }}
          >
            Class {cls}
          </button>
        ))}
      </div>

      {error && <p>{error}</p>}

      <br />

      <button onClick={handleContinue} disabled={loading || !selectedClass}>
        {loading ? "Saving..." : "Continue"}
      </button>
    </main>
  );
}
