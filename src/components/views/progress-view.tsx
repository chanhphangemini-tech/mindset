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
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Thành tích & Thống kê
        </h1>
        <p className="mt-1 text-muted-foreground">
          Theo dõi tiến độ và những thành quả của bạn
        </p>
      </div>

      {/* Level Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-0 shadow-sm bg-gradient-to-r from-emerald-500/5 via-amber-500/5 to-violet-500/5">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 text-white text-2xl font-bold shadow-lg">
                {level}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold">Cấp {level}</h2>
                <p className="text-sm text-muted-foreground">Tổng {userStats?.totalXP ?? 0} XP</p>
                <div className="flex items-center gap-3 mt-2">
                  <Progress value={xpProgress} className="h-2 flex-1" />
                  <span className="text-xs text-muted-foreground">{xpInLevel}/250 XP</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Flame, label: 'Chuỗi hiện tại', value: `${userStats?.currentStreak ?? 0} ngày`, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10' },
          { icon: Target, label: 'Chuỗi dài nhất', value: `${userStats?.longestStreak ?? 0} ngày`, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10' },
          { icon: BookOpen, label: 'Bài đã hoàn thành', value: `${userStats?.lessonsCompleted ?? 0}`, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
          { icon: Clock, label: 'Thời gian học', value: `${userStats?.totalTimeMinutes ?? 0} phút`, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/10' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg mb-2', stat.bg)}>
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
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            Huy hiệu
          </h3>
          <span className="text-sm text-muted-foreground">
            {earnedBadges.length}/{totalBadges} đã đạt
          </span>
        </div>

        {loadingBadges ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
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
                    'border-0 shadow-sm transition-all duration-200',
                    isEarned ? '' : 'opacity-50 grayscale'
                  )}>
                    <CardContent className="p-4 text-center">
                      <div className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl mx-auto mb-2 text-2xl',
                        isEarned ? 'bg-amber-500/10' : 'bg-muted'
                      )}>
                        {badge.icon}
                      </div>
                      <h4 className="text-sm font-semibold">{badge.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{badge.description}</p>
                      {isEarned && (
                        <Badge variant="secondary" className="mt-2 text-[10px]">
                          <Zap className="h-2.5 w-2.5 mr-0.5" />
                          Đã đạt
                        </Badge>
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
