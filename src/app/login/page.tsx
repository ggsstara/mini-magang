"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push("/chat");
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg-dark)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Decorative gradient blobs ── */}
      <div
        style={{
          position: "absolute",
          top: "-180px",
          left: "-180px",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(242,101,34,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-200px",
          right: "-160px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,154,86,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(242,101,34,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Card ── */}
      <div
        className="animate-fadeIn"
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "420px",
          margin: "0 16px",
          background: "var(--color-bg-card)",
          borderRadius: "24px",
          border: "1px solid var(--color-border)",
          padding: "44px 36px 36px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Image
            src="/logo-color.png"
            alt="Chatrigo"
            width={160}
            height={44}
            priority
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "var(--color-text-primary)" }}>
            Selamat Datang Kembali
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "var(--color-text-muted)" }}>
            Masuk ke akun Anda untuk melanjutkan
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email field */}
          <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: "var(--color-text-secondary)" }}>
            Email
          </label>
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-text-muted)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="anda@email.com"
              required
              style={{
                width: "100%",
                padding: "13px 16px 13px 42px",
                backgroundColor: "var(--color-bg-input)",
                border: "1px solid var(--color-border)",
                borderRadius: "12px",
                color: "var(--color-text-primary)",
                fontSize: "14px",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
            />
          </div>

          {/* Password field */}
          <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: "var(--color-text-secondary)" }}>
            Password
          </label>
          <div style={{ position: "relative", marginBottom: "8px" }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-text-muted)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "13px 42px 13px 42px",
                backgroundColor: "var(--color-bg-input)",
                border: "1px solid var(--color-border)",
                borderRadius: "12px",
                color: "var(--color-text-primary)",
                fontSize: "14px",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
            />
            {/* Toggle visibility */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {showPassword ? (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </>
                ) : (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                )}
              </svg>
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div
              className="animate-fadeIn"
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "10px",
                padding: "10px 14px",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span style={{ fontSize: "13px", color: "#ef4444" }}>{error}</span>
            </div>
          )}

          {/* Forgot password link */}
          <div style={{ textAlign: "right", marginBottom: "24px" }}>
            <a
              href="#"
              style={{
                fontSize: "13px",
                color: "var(--color-primary)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Lupa password?
            </a>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "15px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.75 : 1,
              boxShadow: "0 4px 16px rgba(242,101,34,0.35)",
              transition: "transform 0.15s, box-shadow 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.975)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {loading ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}>
                  <path d="M12 2a10 10 0 010 20" />
                </svg>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </>
            ) : (
              "Masuk"
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", margin: "24px 0", gap: "12px" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
          <span style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>atau</span>
          <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
        </div>

        {/* Social login placeholder */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            style={{
              flex: 1,
              padding: "12px",
              background: "var(--color-bg-input)",
              border: "1px solid var(--color-border)",
              borderRadius: "12px",
              color: "var(--color-text-secondary)",
              fontSize: "13.5px",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button
            style={{
              flex: 1,
              padding: "12px",
              background: "var(--color-bg-input)",
              border: "1px solid var(--color-border)",
              borderRadius: "12px",
              color: "var(--color-text-secondary)",
              fontSize: "13.5px",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="#fff">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29.47.08.61-.2.61-.45v-1.69c-2.59.56-3.14-1.25-3.14-1.25-.42-1.08-1.04-1.36-1.04-1.36-.85-.58.06-.57.06-.57.93.07 1.42.96 1.42.96.83 1.41 2.17.99 2.7.76.08-.6.32-1 .58-1.23-2.07-.24-4.24-1.04-4.24-4.64 0-1.02.37-1.86 0.96-2.51-.1-.24-.42-1.19.09-2.48 0 0 .78-.25 2.55.95.74-.2 1.54-.3 2.34-.3s1.6.1 2.34.3c1.77-1.2 2.55-.95 2.55-.95.51 1.29.19 2.24.09 2.48.6.66.96 1.49.96 2.51 0 3.61-2.18 4.39-4.26 4.62.33.28.63.82.63 1.66V21c0 .25.14.53.62.45C19.36 19.85 22 16.24 22 12 22 6.48 17.52 2 12 2z"/>
            </svg>
            GitHub
          </button>
        </div>

        {/* Register link */}
        <p style={{ textAlign: "center", fontSize: "14px", color: "var(--color-text-muted)", marginTop: "28px", marginBottom: 0 }}>
          Belum punya akun?{" "}
          <Link
            href="/register"
            style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
