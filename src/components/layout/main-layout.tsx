'use client'

import { useAppStore } from '@/store/app-store'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Menu, Flame, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import React from 'react'

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

  const randomQuote = motivationalQuotes[Math.floor(Date.now() / 86400000) % motivationalQuotes.length]

  const showBackButton = currentView === 'lesson' || (currentView === 'skill-path' && currentSkillPathId)

  return (
    <div className="min-h-screen flex flex-col bg-[#fde047]">
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b-[4px] border-b-black bg-[#fef3c7] px-4 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="shrink-0 border-[3px] border-black shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] bg-[#fef3c7] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100"
        >
          <Menu className="h-5 w-5 text-black" />
          <span className="sr-only">Mở menu</span>
        </Button>
        <h2 className="text-[11px] font-bold truncate text-black" style={{ fontFamily: "'Press Start 2P', monospace" }}>
          {viewTitles[currentView] ?? 'MindForge'}
        </h2>
        {userStats && userStats.currentStreak > 0 && (
          <div className="ml-auto flex items-center gap-1 border-[3px] border-black bg-[#f59e0b] px-2 py-1 shadow-[4px_4px_0_#000]">
            <Flame className="h-4 w-4 text-white" />
            <span className="text-[10px] font-bold text-white" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              {userStats.currentStreak}
            </span>
          </div>
        )}
      </header>

      {/* Desktop header */}
      <header className="hidden lg:flex lg:sticky lg:top-0 lg:z-40 lg:h-14 lg:items-center lg:gap-3 border-b-[4px] border-b-black bg-[#fef3c7] lg:px-6">
        {showBackButton ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView(currentView === 'lesson' ? 'skill-path' : 'dashboard')}
            className="gap-1.5 border-[3px] border-black bg-white shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100 text-black text-[10px] font-bold"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            <ArrowLeft className="h-3 w-3" />
            <span>QUAY LẠI</span>
          </Button>
        ) : (
          <div />
        )}
        <h2
          className="text-xs font-bold flex-1 text-black"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          {viewTitles[currentView] ?? 'MindForge'}
        </h2>

        <div className="flex items-center gap-2">
          {/* Streak */}
          {userStats && userStats.currentStreak > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 border-[3px] border-black bg-[#f59e0b] px-3 py-1.5 shadow-[4px_4px_0_#000]">
                  <Flame className="h-4 w-4 text-white" />
                  <span
                    className="text-[10px] font-bold text-white"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    {userStats.currentStreak} NGÀY
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-[10px]" style={{ fontFamily: "'Press Start 2P', monospace" }}>Chuỗi học tập hiện tại</p>
              </TooltipContent>
            </Tooltip>
          )}
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
        <footer className="border-t-[4px] border-t-black mt-auto bg-[#fef3c7]">
          <div className="mx-auto max-w-5xl px-4 py-4 lg:px-8">
            <p
              className="text-center text-[10px] text-black italic"
            >
              {randomQuote}
            </p>
            <p
              className="text-center text-[9px] text-black/60 mt-2"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              © 2024 MindForge Academy
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
