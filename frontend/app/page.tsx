"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
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
      } else {
        router.replace("/dashboard");
      }
    };

    run();
  }, [router]);

  return <p>Redirecting...</p>;
}
