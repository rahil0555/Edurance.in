"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Card from "@/components/Card";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);

  // 🔐 Auth + user data check
  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("selected_class")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setSelectedClass(data?.selected_class ?? null);
      setLoading(false);
    };

    loadUser();
  }, [router]);

  // 🚪 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (loading) {
    return (
      <Card>
        <p className="text-center text-gray-500">Loading dashboard…</p>
      </Card>
    );
  }

  return (
    <Card>
      {/* Header */}
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">
        Continue where you left off
      </p>

      {/* Progress Section */}
      <div className="space-y-4">
        {/* Class */}
        <div className="flex items-center justify-between border p-4 rounded-lg">
          <span className="text-gray-700">Class selected</span>
          {selectedClass ? (
            <span className="text-green-600 font-semibold">
              Class {selectedClass} ✔
            </span>
          ) : (
            <button
              onClick={() => router.push("/class")}
              className="text-blue-600 font-medium hover:underline"
            >
              Select →
            </button>
          )}
        </div>

        {/* Subject */}
        <div className="flex items-center justify-between border p-4 rounded-lg">
          <span className="text-gray-700">Subject</span>
          <button
            onClick={() => router.push("/subject")}
            className="text-blue-600 font-medium hover:underline"
          >
            Choose →
          </button>
        </div>

        {/* Lesson */}
        <div className="flex items-center justify-between border p-4 rounded-lg">
          <span className="text-gray-700">Start lesson</span>
          <button
            onClick={() => router.push("/lesson")}
            className="text-blue-600 font-medium hover:underline"
          >
            Open →
          </button>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-8 w-full bg-gray-900 text-white py-3 rounded-lg hover:opacity-90 transition"
      >
        Logout
      </button>
    </Card>
  );
}
