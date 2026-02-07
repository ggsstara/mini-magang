export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 10;
const MAX_INPUT_LENGTH = 4000;
const userRateMap = new Map<string, number[]>();

function formatTime(): string {
  return new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, text } = await req.json();

    if (!sessionId || !text?.trim()) {
      return NextResponse.json(
        { error: "Session ID and message text required" },
        { status: 400 }
      );
    }
    if (text.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        { error: "Message too long" },
        { status: 413 }
      );
    }

    const nowMs = Date.now();
    const arr = userRateMap.get(session.user.id) || [];
    const recent = arr.filter((t) => nowMs - t < RATE_WINDOW_MS);
    if (recent.length >= RATE_MAX) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }
    recent.push(nowMs);
    userRateMap.set(session.user.id, recent);

    // Verify session belongs to user
    const chatSession = await prisma.chatSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id,
      },
    });

    if (!chatSession) {
      return NextResponse.json(
        { error: "Chat session not found" },
        { status: 404 }
      );
    }

    const now = new Date();
    const displayTime = formatTime();

    const historyDesc = await prisma.message.findMany({
      where: { chatSessionId: sessionId },
      orderBy: { timestamp: "desc" },
      take: 10,
      select: { sender: true, text: true },
    });
    const historyAsc = historyDesc.reverse();

    // Create user message
    const userMessage = await prisma.message.create({
      data: {
        chatSessionId: sessionId,
        sender: "user",
        text: text.trim(),
        displayTime,
        timestamp: now,
      },
    });

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 }
      );
    }

    const model = process.env.OPENROUTER_MODEL || "google/gemma-3-27b-it:free";
    const messages = [
      { role: "system" as const, content: "Kamu adalah asisten helpful." },
      ...historyAsc.map((m) => ({
        role: (m.sender === "user" ? "user" : "assistant") as "user" | "assistant",
        content: m.text,
      })),
      { role: "user" as const, content: text.trim() },
    ];

    let data: any = null;
    let lastErrorText = "";
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
            "X-Title": "Chatrigo",
          },
          body: JSON.stringify({ model, messages, max_tokens: 4096 }),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (res.ok) {
          data = await res.json();
          break;
        } else {
          lastErrorText = await res.text();
          if (res.status === 401 || res.status === 403 || res.status === 429) {
            break;
          }
        }
      } catch (e: any) {
        lastErrorText = String(e?.message || e);
      }
    }
    if (!data && lastErrorText) {
      console.error("OpenRouter error:", lastErrorText);
      return NextResponse.json(
        {
          error: "OpenRouter API connection failed",
          details: lastErrorText,
        },
        { status: 502 }
      );
    }
    let botReplyText = "Maaf, terjadi kesalahan saat memproses permintaan.";
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content === "string" && content.trim()) {
      botReplyText = content.trim();
    }

    const botMessage = await prisma.message.create({
      data: {
        chatSessionId: sessionId,
        sender: "bot",
        text: botReplyText,
        displayTime: formatTime(),
        timestamp: new Date(),
      },
    });

    // Update chat session last message & time
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        lastMessage: botReplyText,
        lastTime: formatTime(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        userMessage: {
          id: userMessage.id,
          text: userMessage.text,
          displayTime: userMessage.displayTime,
        },
        botMessage: {
          id: botMessage.id,
          text: botMessage.text,
          displayTime: botMessage.displayTime,
        },
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
