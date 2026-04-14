'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/store/app-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Flame,
  BookOpen,
  Trophy,
  Clock,
  Zap,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  Bot,
  StickyNote,
  GraduationCap,
  Layers,
  PencilLine,
  Medal,
} from 'lucide-react'
import type { SkillPath, DailyChallenge, Module, Lesson } from '@/types'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Color Maps ───────────────────────────────────────────────

const colorMap: Record<string, { bg: string; text: string; border: string; iconBg: string; progress: string; cardHover: string }> = {
  emerald: {
    bg: 'bg-emerald-500/5',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-500/20 hover:border-emerald-500/40',
    iconBg: 'bg-emerald-500/10',
    progress: 'bg-emerald-500',
    cardHover: 'hover:border-emerald-500/40',
  },
  amber: {
    bg: 'bg-amber-500/5',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-500/20 hover:border-amber-500/40',
    iconBg: 'bg-amber-500/10',
    progress: 'bg-amber-500',
    cardHover: 'hover:border-amber-500/40',
  },
  violet: {
    bg: 'bg-violet-500/5',
    text: 'text-violet-700 dark:text-violet-300',
    border: 'border-violet-500/20 hover:border-violet-500/40',
    iconBg: 'bg-violet-500/10',
    progress: 'bg-violet-500',
    cardHover: 'hover:border-violet-500/40',
  },
  rose: {
    bg: 'bg-rose-500/5',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-500/20 hover:border-rose-500/40',
    iconBg: 'bg-rose-500/10',
    progress: 'bg-rose-500',
    cardHover: 'hover:border-rose-500/40',
  },
}

const colors = (color: string) => colorMap[color] ?? colorMap.emerald

// ─── Workflow Steps ───────────────────────────────────────────

const workflowSteps = [
  {
    step: 1,
    icon: GraduationCap,
    title: 'Chọn lộ trình',
    desc: '4 kỹ năng tư duy cốt lõi',
    color: 'bg-emerald-500',
  },
  {
    step: 2,
    icon: Layers,
    title: 'Chọn Module',
    desc: 'Module từ cơ bản đến nâng cao',
    color: 'bg-amber-500',
  },
  {
    step: 3,
    icon: BookOpen,
    title: 'Học bài',
    desc: 'Đọc lý thuyết & ví dụ thực tế',
    color: 'bg-violet-500',
  },
  {
    step: 4,
    icon: PencilLine,
    title: 'Làm Quiz',
    desc: 'Kiểm tra & củng cố kiến thức',
    color: 'bg-rose-500',
  },
  {
    step: 5,
    icon: Medal,
    title: 'Nhận XP & Huy hiệu',
    desc: 'Leo level & mở khóa thành tựu',
    color: 'bg-gradient-to-r from-emerald-500 via-amber-500 to-violet-500',
  },
]

// ─── Main Component ───────────────────────────────────────────

export function DashboardView() {
  const { userStats, completedLessons, navigateToLesson, setView } = useAppStore()
  const [expandedPathId, setExpandedPathId] = useState<string | null>(null)

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

  // Find next uncompleted lesson for "Continue Learning"
  const nextLesson = skillPaths
    ?.flatMap((sp) => sp.modules.map((mod) => ({ ...mod, skillPath: sp })))
    ?.flatMap((mod) => mod.lessons.map((l) => ({ ...l, module: mod })))
    ?.find((l) => !completedLessons.includes(l.id))

  return (
    <div className="space-y-8">
      {/* ── Welcome ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Chao mung den MindForge 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Tiep tuc hanh trinh phat trien tu duy cua ban
        </p>
      </div>

      {/* ── Learning Workflow ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-muted/50 to-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              Quy trinh hoc tap
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {workflowSteps.map((ws, i) => {
                const Icon = ws.icon
                return (
                  <div key={ws.step} className="relative flex flex-col items-center text-center">
                    {/* Connector line */}
                    {i < workflowSteps.length - 1 && (
                      <div className="absolute top-5 left-[calc(50%+18px)] right-[calc(-50%+18px)] h-0.5 bg-border hidden sm:block" />
                    )}
                    <div
                      className={cn(
                        'relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md',
                        ws.color
                      )}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <p className="mt-2 text-xs font-semibold leading-tight">{ws.title}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground leading-tight hidden sm:block">
                      {ws.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Continue Learning ── */}
      {nextLesson && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Tiep tuc hoc
                  </p>
                  <p className="text-sm font-bold mt-0.5 truncate">{nextLesson.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {nextLesson.module.skillPath.title} › {nextLesson.module.title}
                  </p>
                </div>
                <Button
                  onClick={() =>
                    navigateToLesson(
                      nextLesson.module.skillPathId,
                      nextLesson.module.id,
                      nextLesson.id
                    )
                  }
                  className="gap-2 shrink-0"
                  size="sm"
                >
                  Hoc ngay
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Flame, value: userStats?.currentStreak ?? 0, label: 'Chuoi ngay', color: 'amber' },
          { icon: BookOpen, value: completedLessons.length, label: 'Bai hoan thanh', color: 'emerald' },
          { icon: Trophy, value: userStats?.totalXP ?? 0, label: 'Tong XP', color: 'violet' },
          { icon: Clock, value: `${userStats?.totalTimeMinutes ?? 0}p`, label: 'Thoi gian hoc', color: 'rose' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', colorMap[stat.color].iconBg)}>
                    <stat.icon className={cn('h-4 w-4', colorMap[stat.color].text)} />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── Overall Progress ── */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Tien do tong quan</h3>
            <span className="text-sm font-medium text-muted-foreground">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2.5" />
          <p className="text-xs text-muted-foreground mt-2">
            {completedLessons.length} / {totalLessons} bai hoc hoan thanh
          </p>
        </CardContent>
      </Card>

      {/* ── Daily Challenge ── */}
      {dailyChallenge && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="border-0 shadow-sm bg-gradient-to-r from-emerald-500/5 via-amber-500/5 to-violet-500/5">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Thach thuc hom nay
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
                {dailyChallenge.challengeType === 'reflection'
                  ? 'Phan tu'
                  : dailyChallenge.challengeType === 'quiz'
                    ? 'Trac nghiem'
                    : 'Tinh huong'}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── Skill Paths with Module Selection ── */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Lo trinh hoc</h3>

        {loadingPaths ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {skillPaths?.map((sp, i) => (
              <SkillPathCard
                key={sp.id}
                skillPath={sp}
                isExpanded={expandedPathId === sp.id}
                onToggle={() => setExpandedPathId(expandedPathId === sp.id ? null : sp.id)}
                index={i}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Hanh dong nhanh</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: Bot,
              title: 'Hoc cung AI',
              desc: 'Chat voi tro ly AI',
              color: 'bg-violet-500/10',
              action: () => setView('ai-practice'),
            },
            {
              icon: Trophy,
              title: 'Thanh tich',
              desc: 'Xem huy hieu da dat',
              color: 'bg-amber-500/10',
              action: () => setView('progress'),
            },
            {
              icon: StickyNote,
              title: 'Ghi chu',
              desc: 'Quan ly ghi chu hoc tap',
              color: 'bg-emerald-500/10',
              action: () => setView('notes'),
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="cursor-pointer border-0 shadow-sm hover:shadow-md transition-all duration-200"
              onClick={item.action}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', item.color)}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Skill Path Card (Expandable with Modules) ────────────────

function SkillPathCard({
  skillPath,
  isExpanded,
  onToggle,
  index,
}: {
  skillPath: SkillPath
  isExpanded: boolean
  onToggle: () => void
  index: number
}) {
  const { completedLessons, navigateToLesson } = useAppStore()
  const c = colors(skillPath.color)

  const totalLessonsInPath = skillPath.modules.reduce((s, m) => s + m.lessons.length, 0)
  const completedInPath = skillPath.modules.reduce(
    (s, m) => s + m.lessons.filter((l) => completedLessons.includes(l.id)).length,
    0
  )
  const pathProgress =
    totalLessonsInPath > 0 ? Math.round((completedInPath / totalLessonsInPath) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 + 0.2 }}
    >
      <Card className={cn('border transition-all duration-200 shadow-sm overflow-hidden', c.border)}>
        {/* Header row — always visible */}
        <button
          onClick={onToggle}
          className="w-full text-left p-4 sm:p-5 flex items-start gap-3 hover:bg-muted/30 transition-colors"
        >
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl text-lg shrink-0',
              c.iconBg
            )}
          >
            {skillPath.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm leading-tight">{skillPath.title}</h4>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{skillPath.description}</p>
            <div className="flex items-center gap-3 mt-3">
              <Progress value={pathProgress} className="h-1.5 flex-1" />
              <span className="text-xs text-muted-foreground shrink-0">{pathProgress}%</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <span>{skillPath.modules.length} module</span>
              <span>•</span>
              <span>{totalLessonsInPath} bai hoc</span>
              <span>•</span>
              <span>
                {completedInPath}/{totalLessonsInPath} da xong
              </span>
            </div>
          </div>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-muted-foreground shrink-0 mt-1 transition-transform duration-200',
              isExpanded && 'rotate-180'
            )}
          />
        </button>

        {/* Expanded: Modules & Lessons */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-t px-4 sm:px-5 pb-4 pt-3 space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Chon module de bat dau hoc
                </p>
                {skillPath.modules.map((mod, modIdx) => (
                  <ModuleBlock
                    key={mod.id}
                    module={mod}
                    skillPathId={skillPath.id}
                    moduleIndex={modIdx}
                    pathColor={skillPath.color}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

// ─── Module Block ─────────────────────────────────────────────

function ModuleBlock({
  module,
  skillPathId,
  moduleIndex,
  pathColor,
}: {
  module: Module
  skillPathId: string
  moduleIndex: number
  pathColor: string
}) {
  const { completedLessons, navigateToLesson } = useAppStore()
  const c = colors(pathColor)

  const completedInModule = module.lessons.filter((l) => completedLessons.includes(l.id)).length
  const moduleProgress =
    module.lessons.length > 0 ? Math.round((completedInModule / module.lessons.length) * 100) : 0
  const isModuleComplete = moduleProgress === 100 && module.lessons.length > 0

  return (
    <div className="space-y-1.5">
      {/* Module header */}
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold shrink-0',
            isModuleComplete ? 'bg-emerald-500 text-white' : c.iconBg + ' ' + c.text
          )}
        >
          {isModuleComplete ? <CheckCircle2 className="h-3.5 w-3.5" /> : moduleIndex + 1}
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="text-sm font-medium">{module.title}</h5>
          <p className="text-[11px] text-muted-foreground line-clamp-1">{module.description}</p>
        </div>
        <span className={cn('text-xs font-medium shrink-0', c.text)}>{moduleProgress}%</span>
      </div>

      {/* Lessons list */}
      <div className="ml-9 space-y-0.5">
        {module.lessons.map((lesson) => {
          const isCompleted = completedLessons.includes(lesson.id)
          return (
            <button
              key={lesson.id}
              onClick={() => navigateToLesson(skillPathId, module.id, lesson.id)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 hover:bg-muted',
                isCompleted && 'bg-muted/50'
              )}
            >
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full shrink-0 text-xs',
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? <CheckCircle2 className="h-3 w-3" /> : <BookOpen className="h-3 w-3" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('font-medium text-xs truncate', isCompleted && 'text-muted-foreground')}>
                  {lesson.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Clock className="h-2.5 w-2.5" />
                    {lesson.estimatedMinutes}p
                  </span>
                  <span>•</span>
                  <span>{lesson.quizzes.length} quiz</span>
                </div>
              </div>
              {!isCompleted && <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
