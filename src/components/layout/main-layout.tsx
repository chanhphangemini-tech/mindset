'use client'

import { useAppStore } from '@/store/app-store'
import { Sidebar } from '@/components/layout/sidebar'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Menu, Flame, Sun, Moon, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

const viewTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  'skill-path': 'Lộ trình học',
  lesson: 'Bài học',
  'ai-practice': 'Học cùng AI',
  progress: 'Thành tích & Thống kê',
  notes: 'Ghi chú',
  settings: 'Cài đặt',
}

const motivationalQuotes = [
  '“Học là hành trình không bao giờ kết thúc.”',
  '“Tư duy tốt hơn là nền tảng của mọi thành công.”',
  '“Kiến thức là sức mạnh, tư duy là cách sử dụng nó.”',
  '“Mỗi ngày học thêm một điều mới là một ngày không lãng phí.”',
  '“Đầu tư vào kiến thức mang lại lợi suất tốt nhất.”',
]

export function MainLayout({ children }: { children: React.ReactNode }) {
  const {
    currentView,
    currentSkillPathId,
    userStats,
    toggleSidebar,
    setView,
  } = useAppStore()
  const { theme, setTheme } = useTheme()

  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const randomQuote = motivationalQuotes[Math.floor(Date.now() / 86400000) % motivationalQuotes.length]

  const showBackButton = currentView === 'lesson' || (currentView === 'skill-path' && currentSkillPathId)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:hidden">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="shrink-0">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Mở menu</span>
        </Button>
        <h2 className="text-sm font-semibold truncate">
          {viewTitles[currentView] ?? 'MindForge'}
        </h2>
        {userStats && userStats.currentStreak > 0 && (
          <div className="ml-auto flex items-center gap-1 text-sm">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="font-medium">{userStats.currentStreak} ngày</span>
          </div>
        )}
      </header>

      {/* Desktop header */}
      <header className="hidden lg:flex lg:sticky lg:top-0 lg:z-40 lg:h-14 lg:items-center lg:gap-3 lg:border-b lg:bg-background/95 lg:backdrop-blur lg:supports-[backdrop-filter]:bg-background/60 lg:px-6">
        {showBackButton ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView(currentView === 'lesson' ? 'skill-path' : 'dashboard')}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Button>
        ) : (
          <div />
        )}
        <h2 className="text-lg font-semibold flex-1">
          {viewTitles[currentView] ?? 'MindForge'}
        </h2>

        <div className="flex items-center gap-2">
          {/* Streak */}
          {userStats && userStats.currentStreak > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1.5 text-sm font-medium text-orange-600 dark:text-orange-400">
                  <Flame className="h-4 w-4" />
                  <span>{userStats.currentStreak} ngày</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chuỗi học tập hiện tại</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-9 w-9"
              >
                {mounted && theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="sr-only">Đổi giao diện</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{mounted && theme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 lg:pl-64">
        <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="border-t mt-auto">
          <div className="mx-auto max-w-5xl px-4 py-4 lg:px-8">
            <p className="text-center text-xs text-muted-foreground italic">
              {randomQuote}
            </p>
            <p className="text-center text-[10px] text-muted-foreground/60 mt-1">
              © 2024 MindForge Academy
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}

// Need React import for useState/useEffect
import React from 'react'
