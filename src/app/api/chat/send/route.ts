export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Dummy bot replies (akan diganti dengan AI nanti)
const DUMMY_BOT_REPLIES = [
  "Terima kasih atas pesan Anda! Saya sedang memproses informasi tersebut. 🤔",
  "Poin yang sangat bagus! Mari kita diskusikan lebih lanjut.",
  "Saya mengerti. Biarkan saya cari solusi terbaik untuk Anda.",
  "Informasi Anda telah diterima. Akan segera saya tindaklanjuti.",
  "Sounds great! Saya akan membantu Anda menyelesaikan hal ini sekarang.",
  "Menarik sekali! Bisa Anda berikan lebih banyak detail untuk saya proses?",
  "Oke, saya akan menganalisis hal tersebut dan memberikan rekomendasi terbaik.",
  "Done! Hasilnya sudah saya siapkan untuk Anda. ✅",
  "Sempurna, langkah selanjutnya akan saya atur otomatis.",
  "Baru saja saya periksa — semuanya berjalan lancar di sisi server. 🟢",
];

let replyIndex = 0;

function getNextBotReply(): string {
  const reply = DUMMY_BOT_REPLIES[replyIndex % DUMMY_BOT_REPLIES.length];
  replyIndex++;
  return reply;
}

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

    // Generate bot reply
    const botReplyText = getNextBotReply();
    const botMessage = await prisma.message.create({
      data: {
        chatSessionId: sessionId,
        sender: "bot",
        text: botReplyText,
        displayTime: formatTime(),
        timestamp: new Date(now.getTime() + 1500), // 1.5s delay simulation
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
