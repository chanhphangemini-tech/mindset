'use client'

import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/store/app-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  BookOpen,
  CheckCircle2,
  Lock,
  ChevronRight,
  Clock,
  ArrowLeft,
} from 'lucide-react'
import type { SkillPath } from '@/types'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const colorMap: Record<string, { bg: string; text: string; border: string; progress: string; badge: string; iconBg: string }> = {
  emerald: {
    bg: 'bg-emerald-500/5',
    text: 'text-emerald-700',
    border: 'border-emerald-500/20',
    progress: 'bg-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-600',
    iconBg: 'bg-emerald-500',
  },
  amber: {
    bg: 'bg-amber-500/5',
    text: 'text-amber-700',
    border: 'border-amber-500/20',
    progress: 'bg-amber-500',
    badge: 'bg-amber-500/10 text-amber-600',
    iconBg: 'bg-amber-500',
  },
  violet: {
    bg: 'bg-violet-500/5',
    text: 'text-violet-700',
    border: 'border-violet-500/20',
    progress: 'bg-violet-500',
    badge: 'bg-violet-500/10 text-violet-600',
    iconBg: 'bg-violet-500',
  },
  rose: {
    bg: 'bg-rose-500/5',
    text: 'text-rose-700',
    border: 'border-rose-500/20',
    progress: 'bg-rose-500',
    badge: 'bg-rose-500/10 text-rose-600',
    iconBg: 'bg-rose-500',
  },
}

export function SkillPathView() {
  const { currentSkillPathId, completedLessons, lessonScores, navigateToLesson, setView } = useAppStore()

  const { data: skillPaths, isLoading } = useQuery<SkillPath[]>({
    queryKey: ['skill-paths'],
    queryFn: () => fetch('/api/skill-paths').then((r) => r.json()),
  })

  const skillPath = skillPaths?.find((sp) => sp.id === currentSkillPathId)
  const colors = colorMap[skillPath?.color ?? 'emerald'] ?? colorMap.emerald

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 border-4 border-black" />
        <Skeleton className="h-40 border-4 border-black" />
        <Skeleton className="h-32 border-4 border-black" />
      </div>
    )
  }

  if (!skillPath) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground font-bold">Không tìm thấy lộ trình học</p>
        <Button
          variant="ghost"
          onClick={() => setView('dashboard')}
          className="mt-2 border-4 border-black shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold"
        >
          Quay lại Dashboard
        </Button>
      </div>
    )
  }

  const totalLessons = skillPath.modules.reduce((s, m) => s + m.lessons.length, 0)
  const completedInPath = skillPath.modules.reduce(
    (s, m) => s + m.lessons.filter((l) => completedLessons.includes(l.id)).length,
    0
  )
  const pathProgress = totalLessons > 0 ? Math.round((completedInPath / totalLessons) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Back button on mobile */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setView('dashboard')}
        className="gap-1.5 text-muted-foreground lg:hidden border-4 border-black shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Dashboard</span>
      </Button>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="border-4 border-black shadow-[inset_-4px_-4px_0_#000,inset_4px_4px_0_#fff] bg-[#fef3c7] p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className={cn(
              'flex h-12 w-12 items-center justify-center border-3 border-black shadow-[inset_-2px_-2px_0_#000,inset_2px_2px_0_#fff] text-2xl shrink-0 text-white',
              colors.iconBg
            )}>
              {skillPath.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold sm:text-2xl" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '16px' }}>
                {skillPath.title}
              </h1>
              <p className="text-sm text-muted-foreground mt-2">{skillPath.description}</p>
              <div className="flex items-center gap-3 mt-4">
                <div className="h-5 bg-white border-3 border-black flex-1 overflow-hidden">
                  <div
                    className={cn('h-full transition-all duration-500', colors.progress)}
                    style={{ width: `${pathProgress}%` }}
                  />
                </div>
                <span className={cn('text-sm font-bold', colors.text)}>{pathProgress}%</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground font-bold">
                <span>{skillPath.modules.length} module</span>
                <span>•</span>
                <span>{completedInPath}/{totalLessons} bài học</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modules & Lessons */}
      <Accordion type="multiple" defaultValue={skillPath.modules.map((m) => m.id)} className="space-y-3">
        {skillPath.modules.map((mod, modIdx) => {
          const moduleLessons = mod.lessons
          const completedInModule = moduleLessons.filter((l) => completedLessons.includes(l.id)).length
          const moduleProgress = moduleLessons.length > 0 ? Math.round((completedInModule / moduleLessons.length) * 100) : 0
          const isModuleComplete = moduleProgress === 100 && moduleLessons.length > 0

          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: modIdx * 0.05 + 0.1 }}
            >
              <Card className="border-4 border-black shadow-[inset_-4px_-4px_0_#000,inset_4px_4px_0_#fff] overflow-hidden">
                <AccordionItem value={mod.id} className="border-0">
                  <AccordionTrigger className="px-4 sm:px-5 py-4 hover:no-underline hover:bg-[#fde047] transition-colors [&[data-state=open]]:border-b-4 [&[data-state=open]]:border-black [&[data-state=open]]:bg-[#fef3c3]">
                    <div className="flex items-center gap-3 text-left flex-1 mr-4">
                      <div className={cn(
                        'flex h-8 w-8 items-center justify-center border-3 border-black shadow-[inset_-2px_-2px_0_#000,inset_2px_2px_0_#fff] text-sm font-bold shrink-0',
                        isModuleComplete ? 'bg-emerald-500 text-white' : colors.iconBg + ' text-white'
                      )}>
                        {isModuleComplete ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          modIdx + 1
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px' }}>
                          {mod.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 hidden sm:block">{mod.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={cn('text-xs font-bold border-3 border-black shadow-[2px_2px_0_#000] px-2 py-1', colors.badge)}>{moduleProgress}%</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0">
                    <div className="space-y-1 px-2 sm:px-3 pb-3">
                      {moduleLessons.map((lesson) => {
                        const isCompleted = completedLessons.includes(lesson.id)
                        const score = lessonScores[lesson.id]

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => navigateToLesson(skillPath.id, mod.id, lesson.id)}
                            className={cn(
                              'flex w-full items-center gap-3 border-3 border-black px-3 py-2.5 text-left text-sm transition-all duration-200 hover:bg-[#fde047] hover:translate-x-[1px] hover:translate-y-[1px] shadow-[2px_2px_0_#000]',
                              isCompleted && 'bg-[#fef3c3]'
                            )}
                          >
                            <div className={cn(
                              'flex h-7 w-7 items-center justify-center border-2 border-black shrink-0',
                              isCompleted ? 'bg-emerald-500 text-white' : 'bg-white text-muted-foreground'
                            )}>
                              {isCompleted ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              ) : (
                                <BookOpen className="h-3 w-3" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn('font-bold truncate', isCompleted && 'text-muted-foreground')}>
                                {lesson.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {lesson.estimatedMinutes}p
                                </span>
                                <span>•</span>
                                <span>{lesson.quizzes.length} quiz</span>
                                {score !== undefined && (
                                  <>
                                    <span>•</span>
                                    <span className="text-emerald-600 font-bold">{score}đ</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                          </button>
                        )
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Card>
            </motion.div>
          )
        })}
      </Accordion>
    </div>
  )
}
