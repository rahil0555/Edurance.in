import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/* ---------- helpers ---------- */
function getSlideCount(classLevel: string) {
  const n = parseInt(classLevel.replace("Class ", ""));
  if (n <= 6) return 5;
  if (n === 7) return 6;
  if (n === 8 || n === 9) return 7;
  return 8; // Class 10
}

function extractJsonArray(text: string) {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

/* ---------- route ---------- */
export async function POST(req: Request) {
  try {
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

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

let { classLevel, subject, chapter } = body;

/* ✅ NORMALIZE CLASS */
if (typeof classLevel === "string") {
  classLevel = Number(classLevel.replace("Class", "").trim());
}

if (!classLevel || !subject || !chapter) {
  return NextResponse.json(
    { error: "Missing or invalid class / subject / chapter" },
    { status: 400 }
  );
}

    if (!classLevel || !subject || !chapter) {
      return NextResponse.json(
        { error: "Missing class / subject / chapter" },
        { status: 400 }
      );
    }

    /* ---------- check cache ---------- */
    const { data: existing } = await supabase
      .from("lessons")
      .select("slides")
      .eq("user_id", user.id)
      .eq("class", classLevel)
      .eq("subject", subject)
      .eq("chapter", chapter)
      .single();

    if (existing?.slides?.length) {
      return NextResponse.json({
        slides: existing.slides,
        cached: true,
      });
    }

    /* ---------- openai ---------- */
    const slideCount = getSlideCount(classLevel);

    const aiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          temperature: 0.3,
          messages: [
            {
              role: "system",
              content:
                "You are a strict JSON generator. Return ONLY valid JSON. No markdown, no explanation.",
            },
            {
              role: "user",
              content: `
Create EXACTLY ${slideCount} lesson slides for a student.

Class: ${classLevel}
Subject: ${subject}
Chapter: ${chapter}

Rules:
- Use age-appropriate language for ${classLevel}
- Each slide must have:
  - title
  - 4 to 6 detailed bullet points
- Bullets must be full explanatory sentences
- Slides must follow this order:
  1. Introduction / overview
  2. Definition
  3. Explanation
  4. Examples
  5. Importance / applications
  6+. Extra explanation or recap (for higher classes)

Output format (STRICT):
[
  {
    "title": "Slide title",
    "content": [
      "Sentence 1.",
      "Sentence 2."
    ]
  }
]
              `,
            },
          ],
        }),
      }
    );

    const aiData = await aiRes.json();
    const raw = aiData?.choices?.[0]?.message?.content;

    const slides = raw ? extractJsonArray(raw) : null;

    if (!Array.isArray(slides) || slides.length !== slideCount) {
      console.error("AI RAW OUTPUT:", raw);
      return NextResponse.json(
        { error: "AI returned invalid slides" },
        { status: 500 }
      );
    }

    /* ---------- save ---------- */
    await supabase.from("lessons").insert({
      user_id: user.id,
      class: classLevel,
      subject,
      chapter,
      slides,
    });

    return NextResponse.json({
      slides,
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
