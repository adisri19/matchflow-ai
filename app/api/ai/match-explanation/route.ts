import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

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

    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    // Fallback Mock Mode if no key is configured
    if (!anthropicKey || anthropicKey === "dummy-key") {
      const mockText = `Both individuals show a natural alignment between their lifestyles, with a mutual appreciation for ${customer.hobbies[0] || "travel"} and matching views on relocation. Their professions as ${customer.designation} and ${candidate.designation} respectively provide a stable foundation, further strengthened by their shared ${customer.religion} background and local proximity in ${customer.city}.`;
      return NextResponse.json({ explanation: mockText });
    }

    // Call Anthropic Messages API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: `You are an elite, highly sophisticated matrimonial relationship consultant and matchmaking expert. Explain in exactly 2-3 lines why the following two clients are compatible. Use their profession, hobbies, location, religion, and lifestyle as context.
            
            CLIENT 1:
            Name: ${customer.firstName} ${customer.lastName}
            Profession: ${customer.designation} at ${customer.company}
            Hobbies: ${customer.hobbies.join(", ")}
            Location: ${customer.city}, ${customer.state}
            Religion: ${customer.religion} (${customer.caste})
            Lifestyle: Relocate? ${customer.openToRelocate}, Wants Kids? ${customer.wantsKids}, Pets? ${customer.openToPets}
            
            CLIENT 2:
            Name: ${candidate.firstName} ${candidate.lastName}
            Profession: ${candidate.designation} at ${candidate.company}
            Hobbies: ${candidate.hobbies.join(", ")}
            Location: ${candidate.city}, ${candidate.state}
            Religion: ${candidate.religion} (${candidate.caste})
            Lifestyle: Relocate? ${candidate.openToRelocate}, Wants Kids? ${candidate.wantsKids}, Pets? ${candidate.openToPets}
            
            Provide a warm, sophisticated, professional explanation (exactly 2-3 lines/sentences). Do not include any greeting, intro, or concluding text. Be concise and polished.`
          }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API Error details:", errText);
      throw new Error(`Anthropic API responded with status ${response.status}`);
    }

    const data = await response.json();
    const explanation = data.content?.[0]?.text?.trim() || "";

    return NextResponse.json({ explanation });
  } catch (error: any) {
    console.error("Anthropic API Match Explanation Error:", error);
    return NextResponse.json({ error: "Failed to generate compatibility explanation" }, { status: 500 });
  }
}
