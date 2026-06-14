import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Users, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import MissionsSection, { type Mission } from './missions-section'

type World = {
  id: string
  name: string
  description: string | null
  color: string
  status: string
  member_count: number | null
}

const statusStyles: Record<string, string> = {
  'in progress': 'bg-green-100 text-green-700',
  'starting soon': 'bg-amber-100 text-amber-700',
  'not started': 'bg-gray-200 text-gray-600',
}

export default async function WorldDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: world } = await supabase
    .from('worlds')
    .select('id, name, description, color, status, member_count')
    .eq('id', id)
    .single<World>()

  if (!world) {
    notFound()
  }

  const { data: missionsData } = await supabase
    .from('missions')
    .select('id, week_number, title, description, xp_value')
    .eq('world_id', id)
    .order('week_number', { ascending: true })
    .order('created_at', { ascending: true })

  const missions = (missionsData as Mission[] | null) ?? []

  // Enrollment: a user is enrolled in the world referenced by users.world_id.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isEnrolled = false
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('world_id')
      .eq('id', user.id)
      .maybeSingle()
    isEnrolled = profile?.world_id === id
  }

  const statusBadge =
    statusStyles[world.status.toLowerCase()] ?? 'bg-gray-200 text-gray-600'

  return (
    <div className="p-8 lg:p-10 max-w-4xl mx-auto">
      <Link
        href="/worlds"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#4B5563] hover:text-[#1F2937] transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Worlds
      </Link>

      {/* World hero — colour as left border accent */}
      <div
        className="bg-white rounded-xl border border-[#D6D0C4] shadow-sm p-8 mb-8"
        style={{ borderLeftWidth: 6, borderLeftColor: world.color }}
      >
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge}`}
          >
            {world.status}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4B5563]">
            <Users size={16} />
            {world.member_count ?? 0} members
          </span>
          {isEnrolled && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
              <CheckCircle2 size={14} />
              You are enrolled
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-[#1F2937]">{world.name}</h1>
        {world.description && (
          <p className="text-[#4B5563] mt-2 max-w-2xl">{world.description}</p>
        )}
      </div>

      {/* Missions with week tabs + week quest */}
      <MissionsSection missions={missions} />
    </div>
  )
}
