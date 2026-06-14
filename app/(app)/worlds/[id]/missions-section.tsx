'use client'

import { useState } from 'react'
import { Lock, PlayCircle, Trophy } from 'lucide-react'

export type Mission = {
  id: string
  week_number: number
  title: string
  description: string | null
  xp_value: number
}

// First 100 characters + "..." when longer.
function preview(text: string | null) {
  if (!text) return ''
  return text.length > 100 ? `${text.slice(0, 100)}...` : text
}

export default function MissionsSection({ missions }: { missions: Mission[] }) {
  const weeks = Array.from(new Set(missions.map((m) => m.week_number))).sort(
    (a, b) => a - b,
  )
  const [activeWeek, setActiveWeek] = useState(weeks[0] ?? 1)

  const weekMissions = missions.filter((m) => m.week_number === activeWeek)
  // Per spec: Week 1 is Available, every other week is Locked.
  const isAvailable = activeWeek === 1
  const totalXp = weekMissions.reduce((sum, m) => sum + m.xp_value, 0)

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

      {/* Mission cards for the active week */}
      {weekMissions.length === 0 ? (
        <div className="bg-white border border-[#D6D0C4] rounded-xl p-10 text-center text-[#4B5563]">
          No missions for this week yet.
        </div>
      ) : (
        <div className="space-y-3">
          {weekMissions.map((mission) => (
            <div
              key={mission.id}
              className={`bg-white rounded-xl p-5 border border-[#D6D0C4] shadow-sm ${
                isAvailable ? '' : 'opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className="inline-block text-xs font-semibold text-[#4B5563] uppercase tracking-wide mb-1">
                    Week {mission.week_number}
                  </span>
                  <h4 className="font-bold text-[#1F2937]">{mission.title}</h4>
                </div>
                {isAvailable ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 shrink-0">
                    Available
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-600 shrink-0">
                    <Lock size={14} />
                    Locked
                  </span>
                )}
              </div>

              {mission.description && (
                <p className="text-sm text-[#4B5563] mt-2">
                  {preview(mission.description)}
                </p>
              )}

              <div className="flex items-center justify-between gap-3 mt-4">
                <span className="px-2.5 py-1 rounded-full bg-[#E8E4D8] text-xs font-semibold text-[#1F2937]">
                  {mission.xp_value} XP
                </span>
                {isAvailable ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 bg-[#1F2937] text-white rounded-xl px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <PlayCircle size={16} />
                    Start Mission
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4B5563]">
                    <Lock size={14} />
                    Locked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Week Quest (derived from this week's missions — no quests table exists) */}
      <div className="mt-8 bg-white rounded-xl p-6 border border-[#D6D0C4] shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Trophy size={20} className="text-[#1F2937]" />
          <h3 className="text-lg font-bold text-[#1F2937]">
            Week {activeWeek} Quest
          </h3>
        </div>
        <p className="text-sm text-[#4B5563]">
          {weekMissions.length > 0
            ? `Complete all ${weekMissions.length} mission${
                weekMissions.length === 1 ? '' : 's'
              } in Week ${activeWeek} to finish this week's quest and earn ${totalXp} XP.`
            : `No quest available for Week ${activeWeek} yet.`}
        </p>
      </div>
    </div>
  )
}
