export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const limitParam = searchParams.get("limit");
    const limit = Math.max(1, Math.min(200, Number(limitParam) || 100));

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
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

    const messagesDesc = await prisma.message.findMany({
      where: { chatSessionId: sessionId },
      orderBy: { timestamp: "desc" },
      take: limit,
    });
    const messages = messagesDesc.reverse();

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
