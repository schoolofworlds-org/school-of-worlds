import { Users } from 'lucide-react'

export default function CommunityPage() {
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F2937]">Community</h1>
      </div>

      <div className="bg-white border border-[#D6D0C4] rounded-xl p-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#E8E4D8] flex items-center justify-center mx-auto mb-4">
          <Users size={26} className="text-[#4B5563]" />
        </div>
        <p className="text-lg font-semibold text-[#1F2937]">Community coming soon</p>
        <p className="text-sm text-[#4B5563] mt-1">
          Connect with other learners, share progress, and team up on missions.
        </p>
      </div>
    </div>
  )
}
