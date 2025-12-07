import { type NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/admin", "/student", "/supervisor"]
const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/register",
  "/browse",
  "/help",
  "/contact",
  "/privacy",
  "/terms",
  "/faq",
  "/login",
  "/register",
]

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
  if (isProtected) {
    const token = request.cookies.get("session_token")?.value
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
