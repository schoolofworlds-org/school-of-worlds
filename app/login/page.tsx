import { Plus_Jakarta_Sans } from 'next/font/google'
import { Mail } from 'lucide-react'
import { login } from '@/app/auth/actions'
import PasswordField from './password-field'
import GoogleSignInButton from '@/components/google-sign-in-button'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['600', '700'] })

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const { message } = await searchParams

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden bg-[#F5F1E8]">
      {/* Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-[#E5DDD0] rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 w-full max-w-md px-4 md:px-0 py-20">
        <div className="bg-white border border-[#E5DDD0] rounded-xl shadow-[0_4px_20px_rgba(11,18,32,0.04)] p-6 md:p-12 flex flex-col items-center">
          {/* Logo (uses your existing /logo.png) */}
          <div className="mb-12 w-32 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="School of Worlds Logo" className="w-full h-auto object-contain" />
          </div>

          {/* Header */}
          <div className="text-center mb-20">
            <h1 className={`${jakarta.className} text-2xl font-semibold text-black mb-1`}>
              Welcome Back, Explorer
            </h1>
            <p className="text-base text-[#605e58] opacity-80">
              Sign in to continue your world-building journey.
            </p>
          </div>

          {message && message.trim().length > 0 && (
            <p className="w-full mb-6 p-3 rounded-lg text-center text-sm bg-[#ffdad6] text-[#93000a]">
              {message}
            </p>
          )}

          <form action={login} className="w-full space-y-6">
            {/* Email */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block px-1 text-sm font-semibold tracking-[0.05em] text-[#45474c]"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c6c6cc]" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@institution.edu"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-[#E5DDD0] rounded-lg text-base focus:ring-2 focus:ring-black focus:border-black transition-all placeholder:text-[#c6c6cc]/50"
                />
              </div>
            </div>

            {/* Password (client leaf for the eye toggle) */}
            <PasswordField />

            <button
              type="submit"
              className="w-full mt-12 bg-[#151b2a] hover:bg-black text-white text-sm font-semibold tracking-[0.05em] py-4 rounded-lg transition-all active:scale-[0.98] shadow-[0_4px_20px_rgba(11,18,32,0.04)]"
            >
              Sign In
            </button>
          </form>

          {/* Secondary */}
          <div className="mt-20 w-full text-center space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-[#c6c6cc]/30" />
              <span className="text-xs uppercase tracking-widest text-[#c6c6cc]">or</span>
              <div className="h-px flex-1 bg-[#c6c6cc]/30" />
            </div>
            <GoogleSignInButton />
            <p className="text-base text-[#605e58]">
              Don&apos;t have an account?{' '}
              <a href="/signup" className="text-black font-semibold hover:underline underline-offset-4">
                Sign up
              </a>
            </p>
          </div>
        </div>

        <footer className="mt-12 flex justify-center gap-12 text-xs text-[#76777d]">
          <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-black transition-colors">Contact Support</a>
        </footer>
      </main>

      <div className="absolute bottom-2 w-full text-center px-4">
        <p className="text-xs text-[#605e58]/60">
          © 2024 School of Worlds. An archival approach to modern education.
        </p>
      </div>
    </div>
  )
}
