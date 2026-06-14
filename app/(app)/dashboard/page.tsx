import { createClient } from '@/utils/supabase/server'

type World = {
  id: string
  name: string
  color: string
  status: string
}

type Mission = {
  id: string
  title: string
  description: string | null
  status: string
  xp_reward: number
}

type Announcement = {
  id: string
  title: string
  body: string | null
  author: string
  priority: string
  created_at: string
}

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  locked: 'bg-gray-200 text-gray-600',
  todo: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-yellow-100 text-yellow-700',
}

const priorityStyles: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  normal: 'bg-[#E8E4D8] text-[#4B5563]',
  low: 'bg-gray-100 text-gray-500',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Real user name: first name from full_name, otherwise the email handle.
  const firstName =
    user?.user_metadata?.full_name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'Explorer'

  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Worlds (note: the worlds table has no `description` column).
  const { data: worldsData } = await supabase
    .from('worlds')
    .select('id, name, color, status')
    .order('created_at', { ascending: true })

  const worlds = (worldsData as World[] | null) ?? []
  const activeWorlds = worlds.filter((w) => w.status === 'active').slice(0, 2)
  const firstWorld = activeWorlds[0] ?? null

  // Missions for the first active world.
  let missions: Mission[] = []
  if (firstWorld) {
    const { data: missionsData } = await supabase
      .from('missions')
      .select('id, title, description, status, xp_reward')
      .eq('world_id', firstWorld.id)
      .order('order_index', { ascending: true })
    missions = (missionsData as Mission[] | null) ?? []
  }

  // Announcements for the right sidebar.
  const { data: announcementsData } = await supabase
    .from('announcements')
    .select('id, title, body, author, priority, created_at')
    .order('created_at', { ascending: false })
    .limit(4)

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

        {/* Active Worlds */}
        <h2 className="text-xl font-bold text-[#1F2937] mb-4">Active Worlds</h2>
        {activeWorlds.length === 0 ? (
          <div className="bg-white border border-[#D6D0C4] rounded-xl p-10 text-center text-[#4B5563]">
            No active worlds yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeWorlds.map((world) => {
              const badge =
                statusStyles[world.status] ?? 'bg-gray-100 text-gray-600'
              return (
                <div
                  key={world.id}
                  className="bg-white rounded-xl border border-[#D6D0C4] shadow-sm overflow-hidden"
                >
                  <div
                    className="h-2 w-full"
                    style={{ backgroundColor: world.color }}
                  />
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0"
                          style={{ backgroundColor: world.color }}
                        >
                          {world.name.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="text-lg font-bold text-[#1F2937]">
                          {world.name}
                        </h3>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${badge}`}
                      >
                        {world.status}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Current Missions */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#1F2937]">Current Missions</h2>
            {firstWorld && (
              <span className="text-sm font-medium text-[#4B5563]">
                {firstWorld.name}
              </span>
            )}
          </div>

          {missions.length === 0 ? (
            <div className="bg-white border border-[#D6D0C4] rounded-xl p-10 text-center text-[#4B5563]">
              Week 1 missions coming soon
            </div>
          ) : (
            <div className="space-y-4">
              {missions.map((mission) => {
                const badge =
                  statusStyles[mission.status] ?? 'bg-gray-100 text-gray-600'
                return (
                  <div
                    key={mission.id}
                    className="bg-white rounded-xl p-5 border border-[#D6D0C4] shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#1F2937]">
                          {mission.title}
                        </h4>
                        {mission.description && (
                          <p className="text-sm text-[#4B5563] mt-1">
                            {mission.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${badge}`}
                        >
                          {mission.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-medium text-[#4B5563]">
                          {mission.xp_reward} XP
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
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

        {/* Announcements */}
        <div>
          <h2 className="text-xl font-bold text-[#1F2937] mb-4">Announcements</h2>
          {announcements.length === 0 ? (
            <div className="bg-white border border-[#D6D0C4] rounded-xl p-6 text-center text-[#4B5563]">
              No announcements yet.
            </div>
          ) : (
            <div className="space-y-3">
              {announcements.map((announcement) => {
                const badge =
                  priorityStyles[announcement.priority] ??
                  priorityStyles.normal
                const date = new Date(
                  announcement.created_at,
                ).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                })
                return (
                  <div
                    key={announcement.id}
                    className="bg-white rounded-xl p-4 border border-[#D6D0C4] shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-[#1F2937] text-sm">
                        {announcement.title}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize shrink-0 ${badge}`}
                      >
                        {announcement.priority}
                      </span>
                    </div>
                    {announcement.body && (
                      <p className="text-xs text-[#4B5563] mt-1 line-clamp-2">
                        {announcement.body}
                      </p>
                    )}
                    <p className="text-[11px] text-[#4B5563] mt-2">
                      {announcement.author} • {date}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
