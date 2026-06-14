import Sidebar from '@/components/dashboard/Sidebar'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const userName = user.user_metadata?.full_name || user.email || 'Explorer'
  const userEmail = user.email ?? ''

  return (
    <div className="flex h-screen overflow-hidden bg-[#E8E4D8]">
      <Sidebar userName={userName} userEmail={userEmail} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
