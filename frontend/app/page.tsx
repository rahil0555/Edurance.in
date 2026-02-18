import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export default async function HomePage() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ✅ Logged in → dashboard
  if (user) {
    redirect("/dashboard");
  }

  // ❌ Not logged in → login
  redirect("/login");
}
