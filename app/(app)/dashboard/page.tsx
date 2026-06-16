import Link from 'next/link'
import { Pin, PlayCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

type World = {
  id: string
  name: string
  description: string | null
  color: string
  status: string
}

type Mission = {
  id: string
  world_id: string
  week_number: number
  title: string
  xp_value: number
}

type Announcement = {
  id: string
  title: string
  created_at: string
}

const worldStatusStyles: Record<string, string> = {
  'in progress': 'bg-green-100 text-green-700',
  'starting soon': 'bg-amber-100 text-amber-700',
  'not started': 'bg-gray-200 text-gray-600',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Real user identity.
  const fullName = user?.user_metadata?.full_name as string | undefined
  const firstName =
    fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'Explorer'
  const userName = fullName || user?.email?.split('@')[0] || 'Explorer'
  const userEmail = user?.email ?? ''
  const initials = userName
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // First 2 worlds.
  const { data: worldsData } = await supabase
    .from('worlds')
    .select('id, name, description, color, status')
    .order('created_at', { ascending: true })
    .limit(2)
  const worlds = (worldsData as World[] | null) ?? []

  // Top 3 missions by week.
  const { data: missionsData } = await supabase
    .from('missions')
    .select('id, world_id, week_number, title, xp_value')
    .order('week_number', { ascending: true })
    .order('created_at', { ascending: true })
    .limit(3)
  const missions = (missionsData as Mission[] | null) ?? []

  // Up to 3 pinned announcements.
  const { data: announcementsData } = await supabase
    .from('announcements')
    .select('id, title, created_at')
    .eq('is_pinned', true)
    .order('created_at', { ascending: false })
    .limit(3)
  const announcements = (announcementsData as Announcement[] | null) ?? []

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto flex flex-col xl:flex-row gap-10">
      {/* Main Content Area */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-[#1F2937]">
            Welcome back, {firstName} 👋
          </h1>
          <div className="bg-white px-4 py-2 rounded-full border border-[#D6D0C4] shadow-sm text-sm font-medium text-[#4B5563]">
            Today, {today}
          </div>
        </div>

        {/* Worlds */}
        <h2 className="text-xl font-bold text-[#1F2937] mb-4">Your Worlds</h2>
        {worlds.length === 0 ? (
          <div className="bg-white border border-[#D6D0C4] rounded-xl p-10 text-center text-[#4B5563]">
            No worlds available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {worlds.map((world) => {
              const badge =
                worldStatusStyles[world.status.toLowerCase()] ??
                'bg-gray-100 text-gray-600'
              return (
                <Link
                  key={world.id}
                  href={`/worlds/${world.id}`}
                  className="group bg-white rounded-xl border border-[#D6D0C4] shadow-sm p-6 hover:shadow-md transition-shadow"
                  style={{ borderLeftWidth: 6, borderLeftColor: world.color }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-bold text-[#1F2937] group-hover:underline">
                      {world.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize shrink-0 ${badge}`}
                    >
                      {world.status}
                    </span>
                  </div>
                  {world.description && (
                    <p className="text-sm text-[#4B5563]">{world.description}</p>
                  )}
                </Link>
              )
            })}
          </div>
        )}

        {/* Current Missions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-[#1F2937] mb-4">
            Current Missions
          </h2>

          {missions.length === 0 ? (
            <div className="bg-white border border-[#D6D0C4] rounded-xl p-10 text-center text-[#4B5563]">
              Week 1 missions coming soon
            </div>
          ) : (
            <div className="space-y-4">
              {missions.map((mission) => (
                <div
                  key={mission.id}
                  className="bg-white rounded-xl p-5 border border-[#D6D0C4] shadow-sm flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <span className="inline-block text-xs font-semibold text-[#4B5563] uppercase tracking-wide mb-1">
                      Week {mission.week_number}
                    </span>
                    <h4 className="font-bold text-[#1F2937]">{mission.title}</h4>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2.5 py-1 rounded-full bg-[#E8E4D8] text-xs font-semibold text-[#1F2937]">
                      {mission.xp_value} XP
                    </span>
                    <Link
                      href={`/worlds/${mission.world_id}`}
                      className="inline-flex items-center gap-1.5 bg-[#1F2937] text-white rounded-xl px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <PlayCircle size={16} />
                      Start
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full xl:w-[350px] shrink-0 space-y-6">
        {/* Today's date */}
        <div className="bg-white rounded-xl p-6 border border-[#D6D0C4] shadow-sm">
          <p className="text-sm font-medium text-[#4B5563]">Today</p>
          <p className="text-2xl font-bold text-[#1F2937] mt-1">{today}</p>
        </div>

        {/* Pinned announcements */}
        <div>
          <h2 className="text-xl font-bold text-[#1F2937] mb-4">Announcements</h2>
          {announcements.length === 0 ? (
            <div className="bg-white border border-[#D6D0C4] rounded-xl p-6 text-center text-[#4B5563]">
              No announcements yet.
            </div>
          ) : (
            <div className="space-y-3">
              {announcements.map((announcement) => {
                const date = new Date(
                  announcement.created_at,
                ).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
                return (
                  <div
                    key={announcement.id}
                    className="bg-white rounded-xl p-4 border border-[#D6D0C4] shadow-sm"
                  >
                    <div className="flex items-start gap-2">
                      <Pin
                        size={14}
                        className="fill-[#1F2937] text-[#1F2937] mt-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-[#1F2937] text-sm">
                          {announcement.title}
                        </h4>
                        <p className="text-[11px] text-[#4B5563] mt-1">{date}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* User profile */}
        <div className="bg-white rounded-xl p-6 border border-[#D6D0C4] shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#1F2937] flex items-center justify-center shrink-0">
              <span className="text-white font-semibold">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[#1F2937] truncate">{userName}</p>
              <p className="text-xs text-[#4B5563] truncate">{userEmail}</p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-[#1F2937]">
              <span>XP Progress</span>
              {/* Placeholder until per-user XP is wired up */}
              <span>1,250 / 2,000</span>
            </div>
            <div className="h-2 w-full bg-[#E8E4D8] rounded-full overflow-hidden">
              <div className="h-full bg-[#1F2937] w-[62.5%] rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
