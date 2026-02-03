"use client";

import Image from "next/image";
import Link from "next/link";
import { Contact } from "@/data/dummyData";

interface SidebarProps {
  contacts: Contact[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function Sidebar({ contacts, activeId, onSelect }: SidebarProps) {
  return (
    <aside
      style={{
        width: "320px",
        minWidth: "320px",
        backgroundColor: "var(--color-bg-sidebar)",
        borderRight: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* ── Logo Header ── */}
      <div
        style={{
          padding: "24px 20px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <Link href="/chat" style={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/logo-color.png"
            alt="Chatrigo"
            width={140}
            height={38}
            priority
            style={{ objectFit: "contain" }}
          />
        </Link>
        {/* User avatar pill */}
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: 700,
            color: "#fff",
            cursor: "pointer",
            position: "relative",
          }}
        >
          U
          {/* online dot */}
          <span
            style={{
              position: "absolute",
              bottom: "2px",
              right: "2px",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#22c55e",
              border: "2px solid var(--color-bg-sidebar)",
            }}
          />
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div style={{ padding: "16px 16px 12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--color-bg-input)",
            borderRadius: "10px",
            padding: "10px 14px",
          }}
        >
          {/* search icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Cari percakapan..."
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: "var(--color-text-primary)",
              fontSize: "13px",
              boxShadow: "none",
            }}
          />
        </div>
      </div>

      {/* ── Section Label ── */}
      <div
        style={{
          padding: "4px 20px 8px",
          fontSize: "11px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--color-text-muted)",
        }}
      >
        Percakapan
      </div>

      {/* ── Contact List ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 10px" }}>
        {contacts.map((contact, i) => {
          const isActive = contact.id === activeId;
          return (
            <button
              key={contact.id}
              onClick={() => onSelect(contact.id)}
              className="animate-slideIn"
              style={{
                animationDelay: `${i * 0.04}s`,
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "12px 10px",
                border: "none",
                borderRadius: "12px",
                marginBottom: "2px",
                cursor: "pointer",
                backgroundColor: isActive
                  ? "rgba(242, 101, 34, 0.12)"
                  : "transparent",
                borderLeft: isActive ? "3px solid var(--color-primary)" : "3px solid transparent",
                textAlign: "left",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              }}
            >
              {/* Avatar + online indicator */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: isActive
                      ? "linear-gradient(135deg, var(--color-primary), var(--color-secondary))"
                      : "linear-gradient(135deg, #3a3f52, #2a2e3d)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "15px",
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
                      bottom: "1px",
                      right: "1px",
                      width: "11px",
                      height: "11px",
                      borderRadius: "50%",
                      background: "#22c55e",
                      border: "2px solid var(--color-bg-sidebar)",
                    }}
                  />
                )}
              </div>

              {/* Text content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "2px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13.5px",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {contact.name}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--color-text-muted)",
                      flexShrink: 0,
                      marginLeft: "8px",
                    }}
                  >
                    {contact.time}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--color-text-muted)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "160px",
                    }}
                  >
                    {contact.lastMessage}
                  </span>
                  {contact.unread > 0 && (
                    <span
                      style={{
                        background: "var(--color-primary)",
                        color: "#fff",
                        fontSize: "10.5px",
                        fontWeight: 700,
                        minWidth: "18px",
                        height: "18px",
                        borderRadius: "9px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginLeft: "6px",
                      }}
                    >
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Bottom Nav ── */}
      <div
        style={{
          borderTop: "1px solid var(--color-border)",
          padding: "14px 16px",
          display: "flex",
          gap: "8px",
          justifyContent: "center",
        }}
      >
        {/* Settings icon */}
        <button
          style={{
            background: "var(--color-bg-input)",
            border: "none",
            borderRadius: "10px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          title="Settings"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>

        {/* Logout icon */}
        <Link
          href="/login"
          style={{
            background: "var(--color-bg-input)",
            border: "none",
            borderRadius: "10px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          title="Logout"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </Link>
      </div>
    </aside>
  );
}
