import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ChatClient, { type Contact, type Message } from "./ChatClient";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const chatSessions = await prisma.chatSession.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  const initialContacts: Contact[] = chatSessions.map((chatSession) => ({
    id: chatSession.id,
    name: chatSession.botName,
    avatar: chatSession.botAvatar,
    lastMessage: chatSession.lastMessage,
    time: chatSession.lastTime,
    unread: chatSession.unreadCount,
    online: chatSession.isOnline,
  }));

  let initialMessages: Message[] = [];

  if (chatSessions[0]) {
    const firstSessionMessages = await prisma.message.findMany({
      where: { chatSessionId: chatSessions[0].id },
      orderBy: { timestamp: "asc" },
    });

    initialMessages = firstSessionMessages.map((msg) => ({
      id: msg.id,
      sender: msg.sender as "user" | "bot",
      text: msg.text,
      time: msg.displayTime,
    }));
  }

  return (
    <div className="chat-shell">
      <ChatClient
        initialContacts={initialContacts}
        initialMessages={initialMessages}
      />
    </div>
  );
}

