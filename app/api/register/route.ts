import { NextRequest, NextResponse } from 'next/server'
import { register } from '@/app/actions/auth'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      fullName: formData.get('fullName') as string,
      role: formData.get('role') as 'student' | 'supervisor',
      studentId: formData.get('studentId') as string | undefined,
      department: formData.get('department') as string | undefined,
      specialization: formData.get('specialization') as string | undefined,
    }

    console.log('[v0][API] Registration request received for:', data.email)
    
    const result = await register(data)

    if (result.success) {
      // Redirect to success page
      return NextResponse.redirect(new URL('/auth/register/success', request.url))
    } else {
      // Redirect back with error
      const url = new URL('/auth/register', request.url)
      url.searchParams.set('error', result.error || 'Registration failed')
      return NextResponse.redirect(url)
    }
  } catch (error: any) {
    console.error('[v0][API] Registration error:', error)
    const url = new URL('/auth/register', request.url)
    url.searchParams.set('error', 'An unexpected error occurred')
    return NextResponse.redirect(url)
  }
}
