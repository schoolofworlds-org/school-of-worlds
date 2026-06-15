import { signup } from '@/app/auth/actions'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const { message } = await searchParams;

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto">
      <form action={signup} className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-brand-text">
        <h1 className="text-3xl font-semibold text-center mb-8">Sign Up</h1>
        {message && (
          <p className={`mt-4 p-4 bg-brand-card border border-brand-border text-center rounded-xl ${message === 'Check your email and click the link to sign in' ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}
        <label className="text-md font-medium" htmlFor="name">
          Full Name
        </label>
        <input
          className="rounded-xl px-4 py-3 bg-brand-card text-brand-text border border-brand-border mb-6 focus:outline-none focus:ring-2 focus:ring-brand-border placeholder:text-brand-text-muted"
          name="name"
          placeholder="Jane Doe"
          required
        />
        <label className="text-md font-medium" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-xl px-4 py-3 bg-brand-card text-brand-text border border-brand-border mb-6 focus:outline-none focus:ring-2 focus:ring-brand-border placeholder:text-brand-text-muted"
          name="email"
          placeholder="you@example.com"
          required
        />
        <button
          type="submit"
          className="bg-brand-button text-brand-button-text rounded-xl px-4 py-3 font-medium hover:opacity-90 transition-opacity"
        >
          Sign Up
        </button>
        <div className="mt-8 text-center text-sm text-brand-text-muted">
          Already have an account?{' '}
          <a href="/login" className="text-brand-text font-medium underline">
            Sign in
          </a>
        </div>
      </form>
    </div>
  )
}
