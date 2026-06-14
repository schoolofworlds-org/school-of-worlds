import { LogOut } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/auth/actions'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const userName = user?.user_metadata?.full_name || 'Not set'
  const userEmail = user?.email ?? ''

  return (
    <div className="p-8 lg:p-10 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F2937]">Settings</h1>
        <p className="text-[#4B5563] mt-1">Manage your account.</p>
      </div>

      <div className="bg-white border border-[#D6D0C4] rounded-xl shadow-sm divide-y divide-[#D6D0C4]">
        <div className="p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-[#4B5563] mb-1">Name</p>
          <p className="text-[#1F2937] font-medium">{userName}</p>
        </div>
        <div className="p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-[#4B5563] mb-1">Email</p>
          <p className="text-[#1F2937] font-medium">{userEmail}</p>
        </div>
      </div>

      <form action={logout} className="mt-6">
        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-[#1F2937] text-white rounded-xl px-5 py-3 font-medium hover:opacity-90 transition-opacity"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </form>
    </div>
  )
}
