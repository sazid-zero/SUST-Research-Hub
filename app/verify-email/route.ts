import { NextResponse } from "next/server"
import { verifyEmailToken } from "@/app/actions/auth"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.redirect(new URL("/verify-email/result?error=Missing+verification+token", request.url))
  }

  const result = await verifyEmailToken(token)

  if (result.success) {
    const destination =
      result.role === "student"
        ? "/student/dashboard?verified=true"
        : result.role === "supervisor"
        ? "/supervisor/dashboard?verified=true"
        : "/login?verified=true"

    return NextResponse.redirect(new URL(destination, request.url))
  } else {
    const errorMsg = encodeURIComponent(result.error || "Verification failed")
    return NextResponse.redirect(new URL(`/verify-email/result?error=${errorMsg}`, request.url))
  }
}
