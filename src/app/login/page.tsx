"use client";

// Hook React untuk state lokal
import { useState } from "react";

// Router Next.js App Router untuk redirect halaman
import { useRouter } from "next/navigation";

// Komponen Image & Link bawaan Next.js
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  // Inisialisasi router untuk navigasi
  const router = useRouter();

  // State untuk menyimpan input email
  const [email, setEmail] = useState("");

  // State untuk menyimpan input password
  const [password, setPassword] = useState("");

  // State untuk toggle tampil/sembunyi password
  const [showPassword, setShowPassword] = useState(false);

  // State loading untuk simulasi proses login
  const [loading, setLoading] = useState(false);

  // Handler saat form login disubmit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi sederhana: email & password wajib diisi
    if (!email || !password) return;

    // Aktifkan loading
    setLoading(true);

    // Simulasi delay jaringan lalu redirect ke halaman chat
    setTimeout(() => {
      router.push("/chat");
    }, 600);
  };

  return (
    // Wrapper utama halaman login
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
      {/* ===== Elemen dekorasi background (blob gradasi) ===== */}
      {/* Blob kiri atas */}
      <div
        style={{
          position: "absolute",
          top: "-180px",
          left: "-180px",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(242,101,34,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Blob kanan bawah */}
      <div
        style={{
          position: "absolute",
          bottom: "-200px",
          right: "-160px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,154,86,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Blob tengah untuk depth visual */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(242,101,34,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ===== Card Login ===== */}
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
        {/* Logo aplikasi */}
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

        {/* Judul & deskripsi */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 700,
              color: "var(--color-text-primary)",
            }}
          >
            Selamat Datang Kembali
          </h1>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: "14px",
              color: "var(--color-text-muted)",
            }}
          >
            Masuk ke akun Anda untuk melanjutkan
          </p>
        </div>

        {/* ===== Form Login ===== */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Input Email */}
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--color-text-secondary)",
            }}
          >
            Email
          </label>

          <div style={{ position: "relative", marginBottom: "16px" }}>
            {/* Icon email */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-text-muted)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>

            {/* Field email */}
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
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--color-primary)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--color-border)")
              }
            />
          </div>

          {/* Input Password */}
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--color-text-secondary)",
            }}
          >
            Password
          </label>

          <div style={{ position: "relative", marginBottom: "8px" }}>
            {/* Field password dengan toggle visibility */}
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
              }}
            />

            {/* Tombol lihat/sembunyikan password */}
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
              }}
            >
              {/* Icon mata */}
            </button>
          </div>

          {/* Tombol submit */}
          <button type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        {/* Link ke halaman register */}
        <p style={{ textAlign: "center", marginTop: "28px" }}>
          Belum punya akun?{" "}
          <Link href="/register">Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
}
