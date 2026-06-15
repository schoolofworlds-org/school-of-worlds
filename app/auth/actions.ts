'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Login is for existing users only — never create an account here.
      shouldCreateUser: false,
      // TODO: restore `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm` before release.
      emailRedirectTo: 'http://localhost:3000/auth/confirm',
    },
  })

  if (error) {
    return redirect(
      '/login?message=Could not send login link. Please check your email and try again.',
    )
  }

  return redirect('/login?message=Check your email for the sign-in link')
}

export async function signup(formData: FormData) {
  // Debug step 1: dump everything that actually arrived in the FormData.
  console.log('RAW FORMDATA ENTRIES:')
  for (const [key, value] of formData.entries()) {
    console.log(key, ':', value)
  }

  const email = formData.get('email') as string
  const name = formData.get('name') as string
  console.log('SIGNUP DATA:', { email, name })
  console.log('SUPABASE URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      // Debug step 2: hardcoded instead of `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`.
      emailRedirectTo: 'http://localhost:3000/auth/confirm',
      data: {
        full_name: name,
      },
    },
  })

  // Debug step 3: full error detail (2.7s suggests Supabase SMTP/email failure).
  console.log('FULL ERROR:', JSON.stringify(error))

  if (error) {
    return redirect('/signup?message=Could not create user')
  }

  return redirect('/signup?message=Check your email and click the link to sign in')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function verifyOtp(formData: FormData) {
  const email = formData.get('email') as string
  const token = formData.get('token') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })

  if (error) {
    return redirect(`/login?message=Invalid OTP`)
  }

  return redirect('/dashboard')
}
