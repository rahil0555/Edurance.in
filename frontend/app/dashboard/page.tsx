"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
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

      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main>
      <h1>Dashboard</h1>

      <p>Class selected ✔</p>

      {/* NEW BUTTON FOR STEP 3 */}
      <button
        onClick={() => router.push("/subject")}
        style={{ marginTop: "12px" }}
      >
        Continue to Subjects
      </button>

      <br />
      <br />

      <button onClick={handleLogout}>Logout</button>
    </main>
  );
}
