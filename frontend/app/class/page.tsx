"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Card from "@/components/Card";

const CLASSES = [6, 7, 8, 9, 10];

export default function ClassPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setLoading(false);
    };

    checkUser();
  }, [router]);

  const selectClass = async (classNumber: number) => {
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Not authenticated");
      return;
    }

    const { error } = await supabase
      .from("users")
      .update({ selected_class: classNumber })
      .eq("id", user.id);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/subject");
  };

  if (loading) return <p>Loading…</p>;

  return (
    <Card>
      <h1 className="text-3xl font-bold mb-2">Select your class</h1>
      <p className="text-gray-500 mb-6">
        This helps us personalise your lessons
      </p>

      <div className="space-y-3">
        {CLASSES.map((cls) => (
          <button
            key={cls}
            onClick={() => selectClass(cls)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-left hover:bg-gray-100 transition"
          >
            Class {cls}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-4">
          {error}
        </p>
      )}
    </Card>
  );
}
