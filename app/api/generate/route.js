import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { destination, days, budget, style } = await req.json();

    const prompt = `
You are a travel planner.

Create a ${days}-day itinerary for ${destination}.
Budget: ${budget}
Style: ${style}

Respond in JSON with this structure ONLY:
{
  "destination": "",
  "overview": "",
  "itinerary": [
    {
      "day": 1,
      "title": "",
      "activities": [
        {
          "time": "",
          "place": "",
          "description": ""
        }
      ]
    }
  ]
}
`;

    const res = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            temperature: 0.7,
            max_new_tokens: 900,
          },
        }),
      }
    );

    const data = await res.json();

    // HF often returns array
    const text =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text
        : data.generated_text || "";

    if (!text) {
      return NextResponse.json(
        { error: "No text generated", raw: data },
        { status: 500 }
      );
    }

    // Extract JSON safely
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) {
      return NextResponse.json(
        { error: "No JSON found", text },
        { status: 500 }
      );
    }

    const jsonText = text.slice(start, end + 1);
    const itinerary = JSON.parse(jsonText);

    return NextResponse.json({ itinerary });
  } catch (err) {
    console.error("HF ERROR:", err);
    return NextResponse.json(
      { error: "Failed to generate itinerary", message: err.message },
      { status: 500 }
    );
  }
}
