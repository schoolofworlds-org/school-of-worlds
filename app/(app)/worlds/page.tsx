import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

type World = {
  id: string
  name: string
  color: string
  status: string
}

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  locked: 'bg-gray-200 text-gray-600',
}

export default async function WorldsPage() {
  const supabase = await createClient()
  const { data: worlds, error } = await supabase
    .from('worlds')
    .select('id, name, color, status')
    .order('created_at', { ascending: true })

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F2937]">Worlds</h1>
        <p className="text-[#4B5563] mt-1">Explore career paths and track your progress.</p>
      </div>

      {error && (
        <div className="bg-white border border-red-200 text-red-600 rounded-xl p-4">
          Could not load worlds. Please try again later.
        </div>
      )}

      {!error && (!worlds || worlds.length === 0) && (
        <div className="bg-white border border-[#D6D0C4] rounded-xl p-10 text-center text-[#4B5563]">
          No worlds available yet.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(worlds as World[] | null)?.map((world) => {
          const badge = statusStyles[world.status] ?? 'bg-gray-100 text-gray-600'
          return (
            <Link
              key={world.id}
              href={`/worlds/${world.id}`}
              className="group bg-white rounded-xl border border-[#D6D0C4] shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Colour accent bar */}
              <div className="h-2 w-full" style={{ backgroundColor: world.color }} />

              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                      style={{ backgroundColor: world.color }}
                    >
                      {world.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-lg font-bold text-[#1F2937] group-hover:underline">
                      {world.name}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${badge}`}>
                    {world.status}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
