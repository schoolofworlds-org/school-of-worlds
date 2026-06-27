import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const code = searchParams.get('code')

  const supabase = await createClient()

  // Handle OAuth / PKCE code exchange (Google sign-in and magic links)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url))
  }

  // Handle token_hash flow (older flow)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.redirect(
    new URL(
      '/login?message=Link expired or invalid. Please request a new one.',
      request.url,
    ),
  )
}
