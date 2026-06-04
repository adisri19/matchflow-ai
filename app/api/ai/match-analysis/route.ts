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

    const { customer, candidate } = await request.json();

    if (!customer || !candidate) {
      return NextResponse.json({ error: "Customer and candidate profiles are required" }, { status: 400 });
    }

    // 2. Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an elite, emotionally intelligent relationship consultant and matchmaker. You write warm, premium, and sophisticated compatibility summaries for clients."
        },
        {
          role: "user",
          content: `Please analyze the compatibility between our client and a suggested match:
          
          CLIENT:
          Name: ${customer.firstName} ${customer.lastName}
          Age/Gender: ${customer.age} / ${customer.gender}
          Location: ${customer.city}, ${customer.state}
          Religion/Caste: ${customer.religion} / ${customer.caste}
          Profession: ${customer.designation} at ${customer.company} (Income: ${customer.income} LPA)
          Hobbies: ${customer.hobbies.join(", ")}
          Values: ${customer.values.join(", ")}
          Bio: ${customer.bio}

          CANDIDATE MATCH:
          Name: ${candidate.firstName} ${candidate.lastName}
          Age/Gender: ${candidate.age} / ${candidate.gender}
          Location: ${candidate.city}, ${candidate.state}
          Religion/Caste: ${candidate.religion} / ${candidate.caste}
          Profession: ${candidate.designation} at ${candidate.company} (Income: ${candidate.income} LPA)
          Hobbies: ${candidate.hobbies.join(", ")}
          Values: ${candidate.values.join(", ")}
          Bio: ${candidate.bio}

          Write a warm, concise compatibility analysis (exactly 2-3 sentences). Highlight the specific emotional alignment, shared values, and potential lifestyle chemistry. Keep it optimistic and consultant-level.`
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const analysis = response.choices[0]?.message?.content?.trim() || "";

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error("AI Match Analysis Error:", error);
    return NextResponse.json({ error: "Failed to generate compatibility analysis" }, { status: 500 });
  }
}
