'use client'

import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/store/app-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Flame, Trophy, Clock, BookOpen, Zap, Target, Award, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import type { Badge as BadgeType } from '@/types'

export function ProgressView() {
  const { userStats } = useAppStore()

  const { data: badges, isLoading: loadingBadges } = useQuery<BadgeType[]>({
    queryKey: ['badges'],
    queryFn: () => fetch('/api/badges').then((r) => r.json()),
  })

  const earnedBadges = badges?.filter((b) => b.earnedAt) ?? []
  const totalBadges = badges?.length ?? 0
  const level = userStats?.level ?? 1
  const xpInLevel = userStats ? userStats.totalXP % 250 : 0
  const xpProgress = (xpInLevel / 250) * 100

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-lg font-bold tracking-tight sm:text-xl flex items-center gap-2"
          style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '14px' }}
        >
          🏆 Thành tích & Thống kê
        </h1>
        <p className="mt-2 text-muted-foreground text-xs">
          Theo dõi tiến độ và những thành quả của bạn
        </p>
      </div>

      {/* Level Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-4 border-black shadow-[inset_-4px_-4px_0_#000,inset_4px_4px_0_#fff] bg-[#fef3c7]">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center bg-[#e11d48] text-white text-2xl font-bold border-4 border-black shadow-[4px_4px_0_#000]">
                {level}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold">Cấp {level}</h2>
                <p className="text-sm text-muted-foreground">Tổng {userStats?.totalXP ?? 0} XP</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 h-5 bg-white border-3 border-black overflow-hidden">
                    <div
                      className="h-full bg-[#e11d48] transition-all duration-500"
                      style={{ width: `${xpProgress}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-bold">{xpInLevel}/250 XP</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Flame, label: 'Chuỗi hiện tại', value: `${userStats?.currentStreak ?? 0} ngày`, color: 'text-orange-700', bg: 'bg-orange-100' },
          { icon: Target, label: 'Chuỗi dài nhất', value: `${userStats?.longestStreak ?? 0} ngày`, color: 'text-red-700', bg: 'bg-red-100' },
          { icon: BookOpen, label: 'Bài đã hoàn thành', value: `${userStats?.lessonsCompleted ?? 0}`, color: 'text-emerald-700', bg: 'bg-emerald-100' },
          { icon: Clock, label: 'Thời gian học', value: `${userStats?.totalTimeMinutes ?? 0} phút`, color: 'text-violet-700', bg: 'bg-violet-100' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-4 border-black shadow-[inset_-4px_-4px_0_#000,inset_4px_4px_0_#fff] bg-[#fef3c7]">
              <CardContent className="p-4">
                <div className={cn('flex h-9 w-9 items-center justify-center border-3 border-black shadow-[inset_-2px_-2px_0_#000,inset_2px_2px_0_#fff] mb-2', stat.bg)}>
                  <stat.icon className={cn('h-4 w-4', stat.color)} />
                </div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Badges */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-sm font-bold flex items-center gap-2"
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '10px' }}
          >
            <Award className="h-5 w-5 text-amber-500" />
            Huy hiệu
          </h3>
          <span className="text-sm text-muted-foreground font-bold">
            {earnedBadges.length}/{totalBadges} đã đạt
          </span>
        </div>

        {loadingBadges ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 border-4 border-black" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {badges?.map((badge, i) => {
              const isEarned = !!badge.earnedAt
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <Card className={cn(
                    'border-4 border-black shadow-[inset_-4px_-4px_0_#000,inset_4px_4px_0_#fff] bg-[#fef3c7] transition-all duration-200',
                    isEarned ? '' : 'opacity-50 grayscale'
                  )}>
                    <CardContent className="p-4 text-center">
                      <div className={cn(
                        'flex h-12 w-12 items-center justify-center border-3 border-black mx-auto mb-2 text-2xl',
                        isEarned
                          ? 'shadow-[inset_-2px_-2px_0_#000,inset_2px_2px_0_#fff] bg-amber-100'
                          : 'bg-gray-100'
                      )}>
                        {badge.icon}
                      </div>
                      <h4 className="text-sm font-bold">{badge.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{badge.description}</p>
                      {isEarned && (
                        <span className="inline-flex items-center mt-2 text-[10px] px-2 py-0.5 border-3 border-black shadow-[2px_2px_0_#000] bg-[#fef3c7] font-bold">
                          <Zap className="h-2.5 w-2.5 mr-0.5" />
                          Đã đạt
                        </span>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
