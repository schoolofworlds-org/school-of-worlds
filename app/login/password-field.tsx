'use client'

import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'

export default function PasswordField({
  forgot = true,
  minLength,
  helpText,
}: {
  forgot?: boolean
  minLength?: number
  helpText?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center px-1">
        <label htmlFor="password" className="text-sm font-semibold tracking-[0.05em] text-[#45474c]">
          Password
        </label>
        {forgot && (
          <a href="#" className="text-xs text-[#605e58] hover:text-black transition-colors">
            Forgot password?
          </a>
        )}
      </div>
      <div className="relative">
        <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c6c6cc]" />
        <input
          id="password"
          name="password"
          type={show ? 'text' : 'password'}
          required
          minLength={minLength}
          placeholder="••••••••"
          className="w-full pl-12 pr-12 py-3 bg-white border border-[#E5DDD0] rounded-lg text-base focus:ring-2 focus:ring-black focus:border-black transition-all placeholder:text-[#c6c6cc]/50"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c6c6cc] hover:text-black transition-colors"
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {helpText && <p className="text-xs text-[#605e58] mt-1 px-1">{helpText}</p>}
    </div>
  )
}
