'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trophy, Crown, ChevronRight } from 'lucide-react'

export type Mission = {
  id: string
  week_number: number
  title: string
  description: string | null
  xp_value: number
  mission_type: string
  unlock_order: number | null
}

function statusBadge(status?: string) {
  if (status === 'graded')
    return { label: 'Graded', cls: 'bg-green-100 text-green-700' }
  if (status === 'submitted')
    return { label: 'Submitted', cls: 'bg-orange-100 text-orange-700' }
  return { label: 'Not Started', cls: 'bg-gray-200 text-gray-600' }
}

export default function MissionsSection({
  missions,
  statusMap,
}: {
  missions: Mission[]
  statusMap: Record<string, string>
}) {
  const weeks = Array.from(new Set(missions.map((m) => m.week_number))).sort(
    (a, b) => a - b,
  )
  const [activeWeek, setActiveWeek] = useState(weeks[0] ?? 1)

  const weekMissions = missions.filter((m) => m.week_number === activeWeek)
  const quests = weekMissions.filter((m) => m.mission_type === 'quest')
  const summits = weekMissions.filter((m) => m.mission_type === 'summit')
  const regular = weekMissions
    .filter((m) => m.mission_type === 'mission')
    .sort((a, b) => (a.unlock_order ?? 0) - (b.unlock_order ?? 0))

  return (
    <div>
      <h2 className="text-xl font-bold text-[#1F2937] mb-4">Missions</h2>

      {/* Week tabs */}
      {weeks.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {weeks.map((week) => (
            <button
              key={week}
              type="button"
              onClick={() => setActiveWeek(week)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                week === activeWeek
                  ? 'bg-[#1F2937] text-white'
                  : 'bg-white text-[#1F2937] border border-[#D6D0C4] hover:bg-[#E8E4D8]'
              }`}
            >
              Week {week}
            </button>
          ))}
        </div>
      )}

      {/* Weekly quest(s) — larger cards above the missions */}
      {quests.map((quest) => {
        const badge = statusBadge(statusMap[quest.id])
        return (
          <Link
            key={quest.id}
            href={`/missions/${quest.id}`}
            className="group block bg-white rounded-xl border border-[#D6D0C4] shadow-sm p-6 mb-4 hover:shadow-md transition-shadow"
            style={{ borderLeftWidth: 6, borderLeftColor: '#F59E0B' }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <Trophy size={22} className="text-amber-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
                    Weekly Quest
                  </span>
                  <h3 className="text-lg font-bold text-[#1F2937] group-hover:underline">
                    {quest.title}
                  </h3>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${badge.cls}`}>
                {badge.label}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-3 text-sm">
              <span className="px-2.5 py-1 rounded-full bg-[#E8E4D8] text-xs font-semibold text-[#1F2937]">
                {quest.xp_value} XP
              </span>
              <span className="inline-flex items-center text-[#4B5563] group-hover:text-[#1F2937] text-xs font-medium ml-auto">
                Open <ChevronRight size={14} />
              </span>
            </div>
          </Link>
        )
      })}

      {/* Mission cards */}
      {regular.length === 0 && quests.length === 0 && summits.length === 0 ? (
        <div className="bg-white border border-[#D6D0C4] rounded-xl p-10 text-center text-[#4B5563]">
          Nothing for this week yet.
        </div>
      ) : (
        <div className="space-y-3">
          {regular.map((mission) => {
            const badge = statusBadge(statusMap[mission.id])
            return (
              <Link
                key={mission.id}
                href={`/missions/${mission.id}`}
                className="group block bg-white rounded-xl p-5 border border-[#D6D0C4] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="inline-block text-xs font-semibold text-[#4B5563] uppercase tracking-wide mb-1">
                      Mission
                    </span>
                    <h4 className="font-bold text-[#1F2937] group-hover:underline">
                      {mission.title}
                    </h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${badge.cls}`}>
                    {badge.label}
                  </span>
                </div>
                <div className="mt-3">
                  <span className="px-2.5 py-1 rounded-full bg-[#E8E4D8] text-xs font-semibold text-[#1F2937]">
                    {mission.xp_value} XP
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Final Summit — bottom of its week */}
      {summits.map((summit) => {
        const badge = statusBadge(statusMap[summit.id])
        return (
          <Link
            key={summit.id}
            href={`/missions/${summit.id}`}
            className="group block bg-white rounded-xl border border-[#D6D0C4] shadow-sm p-6 mt-4 hover:shadow-md transition-shadow"
            style={{ borderLeftWidth: 6, borderLeftColor: '#7C3AED' }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <Crown size={22} className="text-purple-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                    Final Summit
                  </span>
                  <h3 className="text-lg font-bold text-[#1F2937] group-hover:underline">
                    {summit.title}
                  </h3>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${badge.cls}`}>
                {badge.label}
              </span>
            </div>
            <div className="mt-3">
              <span className="px-2.5 py-1 rounded-full bg-[#E8E4D8] text-xs font-semibold text-[#1F2937]">
                {summit.xp_value} XP
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
