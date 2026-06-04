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

    const sharedHobbies = customer.hobbies.filter((h: string) => candidate.hobbies.includes(h));
    const sharedValues = customer.values.filter((v: string) => candidate.values.includes(v));

    // 2. Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a senior relationship manager at a premium matrimonial service. You draft highly personalized, warm, and professional introduction emails sent from the matchmaker to a client to introduce a potential match."
        },
        {
          role: "user",
          content: `Please draft an introduction email from me (their matchmaker) to our client ${customer.firstName}, proposing ${candidate.firstName} as a potential match.

          CLIENT DETAILS:
          Name: ${customer.firstName} ${customer.lastName}
          Hobbies: ${customer.hobbies.join(", ")}
          Values: ${customer.values.join(", ")}

          CANDIDATE DETAILS:
          Name: ${candidate.firstName} ${candidate.lastName}
          Age: ${candidate.age}
          City: ${candidate.city}
          Profession: ${candidate.designation} at ${candidate.company}
          Hobbies: ${candidate.hobbies.join(", ")}
          Values: ${candidate.values.join(", ")}
          Bio: ${candidate.bio}

          HIGHLIGHTS:
          ${sharedHobbies.length > 0 ? `- Shared hobbies: ${sharedHobbies.join(", ")}` : ""}
          ${sharedValues.length > 0 ? `- Shared values: ${sharedValues.join(", ")}` : ""}

          The email should have:
          1. A premium, warm Subject Line.
          2. A greeting ("Dear ${customer.firstName},").
          3. A body paragraph summarizing why ${candidate.firstName} is a great match, highlighting their common ground (hobbies/values) and profession/lifestyle alignment.
          4. A call to action suggesting a brief introductory call.
          5. A warm sign-off from "Your Matchmaking Consultant".

          Do not use raw placeholder brackets like [Name] in the final text. Keep the message around 150 words.`
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const intro = response.choices[0]?.message?.content?.trim() || "";

    return NextResponse.json({ intro });
  } catch (error: any) {
    console.error("AI Generate Intro Error:", error);
    return NextResponse.json({ error: "Failed to generate introduction message" }, { status: 500 });
  }
}
