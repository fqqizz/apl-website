import { NextResponse } from "next/server";
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

    return NextResponse.json({
      reply: getKnowledgeReply(lastUser.content) || getDefaultKnowledgeReply(lastUser.content)
    });
  } catch {
    return NextResponse.json({ error: "Unable to process request" }, { status: 500 });
  }
}
