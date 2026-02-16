import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* -------------------- SUPABASE -------------------- */
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/* -------------------- GAMMA HELPER -------------------- */
async function createGammaPresentation(slides: any[]) {
  if (!process.env.GAMMA_API_KEY) {
    throw new Error("GAMMA_API_KEY missing");
  }

  const formattedText = slides
    .map(
      (s) =>
        `## ${s.title}\n${s.content
          .map((c: string) => `- ${c}`)
          .join("\n")}`
    )
    .join("\n\n");

  const res = await fetch("https://api.gamma.app/api/presentations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GAMMA_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: formattedText,
      theme: "educational",
      autoFormat: true,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Gamma error:", data);
    throw new Error("Gamma presentation failed");
  }

  return data.presentationUrl;
}

/* -------------------- API HANDLER -------------------- */
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Missing Authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { classLevel, subject, chapter } = await req.json();

    if (!classLevel || !subject || !chapter) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ---------- 1️⃣ CHECK DB ---------- */
    const { data: existingLesson } = await supabaseAdmin
      .from("lessons")
      .select("slides, presentation_url")
      .eq("user_id", user.id)
      .eq("class", classLevel)
      .eq("subject", subject)
      .eq("chapter", chapter)
      .single();

    if (existingLesson) {
      return NextResponse.json({
        slides: existingLesson.slides,
        presentationUrl: existingLesson.presentation_url,
        cached: true,
      });
    }

    /* ---------- 2️⃣ CALL OPENAI ---------- */
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY missing" },
        { status: 500 }
      );
    }

    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a strict JSON API. Return ONLY valid JSON. No markdown.",
            },
            {
              role: "user",
              content: `Create lesson slides in JSON for:
Class: ${classLevel}
Subject: ${subject}
Chapter: ${chapter}

Format:
[
  { "title": "Slide title", "content": ["Point 1", "Point 2"] }
]`,
            },
          ],
          temperature: 0.2,
        }),
      }
    );

    const openaiData = await openaiRes.json();

    const raw = openaiData?.choices?.[0]?.message?.content;

    if (!raw) {
      return NextResponse.json(
        { error: "Empty AI response" },
        { status: 500 }
      );
    }

    const slides = JSON.parse(raw);

    /* ---------- 3️⃣ GAMMA ---------- */
    const presentationUrl = await createGammaPresentation(slides);

    /* ---------- 4️⃣ SAVE ---------- */
    await supabaseAdmin.from("lessons").insert({
      user_id: user.id,
      class: classLevel,
      subject,
      chapter,
      slides,
      presentation_url: presentationUrl,
    });

    /* ---------- 5️⃣ RETURN ---------- */
    return NextResponse.json({
      slides,
      presentationUrl,
      cached: false,
    });
  } catch (err: any) {
    console.error("LESSON API ERROR:", err);
    return NextResponse.json(
      { error: err.message ?? "Server error" },
      { status: 500 }
    );
  }
}
