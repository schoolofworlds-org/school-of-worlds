import { ExternalLink, FolderOpen } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

type PortfolioItem = {
  id: string
  title: string
  description: string | null
  image_url: string | null
  link_url: string | null
}

export default async function PortfolioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // The layout already guards against unauthenticated access, but guard the
  // query too so we never run it without a user id.
  const { data: items } = user
    ? await supabase
        .from('portfolio_items')
        .select('id, title, description, image_url, link_url')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    : { data: null }

  const projects = (items as PortfolioItem[] | null) ?? []

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F2937]">Portfolio</h1>
        <p className="text-[#4B5563] mt-1">Projects you have built across your worlds.</p>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white border border-[#D6D0C4] rounded-xl p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#E8E4D8] flex items-center justify-center mx-auto mb-4">
            <FolderOpen size={26} className="text-[#4B5563]" />
          </div>
          <p className="text-lg font-semibold text-[#1F2937]">No projects yet</p>
          <p className="text-sm text-[#4B5563] mt-1">
            Complete missions to start building your portfolio.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-[#D6D0C4] shadow-sm overflow-hidden flex flex-col"
            >
              {project.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-[#E8E4D8] flex items-center justify-center">
                  <FolderOpen size={28} className="text-[#4B5563]" />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-[#1F2937]">{project.title}</h3>
                {project.description && (
                  <p className="text-sm text-[#4B5563] mt-1 flex-1">{project.description}</p>
                )}
                {project.link_url && (
                  <a
                    href={project.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#1F2937] hover:opacity-70 transition-opacity mt-3"
                  >
                    View project <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
