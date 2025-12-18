import fetch from "node-fetch";

export async function callOpenAI(prompt, options = {}) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: options.model || "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: options.system || "you are a helpfull assistant",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: options.max_tokens || 800,
      temperature: options.temperature ?? 0.7,
    }),
  });

  if (!res.ok) throw new Error(`OpenAI error: ${await res.text()}`);
  const json = await res.json();
  return json;
}
