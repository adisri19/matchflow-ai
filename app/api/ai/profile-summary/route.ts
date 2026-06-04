import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { openai } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    // 1. Session Auth Protection
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { profile } = await request.json();

    if (!profile) {
      return NextResponse.json({ error: "Profile details are required" }, { status: 400 });
    }

    // 2. Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert matchmaking consultant. You summarize candidate profiles into elegant, highly attractive, and emotionally intelligent 1-2 sentence descriptions."
        },
        {
          role: "user",
          content: `Please generate a warm, premium, and concise summary (1-2 sentences) of this profile for our internal database:
          
          Name: ${profile.firstName} ${profile.lastName}
          Age: ${profile.age}
          City: ${profile.city}
          Degree: ${profile.degree}
          Profession: ${profile.designation} at ${profile.company} (Income: ${profile.income} LPA)
          Hobbies: ${profile.hobbies.join(", ")}
          Values: ${profile.values.join(", ")}
          Bio: ${profile.bio}

          Highlight their character, professional success, and core relationship approach. Do not mention their name to keep it objective.`
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const summary = response.choices[0]?.message?.content?.trim() || "";

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("AI Profile Summary Error:", error);
    return NextResponse.json({ error: "Failed to generate profile summary" }, { status: 500 });
  }
}
