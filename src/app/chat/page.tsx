"use client";

// Hook React yang dipakai untuk state & optimasi callback
import { useState, useCallback } from "react";

// Komponen UI utama
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import MessageInput from "@/components/MessageInput";

// Dummy data + tipe TypeScript
import {
  CONTACTS,
  INITIAL_MESSAGES,
  DUMMY_BOT_REPLIES,
  Contact,
  Message,
} from "@/data/dummyData";

// ─────────────────────────────────────────
// Helper: generate id unik sederhana
// (karena belum pakai database)
// ─────────────────────────────────────────
let counter = 9999;
function uid() {
  return String(++counter);
}

// ─────────────────────────────────────────
// Helper: ambil waktu sekarang (HH:MM)
// ─────────────────────────────────────────
function nowTime(): string {
  const d = new Date();
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

// ─────────────────────────────────────────
// Helper: balasan bot berurutan (loop)
// ─────────────────────────────────────────
let replyIndex = 0;
function getNextBotReply(): string {
  const reply =
    DUMMY_BOT_REPLIES[replyIndex % DUMMY_BOT_REPLIES.length];
  replyIndex++;
  return reply;
}

export default function ChatPage() {
  // Semua pesan disimpan per kontak (key = contact.id)
  // Deep clone agar dummy data tidak termutasi
  const [allMessages, setAllMessages] = useState<
    Record<string, Message[]>
  >(() => {
    const clone: Record<string, Message[]> = {};
    for (const key of Object.keys(INITIAL_MESSAGES)) {
      clone[key] = [...INITIAL_MESSAGES[key]];
    }
    return clone;
  });

  // Data kontak (sidebar)
  const [contacts, setContacts] = useState<Contact[]>(() => [...CONTACTS]);

  // Kontak yang sedang aktif
  const [activeId, setActiveId] = useState<string>(CONTACTS[0].id);

  // Status "bot sedang mengetik"
  const [isTyping, setIsTyping] = useState(false);

  // ─────────────────────────────────────────
  // Handler: memilih kontak di sidebar
  // ─────────────────────────────────────────
  const handleSelect = useCallback((id: string) => {
    // Ganti kontak aktif
    setActiveId(id);

    // Hentikan indikator typing saat ganti chat
    setIsTyping(false);

    // Reset unread badge pada kontak yang dipilih
    setContacts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, unread: 0 } : c
      )
    );
  }, []);

  // ─────────────────────────────────────────
  // Handler: kirim pesan user
  // ─────────────────────────────────────────
  const handleSend = useCallback(
    (text: string) => {
      const now = nowTime();

      // 1️⃣ Tambahkan pesan user ke chat aktif
      const userMsg: Message = {
        id: uid(),
        sender: "user",
        text,
        time: now,
      };

      setAllMessages((prev) => ({
        ...prev,
        [activeId]: [...(prev[activeId] || []), userMsg],
      }));

      // 2️⃣ Update preview terakhir di sidebar
      setContacts((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, lastMessage: text, time: now }
            : c
        )
      );

      // 3️⃣ Simulasi bot sedang mengetik
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);

        // Ambil balasan bot dummy
        const botReply = getNextBotReply();

        const botMsg: Message = {
          id: uid(),
          sender: "bot",
          text: botReply,
          time: nowTime(),
        };

        // Tambahkan pesan bot ke chat
        setAllMessages((prev) => ({
          ...prev,
          [activeId]: [...(prev[activeId] || []), botMsg],
        }));

        // Update sidebar dengan pesan bot terbaru
        setContacts((prev) =>
          prev.map((c) =>
            c.id === activeId
              ? {
                  ...c,
                  lastMessage: botReply,
                  time: nowTime(),
                }
              : c
          )
        );
      }, 1200 + Math.random() * 800); // Delay 1.2 – 2 detik
    },
    [activeId]
  );

  // Ambil data kontak yang sedang aktif
  const activeContact =
    contacts.find((c) => c.id === activeId) ?? contacts[0];

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Sidebar kontak */}
      <Sidebar
        contacts={contacts}
        activeId={activeId}
        onSelect={handleSelect}
      />

      {/* Area chat utama */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {/* Window pesan */}
        <ChatWindow
          contact={activeContact}
          messages={allMessages[activeId] || []}
          isTyping={isTyping}
        />

        {/* Input kirim pesan */}
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}
