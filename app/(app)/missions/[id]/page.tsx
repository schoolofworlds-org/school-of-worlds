import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

type Mission = {
  id: string
  world_id: string
  week_number: number
  title: string
  description: string | null
  xp_value: number
}

type Submission = {
  discord_link: string | null
  status: string
  submitted_at: string
}

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
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const { error: errorParam } = await searchParams
  const supabase = await createClient()

  const { data: mission } = await supabase
    .from('missions')
    .select('id, world_id, week_number, title, description, xp_value')
    .eq('id', id)
    .single<Mission>()

  if (!mission) {
    notFound()
  }

  // Has the current user already submitted this mission?
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let submission: Submission | null = null
  if (user) {
    const { data } = await supabase
      .from('mission_submissions')
      .select('discord_link, status, submitted_at')
      .eq('mission_id', id)
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    submission = (data as Submission | null) ?? null
  }

  // Server action: record the submission.
  async function submitMission(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      redirect('/login')
    }

    const discordLink = (formData.get('discord_link') as string)?.trim() || null

    const { error } = await supabase.from('mission_submissions').insert({
      user_id: user.id,
      mission_id: id,
      discord_link: discordLink,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
    })

    if (error) {
      redirect(`/missions/${id}?error=1`)
    }
    redirect(`/missions/${id}`)
  }

  return (
    <div className="p-8 lg:p-10 max-w-3xl mx-auto">
      <Link
        href={`/worlds/${mission.world_id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#4B5563] hover:text-[#1F2937] transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to World
      </Link>

      {/* Mission header */}
      <div className="bg-white rounded-xl border border-[#D6D0C4] shadow-sm p-6 mb-8">
        <span className="inline-block text-xs font-semibold text-[#4B5563] uppercase tracking-wide mb-1">
          Week {mission.week_number} • {mission.xp_value} XP
        </span>
        <h1 className="text-2xl font-bold text-[#1F2937]">{mission.title}</h1>
        {mission.description && (
          <p className="text-[#4B5563] mt-2">{mission.description}</p>
        )}
      </div>

      {/* Submit Your Work */}
      <h2 className="text-xl font-bold text-[#1F2937] mb-4">Submit Your Work</h2>

      <div className="bg-white rounded-xl border border-[#D6D0C4] shadow-sm p-6">
        <h3 className="text-base font-bold text-[#1F2937] mb-4">
          Submission Instructions
        </h3>
        <ol className="space-y-4 text-sm text-[#4B5563]">
          <li>
            <span className="font-semibold text-[#1F2937]">
              1. Complete your work and save these files:
            </span>
            <ul className="list-disc list-inside mt-1 ml-1 space-y-0.5">
              <li>Mission Report</li>
              <li>Research Notes</li>
              <li>AI Prompt Log</li>
              <li>Reflection Document</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-[#1F2937]">
              2. Compress all files into a ZIP folder named:
            </span>
            <code className="block mt-1 w-fit bg-[#E8E4D8] rounded-lg px-3 py-2 font-mono text-xs text-[#1F2937]">
              Mission-{mission.week_number}-YourName.zip
            </code>
          </li>
          <li>
            <span className="font-semibold text-[#1F2937]">
              3. Upload the ZIP to the #submissions channel on our Discord
              server.
            </span>
          </li>
          <li>
            <span className="font-semibold text-[#1F2937]">
              4. Once submitted, paste your Discord submission link below.
            </span>
          </li>
        </ol>
      </div>

      {/* Submission form / confirmation */}
      {submission ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-4">
          <div className="flex items-center gap-2 text-green-700 font-semibold">
            <CheckCircle2 size={18} />
            Submitted
          </div>
          <p className="text-sm text-[#4B5563] mt-2">
            Marked as submitted on {formatDate(submission.submitted_at)}.
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
          className="bg-white rounded-xl border border-[#D6D0C4] shadow-sm p-6 mt-4 space-y-3"
        >
          {errorParam && (
            <p className="text-sm text-red-500">
              Could not save your submission. Please try again.
            </p>
          )}
          <label
            htmlFor="discord_link"
            className="block text-sm font-medium text-[#1F2937]"
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
          <button
            type="submit"
            className="bg-[#1F2937] text-white rounded-xl px-4 py-3 font-medium hover:opacity-90 transition-opacity"
          >
            Mark as Submitted
          </button>
        </form>
      )}
    </div>
  )
}
