'use client'

import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/store/app-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Flame, BookOpen, Trophy, Clock, Zap, ChevronRight } from 'lucide-react'
import type { SkillPath, DailyChallenge } from '@/types'
import { motion } from 'framer-motion'

const colorMap: Record<string, string> = {
  emerald: 'from-emerald-500 to-emerald-600',
  amber: 'from-amber-500 to-amber-600',
  violet: 'from-violet-500 to-violet-600',
  rose: 'from-rose-500 to-rose-600',
}

const borderColorMap: Record<string, string> = {
  emerald: 'border-emerald-500/20 hover:border-emerald-500/40',
  amber: 'border-amber-500/20 hover:border-amber-500/40',
  violet: 'border-violet-500/20 hover:border-violet-500/40',
  rose: 'border-rose-500/20 hover:border-rose-500/40',
}

const iconBgMap: Record<string, string> = {
  emerald: 'bg-emerald-500/10',
  amber: 'bg-amber-500/10',
  violet: 'bg-violet-500/10',
  rose: 'bg-rose-500/10',
}

export function DashboardView() {
  const { userStats, completedLessons, navigateToSkillPath, setView } = useAppStore()

  const { data: skillPaths, isLoading: loadingPaths } = useQuery<SkillPath[]>({
    queryKey: ['skill-paths'],
    queryFn: () => fetch('/api/skill-paths').then((r) => r.json()),
  })

  const { data: dailyChallenge } = useQuery<DailyChallenge>({
    queryKey: ['daily-challenge'],
    queryFn: () => fetch('/api/daily-challenge').then((r) => r.json()),
  })

  const totalLessons = skillPaths?.reduce((sum, sp) => sum + sp.modules.reduce((s, m) => s + m.lessons.length, 0), 0) ?? 0
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Chào mừng đến MindForge 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Tiếp tục hành trình phát triển tư duy của bạn
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                  <Flame className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <p className="text-2xl font-bold">{userStats?.currentStreak ?? 0}</p>
              <p className="text-xs text-muted-foreground">Chuỗi ngày</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                  <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <p className="text-2xl font-bold">{completedLessons.length}</p>
              <p className="text-xs text-muted-foreground">Bài đã hoàn thành</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                  <Trophy className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
              </div>
              <p className="text-2xl font-bold">{userStats?.totalXP ?? 0}</p>
              <p className="text-xs text-muted-foreground">Tổng XP</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10">
                  <Clock className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </div>
              </div>
              <p className="text-2xl font-bold">{userStats?.totalTimeMinutes ?? 0}p</p>
              <p className="text-xs text-muted-foreground">Thời gian học</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Overall Progress */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Tiến độ tổng quan</h3>
            <span className="text-sm font-medium text-muted-foreground">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2.5" />
          <p className="text-xs text-muted-foreground mt-2">
            {completedLessons.length} / {totalLessons} bài học hoàn thành
          </p>
        </CardContent>
      </Card>

      {/* Daily Challenge */}
      {dailyChallenge && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-0 shadow-sm bg-gradient-to-r from-emerald-500/5 via-amber-500/5 to-violet-500/5">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Thử thách hôm nay
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  +{dailyChallenge.xpReward} XP
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <p className="font-medium text-sm">{dailyChallenge.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{dailyChallenge.description}</p>
              <Badge variant="outline" className="mt-3 text-xs capitalize">
                {dailyChallenge.challengeType === 'reflection' ? 'Phản tư' : 
                 dailyChallenge.challengeType === 'quiz' ? 'Trắc nghiệm' : 'Tình huống'}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Skill Paths */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Lộ trình học</h3>
        </div>

        {loadingPaths ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {skillPaths?.map((sp, i) => {
              const totalLessonsInPath = sp.modules.reduce((s, m) => s + m.lessons.length, 0)
              const completedInPath = sp.modules.reduce(
                (s, m) => s + m.lessons.filter((l) => completedLessons.includes(l.id)).length,
                0
              )
              const pathProgress = totalLessonsInPath > 0 ? Math.round((completedInPath / totalLessonsInPath) * 100) : 0

              return (
                <motion.div
                  key={sp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i + 0.2 }}
                >
                  <Card
                    className={cn(
                      'cursor-pointer transition-all duration-200 border',
                      borderColorMap[sp.color] || 'hover:border-primary/30'
                    )}
                    onClick={() => navigateToSkillPath(sp.id)}
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl text-lg shrink-0', iconBgMap[sp.color])}>
                          {sp.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm leading-tight">{sp.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {sp.description}
                          </p>
                          <div className="flex items-center gap-3 mt-3">
                            <Progress value={pathProgress} className="h-1.5 flex-1" />
                            <span className="text-xs text-muted-foreground shrink-0">{pathProgress}%</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>{sp.modules.length} module</span>
                            <span>•</span>
                            <span>{totalLessonsInPath} bài học</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Hành động nhanh</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Card
            className="cursor-pointer border-0 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() => setView('ai-practice')}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                🤖
              </div>
              <div>
                <p className="text-sm font-semibold">Học cùng AI</p>
                <p className="text-xs text-muted-foreground">Chat với trợ lý AI</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer border-0 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() => setView('progress')}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                🏆
              </div>
              <div>
                <p className="text-sm font-semibold">Thành tích</p>
                <p className="text-xs text-muted-foreground">Xem huy hiệu đã đạt</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer border-0 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() => setView('notes')}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                📝
              </div>
              <div>
                <p className="text-sm font-semibold">Ghi chú</p>
                <p className="text-xs text-muted-foreground">Quản lý ghi chú học tập</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

import { cn } from '@/lib/utils'
