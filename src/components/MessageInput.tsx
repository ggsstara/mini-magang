"use client";

import { useState, useRef } from "react";

interface MessageInputProps {
  onSend: (text: string) => void;
}

export default function MessageInput({ onSend }: MessageInputProps) {
  const [value, setValue] = useState("");
  const textRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
    textRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        padding: "18px 24px",
        borderTop: "1px solid var(--color-border)",
        backgroundColor: "var(--color-bg-sidebar)",
        flexShrink: 0,
      }}
    >
      {/* Toolbar icons row */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
        {/* Attachment */}
        <button
          style={{
            background: "var(--color-bg-input)",
            border: "none",
            borderRadius: "8px",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          title="Lampiran"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a4.5 4.5 0 01-6.36-6.36l9.19-9.19a3 3 0 014.24 4.24l-9.2 9.19a1.5 1.5 0 01-2.12-2.12l8.49-8.48" />
          </svg>
        </button>
        {/* Image */}
        <button
          style={{
            background: "var(--color-bg-input)",
            border: "none",
            borderRadius: "8px",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          title="Gambar"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </button>
        {/* GIF / Sticker */}
        <button
          style={{
            background: "var(--color-bg-input)",
            border: "none",
            borderRadius: "8px",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          title="GIF"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="6" width="22" height="12" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
            <line x1="12" y1="6" x2="12" y2="18" />
            <polyline points="8 10 6 12 8 14" />
            <line x1="15" y1="10" x2="15" y2="14" />
            <line x1="18" y1="10" x2="18" y2="14" />
            <line x1="15" y1="12" x2="18" y2="12" />
          </svg>
        </button>
      </div>

      {/* Input row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "12px",
          backgroundColor: "var(--color-bg-input)",
          borderRadius: "14px",
          padding: "10px 12px 10px 18px",
        }}
      >
        <textarea
          ref={textRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ketik pesan Anda... (Enter untuk kirim)"
          rows={1}
          style={{
            flex: 1,
            resize: "none",
            background: "none",
            border: "none",
            outline: "none",
            color: "var(--color-text-primary)",
            fontSize: "14px",
            lineHeight: 1.5,
            maxHeight: "120px",
            overflowY: "auto",
            boxShadow: "none",
            fontFamily: "inherit",
          }}
        />

        {/* Emoji btn */}
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          title="Emoji"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </button>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!value.trim()}
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: value.trim()
              ? "linear-gradient(135deg, var(--color-primary), var(--color-secondary))"
              : "var(--color-bg-dark)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: value.trim() ? "pointer" : "not-allowed",
            flexShrink: 0,
            boxShadow: value.trim() ? "0 3px 12px rgba(242,101,34,0.35)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={value.trim() ? "#fff" : "var(--color-text-muted)"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" fill={value.trim() ? "#fff" : "none"} stroke={value.trim() ? "#fff" : "var(--color-text-muted)"} />
          </svg>
        </button>
      </div>

      {/* Hint */}
      <div style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "8px", textAlign: "center" }}>
        Shift + Enter untuk baris baru &nbsp;·&nbsp; Didukung oleh <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>Chatrigo AI</span>
      </div>
    </div>
  );
}
