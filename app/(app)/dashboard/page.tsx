import Link from 'next/link'
import { Pin, ArrowRight, Trophy, Zap, CheckCircle2, Clock } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { levelFromXp, xpIntoLevel, XP_PER_LEVEL } from '@/lib/level'

type RecentSubmission = {
  mission_id: string
  status: string
  xp_awarded: number | null
  submitted_at: string
  missions: { title: string } | null
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const fullName = user?.user_metadata?.full_name as string | undefined
  const firstName =
    fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'Explorer'

  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Profile (xp + enrolled world).
  const { data: profile } = user
    ? await supabase
        .from('users')
        .select('world_id, xp_total')
        .eq('id', user.id)
        .maybeSingle()
    : { data: null }

  const xpTotal = profile?.xp_total ?? 0
  const level = levelFromXp(xpTotal)
  const xpInLevel = xpIntoLevel(xpTotal)

  // Active world.
  const { data: activeWorld } = profile?.world_id
    ? await supabase
        .from('worlds')
        .select('id, name, color, status')
        .eq('id', profile.world_id)
        .maybeSingle()
    : { data: null }

  // The user's submissions (for progress + next mission + recent activity).
  const { data: mySubs } = user
    ? await supabase
        .from('mission_submissions')
        .select('mission_id')
        .eq('user_id', user.id)
    : { data: null }
  const submittedIds = new Set((mySubs ?? []).map((s) => s.mission_id as string))
  const completedCount = submittedIds.size

  // Next uncompleted mission in the active world.
  let nextMission: { id: string; title: string; week_number: number } | null =
    null
  if (activeWorld) {
    const { data: worldMissions } = await supabase
      .from('missions')
      .select('id, title, week_number, unlock_order')
      .eq('world_id', activeWorld.id)
      .eq('mission_type', 'mission')
      .order('unlock_order', { ascending: true })
    nextMission =
      (worldMissions ?? []).find((m) => !submittedIds.has(m.id as string)) ??
      null
  }

  // Recent activity (last 3 submissions).
  const { data: recentData } = user
    ? await supabase
        .from('mission_submissions')
        .select('mission_id, status, xp_awarded, submitted_at, missions(title)')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(3)
    : { data: null }
  const recent = (recentData as RecentSubmission[] | null) ?? []

  // Right sidebar: next deadline (upcoming unlock_date) + pinned announcements.
  const { data: deadlineData } = await supabase
    .from('missions')
    .select('id, title, unlock_date')
    .not('unlock_date', 'is', null)
    .gt('unlock_date', new Date().toISOString())
    .order('unlock_date', { ascending: true })
    .limit(1)
  const nextDeadline = deadlineData?.[0] ?? null

  const { data: announcements } = await supabase
    .from('announcements')
    .select('id, title, created_at')
    .eq('is_pinned', true)
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto flex flex-col xl:flex-row gap-10">
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-[#1F2937]">
            Welcome back, {firstName} 👋
          </h1>
          <div className="bg-white px-4 py-2 rounded-full border border-[#D6D0C4] shadow-sm text-sm font-medium text-[#4B5563]">
            Today, {today}
          </div>
        </div>

        {/* Continue Learning */}
        <h2 className="text-xl font-bold text-[#1F2937] mb-4">Continue Learning</h2>
        {!activeWorld ? (
          <Link
            href="/worlds"
            className="block bg-white rounded-xl border border-[#D6D0C4] shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <p className="font-bold text-[#1F2937]">You haven&apos;t joined a world yet</p>
            <p className="text-sm text-[#4B5563] mt-1">
              Browse the worlds and start your first mission.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-[#1F2937] mt-3">
              Explore worlds <ArrowRight size={16} />
            </span>
          </Link>
        ) : (
          <div
            className="bg-white rounded-xl border border-[#D6D0C4] shadow-sm p-6"
            style={{ borderLeftWidth: 6, borderLeftColor: activeWorld.color }}
          >
            <span className="text-xs font-semibold text-[#4B5563] uppercase tracking-wide">
              {activeWorld.name} World
            </span>
            {nextMission ? (
              <>
                <h3 className="text-lg font-bold text-[#1F2937] mt-1">
                  {nextMission.title}
                </h3>
                <p className="text-sm text-[#4B5563] mt-1">
                  Week {nextMission.week_number} · Your next mission
                </p>
                <Link
                  href={`/missions/${nextMission.id}`}
                  className="inline-flex items-center gap-2 bg-[#1F2937] text-white rounded-xl px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity mt-4"
                >
                  Continue <ArrowRight size={16} />
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-[#1F2937] mt-1">
                  All missions complete 🎉
                </h3>
                <Link
                  href={`/worlds/${activeWorld.id}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#1F2937] mt-3"
                >
                  Review {activeWorld.name} <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>
        )}

        {/* Your Progress */}
        <h2 className="text-xl font-bold text-[#1F2937] mt-8 mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-[#D6D0C4] shadow-sm p-5">
            <CheckCircle2 size={20} className="text-green-600 mb-2" />
            <p className="text-2xl font-bold text-[#1F2937]">{completedCount}</p>
            <p className="text-sm text-[#4B5563]">Missions completed</p>
          </div>
          <div className="bg-white rounded-xl border border-[#D6D0C4] shadow-sm p-5">
            <Zap size={20} className="text-amber-500 mb-2" />
            <p className="text-2xl font-bold text-[#1F2937]">{xpTotal}</p>
            <p className="text-sm text-[#4B5563]">Total XP</p>
          </div>
          <div className="bg-white rounded-xl border border-[#D6D0C4] shadow-sm p-5">
            <Trophy size={20} className="text-[#1F2937] mb-2" />
            <p className="text-2xl font-bold text-[#1F2937]">Level {level}</p>
            <p className="text-sm text-[#4B5563]">
              {xpInLevel} / {XP_PER_LEVEL} XP
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <h2 className="text-xl font-bold text-[#1F2937] mt-8 mb-4">Recent Activity</h2>
        {recent.length === 0 ? (
          <div className="bg-white border border-[#D6D0C4] rounded-xl p-8 text-center text-[#4B5563]">
            No activity yet. Submit your first mission to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map((sub) => (
              <Link
                key={sub.mission_id}
                href={`/missions/${sub.mission_id}`}
                className="flex items-center justify-between gap-4 bg-white rounded-xl p-4 border border-[#D6D0C4] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#1F2937] truncate">
                      {sub.missions?.title ?? 'Mission'}
                    </p>
                    <p className="text-xs text-[#4B5563]">
                      {new Date(sub.submitted_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                      {' · '}
                      <span className="capitalize">{sub.status}</span>
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#1F2937] shrink-0">
                  +{sub.xp_awarded ?? 0} XP
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Right sidebar */}
      <div className="w-full xl:w-[350px] shrink-0 space-y-6">
        <div className="bg-white rounded-xl p-6 border border-[#D6D0C4] shadow-sm">
          <div className="flex items-center gap-2 text-[#4B5563] mb-1">
            <Clock size={16} />
            <p className="text-sm font-medium">Next deadline</p>
          </div>
          {nextDeadline ? (
            <>
              <p className="font-bold text-[#1F2937] mt-1">{nextDeadline.title}</p>
              <p className="text-sm text-[#4B5563]">
                {new Date(nextDeadline.unlock_date as string).toLocaleDateString(
                  'en-US',
                  { month: 'short', day: 'numeric', year: 'numeric' },
                )}
              </p>
            </>
          ) : (
            <p className="text-sm text-[#4B5563] mt-1">No upcoming deadlines.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#1F2937] mb-4">Announcements</h2>
          {(announcements ?? []).length === 0 ? (
            <div className="bg-white border border-[#D6D0C4] rounded-xl p-6 text-center text-[#4B5563]">
              No announcements yet.
            </div>
          ) : (
            <div className="space-y-3">
              {(announcements ?? []).map((a) => (
                <div
                  key={a.id}
                  className="bg-white rounded-xl p-4 border border-[#D6D0C4] shadow-sm"
                >
                  <div className="flex items-start gap-2">
                    <Pin size={14} className="fill-[#1F2937] text-[#1F2937] mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#1F2937] text-sm">{a.title}</h4>
                      <p className="text-[11px] text-[#4B5563] mt-1">
                        {new Date(a.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
