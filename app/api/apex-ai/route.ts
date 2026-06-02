import { NextResponse } from "next/server";
import { APEX_AI_SYSTEM_PROMPT } from "@/lib/apex-ai-prompt";
import { getDefaultKnowledgeReply, getKnowledgeReply } from "@/lib/apex-knowledge";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = (body.messages || []) as ChatMessage[];
    const lastUser = [...messages].reverse().find((m) => m.role === "user");

    if (!lastUser?.content) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    const knowledge = getKnowledgeReply(lastUser.content);
    if (knowledge) {
      return NextResponse.json({ reply: knowledge });
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
            generationConfig: { maxOutputTokens: 512, temperature: 0.4 }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (reply && !/visit.*website|for specific details/i.test(reply)) {
          return NextResponse.json({ reply });
        }
      }
    }

    const fallback = getKnowledgeReply(lastUser.content);
    return NextResponse.json({ reply: fallback || getDefaultKnowledgeReply() });
  } catch {
    return NextResponse.json({ error: "Unable to process request" }, { status: 500 });
  }
}
