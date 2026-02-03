import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chatrigo – AI Chat",
  description: "Modern AI-powered chat application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
