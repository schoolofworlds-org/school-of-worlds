import Link from 'next/link'
import {
  Search,
  Calendar,
  HelpCircle,
  Zap,
  CalendarDays,
  Users,
  Play,
  ArrowRight,
} from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

type World = {
  id: string
  name: string
  description: string | null
  status: string
  member_count: number | null
  color: string | null
}

type Mission = {
  id: string
  title: string
  week_number: number
  xp_value: number
  mission_type: string
}

const hex = (c: string | null | undefined) => c || '#0B1220'

function relTime(value: string) {
  const h = Math.floor((Date.now() - new Date(value).getTime()) / 3.6e6)
  if (h < 1) return 'just now'
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function fmtDeadline(value: string) {
  return new Date(value)
    .toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
    .toUpperCase()
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const fullName = user?.user_metadata?.full_name as string | undefined
  const firstName =
    fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'Explorer'

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  // Enrolled world (drives the Current Missions list).
  const { data: profile } = user
    ? await supabase.from('users').select('world_id').eq('id', user.id).maybeSingle()
    : { data: null }

  // Active Worlds grid (additive read).
  const { data: worldsData } = await supabase
    .from('worlds')
    .select('id, name, description, status, member_count, color')
    .order('created_at', { ascending: true })
  const worlds = (worldsData as World[] | null) ?? []

  // Submission status map for the current user.
  const { data: mySubs } = user
    ? await supabase.from('mission_submissions').select('mission_id').eq('user_id', user.id)
    : { data: null }
  const submittedIds = new Set((mySubs ?? []).map((s) => s.mission_id as string))

  // Current missions for the enrolled world (widened select to include xp_value).
  const activeWorld = worlds.find((w) => w.id === profile?.world_id) ?? null
  let currentMissions: Mission[] = []
  if (activeWorld) {
    const { data: missionsData } = await supabase
      .from('missions')
      .select('id, title, week_number, xp_value, mission_type')
      .eq('world_id', activeWorld.id)
      .eq('mission_type', 'mission')
      .order('unlock_order', { ascending: true })
    currentMissions = ((missionsData as Mission[] | null) ?? []).slice(0, 5)
  }
  const accent = hex(activeWorld?.color)

  // Upcoming deadlines (widened limit) — real unlock_date only.
  const { data: deadlines } = await supabase
    .from('missions')
    .select('id, title, unlock_date')
    .not('unlock_date', 'is', null)
    .gt('unlock_date', new Date().toISOString())
    .order('unlock_date', { ascending: true })
    .limit(5)

  // Pinned announcements (widened select to include category).
  const { data: announcements } = await supabase
    .from('announcements')
    .select('id, title, category, created_at')
    .eq('is_pinned', true)
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div className="min-h-full bg-white text-on-surface font-body-md text-body-md">
      {/* Top app bar */}
      <header className="h-16 sticky top-0 bg-white border-b border-border-subtle z-40 flex justify-between items-center px-8">
        <div className="flex items-center gap-4 w-1/3">
          <div className="relative w-full max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            {/* Visual only for now */}
            <input
              type="text"
              placeholder="Search for missions, worlds, or students..."
              className="w-full pl-10 pr-4 py-2 bg-surface-variant border border-border-subtle rounded-[0.5rem] focus:ring-0 focus:border-primary text-body-md transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-secondary">
            <button className="hover:text-primary transition-colors" aria-label="Calendar">
              <Calendar size={22} />
            </button>
            <button className="hover:text-primary transition-colors" aria-label="Help">
              <HelpCircle size={22} />
            </button>
          </div>
          <div className="h-8 w-px bg-border-subtle" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[0.5rem] bg-surface-variant border border-border-subtle flex items-center justify-center">
              <Zap size={18} className="text-primary fill-primary" />
            </div>
            <span className="font-label-md font-bold text-primary">1 Day Streak</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-8">
        <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-8">
          {/* Center */}
          <div className="col-span-12 lg:col-span-9 space-y-10">
            <section>
              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                Welcome back, {firstName}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-secondary">
                <CalendarDays size={16} />
                <p className="font-body-md">{today}</p>
              </div>
            </section>

            {/* Active Worlds */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline-sm text-headline-sm font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Active Worlds
                </h3>
                <Link
                  href="/worlds"
                  className="text-label-md font-bold text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  Browse All Worlds
                </Link>
              </div>
              {worlds.length === 0 ? (
                <div className="bg-surface-variant border border-border-subtle p-8 rounded-[1rem] text-secondary">
                  No worlds available yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {worlds.map((w) => {
                    const c = hex(w.color)
                    return (
                      <div
                        key={w.id}
                        className="bg-surface-variant border border-border-subtle p-8 rounded-[1rem] hover:border-primary transition-colors"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div
                            className="px-3 py-1 rounded-full font-label-md text-[11px] uppercase tracking-wider"
                            style={{ backgroundColor: `${c}1A`, color: c }}
                          >
                            {w.status}
                          </div>
                          <div className="flex items-center gap-1.5 text-secondary text-[12px] font-medium">
                            <Users size={14} />
                            {w.member_count ?? 0} members
                          </div>
                        </div>
                        <h4 className="font-headline-sm text-headline-sm font-bold mb-2 text-primary">
                          {w.name}
                        </h4>
                        <p className="text-on-surface-variant text-[14px] leading-relaxed mb-6 line-clamp-2">
                          {w.description}
                        </p>
                        <div className="flex items-center justify-between pt-6 border-t border-border-subtle">
                          <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full border-2 border-surface-variant bg-slate-200" />
                            <div className="w-8 h-8 rounded-full border-2 border-surface-variant bg-slate-300" />
                            <div className="w-8 h-8 rounded-full border-2 border-surface-variant bg-slate-400" />
                          </div>
                          <Link
                            href={`/worlds/${w.id}`}
                            className="bg-primary text-white font-label-md px-6 py-2.5 rounded-[0.5rem] hover:bg-primary/90 transition-all active:scale-[0.98]"
                          >
                            Continue
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

            {/* Current Missions */}
            <section>
              <h3 className="font-headline-sm text-headline-sm font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                Current Missions
              </h3>
              {currentMissions.length === 0 ? (
                <div className="p-6 bg-surface-variant border border-border-subtle rounded-[0.5rem] text-secondary">
                  {activeWorld
                    ? 'No missions yet for your world.'
                    : 'Join a world to start missions.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {currentMissions.map((m) => {
                    const done = submittedIds.has(m.id)
                    return (
                      <Link
                        key={m.id}
                        href={`/missions/${m.id}`}
                        className="flex items-center justify-between p-6 bg-surface-variant border border-border-subtle rounded-[0.5rem] hover:border-primary transition-colors"
                      >
                        <div className="flex items-center gap-6">
                          <div className="text-center w-12">
                            <p className="text-[10px] font-bold text-secondary uppercase tracking-tighter">
                              Week
                            </p>
                            <p className="font-headline-sm text-primary">
                              {String(m.week_number).padStart(2, '0')}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-label-md text-primary font-bold">{m.title}</h5>
                            <div className="flex items-center gap-3 mt-1">
                              <span
                                className="text-[11px] font-bold px-2 py-0.5 border rounded"
                                style={{
                                  color: accent,
                                  backgroundColor: `${accent}1A`,
                                  borderColor: `${accent}33`,
                                }}
                              >
                                {m.xp_value} XP
                              </span>
                              <span className="text-[11px] text-secondary flex items-center gap-1 font-medium">
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: done ? '#00B894' : '#E5DDD0' }}
                                />
                                {done ? 'Submitted' : 'Not Started'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="flex items-center gap-2 px-5 py-2 border border-primary text-[12px] font-bold text-primary rounded">
                          {done ? 'Review' : 'Start'}
                          {done ? <Play size={16} /> : <ArrowRight size={16} />}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Right sidebar */}
          <aside className="col-span-12 lg:col-span-3 space-y-10">
            {/* Upcoming */}
            <section>
              <h3 className="font-label-md text-primary font-bold uppercase tracking-widest mb-6 border-b border-border-subtle pb-2">
                Upcoming
              </h3>
              {(deadlines ?? []).length === 0 ? (
                <p className="text-[12px] text-secondary">No upcoming deadlines.</p>
              ) : (
                <div className="space-y-6">
                  {(deadlines ?? []).map((d) => (
                    <div key={d.id} className="relative pl-4 border-l-2 border-primary/40">
                      <p className="text-[11px] font-bold text-secondary">
                        {fmtDeadline(d.unlock_date as string)}
                      </p>
                      <h4 className="font-label-md text-primary mt-1">{d.title}</h4>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Announcements */}
            <section>
              <h3 className="font-label-md text-primary font-bold uppercase tracking-widest mb-6 border-b border-border-subtle pb-2">
                Announcements
              </h3>
              {(announcements ?? []).length === 0 ? (
                <p className="text-[12px] text-secondary">No announcements yet.</p>
              ) : (
                <div className="space-y-4">
                  {(announcements ?? []).map((a) => (
                    <div
                      key={a.id}
                      className="bg-surface-variant border border-border-subtle p-4 hover:bg-white transition-colors rounded-[0.5rem]"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-primary text-white uppercase rounded-sm">
                          {a.category ?? 'Update'}
                        </span>
                        <span className="text-[10px] text-secondary font-medium">
                          {relTime(a.created_at as string)}
                        </span>
                      </div>
                      <h4 className="font-label-md text-primary font-bold leading-tight">
                        {a.title}
                      </h4>
                    </div>
                  ))}
                </div>
              )}
              <Link
                href="/announcements"
                className="block w-full mt-6 text-[11px] font-bold text-secondary text-center hover:text-primary transition-colors uppercase tracking-widest"
              >
                View Archive
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
