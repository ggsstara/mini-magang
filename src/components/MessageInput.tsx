 "use client";

import { useState, useRef } from "react";
import {
  SendIcon,
} from "@/components/icons";

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
    <div className="message-input-root">
      <div style={{ height: "8px" }} />

      {/* Input row */}
      <div className="message-input-box">
        <textarea
          ref={textRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ketik pesan Anda... (Enter untuk kirim)"
          rows={1}
          className="message-input-textarea"
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!value.trim()}
          className={`message-input-send-btn ${
            value.trim()
              ? "message-input-send-btn-active"
              : "message-input-send-btn-inactive"
          }`}
        >
          <SendIcon active={!!value.trim()} />
        </button>
      </div>

      {/* Hint */}
      <div className="message-input-hint">
        Shift + Enter untuk baris baru &nbsp;·&nbsp; Didukung oleh{" "}
        <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>
          Chatrigo AI
        </span>
      </div>
    </div>
  );
}
