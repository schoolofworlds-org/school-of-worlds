'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Globe,
  Users,
  FolderOpen,
  Bell,
  Settings,
  LogOut
} from 'lucide-react'
import { logout } from '@/app/auth/actions'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Worlds', href: '/worlds', icon: Globe },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Portfolio', href: '/portfolio', icon: FolderOpen },
  { name: 'Announcements', href: '/announcements', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
]

type SidebarProps = {
  userName: string
  userEmail: string
}

export default function Sidebar({ userName, userEmail }: SidebarProps) {
  const pathname = usePathname()

  const initials = userName
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <aside className="w-64 bg-white border-r border-[#D6D0C4] flex flex-col h-full shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-2 font-bold text-xl text-[#1F2937]">
          <Image
            src="/logo.png"
            alt="School of Worlds"
            width={40}
            height={40}
            className="rounded-lg"
          />
          School of Worlds
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive 
                  ? 'bg-[#1F2937] text-white' 
                  : 'text-[#1F2937] hover:bg-[#E8E4D8]'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-[#4B5563]'} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-6 border-t border-[#D6D0C4] space-y-3">
        <div className="bg-[#E8E4D8] rounded-xl p-4 flex flex-col gap-3">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-[#1F2937] flex items-center justify-center shrink-0">
               <span className="text-white text-sm font-semibold">{initials}</span>
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1F2937] truncate">{userName}</p>
                <p className="text-xs text-[#4B5563] truncate">{userEmail}</p>
             </div>
           </div>
           
           <div className="space-y-1">
             <div className="flex justify-between text-xs font-medium text-[#1F2937]">
               <span>XP Progress</span>
               <span>1,250 / 2,000</span>
             </div>
             <div className="h-2 w-full bg-[#D6D0C4] rounded-full overflow-hidden">
                <div className="h-full bg-[#1F2937] w-[62.5%] rounded-full"></div>
             </div>
           </div>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-[#1F2937] hover:bg-[#E8E4D8] transition-colors"
          >
            <LogOut size={20} className="text-[#4B5563]" />
            Log Out
          </button>
        </form>
      </div>
    </aside>
  )
}
