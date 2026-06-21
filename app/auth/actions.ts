'use server'

import { createClient } from '@/utils/supabase/server'
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
  const supabase = await createClient()

  console.log('=== SIGNUP START ===')
  console.log('name:', name, 'email:', email)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  })

  console.log('SIGNUP RESULT - data:', JSON.stringify(data, null, 2))
  console.log('SIGNUP RESULT - error:', JSON.stringify(error, null, 2))
  console.log('=== SIGNUP END ===')

  if (error) {
    return redirect('/signup?message=' + encodeURIComponent(error.message))
  }

  return redirect('/dashboard')
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
