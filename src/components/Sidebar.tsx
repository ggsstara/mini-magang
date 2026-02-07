 "use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { memo } from "react";
import type { Contact } from "@/app/chat/ChatClient";
import {
  SearchIcon,
  SettingsIcon,
  LogoutIcon,
} from "@/components/icons";

interface SidebarProps {
  contacts: Contact[];
  activeId: string;
  onSelect: (id: string) => void;
}

function Sidebar({
  contacts,
  activeId,
  onSelect,
}: SidebarProps) {
  return (
    <aside className="sidebar-root">
      {/* ── Logo Header ── */}
      <div className="sidebar-header">
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
          className="sidebar-user-pill"
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
      <div className="sidebar-search">
        <div className="sidebar-search-inner">
          {/* search icon */}
          <SearchIcon />
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
      <div className="sidebar-section-label">
        Percakapan
      </div>

      {/* ── Contact List ── */}
      <div className="sidebar-list">
        {contacts.map((contact, i) => {
          const isActive = contact.id === activeId;
          const btnClass = `sidebar-contact-btn${
            isActive ? " sidebar-contact-btn-active" : ""
          }`;
          return (
            <button
              key={contact.id}
              onClick={() => onSelect(contact.id)}
              className={`animate-slideIn ${btnClass}`}
              style={{ animationDelay: `${i * 0.04}s` }}
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
      <div className="sidebar-bottom">
        {/* Settings icon */}
        <button
          className="sidebar-icon-button"
          title="Settings"
        >
          <SettingsIcon />
        </button>

        {/* Logout icon */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="sidebar-icon-button"
          title="Logout"
        >
          <LogoutIcon />
        </button>
      </div>
    </aside>
  );
}

export default memo(Sidebar);
