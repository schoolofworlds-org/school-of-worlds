import { Pin } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

type Announcement = {
  id: string
  title: string
  content: string | null
  priority: string
  category: string | null
  is_pinned: boolean
  created_at: string
}

// high = red, normal = gray (per spec); low kept muted for completeness.
const priorityStyles: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  normal: 'bg-gray-100 text-gray-600',
  low: 'bg-gray-100 text-gray-500',
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function AnnouncementsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('announcements')
    .select('id, title, content, priority, category, is_pinned, created_at')
    // Pinned first, then newest first.
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  const items = (data as Announcement[] | null) ?? []

  return (
    <div className="p-8 lg:p-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F2937]">Announcements</h1>
        <p className="text-[#4B5563] mt-1">
          The latest news and updates from School of Worlds.
        </p>
      </div>

      {error && (
        <div className="bg-white border border-red-200 text-red-600 rounded-xl p-4">
          Could not load announcements. Please try again later.
        </div>
      )}

      {!error && items.length === 0 && (
        <div className="bg-white border border-[#D6D0C4] rounded-xl p-10 text-center text-[#4B5563]">
          No announcements yet.
        </div>
      )}

      <div className="space-y-4">
        {items.map((item) => {
          const badge =
            priorityStyles[item.priority] ?? 'bg-gray-100 text-gray-600'
          return (
            <article
              key={item.id}
              className={`bg-white rounded-xl p-6 border shadow-sm ${
                item.is_pinned ? 'border-[#1F2937]' : 'border-[#D6D0C4]'
              }`}
            >
              {item.is_pinned && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1F2937] mb-2">
                  <Pin size={14} className="fill-[#1F2937]" />
                  Pinned
                </div>
              )}

              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="text-lg font-bold text-[#1F2937]">{item.title}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize shrink-0 ${badge}`}
                >
                  {item.priority}
                </span>
              </div>

              {item.content && (
                <p className="text-sm text-[#4B5563] mb-4">{item.content}</p>
              )}

              <div className="flex items-center gap-3 text-xs text-[#4B5563] font-medium">
                {item.category && (
                  <span className="px-2.5 py-1 rounded-full bg-[#E8E4D8] text-[#4B5563] capitalize">
                    {item.category}
                  </span>
                )}
                <span>{formatDate(item.created_at)}</span>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
