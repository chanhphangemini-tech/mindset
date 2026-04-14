'use client'

import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/store/app-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
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
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20',
  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20',
  rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20',
}

const activeColorMap: Record<string, string> = {
  emerald: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-l-emerald-500',
  amber: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-l-amber-500',
  violet: 'bg-violet-500/20 text-violet-700 dark:text-violet-300 border-l-violet-500',
  rose: 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-l-rose-500',
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
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-amber-500 text-white font-bold text-sm">
          MF
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight">MindForge</h1>
          <p className="text-[11px] text-muted-foreground leading-none">Academy</p>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-3">
        <div className="space-y-1">
          {/* Dashboard */}
          <button
            onClick={() => setView('dashboard')}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 border-l-2 border-transparent',
              currentView === 'dashboard'
                ? 'bg-primary/10 text-primary border-l-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground border-l-transparent'
            )}
          >
            <BarChart3 className="h-4 w-4 shrink-0" />
            <span>Dashboard</span>
          </button>

          {/* AI Practice */}
          <button
            onClick={() => setView('ai-practice')}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 border-l-2 border-transparent',
              currentView === 'ai-practice'
                ? 'bg-primary/10 text-primary border-l-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground border-l-transparent'
            )}
          >
            <Bot className="h-4 w-4 shrink-0" />
            <span>Học cùng AI</span>
          </button>
        </div>

        <Separator className="my-3" />

        {/* Skill paths label */}
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Lộ trình học
        </p>

        <div className="space-y-1">
          {loadingPaths
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))
            : skillPaths?.map((sp) => {
                const isActive = currentView === 'skill-path' && currentSkillPathId === sp.id
                return (
                  <button
                    key={sp.id}
                    onClick={() => navigateToSkillPath(sp.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 border-l-2',
                      isActive
                        ? cn(activeColorMap[sp.color] || 'bg-primary/10 text-primary border-l-primary')
                        : cn(colorMap[sp.color] || 'text-muted-foreground hover:bg-muted hover:text-foreground'),
                      !isActive && 'border-l-transparent'
                    )}
                  >
                    <span className="text-base shrink-0">{sp.icon}</span>
                    <span className="truncate">{sp.title}</span>
                  </button>
                )
              })}
        </div>

        <Separator className="my-3" />

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
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 border-l-2 border-transparent',
                  isActive
                    ? 'bg-primary/10 text-primary border-l-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground border-l-transparent'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
              </button>
            )
          })}
        </div>
      </ScrollArea>

      {/* User level section */}
      <div className="border-t p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-amber-500 text-white text-xs font-bold">
              {level}
            </div>
            <div>
              <p className="text-xs font-semibold">Cấp {level}</p>
              <p className="text-[10px] text-muted-foreground">{userStats?.totalXP ?? 0} XP tổng</p>
            </div>
          </div>
          <span className="text-[10px] text-muted-foreground">
            {xpInLevel}/250 XP
          </span>
        </div>
        <Progress value={xpProgress} className="h-1.5" />
      </div>
    </div>
  )
}

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppStore()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r bg-card z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">Menu điều hướng</SheetTitle>
              <SidebarContent />
            </SheetContent>
          </Sheet>
        )}
      </AnimatePresence>
    </>
  )
}
