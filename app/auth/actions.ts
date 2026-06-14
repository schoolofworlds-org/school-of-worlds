'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  })

  console.log('========================')
  console.log('LOGIN ATTEMPT')
  console.log('Email:', email)
  console.log('SITE_URL env:', process.env.NEXT_PUBLIC_SITE_URL)
  console.log('Error object:', error)
  console.log('Error message:', error?.message)
  console.log('Error status:', error?.status)
  console.log('========================')

  if (error) {
    return redirect('/login?message=Could not authenticate user')
  }

  return redirect('/login?message=Check your email and click the link to sign in')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const name = formData.get('name') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
      data: {
        full_name: name,
      },
    },
  })

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
