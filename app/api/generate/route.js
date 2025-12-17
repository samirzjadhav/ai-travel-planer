import { NextResponse } from "next/server";
import { z } from "zod";

const ItinerarySchema = z.object({
  destination: z.string(),
  overview: z.string().optional(),
  total_cost_estimate: z.string().optional(),
  days: z.number().optional(),
  itinerary: z.array(
    z.object({
      day: z.number(),
      title: z.string().optional(),
      activities: z.array(
        z.object({
          time: z.string().optional(),
          place: z.string().optional(),
          description: z.string().optional(),
          estimated_cost: z.string().optional(),
        })
      ),
    })
  ),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      destination = "",
      days = 3,
      budget = "unspecified",
      style = "Balanced",
    } = body;

    const userPrompt = `
You are a travel planner assistant. Generate a multi-day itinerary in STRICT JSON only.  
Fields required: destination, overview, total_cost_estimate, itinerary (array of day objects).
Each day object must have: day (number), title (short), activities (array).
Each activity: time (string), place (string), description (string), estimated_cost (string).

Destination: ${destination}
Days: ${days}
Budget: ${budget}
Style: ${style}

Return ONLY valid JSON — no backticks, no explanation.
`;
    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful travel planner." },
            { role: "user", content: userPrompt },
          ],
          max_tokens: 1200,
          temperature: 0.7,
        }),
      }
    );

    if (!openaiRes.ok) {
      const text = await openaiRes.text();
      return NextResponse.json(
        { error: "OpenAI error", details: text },
        { status: 500 }
      );
    }

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content || "";

    let jsonText = reply;
    const firstBrace = reply.indexOf("{");
    if (firstBrace !== -1) {
      jsonText = reply.slice(firstBrace);

      const lastBrace = jsonText.lastIndexOf("}");
      if (lastBrace !== -1) jsonText = jsonText.slice(0, lastBrace + 1);
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (parseErr) {
      return NextResponse.json(
        { error: "Failed to parse AI JSON", reply },
        { status: 500 }
      );
    }

    const result = ItinerarySchema.safeParse(parsed);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.format(), parsed },
        { status: 500 }
      );
    }

    if (!parsed.days)
      parsed.days = Array.isArray(parsed.itinerary)
        ? parsed.itinerary.length
        : days;

    return NextResponse.json({ itinerary: parsed });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
