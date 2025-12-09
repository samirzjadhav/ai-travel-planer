// app/api/generate/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { destination, days, budget, style } = body;

    // Build prompt that instructs the model to return JSON
    const prompt = `
You are a travel-planning assistant. Generate a multi-day itinerary in strict JSON format for the user.

Destination: ${destination}
Days: ${days}
Budget: ${budget}
Travel style: ${style}

Return JSON only with this structure:
{
  "destination": "...",
  "overview": "...",
  "total_cost_estimate": "...",
  "itinerary": [
    {
      "day": 1,
      "title": "Morning/Evening summary",
      "activities": [
         {"time":"9:00 AM","place":"Place name","description":"...","estimated_cost":"..."}
      ]
    }
  ]
}

Make the plan realistic but concise. Do not include extra commentary.
    `.trim();

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
            { role: "user", content: prompt },
          ],
          max_tokens: 1000,
          temperature: 0.8,
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
    // Extract assistant reply (text)
    const reply = data.choices?.[0]?.message?.content || "";

    // Attempt to parse JSON out of the reply (many times model returns JSON string)
    let parsed;
    try {
      // Try to find the first JSON object in the text and parse it
      const jsonStart = reply.indexOf("{");
      const jsonText = jsonStart !== -1 ? reply.slice(jsonStart) : reply;
      parsed = JSON.parse(jsonText);
    } catch (err) {
      // If parsing fails, send back the raw response so client can show it for debugging
      return NextResponse.json(
        { error: "Failed to parse AI response", reply },
        { status: 500 }
      );
    }

    return NextResponse.json({ itinerary: parsed });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
