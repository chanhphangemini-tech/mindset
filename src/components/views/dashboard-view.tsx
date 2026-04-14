'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/store/app-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
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

// ─── Neo-Brutalist Design Tokens ───────────────────────────────

const NB = {
  card: 'border-4 border-black shadow-[inset_-4px_-4px_0_#000,inset_4px_4px_0_#fff]',
  cardHover: 'hover:shadow-[inset_-6px_-6px_0_#000,inset_6px_6px_0_#fff]',
  button: 'border-4 border-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000]',
  iconBox: 'border-[3px] border-black shadow-[inset_-2px_-2px_0_#000,inset_2px_2px_0_#fff]',
  badge: 'border-[3px] border-black shadow-[2px_2px_0_#000]',
  progressTrack: 'bg-white border-[3px] border-black',
  progressFill: 'bg-[#e11d48]',
  cardBg: 'bg-[#fef3c7]',
  pageBg: 'bg-[#fde047]',
}

// ─── Color Maps (Solid Backgrounds) ────────────────────────────

const colorMap: Record<string, { text: string; iconBg: string; progress: string; solidBg: string }> = {
  emerald: {
    text: 'text-[#10b981]',
    iconBg: 'bg-[#10b981]',
    progress: 'bg-[#10b981]',
    solidBg: 'bg-[#10b981]',
  },
  amber: {
    text: 'text-[#f59e0b]',
    iconBg: 'bg-[#f59e0b]',
    progress: 'bg-[#f59e0b]',
    solidBg: 'bg-[#f59e0b]',
  },
  violet: {
    text: 'text-[#8b5cf6]',
    iconBg: 'bg-[#8b5cf6]',
    progress: 'bg-[#8b5cf6]',
    solidBg: 'bg-[#8b5cf6]',
  },
  rose: {
    text: 'text-[#e11d48]',
    iconBg: 'bg-[#e11d48]',
    progress: 'bg-[#e11d48]',
    solidBg: 'bg-[#e11d48]',
  },
}

const colors = (color: string) => colorMap[color] ?? colorMap.emerald

// ─── Workflow Steps ───────────────────────────────────────────

const workflowSteps = [
  {
    step: 1,
    icon: GraduationCap,
    title: 'Chon lo trinh',
    desc: '4 ky nang tu duy cot loi',
    color: 'bg-[#10b981]',
  },
  {
    step: 2,
    icon: Layers,
    title: 'Chon Module',
    desc: 'Module tu co ban den nang cao',
    color: 'bg-[#f59e0b]',
  },
  {
    step: 3,
    icon: BookOpen,
    title: 'Hoc bai',
    desc: 'Doc ly thuyet & vi du thuc te',
    color: 'bg-[#8b5cf6]',
  },
  {
    step: 4,
    icon: PencilLine,
    title: 'Lam Quiz',
    desc: 'Kiem tra & cuong co kien thuc',
    color: 'bg-[#e11d48]',
  },
  {
    step: 5,
    icon: Medal,
    title: 'Nhan XP & Huy hieu',
    desc: 'Leo level & mo khoa thanh tuu',
    color: 'bg-[#10b981]',
  },
]

// ─── Neo-Brutalist Progress Bar ───────────────────────────────

function NeoProgress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('h-3 w-full overflow-hidden', NB.progressTrack, className)}>
      <div
        className={cn('h-full transition-all duration-300', NB.progressFill)}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}

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
    <div className="space-y-6">
      {/* ── Welcome ── */}
      <div className="border-4 border-black bg-[#fef3c7] p-5 shadow-[4px_4px_0_#000]">
        <h1
          className="text-[15px] font-bold tracking-tight leading-snug"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          Chao mung den MindForge
        </h1>
        <p className="mt-2 text-[11px] text-black/70 leading-relaxed">
          Tiep tuc hanh trinh phat trien tu duy cua ban
        </p>
      </div>

      {/* ── Learning Workflow ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className={cn('bg-[#fef3c7]', NB.card)}>
          <div className="p-4 pb-2 sm:p-6 sm:pb-2">
            <h3
              className="text-[13px] font-bold flex items-center gap-2"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              <Zap className="h-4 w-4 text-[#f59e0b]" />
              Quy trinh hoc tap
            </h3>
          </div>
          <div className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {workflowSteps.map((ws, i) => {
                const Icon = ws.icon
                return (
                  <div key={ws.step} className="relative flex flex-col items-center text-center">
                    {/* Connector line */}
                    {i < workflowSteps.length - 1 && (
                      <div className="absolute top-5 left-[calc(50%+18px)] right-[calc(-50%+18px)] h-[3px] bg-black hidden sm:block" />
                    )}
                    <div
                      className={cn(
                        'relative z-10 flex h-10 w-10 items-center justify-center text-white',
                        ws.color,
                        NB.iconBox
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="mt-2 text-[10px] font-bold leading-tight" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                      {ws.title}
                    </p>
                    <p className="mt-1 text-[10px] text-black/60 leading-tight hidden sm:block">
                      {ws.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Continue Learning ── */}
      {nextLesson && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className={cn('bg-[#fef3c7]', NB.card)}>
            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center bg-[#e11d48] text-white shrink-0 border-[3px] border-black">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-black/60 uppercase tracking-wider" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                    Tiep tuc hoc
                  </p>
                  <p className="text-sm font-bold mt-1 truncate">{nextLesson.title}</p>
                  <p className="text-[11px] text-black/60 mt-0.5 truncate">
                    {nextLesson.module.skillPath.title} &rsaquo; {nextLesson.module.title}
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
                  className={cn('gap-2 shrink-0 bg-[#e11d48] text-white font-bold text-xs', NB.button)}
                  size="sm"
                >
                  Hoc ngay
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
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
            <div className={cn('bg-[#fef3c7]', NB.card)}>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center text-white border-[3px] border-black',
                      colorMap[stat.color].iconBg
                    )}
                  >
                    <stat.icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-xl font-bold" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  {stat.value}
                </p>
                <p className="text-[10px] text-black/60 mt-1">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Overall Progress ── */}
      <div className={cn('bg-[#fef3c7]', NB.card)}>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-bold" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              Tien do tong quan
            </h3>
            <span className="text-sm font-bold text-black">{overallProgress}%</span>
          </div>
          <NeoProgress value={overallProgress} />
          <p className="text-[10px] text-black/60 mt-2">
            {completedLessons.length} / {totalLessons} bai hoc hoan thanh
          </p>
        </div>
      </div>

      {/* ── Daily Challenge ── */}
      {dailyChallenge && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className={cn('bg-[#fef3c7]', NB.card)}>
            <div className="p-4 pb-2 sm:p-6 sm:pb-2">
              <div className="flex items-center justify-between">
                <h3
                  className="text-[13px] font-bold flex items-center gap-2"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  <Zap className="h-4 w-4 text-[#f59e0b]" />
                  Thach thuc hom nay
                </h3>
                <Badge className={cn('text-[10px] bg-[#f59e0b] text-white font-bold', NB.badge)}>
                  +{dailyChallenge.xpReward} XP
                </Badge>
              </div>
            </div>
            <div className="p-4 pt-0 sm:p-6 sm:pt-0">
              <p className="font-bold text-sm">{dailyChallenge.title}</p>
              <p className="text-[11px] text-black/60 mt-1 leading-relaxed">{dailyChallenge.description}</p>
              <Badge className={cn('mt-3 text-[10px] capitalize font-bold bg-white', NB.badge)}>
                {dailyChallenge.challengeType === 'reflection'
                  ? 'Phan tu'
                  : dailyChallenge.challengeType === 'quiz'
                    ? 'Trac nghiem'
                    : 'Tinh huong'}
              </Badge>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Skill Paths with Module Selection ── */}
      <div>
        <h3 className="text-[13px] font-bold mb-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>
          Lo trinh hoc
        </h3>

        {loadingPaths ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 border-4 border-black" />
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
        <h3 className="text-[13px] font-bold mb-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>
          Hanh dong nhanh
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: Bot,
              title: 'Hoc cung AI',
              desc: 'Chat voi tro ly AI',
              color: 'bg-[#8b5cf6]',
              action: () => setView('ai-practice'),
            },
            {
              icon: Trophy,
              title: 'Thanh tich',
              desc: 'Xem huy hieu da dat',
              color: 'bg-[#f59e0b]',
              action: () => setView('progress'),
            },
            {
              icon: StickyNote,
              title: 'Ghi chu',
              desc: 'Quan ly ghi chu hoc tap',
              color: 'bg-[#10b981]',
              action: () => setView('notes'),
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
            >
              <div
                className={cn(
                  'bg-[#fef3c7] cursor-pointer transition-shadow duration-200',
                  NB.card,
                  NB.cardHover
                )}
                onClick={item.action}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') item.action() }}
              >
                <div className="p-4 flex items-center gap-3">
                  <div className={cn('flex h-10 w-10 items-center justify-center text-white border-[3px] border-black', item.color)}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{item.title}</p>
                    <p className="text-[10px] text-black/60">{item.desc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
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
      <div className={cn('bg-[#fef3c7] transition-shadow duration-200 overflow-hidden', NB.card, NB.cardHover)}>
        {/* Header row — always visible */}
        <button
          onClick={onToggle}
          className="w-full text-left p-4 sm:p-5 flex items-start gap-3 hover:bg-black/5 transition-colors"
        >
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center text-lg text-white shrink-0 border-[3px] border-black',
              c.iconBg
            )}
          >
            {skillPath.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm leading-tight">{skillPath.title}</h4>
            <p className="text-[10px] text-black/60 mt-1 line-clamp-2">{skillPath.description}</p>
            <div className="flex items-center gap-3 mt-3">
              <NeoProgress value={pathProgress} className="h-2 flex-1" />
              <span className="text-[10px] font-bold text-black shrink-0">{pathProgress}%</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-[10px] text-black/60">
              <span>{skillPath.modules.length} module</span>
              <span>&bull;</span>
              <span>{totalLessonsInPath} bai hoc</span>
              <span>&bull;</span>
              <span>
                {completedInPath}/{totalLessonsInPath} da xong
              </span>
            </div>
          </div>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-black shrink-0 mt-1 transition-transform duration-200',
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
              <div className="border-t-4 border-black px-4 sm:px-5 pb-4 pt-3 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-black/60">
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
      </div>
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
            'flex h-7 w-7 items-center justify-center text-xs font-bold shrink-0 border-[3px] border-black text-white',
            isModuleComplete ? 'bg-[#10b981]' : c.iconBg
          )}
        >
          {isModuleComplete ? <CheckCircle2 className="h-3.5 w-3.5" /> : moduleIndex + 1}
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="text-sm font-bold">{module.title}</h5>
          <p className="text-[10px] text-black/60 line-clamp-1">{module.description}</p>
        </div>
        <span className={cn('text-xs font-bold shrink-0', c.text)}>{moduleProgress}%</span>
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
                'flex w-full items-center gap-2.5 border-[3px] border-black px-3 py-2 text-left text-xs transition-all duration-200 hover:bg-black/5',
                isCompleted ? 'bg-white' : 'bg-[#fef3c7]'
              )}
            >
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center shrink-0 text-xs border-[3px] border-black text-white',
                  isCompleted ? 'bg-[#10b981]' : 'bg-black/20'
                )}
              >
                {isCompleted ? <CheckCircle2 className="h-3 w-3" /> : <BookOpen className="h-3 w-3" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('font-bold text-xs truncate', isCompleted && 'text-black/60')}>
                  {lesson.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-black/60">
                  <span className="flex items-center gap-0.5">
                    <Clock className="h-2.5 w-2.5" />
                    {lesson.estimatedMinutes}p
                  </span>
                  <span>&bull;</span>
                  <span>{lesson.quizzes.length} quiz</span>
                </div>
              </div>
              {!isCompleted && <ChevronRight className="h-3 w-3 text-black/60 shrink-0" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
