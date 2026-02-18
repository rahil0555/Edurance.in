"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
      }
    }

    checkAuth();
  }, [router]);

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>

      <p>Welcome to Edurance.</p>

      <button
        style={{ marginTop: 16 }}
        onClick={() => router.push("/class")}
      >
        Start Learning
      </button>

      <br />

      <button
        style={{ marginTop: 16 }}
        onClick={async () => {
          await supabase.auth.signOut();
          router.replace("/login");
        }}
      >
        Logout
      </button>
    </main>
  );
}
