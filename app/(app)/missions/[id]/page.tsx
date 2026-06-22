import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { ArrowLeft, CheckCircle2, Square, Sparkles } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

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

type Submission = {
  submission_text: string | null
  discord_link: string | null
  status: string
  xp_awarded: number | null
  submitted_at: string
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

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function MissionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ submitted?: string; error?: string }>
}) {
  const { id } = await params
  const { submitted, error: errorParam } = await searchParams
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

  let submission: Submission | null = null
  if (user) {
    const { data } = await supabase
      .from('mission_submissions')
      .select('submission_text, discord_link, status, xp_awarded, submitted_at')
      .eq('mission_id', id)
      .eq('user_id', user.id)
      .maybeSingle()
    submission = (data as Submission | null) ?? null
  }

  // Server Action — record the submission. The DB trigger awards XP.
  async function submitMission(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      redirect('/login')
    }

    const submissionText =
      (formData.get('submission_text') as string)?.trim() || null
    const discordLink =
      (formData.get('discord_link') as string)?.trim() || null

    const { error } = await supabase.from('mission_submissions').insert({
      user_id: user.id,
      mission_id: id,
      submission_text: submissionText,
      discord_link: discordLink,
      status: 'submitted',
    })

    // 23505 = unique violation (already submitted) — fall through to success view.
    if (error && error.code !== '23505') {
      redirect(`/missions/${id}?error=1`)
    }

    revalidatePath(`/missions/${id}`)
    revalidatePath('/dashboard')
    redirect(`/missions/${id}?submitted=1`)
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

      {submission ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-2 text-green-700 font-semibold">
            <CheckCircle2 size={18} />
            {submitted ? 'Mission submitted!' : 'Already submitted'}
          </div>
          <div
            className={`inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-xl bg-[#1F2937] text-white font-bold ${
              submitted ? 'animate-xp-pop' : ''
            }`}
          >
            <Sparkles size={16} />+{submission.xp_awarded ?? mission.xp_value} XP
          </div>
          <p className="text-sm text-[#4B5563] mt-3">
            Submitted on {formatDate(submission.submitted_at)}.
          </p>
          {submission.discord_link && (
            <a
              href={submission.discord_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#1F2937] underline break-all mt-1 inline-block"
            >
              {submission.discord_link}
            </a>
          )}
        </div>
      ) : (
        <form
          action={submitMission}
          className="bg-white rounded-xl border border-[#D6D0C4] shadow-sm p-6 space-y-4"
        >
          {errorParam && (
            <p className="text-sm text-red-500">
              Could not save your submission. Please try again.
            </p>
          )}
          <div>
            <label
              htmlFor="submission_text"
              className="block text-sm font-medium text-[#1F2937] mb-1"
            >
              Notes / what you did
            </label>
            <textarea
              id="submission_text"
              name="submission_text"
              rows={5}
              placeholder="Describe what you did, paste notes, or summarize your work…"
              className="w-full rounded-xl px-4 py-3 bg-white text-[#1F2937] border border-[#D6D0C4] focus:outline-none focus:ring-2 focus:ring-[#D6D0C4] placeholder:text-[#4B5563]"
            />
          </div>
          <div>
            <label
              htmlFor="discord_link"
              className="block text-sm font-medium text-[#1F2937] mb-1"
            >
              Discord Submission Link
            </label>
            <input
              id="discord_link"
              name="discord_link"
              type="url"
              required
              placeholder="https://discord.com/channels/..."
              className="w-full rounded-xl px-4 py-3 bg-white text-[#1F2937] border border-[#D6D0C4] focus:outline-none focus:ring-2 focus:ring-[#D6D0C4] placeholder:text-[#4B5563]"
            />
          </div>
          <button
            type="submit"
            className="bg-[#1F2937] text-white rounded-xl px-5 py-3 font-medium hover:opacity-90 transition-opacity"
          >
            Submit Mission
          </button>
        </form>
      )}
    </div>
  )
}
