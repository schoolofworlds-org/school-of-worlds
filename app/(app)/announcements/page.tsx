import { Pin, Bell } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

type Announcement = {
  id: string
  title: string
  content: string | null
  author_id: string | null
  priority: string
  category: string | null
  is_pinned: boolean
  created_at: string
}

const priorityStyles: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  normal: 'bg-gray-100 text-gray-600',
  low: 'bg-blue-100 text-blue-700',
}

// "Jun 14, 2026"
function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function AnnouncementsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('announcements')
    .select('id, title, content, author_id, priority, category, is_pinned, created_at')
    // Pinned first, then newest first.
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  const items = (data as Announcement[] | null) ?? []

  // Resolve author names from author_id where possible. (RLS on `users`
  // restricts reads to the viewer's own row, so most resolve to the
  // "School of Worlds" fallback below.)
  const authorIds = [
    ...new Set(items.map((i) => i.author_id).filter((v): v is string => !!v)),
  ]
  const authorNames: Record<string, string> = {}
  if (authorIds.length > 0) {
    const { data: users } = await supabase
      .from('users')
      .select('id, name')
      .in('id', authorIds)
    for (const u of users ?? []) {
      if (u.name) authorNames[u.id] = u.name
    }
  }
  const authorName = (id: string | null) =>
    (id && authorNames[id]) || 'School of Worlds'

  return (
    <div className="p-8 lg:p-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F2937]">Announcements</h1>
        <p className="text-[#4B5563] mt-1">Latest updates from the platform</p>
      </div>

      {error && (
        <div className="bg-white border border-red-200 text-red-600 rounded-xl p-4">
          Could not load announcements. Please try again later.
        </div>
      )}

      {!error && items.length === 0 && (
        <div className="bg-white border border-[#D6D0C4] rounded-xl p-12 text-center">
          <Bell size={40} className="mx-auto text-[#4B5563] mb-3" />
          <p className="text-[#4B5563] font-medium">
            No announcements yet. Check back soon.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {items.map((item) => {
          const badge =
            priorityStyles[item.priority] ?? 'bg-gray-100 text-gray-600'
          return (
            <article
              key={item.id}
              className="bg-white rounded-xl p-6 border border-[#D6D0C4] shadow-sm"
            >
              {item.is_pinned && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1F2937] mb-2">
                  <Pin size={14} className="fill-[#1F2937] text-[#1F2937]" />
                  Pinned
                </div>
              )}

              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="text-xl font-bold text-[#1F2937]">{item.title}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize shrink-0 ${badge}`}
                >
                  {item.priority}
                </span>
              </div>

              {item.content && (
                <p className="text-sm text-[#4B5563] mb-4">{item.content}</p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#4B5563] font-medium">
                {item.category && (
                  <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
                    {item.category}
                  </span>
                )}
                <span>{authorName(item.author_id)}</span>
                <span>•</span>
                <span>{formatDate(item.created_at)}</span>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
