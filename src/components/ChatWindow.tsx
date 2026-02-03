"use client";

import { useEffect, useRef } from "react";
import { Message, Contact } from "@/data/dummyData";

interface ChatWindowProps {
  contact: Contact;
  messages: Message[];
  isTyping: boolean;
}

export default function ChatWindow({ contact, messages, isTyping }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages or typing state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      {/* ── Chat Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "16px 28px",
          borderBottom: "1px solid var(--color-border)",
          backgroundColor: "var(--color-bg-sidebar)",
          flexShrink: 0,
        }}
      >
        {/* Avatar */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "17px",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {contact.avatar}
          </div>
          {contact.online && (
            <span
              className="pulse-dot"
              style={{
                position: "absolute",
                bottom: "2px",
                right: "2px",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#22c55e",
                border: "2px solid var(--color-bg-sidebar)",
              }}
            />
          )}
        </div>

        {/* Name + status */}
        <div>
          <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--color-text-primary)" }}>
            {contact.name}
          </div>
          <div style={{ fontSize: "12px", color: contact.online ? "#22c55e" : "var(--color-text-muted)" }}>
            {contact.online ? "Online sekarang" : "Offline"}
          </div>
        </div>

        {/* Right actions */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
          {/* Phone */}
          <button style={{ background: "var(--color-bg-input)", border: "none", borderRadius: "10px", width: "38px", height: "38px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
          </button>
          {/* Video */}
          <button style={{ background: "var(--color-bg-input)", border: "none", borderRadius: "10px", width: "38px", height: "38px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </button>
          {/* More */}
          <button style={{ background: "var(--color-bg-input)", border: "none", borderRadius: "10px", width: "38px", height: "38px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="1" fill="var(--color-text-muted)" />
              <circle cx="12" cy="12" r="1" fill="var(--color-text-muted)" />
              <circle cx="12" cy="19" r="1" fill="var(--color-text-muted)" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Message Scroll Area ── */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 28px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          background: "var(--color-bg-dark)",
        }}
      >
        {messages.map((msg, i) => {
          const isBot = msg.sender === "bot"; // Bot sekarang di kanan
          const prevSameSender = i > 0 && messages[i - 1].sender === msg.sender;

          /* ── Bubble + Timestamp (shared) ── */
          const BubbleContent = (
            <div style={{ maxWidth: "520px" }}>
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: isBot ? "var(--color-bubble-user)" : "var(--color-bubble-bot)",
                  color: "#fff",
                  padding: "10px 16px",
                  borderRadius: isBot ? "18px 18px 6px 18px" : "18px 18px 18px 6px",
                  fontSize: "13.5px",
                  lineHeight: 1.55,
                  boxShadow: isBot
                    ? "0 2px 8px rgba(242,101,34,0.25)"
                    : "0 2px 6px rgba(0,0,0,0.2)",
                  wordBreak: "break-word",
                }}
              >
                {msg.text}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--color-text-muted)",
                  marginTop: "4px",
                  textAlign: isBot ? "right" : "left",
                  paddingLeft: isBot ? undefined : "4px",
                  paddingRight: isBot ? "4px" : undefined,
                }}
              >
                {msg.time}
                {isBot && (
                  <span style={{ marginLeft: "4px" }}>
                    <svg style={{ display: "inline", verticalAlign: "middle" }} width="14" height="10" viewBox="0 0 14 10" fill="none">
                      <path d="M1 5L4.5 8.5L13 1" stroke="var(--color-secondary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M4 5L7.5 8.5L16 1" stroke="var(--color-secondary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" transform="translate(-3,0)" />
                    </svg>
                  </span>
                )}
              </div>
            </div>
          );

          /* ── Avatar User ── */
          const UserAvatar = (
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              U
            </div>
          );

          /* ── BOT → rata kanan ── */
          if (isBot) {
            return (
              <div
                key={msg.id}
                className="animate-fadeIn"
                style={{
                  animationDelay: `${Math.min(i * 0.06, 0.4)}s`,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >
                {BubbleContent}
              </div>
            );
          }

          /* ── USER → rata kiri ── */
          return (
            <div
              key={msg.id}
              className="animate-fadeIn"
              style={{
                animationDelay: `${Math.min(i * 0.06, 0.4)}s`,
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-end",
                gap: "10px",
              }}
            >
              {!prevSameSender ? UserAvatar : <div style={{ width: "32px", flexShrink: 0 }} />}
              {BubbleContent}
            </div>
          );
        })}

        {/* ── Typing Indicator ── */}
        {isTyping && (
          <div className="animate-fadeIn" style={{ display: "flex", alignItems: "flex-end", gap: "10px", justifyContent: "flex-end" }}>
            <div
              style={{
                backgroundColor: "var(--color-bubble-user)",
                padding: "14px 18px",
                borderRadius: "18px 18px 6px 18px",
                display: "flex",
                gap: "5px",
                alignItems: "center",
                boxShadow: "0 2px 8px rgba(242,101,34,0.25)",
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#fff",
                    animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}