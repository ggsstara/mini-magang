"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Password strength ──
  const getStrength = (): { label: string; color: string; width: string } => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: "Lemah", color: "#ef4444", width: "20%" };
    if (score <= 2) return { label: "Cukup", color: "#f59e0b", width: "40%" };
    if (score <= 3) return { label: "Baik", color: "#3b82f6", width: "65%" };
    return { label: "Kuat", color: "#22c55e", width: "100%" };
  };

  const strength = password ? getStrength() : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi tidak cocok.");
      return;
    }
    if (password.length < 6) {
      setError("Password harus minimal 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      // Register user
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registrasi gagal");
        setLoading(false);
        return;
      }

      // Auto-login after successful registration
      const signInResult = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInResult?.error) {
        setError("Registrasi berhasil, silakan login manual");
        setLoading(false);
        router.push("/login");
      } else {
        router.push("/chat");
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  // ── Reusable input styles ──
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px 13px 42px",
    backgroundColor: "var(--color-bg-input)",
    border: "1px solid var(--color-border)",
    borderRadius: "12px",
    color: "var(--color-text-primary)",
    fontSize: "14px",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "6px",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--color-text-secondary)",
  };

  const iconWrap: React.CSSProperties = {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
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
      {/* ── Decorative blobs ── */}
      <div style={{ position: "absolute", bottom: "-200px", left: "-150px", width: "480px", height: "480px", borderRadius: "50%", background: "radial-gradient(circle, rgba(242,101,34,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "-160px", right: "-140px", width: "440px", height: "440px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,154,86,0.11) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "560px", height: "560px", borderRadius: "50%", background: "radial-gradient(circle, rgba(242,101,34,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* ── Card ── */}
      <div
        className="animate-fadeIn"
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "440px",
          margin: "0 16px",
          background: "var(--color-bg-card)",
          borderRadius: "24px",
          border: "1px solid var(--color-border)",
          padding: "40px 36px 32px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <Image src="/logo-color.png" alt="Chatrigo" width={160} height={44} priority style={{ objectFit: "contain" }} />
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "var(--color-text-primary)" }}>
            Buat Akun Baru
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "var(--color-text-muted)" }}>
            Bergabunglah dengan Chatrigo hari ini
          </p>
        </div>

        {/* Error toast */}
        {error && (
          <div
            className="animate-fadeIn"
            style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "10px",
              padding: "10px 14px",
              marginBottom: "18px",
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

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <label style={labelStyle}>Nama Lengkap</label>
          <div style={{ position: "relative", marginBottom: "14px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconWrap}>
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="8" r="4" />
            </svg>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
            />
          </div>

          {/* Email */}
          <label style={labelStyle}>Email</label>
          <div style={{ position: "relative", marginBottom: "14px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconWrap}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="anda@email.com"
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
            />
          </div>

          {/* Password */}
          <label style={labelStyle}>Password</label>
          <div style={{ position: "relative", marginBottom: "8px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconWrap}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ ...inputStyle, paddingRight: "42px" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
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

          {/* Strength bar */}
          {strength && (
            <div style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ fontSize: "11.5px", color: "var(--color-text-muted)" }}>Kekuatan password</span>
                <span style={{ fontSize: "11.5px", fontWeight: 600, color: strength.color }}>{strength.label}</span>
              </div>
              <div style={{ height: "4px", background: "var(--color-bg-input)", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: strength.width, background: strength.color, borderRadius: "2px", transition: "width 0.35s ease, background 0.35s ease" }} />
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <label style={labelStyle}>Konfirmasi Password</label>
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconWrap}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
            />
            {/* Match indicator */}
            {confirmPassword && (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke={password === confirmPassword ? "#22c55e" : "#ef4444"}
                style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)" }}
              >
                {password === confirmPassword ? (
                  <polyline points="20 6 9 17 4 12" />
                ) : (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                )}
              </svg>
            )}
          </div>

          {/* Terms checkbox */}
          <label
            style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "22px", cursor: "pointer" }}
          >
            <input
              type="checkbox"
              required
              style={{
                width: "18px",
                height: "18px",
                marginTop: "1px",
                flexShrink: 0,
                accentColor: "var(--color-primary)",
                cursor: "pointer",
              }}
            />
            <span style={{ fontSize: "13px", color: "var(--color-text-muted)", lineHeight: 1.45 }}>
              Saya menyetujui{" "}
              <a href="#" style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 500 }}>Syarat & Ketentuan</a>
              {" "}dan{" "}
              <a href="#" style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 500 }}>Kebijakan Privasi</a>
            </span>
          </label>

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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "transform 0.15s",
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
              "Buat Akun"
            )}
          </button>
        </form>

        {/* Login link */}
        <p style={{ textAlign: "center", fontSize: "14px", color: "var(--color-text-muted)", marginTop: "24px", marginBottom: 0 }}>
          Sudah punya akun?{" "}
          <Link href="/login" style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
