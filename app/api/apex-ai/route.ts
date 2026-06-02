import { NextResponse } from "next/server";
import { APEX_AI_SYSTEM_PROMPT } from "@/lib/apex-ai-prompt";

type ChatMessage = { role: "user" | "assistant"; content: string };

function fallbackReply(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("register") && q.includes("player")) {
    return "Register as a player at /register/player. Complete the form, pay ₹249 securely, and you'll receive your Player ID after APL review. Check status at /status.";
  }
  if (q.includes("franchise")) {
    return "Franchise ownership is at /register/franchise. Founding spots are limited for Season One. The committee reviews every application.";
  }
  if (q.includes("fee") || q.includes("cost") || q.includes("price")) {
    return "Player registration is ₹249 via secure online checkout. For franchise investment details, call +91 8491900407.";
  }
  if (q.includes("status")) {
    return "Check your application at /status using your Player ID (e.g. APL-4821).";
  }
  if (q.includes("baramulla") || q.includes("kashmir")) {
    return "APL is based in Baramulla, North Kashmir — the first structured professional football league from the valley. Players from across Kashmir are welcome.";
  }
  return "For specific details, visit apexpremiereleague.in or call +91 8491900407. I can help with registration, franchises, fees, and Season One.";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = (body.messages || []) as ChatMessage[];
    const lastUser = [...messages].reverse().find((m) => m.role === "user");

    if (!lastUser?.content) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

    if (apiKey) {
      const contents = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: APEX_AI_SYSTEM_PROMPT }] },
            contents,
            generationConfig: { maxOutputTokens: 512, temperature: 0.7 }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) return NextResponse.json({ reply: reply.trim() });
      }
    }

    return NextResponse.json({ reply: fallbackReply(lastUser.content) });
  } catch {
    return NextResponse.json({ error: "Unable to process request" }, { status: 500 });
  }
}
