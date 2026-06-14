import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  console.log('=== AUTH CONFIRM HIT ===')
  console.log('Full URL:', request.url)
  console.log('Search params:',
    Object.fromEntries(searchParams.entries()))

  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const code = searchParams.get('code')

  const supabase = await createClient()

  // Handle PKCE code exchange (newer Supabase flow)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    console.log('Auth result error:', error)
    if (!error) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Handle token_hash flow (older flow)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    console.log('Auth result error:', error)
    if (!error) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.redirect(
    new URL('/login?message=Link invalid or expired', request.url)
  )
}
