import { login } from '@/app/auth/actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const { message } = await searchParams

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto bg-[#E8E4D8] min-h-screen">
      <form action={login} className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-[#1F2937]">
        <h1 className="text-3xl font-semibold text-center mb-8">Sign In</h1>

        {message && message.trim().length > 0 && (
          <p className="mt-4 p-4 bg-white border border-[#D6D0C4] text-center rounded-xl text-red-500">
            {message}
          </p>
        )}

        <label className="text-md font-medium" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-xl px-4 py-3 bg-white text-[#1F2937] border border-[#D6D0C4] mb-6 focus:outline-none focus:ring-2 focus:ring-[#D6D0C4] placeholder:text-[#4B5563]"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md font-medium" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-xl px-4 py-3 bg-white text-[#1F2937] border border-[#D6D0C4] mb-6 focus:outline-none focus:ring-2 focus:ring-[#D6D0C4] placeholder:text-[#4B5563]"
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
        <button
          type="submit"
          className="bg-[#1F2937] text-white rounded-xl px-4 py-3 font-medium hover:opacity-90 transition-opacity"
        >
          Sign In
        </button>
        <div className="mt-3 text-center">
          <a href="/login" className="text-sm text-[#4B5563] hover:text-[#1F2937] underline">
            Forgot password?
          </a>
        </div>
        <div className="mt-8 text-center text-sm text-[#4B5563]">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-[#1F2937] font-medium underline">
            Sign up
          </a>
        </div>
      </form>
    </div>
  )
}
