'use client'

import { useRef, useState } from 'react'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { CheckCircle2, Sparkles, Upload, X } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['600', '700'] })

const YEAR_SECONDS = 60 * 60 * 24 * 365
const MAX_BYTES = 10 * 1024 * 1024
const ACCEPT = '.pdf,.doc,.docx,image/*'
const ALLOWED_EXT = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'gif', 'webp']

type UrlColumn =
  | 'mission_report_url'
  | 'research_notes_url'
  | 'ai_prompt_log_url'
  | 'reflection_document_url'

const FIELDS: { key: string; label: string; column: UrlColumn }[] = [
  { key: 'mission_report', label: 'Mission Report', column: 'mission_report_url' },
  { key: 'research_notes', label: 'Research Notes', column: 'research_notes_url' },
  { key: 'ai_prompt_log', label: 'AI Prompt Log', column: 'ai_prompt_log_url' },
  { key: 'reflection_document', label: 'Reflection Document', column: 'reflection_document_url' },
]

export type SubmissionRow = {
  submission_text: string | null
  discord_link: string | null
  xp_awarded: number | null
  mission_report_url: string | null
  research_notes_url: string | null
  ai_prompt_log_url: string | null
  reflection_document_url: string | null
}

type Uploaded = { name: string; url: string }

function fileNameFromUrl(url: string) {
  try {
    const path = new URL(url).pathname
    return decodeURIComponent(path.split('/').pop() || 'file')
  } catch {
    return 'file'
  }
}

export default function SubmissionForm({
  missionId,
  userId,
  xpValue,
  submission,
}: {
  missionId: string
  userId: string | null
  xpValue: number
  submission: SubmissionRow | null
}) {
  // Seed state from any existing submission so re-edits show what's already there.
  const seeded: Record<string, Uploaded | null> = {}
  for (const f of FIELDS) {
    const existing = submission?.[f.column]
    seeded[f.key] = existing ? { name: fileNameFromUrl(existing), url: existing } : null
  }

  const [files, setFiles] = useState<Record<string, Uploaded | null>>(seeded)
  const [notes, setNotes] = useState(submission?.submission_text ?? '')
  const [discord, setDiscord] = useState(submission?.discord_link ?? '')
  const [rowErrors, setRowErrors] = useState<Record<string, string | null>>({})
  const [uploading, setUploading] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [done, setDone] = useState(submission != null)
  const [awardedXp, setAwardedXp] = useState<number | null>(
    submission?.xp_awarded ?? null,
  )
  const justSubmitted = useRef(false)

  if (!userId) {
    return (
      <div className="bg-[#F5F1E8] border border-[#E5DDD0] rounded-xl p-6 text-center">
        <p className="text-sm text-[#4B5563]">Sign in to submit your work.</p>
      </div>
    )
  }

  const supabase = createClient()

  async function handleUpload(fieldKey: string, file: File | undefined) {
    if (!file) return
    setRowErrors((e) => ({ ...e, [fieldKey]: null }))

    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!ALLOWED_EXT.includes(ext)) {
      setRowErrors((e) => ({ ...e, [fieldKey]: 'Use PDF, DOC, DOCX, or an image.' }))
      return
    }
    if (file.size > MAX_BYTES) {
      setRowErrors((e) => ({ ...e, [fieldKey]: 'File must be 10MB or less.' }))
      return
    }

    setUploading(fieldKey)
    const path = `${userId}/${missionId}/${fieldKey}/${file.name}`
    const { error: upErr } = await supabase.storage
      .from('submissions')
      .upload(path, file, { upsert: true })
    if (upErr) {
      setUploading(null)
      setRowErrors((e) => ({ ...e, [fieldKey]: 'Upload failed. Try again.' }))
      return
    }

    const { data, error: urlErr } = await supabase.storage
      .from('submissions')
      .createSignedUrl(path, YEAR_SECONDS)
    setUploading(null)
    if (urlErr || !data) {
      setRowErrors((e) => ({ ...e, [fieldKey]: 'Could not link file. Try again.' }))
      return
    }

    setFiles((f) => ({ ...f, [fieldKey]: { name: file.name, url: data.signedUrl } }))
  }

  // ponytail: clears the form reference only; the object stays in the bucket.
  function removeFile(fieldKey: string) {
    setFiles((f) => ({ ...f, [fieldKey]: null }))
  }

  async function handleSubmit() {
    setFormError(null)
    const uploaded = FIELDS.filter((f) => files[f.key])
    if (uploaded.length === 0) {
      setFormError('Upload at least one file before submitting.')
      return
    }

    setSubmitting(true)
    const urlPayload: Record<string, string | null> = {}
    for (const f of FIELDS) urlPayload[f.column] = files[f.key]?.url ?? null

    const text = notes.trim() || null
    const link = discord.trim() || null

    if (submission) {
      // UPDATE only — INSERT would fire the XP trigger a second time.
      const { error } = await supabase
        .from('mission_submissions')
        .update({ ...urlPayload, submission_text: text, discord_link: link })
        .eq('user_id', userId)
        .eq('mission_id', missionId)
      setSubmitting(false)
      if (error) {
        setFormError('Could not save your submission. Please try again.')
        return
      }
      setDone(true)
      return
    }

    const { data, error } = await supabase
      .from('mission_submissions')
      .insert({
        user_id: userId,
        mission_id: missionId,
        status: 'submitted',
        submission_text: text,
        discord_link: link,
        ...urlPayload,
      })
      .select('xp_awarded')
      .single()
    setSubmitting(false)
    if (error) {
      setFormError('Could not save your submission. Please try again.')
      return
    }
    justSubmitted.current = true
    setAwardedXp(data?.xp_awarded ?? xpValue)
    setDone(true)
  }

  if (done) {
    return (
      <div className="bg-green-50 border border-green-300 rounded-xl p-6">
        <div className="flex items-center gap-2 text-green-700 font-semibold">
          <CheckCircle2 size={18} />
          Mission submitted!
        </div>
        <div
          className={`inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-xl bg-[#0B1220] text-white font-bold ${
            justSubmitted.current ? 'animate-xp-pop' : ''
          }`}
        >
          <Sparkles size={16} />+{awardedXp ?? xpValue} XP
        </div>
        <p className="text-sm text-[#4B5563] mt-3">
          Your work is in. Your mentor will review it soon.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-[#D6D0C4] shadow-sm p-6 space-y-5">
      <div className="space-y-3">
        {FIELDS.map((f) => {
          const file = files[f.key]
          const isUploading = uploading === f.key
          return (
            <div
              key={f.key}
              className="bg-[#F5F1E8] border border-[#E5DDD0] rounded-xl px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`${jakarta.className} text-xs font-semibold uppercase tracking-wide text-[#0B1220]`}
                >
                  {f.label}
                </span>

                {file ? (
                  <button
                    type="button"
                    onClick={() => removeFile(f.key)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4B5563] hover:text-[#0B1220] transition-colors"
                  >
                    <X size={14} />
                    Remove
                  </button>
                ) : (
                  <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B1220] cursor-pointer hover:opacity-70 transition-opacity">
                    <Upload size={14} />
                    {isUploading ? 'Uploading…' : 'Upload'}
                    <input
                      type="file"
                      accept={ACCEPT}
                      className="hidden"
                      disabled={isUploading}
                      onChange={(e) => handleUpload(f.key, e.target.files?.[0])}
                    />
                  </label>
                )}
              </div>

              {file && (
                <p className="mt-1.5 text-xs text-[#4B5563] break-all">{file.name}</p>
              )}
              {rowErrors[f.key] && (
                <p className="mt-1.5 text-xs text-red-500">{rowErrors[f.key]}</p>
              )}
            </div>
          )
        })}
      </div>

      <div>
        <label
          htmlFor="submission_notes"
          className={`${jakarta.className} block text-xs font-semibold uppercase tracking-wide text-[#0B1220] mb-1.5`}
        >
          Submission Notes
        </label>
        <textarea
          id="submission_notes"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What did you learn? Anything you want your mentor to focus on?"
          className="w-full rounded-xl px-4 py-3 bg-white text-[#0B1220] border border-[#E5DDD0] focus:outline-none focus:ring-2 focus:ring-[#E5DDD0] placeholder:text-[#4B5563]"
        />
      </div>

      <div>
        <label
          htmlFor="discord_link"
          className={`${jakarta.className} block text-xs font-semibold uppercase tracking-wide text-[#0B1220] mb-1.5`}
        >
          Discord Link <span className="normal-case text-[#4B5563]">(optional)</span>
        </label>
        <input
          id="discord_link"
          type="url"
          value={discord}
          onChange={(e) => setDiscord(e.target.value)}
          placeholder="https://discord.com/channels/..."
          className="w-full rounded-xl px-4 py-3 bg-white text-[#0B1220] border border-[#E5DDD0] focus:outline-none focus:ring-2 focus:ring-[#E5DDD0] placeholder:text-[#4B5563]"
        />
      </div>

      {formError && <p className="text-sm text-red-500">{formError}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-[#0B1220] text-white rounded-xl px-5 py-3 font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {submitting ? 'Submitting…' : 'Submit Mission'}
      </button>
    </div>
  )
}
