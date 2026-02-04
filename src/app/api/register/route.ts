import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Validasi input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password harus minimal 6 karakter" },
        { status: 400 }
      );
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru dengan initial chat session
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        chatSessions: {
          create: {
            botName: "Chatrigo Assistant",
            botAvatar: "C",
            lastMessage: "Halo! Selamat datang di Chatrigo 👋",
            lastTime: "Baru saja",
            isOnline: true,
            messages: {
              create: {
                sender: "bot",
                text: "Halo! Selamat datang di Chatrigo 👋 Saya adalah asisten AI Anda. Bagaimana saya bisa membantu Anda hari ini?",
                displayTime: new Date().toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Registrasi berhasil",
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat registrasi" },
      { status: 500 }
    );
  }
}
