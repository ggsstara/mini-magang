export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "LLM API key not configured" },
        { status: 500 }
      );
    }

    const contents = [
      ...historyAsc.map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      })),
      {
        role: "user",
        parts: [{ text: text.trim() }],
      },
    ];

    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    let data: any = null;
    let lastErrorText = "";
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: "Kamu adalah asisten helpful." }],
              },
              contents,
            }),
            signal: controller.signal,
          }
        );
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
      console.error("Gemini error:", lastErrorText);
      // Return actual error to help debug connection issues
      return NextResponse.json(
        {
          error: "Gemini API connection failed",
          details: lastErrorText,
        },
        { status: 502 }
      );
    }
    let botReplyText = "Maaf, terjadi kesalahan saat memproses permintaan.";
    if (data?.candidates?.[0]?.content?.parts) {
      const parts = data.candidates[0].content.parts;
      const textParts = parts
        .map((p: any) => (typeof p.text === "string" ? p.text : ""))
        .filter(Boolean);
      if (textParts.length > 0) {
        botReplyText = textParts.join("\n\n").trim();
      }
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
