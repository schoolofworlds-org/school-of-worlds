'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/login?message=' + encodeURIComponent('Invalid email or password'))
  }

  return redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 1. Create an already-confirmed user with the service role — sends NO email.
  const admin = createAdminClient()
  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name },
  })

  if (createError) {
    // e.g. duplicate email, weak password
    return redirect('/signup?message=' + encodeURIComponent(createError.message))
  }

  // 2. Sign the new user in on the SSR client to set the session cookies.
  const supabase = await createClient()
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
    return redirect(
      '/login?message=' + encodeURIComponent('Account created — please sign in.'),
    )
  }

  // 3. Session is set — go to the dashboard.
  redirect('/dashboard')
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
