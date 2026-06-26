import Link from 'next/link'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Zap, Users } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['600', '700', '800'] })

type World = {
  id: string
  name: string
  description: string | null
  color: string | null
  status: string
  member_count: number | null
}

export default async function WorldsPage() {
  const supabase = await createClient()

  const { data: worldsData, error } = await supabase
    .from('worlds')
    .select('id, name, description, color, status, member_count')
    .order('created_at', { ascending: true })
  const worlds = (worldsData as World[] | null) ?? []

  // Per-world mission totals + XP (additive read).
  const { data: missionsData } = await supabase
    .from('missions')
    .select('id, world_id, mission_type, xp_value')

  // The current user's completed missions (additive read; auth-guarded by layout).
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: subsData } = user
    ? await supabase.from('mission_submissions').select('mission_id').eq('user_id', user.id)
    : { data: null }
  const submittedIds = new Set((subsData ?? []).map((s) => s.mission_id as string))

  const missionWorld = new Map<string, string>()
  const totalMissions: Record<string, number> = {}
  const totalXp: Record<string, number> = {}
  for (const m of missionsData ?? []) {
    const wid = m.world_id as string
    missionWorld.set(m.id as string, wid)
    totalXp[wid] = (totalXp[wid] ?? 0) + ((m.xp_value as number) ?? 0)
    if (m.mission_type === 'mission') totalMissions[wid] = (totalMissions[wid] ?? 0) + 1
  }
  const completed: Record<string, number> = {}
  for (const mid of submittedIds) {
    const wid = missionWorld.get(mid)
    if (wid) completed[wid] = (completed[wid] ?? 0) + 1
  }

  return (
    <div className="min-h-full bg-[#F5F1E8] p-10">
      <div className="max-w-7xl">
        <header className="mb-10">
          <h1 className={`${jakarta.className} text-4xl font-extrabold text-black mb-2`}>Worlds</h1>
          <p className="text-gray-500 text-lg">Explore career paths and track your progress.</p>
        </header>

        {error && (
          <div className="bg-white border border-red-200 text-red-600 rounded-xl p-4">
            Could not load worlds. Please try again later.
          </div>
        )}

        {!error && worlds.length === 0 && (
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-10 text-center text-gray-500">
            No worlds available yet.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {worlds.map((world) => {
            const color = world.color || '#1F2937'
            const status = (world.status ?? '').toLowerCase()
            const inProgress = status === 'in progress'
            const comingSoon = status === 'starting soon'

            const badgeText = inProgress
              ? 'In Progress'
              : comingSoon
                ? 'Coming Soon'
                : 'Not Started'

            const total = totalMissions[world.id] ?? 0
            const done = completed[world.id] ?? 0
            const pct = total > 0 ? Math.round((done / total) * 100) : 0
            const xp = totalXp[world.id] ?? 0

            return (
              <Link
                key={world.id}
                href={`/worlds/${world.id}`}
                className="group bg-white rounded-xl overflow-hidden border border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Gradient header from world colour */}
                <div
                  className="h-28 relative p-4"
                  style={{
                    background: `linear-gradient(to bottom right, ${color}, color-mix(in srgb, ${color}, #000 35%))`,
                  }}
                >
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white">
                    <Users size={12} />
                    {world.member_count ?? 0}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                    {badgeText}
                  </div>
                </div>

                <div
                  className={`px-6 pb-6 pt-0 flex-1 flex flex-col relative ${comingSoon ? 'opacity-75' : ''}`}
                >
                  {/* Avatar */}
                  <div className="absolute -top-8 left-6 w-16 h-16 rounded-full bg-white border-4 border-white shadow-sm flex items-center justify-center">
                    <div
                      className={`${jakarta.className} w-full h-full rounded-full flex items-center justify-center font-bold text-2xl`}
                      style={{ backgroundColor: `color-mix(in srgb, ${color}, #fff 88%)`, color }}
                    >
                      {world.name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <div className="mt-10 mb-6">
                    <h3 className={`${jakarta.className} font-bold text-xl mb-1 text-[#171c24]`}>
                      {world.name}
                    </h3>
                    {world.description && (
                      <p className="text-sm text-gray-500">{world.description}</p>
                    )}
                  </div>

                  {/* State-specific middle */}
                  {inProgress && (
                    <div className="mb-8">
                      <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>
                          {done} of {total} missions
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  )}
                  {!inProgress && !comingSoon && (
                    <div className="mb-8 text-gray-400 italic text-sm">
                      Unlock the first mission to begin your journey.
                    </div>
                  )}
                  {comingSoon && (
                    <div className="mb-8">
                      <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-100 rounded-full" style={{ width: '0%' }} />
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-5">
                    <div className="flex items-center gap-1.5 font-semibold text-sm">
                      <Zap size={16} className="text-yellow-500 fill-yellow-500" />
                      <span>{xp} XP</span>
                    </div>
                    {inProgress ? (
                      <span className="px-5 py-2 bg-black text-white text-sm font-semibold rounded-lg group-hover:bg-gray-800 transition-colors">
                        Continue
                      </span>
                    ) : comingSoon ? (
                      <span className="px-5 py-2 bg-gray-50 text-gray-300 text-sm font-semibold rounded-lg">
                        Coming Soon
                      </span>
                    ) : (
                      <span className="px-5 py-2 bg-gray-100 text-black text-sm font-semibold rounded-lg group-hover:bg-gray-200 transition-colors">
                        Start
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
