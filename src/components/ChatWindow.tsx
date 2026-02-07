 "use client";

import { useEffect, useRef } from "react";
import type { Contact, Message } from "@/app/chat/ChatClient";
import { DoubleCheckIcon } from "@/components/icons";

interface ChatWindowProps {
  contact: Contact;
  messages: Message[];
  isTyping: boolean;
}

export default function ChatWindow({
  contact,
  messages,
  isTyping,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages or typing state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="chat-column">
      {/* ── Chat Header ── */}
      <div className="chat-header">
        {/* Avatar */}
        <div style={{ position: "relative" }}>
          <div className="chat-avatar-lg">{contact.avatar}</div>
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
          <div
            style={{
              fontSize: "12px",
              color: contact.online ? "#22c55e" : "var(--color-text-muted)",
            }}
          >
            {contact.online ? "Online sekarang" : "Offline"}
          </div>
        </div>

        <div style={{ flex: 1 }} />
      </div>

      {/* ── Message Scroll Area ── */}
      <div ref={scrollRef} className="chat-scroll">
        {messages.map((msg, i) => {
          const isBot = msg.sender === "bot"; // Bot sekarang di kanan
          const prevSameSender = i > 0 && messages[i - 1].sender === msg.sender;

          /* ── Bubble + Timestamp (shared) ── */
          const BubbleContent = (
            <div style={{ maxWidth: "520px" }}>
              <div
                className={`chat-bubble ${
                  isBot ? "chat-bubble-user" : "chat-bubble-bot"
                }`}
              >
                {msg.text}
              </div>
              <div
                className="chat-time"
                style={{
                  textAlign: isBot ? "right" : "left",
                  paddingLeft: isBot ? undefined : "4px",
                  paddingRight: isBot ? "4px" : undefined,
                }}
              >
                {msg.time}
                {isBot && (
                  <span style={{ marginLeft: "4px" }}>
                    <DoubleCheckIcon style={{ display: "inline", verticalAlign: "middle" }} />
                  </span>
                )}
              </div>
            </div>
          );

          /* ── Avatar User ── */
          const UserAvatar = (
            <div
              className="chat-avatar-sm"
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
                style={{ animationDelay: `${Math.min(i * 0.06, 0.4)}s` }}
              >
                <div className="chat-row chat-row-right">{BubbleContent}</div>
              </div>
            );
          }

          /* ── USER → rata kiri ── */
          return (
            <div
              key={msg.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${Math.min(i * 0.06, 0.4)}s` }}
            >
              <div className="chat-row chat-row-left">
                {!prevSameSender ? (
                  UserAvatar
                ) : (
                  <div style={{ width: "32px", flexShrink: 0 }} />
                )}
                {BubbleContent}
              </div>
            </div>
          );
        })}

        {/* ── Typing Indicator ── */}
        {isTyping && (
          <div className="animate-fadeIn chat-typing">
            <div className="chat-typing-bubble">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="chat-typing-dot"
                  style={{
                    animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
              ></span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
