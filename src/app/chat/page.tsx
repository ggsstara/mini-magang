"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import MessageInput from "@/components/MessageInput";

// Types matching database schema
interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  // ── Redirect if not authenticated ──
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // ── Load chat sessions on mount ──
  useEffect(() => {
    if (status === "authenticated") {
      loadChatSessions();
    }
  }, [status]);

  // ── Load messages when active chat changes ──
  useEffect(() => {
    if (activeId) {
      loadMessages(activeId);
    }
  }, [activeId]);

  const loadChatSessions = async () => {
    try {
      const res = await fetch("/api/chat/sessions");
      const data = await res.json();

      if (res.ok && data.chatSessions) {
        const formatted: Contact[] = data.chatSessions.map((session: any) => ({
          id: session.id,
          name: session.botName,
          avatar: session.botAvatar,
          lastMessage: session.lastMessage,
          time: session.lastTime,
          unread: session.unreadCount,
          online: session.isOnline,
        }));

        setContacts(formatted);
        if (formatted.length > 0 && !activeId) {
          setActiveId(formatted[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to load chat sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/chat/messages?sessionId=${sessionId}`);
      const data = await res.json();

      if (res.ok && data.messages) {
        const formatted: Message[] = data.messages.map((msg: any) => ({
          id: msg.id,
          sender: msg.sender,
          text: msg.text,
          time: msg.displayTime,
        }));

        setMessages(formatted);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
    setIsTyping(false);
    // Clear unread badge
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  }, []);

  const handleSend = async (text: string) => {
    if (!activeId) return;

    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      sender: "user",
      text,
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Optimistic update
    setMessages((prev) => [...prev, tempUserMsg]);

    // Update sidebar preview immediately
    setContacts((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, lastMessage: text, time: tempUserMsg.time }
          : c
      )
    );

    // Show typing indicator
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: activeId, text }),
      });

      const data = await res.json();

      if (res.ok) {
        // Replace temp message with real ones from DB
        setMessages((prev) => {
          const withoutTemp = prev.filter((m) => m.id !== tempUserMsg.id);
          return [
            ...withoutTemp,
            {
              id: data.userMessage.id,
              sender: "user",
              text: data.userMessage.text,
              time: data.userMessage.displayTime,
            },
            {
              id: data.botMessage.id,
              sender: "bot",
              text: data.botMessage.text,
              time: data.botMessage.displayTime,
            },
          ];
        });

        // Update sidebar with bot reply
        setContacts((prev) =>
          prev.map((c) =>
            c.id === activeId
              ? {
                  ...c,
                  lastMessage: data.botMessage.text,
                  time: data.botMessage.displayTime,
                }
              : c
          )
        );
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Remove temp message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
    } finally {
      setIsTyping(false);
    }
  };

  // ── Loading state ──
  if (status === "loading" || loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "var(--color-bg-dark)",
          color: "var(--color-text-primary)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ animation: "spin 0.8s linear infinite", margin: "0 auto" }}
          >
            <path d="M12 2a10 10 0 010 20" />
          </svg>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ marginTop: "16px", fontSize: "14px" }}>Memuat...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const activeContact = contacts.find((c) => c.id === activeId) || contacts[0];

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <Sidebar contacts={contacts} activeId={activeId} onSelect={handleSelect} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {activeContact ? (
          <>
            <ChatWindow
              contact={activeContact}
              messages={messages}
              isTyping={isTyping}
            />
            <MessageInput onSend={handleSend} />
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-text-muted)",
            }}
          >
            Pilih chat untuk memulai percakapan
          </div>
        )}
      </div>
    </div>
  );
}
