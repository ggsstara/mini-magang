"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import MessageInput from "@/components/MessageInput";

// Types shared with server page
export interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

export interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
}

interface ChatClientProps {
  initialContacts: Contact[];
  initialMessages?: Message[];
}

export default function ChatClient({
  initialContacts,
  initialMessages = [],
}: ChatClientProps) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [activeId, setActiveId] = useState<string>(
    initialContacts[0]?.id ?? ""
  );
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);

  // Track latest session to avoid race conditions when switching fast
  const latestSessionIdRef = useRef<string | null>(null);
  const initialLoadedRef = useRef<boolean>(!!initialMessages.length);
  const abortControllerRef = useRef<AbortController | null>(null);

  // ── Load messages when active chat changes ──
  useEffect(() => {
    if (!activeId) return;

    // Skip immediate refetch for the very first active session
    if (initialLoadedRef.current) {
      initialLoadedRef.current = false;
      return;
    }

    void loadMessages(activeId);
  }, [activeId]);

  const loadMessages = async (sessionId: string) => {
    try {
      latestSessionIdRef.current = sessionId;
      // Cancel any in-flight request for previous session
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const res = await fetch(`/api/chat/messages?sessionId=${sessionId}`, {
        cache: "no-store",
        signal: controller.signal,
      });
      const data = await res.json();

      if (res.ok && data.messages && latestSessionIdRef.current === sessionId) {
        const formatted: Message[] = data.messages.map((msg: any) => ({
          id: msg.id,
          sender: msg.sender,
          text: msg.text,
          time: msg.displayTime,
        }));

        setMessages(formatted);
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        // Swallow abort errors – we intentionally cancelled
        return;
      }
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
      } else {
        // Remove temp message and show error
        setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
        const errMsg = data?.details || data?.error || "Failed to send message";
        console.error("Chat send error:", errMsg);
        alert(errMsg);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Remove temp message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
    } finally {
      setIsTyping(false);
    }
  };

  const activeContact = useMemo(
    () => contacts.find((c) => c.id === activeId) ?? contacts[0] ?? null,
    [contacts, activeId]
  );

  return (
    <>
      <Sidebar contacts={contacts} activeId={activeId} onSelect={handleSelect} />

      <div className="chat-column">
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
          <div className="chat-center-muted">Pilih chat untuk memulai percakapan</div>
        )}
      </div>
    </>
  );
}

