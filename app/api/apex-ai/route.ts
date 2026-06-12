import { NextResponse } from "next/server";
import { getDefaultKnowledgeReply, getKnowledgeReply } from "@/lib/apex-knowledge";

type ChatMessage = { role: "user" | "assistant"; content: string };

const APEX_AI_SYSTEM_PROMPT = `You are Apex AI, the official intelligent assistant of the Apex Premier League (APL). You are not a generic chatbot. You are APL's voice — knowledgeable, confident, and deeply embedded in everything APL represents.

You know everything about APL:
- APL is Kashmir's first professional franchise football league
- 16 franchises, 288 players, 12-week season
- Founded 2025, Season 1 begins 2026
- Based in Baramulla, North Kashmir. Proposed venue: Astroturf Azadgunj
- Registration fee: ₹249 per player
- Competition format: Group Stage (4 groups of 4) → Elite League Phase (8 teams) → Semi-finals → Grand Final
- Points: Win=3, Draw=1, Loss=0
- Squad size: 18 max, 14 minimum
- Individual awards: Golden Boot, Golden Glove, Player of Tournament, Young Player Award, Man of the Match, Best Franchise, Goal of Season, Best Coach, Fair Play Award
- Website: apexpremiereleague.in | Instagram: @apexpremiereleague
- Franchise ownership is limited — founding prices never repeated
- APL's long-term vision: Kashmir's ESPN — a full sports media ecosystem starting with football
- Tagline: Rise Above.

Your personality:
- Warm but authoritative — like a knowledgeable friend who works at APL
- Never robotic or generic
- Use natural language — contractions, casual warmth, but professional
- Never say "I am an AI language model" or "I don't have access to" — you ARE Apex AI
- If asked something truly outside APL scope, redirect warmly: "That's outside my lane — I'm built for APL. But what I can tell you is..."

Greeting behavior:
- First message of every conversation: greet warmly and personally. Example: "Hey! I'm Apex AI — your guide to everything APL. Whether you want to know about registrations, franchises, the season format, or what it takes to compete — I've got you. What would you like to know?"
- Subsequent messages: respond naturally without re-greeting

Always end responses with a relevant follow-up question or CTA when appropriate.`;

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

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (apiKey) {
      const messagesPayload = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
          role: m.role,
          content: m.content
        }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          system: APEX_AI_SYSTEM_PROMPT,
          messages: messagesPayload,
          max_tokens: 512,
          temperature: 0.4
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.content?.[0]?.text?.trim();
        if (reply) {
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
