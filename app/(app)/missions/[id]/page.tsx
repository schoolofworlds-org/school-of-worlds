import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Square } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import SubmissionForm, { type SubmissionRow } from '@/components/missions/SubmissionForm'

type Mission = {
  id: string
  world_id: string
  week_number: number
  title: string
  description: string | null
  vocabulary: string | null
  requirements: string | null
  xp_value: number
  mission_type: string
}

const typeMeta: Record<string, { label: string; cls: string }> = {
  mission: { label: 'Mission', cls: 'bg-[#1F2937] text-white' },
  quest: { label: 'Quest', cls: 'bg-amber-100 text-amber-700' },
  summit: { label: 'Summit', cls: 'bg-purple-100 text-purple-700' },
}

const DEFAULT_REQUIREMENTS = [
  'Mission Report',
  'Research Notes',
  'AI Prompt Log',
  'Reflection Document',
]

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: mission } = await supabase
    .from('missions')
    .select(
      'id, world_id, week_number, title, description, vocabulary, requirements, xp_value, mission_type',
    )
    .eq('id', id)
    .single<Mission>()

  if (!mission) {
    notFound()
  }

  const { data: world } = await supabase
    .from('worlds')
    .select('name')
    .eq('id', mission.world_id)
    .maybeSingle()
  const worldName = world?.name ?? 'World'

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let submission: SubmissionRow | null = null
  if (user) {
    const { data } = await supabase
      .from('mission_submissions')
      .select(
        'submission_text, discord_link, xp_awarded, mission_report_url, research_notes_url, ai_prompt_log_url, reflection_document_url',
      )
      .eq('mission_id', id)
      .eq('user_id', user.id)
      .maybeSingle()
    submission = (data as SubmissionRow | null) ?? null
  }

  const type = typeMeta[mission.mission_type] ?? typeMeta.mission
  const vocab =
    mission.vocabulary
      ?.split(',')
      .map((v) => v.trim())
      .filter(Boolean) ?? []
  const checklist = mission.requirements
    ? mission.requirements.split(',').map((r) => r.trim()).filter(Boolean)
    : DEFAULT_REQUIREMENTS

  return (
    <div className="p-8 lg:p-10 max-w-3xl mx-auto">
      <Link
        href={`/worlds/${mission.world_id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#4B5563] hover:text-[#1F2937] transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to {worldName} World
      </Link>

      {/* Top section */}
      <div className="bg-white rounded-xl border border-[#D6D0C4] shadow-sm p-6 mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E4D8] text-[#1F2937]">
            Week {mission.week_number}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${type.cls}`}>
            {type.label}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            {mission.xp_value} XP
          </span>
        </div>
        <h1 className="text-2xl font-bold text-[#1F2937]">{mission.title}</h1>
      </div>

      {/* Mission brief */}
      <div className="bg-white rounded-xl border border-[#D6D0C4] shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-[#1F2937] mb-3">What You Need To Do</h2>
        {mission.description && (
          <p className="text-sm text-[#4B5563] whitespace-pre-line">
            {mission.description}
          </p>
        )}

        {vocab.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-bold text-[#1F2937] mb-2">Vocabulary</h3>
            <div className="flex flex-wrap gap-2">
              {vocab.map((word) => (
                <span
                  key={word}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[#E8E4D8] text-[#1F2937]"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Requirements */}
      <div className="bg-white rounded-xl border border-[#D6D0C4] shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-[#1F2937] mb-3">Requirements</h2>
        <ul className="space-y-2">
          {checklist.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-[#1F2937]">
              <Square size={16} className="text-[#4B5563] shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        {vocab.length > 0 && (
          <p className="text-xs text-[#4B5563] mt-4">
            Use all vocabulary words naturally in your submission.
          </p>
        )}
      </div>

      {/* Submission */}
      <h2 className="text-xl font-bold text-[#1F2937] mb-4">Submit Your Work</h2>

      <SubmissionForm
        missionId={mission.id}
        userId={user?.id ?? null}
        xpValue={mission.xp_value}
        submission={submission}
      />
    </div>
  )
}
