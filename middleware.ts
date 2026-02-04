export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // Protect semua routes KECUALI:
    // - /login, /register
    // - /api/register, /api/auth
    // - Static files (_next/static, images, dll)
    "/((?!login|register|api/register|api/auth|_next/static|_next/image|favicon.ico|logo-.*\\.png).*)",
  ],
};