import { NextRequest, NextResponse } from 'next/server'
import { deleteSessionCookie } from '@/lib/utils/cookies'
import { deleteSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await import('next/headers').then(m => m.cookies())
    const token = cookieStore.get('session_token')?.value

    if (token) {
      await deleteSession(token)
    }

    await deleteSessionCookie()

    return NextResponse.redirect(new URL('/login', request.url), {
      status: 303,
    })
  } catch (error) {
    console.error('[Logout] Error:', error)
    return NextResponse.redirect(new URL('/login', request.url), {
      status: 303,
    })
  }
}
