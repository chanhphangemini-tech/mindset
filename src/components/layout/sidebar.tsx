'use client'

import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/store/app-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  Bot,
  Trophy,
  TrendingUp,
  StickyNote,
} from 'lucide-react'
import type { SkillPath } from '@/types'

const bottomNavItems = [
  { icon: Trophy, title: 'Thành tựu', view: 'progress' as const },
  { icon: TrendingUp, title: 'Thống kê', view: 'progress' as const },
  { icon: StickyNote, title: 'Ghi chú', view: 'notes' as const },
]

const colorMap: Record<string, string> = {
  emerald: 'bg-emerald-500 text-white hover:bg-emerald-600',
  amber: 'bg-amber-500 text-white hover:bg-amber-600',
  violet: 'bg-violet-500 text-white hover:bg-violet-600',
  rose: 'bg-rose-500 text-white hover:bg-rose-600',
}

const activeColorMap: Record<string, string> = {
  emerald: 'bg-emerald-600 text-white border-l-[4px] border-l-emerald-800',
  amber: 'bg-amber-600 text-white border-l-[4px] border-l-amber-800',
  violet: 'bg-violet-600 text-white border-l-[4px] border-l-violet-800',
  rose: 'bg-rose-600 text-white border-l-[4px] border-l-rose-800',
}

function SidebarContent() {
  const {
    currentView,
    currentSkillPathId,
    userStats,
    setView,
    navigateToSkillPath,
  } = useAppStore()

  const { data: skillPaths, isLoading: loadingPaths } = useQuery<SkillPath[]>({
    queryKey: ['skill-paths'],
    queryFn: () => fetch('/api/skill-paths').then((r) => r.json()),
  })

  const level = userStats?.level ?? 1
  const xpInLevel = userStats ? userStats.totalXP % 250 : 0
  const xpProgress = (xpInLevel / 250) * 100

  return (
    <div className="flex h-full flex-col bg-[#fef3c7]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-4 shadow-[inset_-4px_-4px_0_#000,inset_4px_4px_0_#fff]">
        <div className="flex h-10 w-10 items-center justify-center border-[4px] border-black bg-[#e11d48] text-white font-bold text-[10px] shadow-[4px_4px_0_#000]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
          MF
        </div>
        <div>
          <h1
            className="text-xs font-bold tracking-tight text-black"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            MindForge
          </h1>
          <p className="text-[9px] text-black/60 leading-none mt-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            Academy
          </p>
        </div>
      </div>

      <div className="border-b-[4px] border-b-black" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-3">
        <div className="space-y-1">
          {/* Dashboard */}
          <button
            onClick={() => setView('dashboard')}
            className={cn(
              'flex w-full items-center gap-3 px-3 py-2.5 text-[10px] font-bold transition-all duration-100 border-[3px] border-black',
              currentView === 'dashboard'
                ? 'bg-[#e11d48] text-white shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.2),inset_2px_2px_0_rgba(255,255,255,0.2)]'
                : 'bg-white text-black shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]'
            )}
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            <BarChart3 className="h-4 w-4 shrink-0" />
            <span>DASHBOARD</span>
          </button>

          {/* AI Practice */}
          <button
            onClick={() => setView('ai-practice')}
            className={cn(
              'flex w-full items-center gap-3 px-3 py-2.5 text-[10px] font-bold transition-all duration-100 border-[3px] border-black',
              currentView === 'ai-practice'
                ? 'bg-[#e11d48] text-white shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.2),inset_2px_2px_0_rgba(255,255,255,0.2)]'
                : 'bg-white text-black shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]'
            )}
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            <Bot className="h-4 w-4 shrink-0" />
            <span>HỌC CÙNG AI</span>
          </button>
        </div>

        <div className="border-b-[4px] border-b-black my-3" />

        {/* Skill paths label */}
        <p
          className="px-3 pb-2 text-[9px] font-bold uppercase tracking-wider text-black/60"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          LỘ TRÌNH HỌC
        </p>

        <div className="space-y-1">
          {loadingPaths
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                  <Skeleton className="h-5 w-5 border-[3px] border-black" />
                  <Skeleton className="h-4 w-28 border-[3px] border-black" />
                </div>
              ))
            : skillPaths?.map((sp) => {
                const isActive = currentView === 'skill-path' && currentSkillPathId === sp.id
                return (
                  <button
                    key={sp.id}
                    onClick={() => navigateToSkillPath(sp.id)}
                    className={cn(
                      'flex w-full items-center gap-3 px-3 py-2.5 text-[10px] font-bold transition-all duration-100 border-[3px] border-black',
                      isActive
                        ? cn(activeColorMap[sp.color] || 'bg-[#e11d48] text-white shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.2),inset_2px_2px_0_rgba(255,255,255,0.2)]')
                        : cn(colorMap[sp.color] || 'bg-white text-black shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]')
                    )}
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    <span className="text-base shrink-0">{sp.icon}</span>
                    <span className="truncate">{sp.title}</span>
                  </button>
                )
              })}
        </div>

        <div className="border-b-[4px] border-b-black my-3" />

        {/* Bottom nav */}
        <div className="space-y-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.view
            return (
              <button
                key={item.title}
                onClick={() => setView(item.view)}
                className={cn(
                  'flex w-full items-center gap-3 px-3 py-2.5 text-[10px] font-bold transition-all duration-100 border-[3px] border-black',
                  isActive
                    ? 'bg-[#e11d48] text-white shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.2),inset_2px_2px_0_rgba(255,255,255,0.2)]'
                    : 'bg-white text-black shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]'
                )}
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.title.toUpperCase()}</span>
              </button>
            )
          })}
        </div>
      </ScrollArea>

      {/* User level section */}
      <div className="border-t-[4px] border-t-black p-4 bg-[#fef3c7] shadow-[inset_-4px_-4px_0_#000,inset_4px_4px_0_#fff]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className="flex h-10 w-10 items-center justify-center border-[4px] border-black bg-[#e11d48] text-white text-xs font-bold shadow-[4px_4px_0_#000]"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              {level}
            </div>
            <div>
              <p className="text-[10px] font-bold text-black" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                CẤP {level}
              </p>
              <p className="text-[9px] text-black/60 mt-0.5" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                {userStats?.totalXP ?? 0} XP
              </p>
            </div>
          </div>
          <span className="text-[9px] text-black/60" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            {xpInLevel}/250
          </span>
        </div>
        {/* Neo-brutalist progress bar */}
        <div className="h-4 w-full border-[3px] border-black bg-white shadow-[inset_-2px_-2px_0_#000,inset_2px_2px_0_#fff]">
          <div
            className="h-full bg-[#f59e0b] transition-all duration-300"
            style={{ width: `${Math.max(xpProgress, 2)}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppStore()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r-[4px] border-r-black bg-[#fef3c7] z-30 shadow-[inset_-4px_-4px_0_#000,inset_4px_4px_0_#fff]">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="w-72 p-0 bg-[#fef3c7] border-r-[4px] border-r-black">
              <SheetTitle className="sr-only">Menu điều hướng</SheetTitle>
              <SidebarContent />
            </SheetContent>
          </Sheet>
        )}
      </AnimatePresence>
    </>
  )
}
