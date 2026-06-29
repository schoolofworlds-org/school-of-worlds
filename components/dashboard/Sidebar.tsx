'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Globe,
  FolderOpen,
  Bell,
  Settings,
  LogOut
} from 'lucide-react'
import { logout } from '@/app/auth/actions'
import { levelFromXp, xpIntoLevel, XP_PER_LEVEL } from '@/lib/level'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Worlds', href: '/worlds', icon: Globe },
  { name: 'Portfolio', href: '/portfolio', icon: FolderOpen },
  { name: 'Announcements', href: '/announcements', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
]

type SidebarProps = {
  userName: string
  userEmail: string
  xpTotal: number
}

export default function Sidebar({ userName, userEmail, xpTotal }: SidebarProps) {
  const pathname = usePathname()

  const initials = userName
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const level = levelFromXp(xpTotal)
  const xpInLevel = xpIntoLevel(xpTotal)
  const levelPct = Math.round((xpInLevel / XP_PER_LEVEL) * 100)

  return (
    <aside className="w-52 bg-white border-r border-[#D6D0C4] flex flex-col h-full shrink-0">
      <div className="p-4">
        <div className="flex items-center gap-2 font-bold text-[13px] text-[#1F2937]">
          <Image
            src="/logo.png"
            alt="School of Worlds"
            width={28}
            height={28}
            className="rounded-lg"
          />
          School of Worlds
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-[#1F2937] text-white'
                  : 'text-[#1F2937] hover:bg-[#E8E4D8]'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-white' : 'text-[#4B5563]'} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#D6D0C4] space-y-2">
        <div className="bg-[#E8E4D8] rounded-xl p-3 flex flex-col gap-2.5">
           <div className="flex items-center gap-2.5">
             <div className="w-7 h-7 rounded-full bg-[#1F2937] flex items-center justify-center shrink-0">
               <span className="text-white text-[11px] font-semibold">{initials}</span>
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-[#1F2937] truncate">{userName}</p>
                <p className="text-[11px] text-[#4B5563] truncate">{userEmail}</p>
             </div>
           </div>

           <div className="space-y-1">
             <div className="flex justify-between text-[11px] font-medium text-[#1F2937]">
               <span>Level {level}</span>
               <span>{xpInLevel} / {XP_PER_LEVEL} XP</span>
             </div>
             <div className="h-1.5 w-full bg-[#D6D0C4] rounded-full overflow-hidden">
                <div className="h-full bg-[#1F2937] rounded-full" style={{ width: `${levelPct}%` }}></div>
             </div>
           </div>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-[#1F2937] hover:bg-[#E8E4D8] transition-colors"
          >
            <LogOut size={16} className="text-[#4B5563]" />
            Log Out
          </button>
        </form>
      </div>
    </aside>
  )
}
