'use client'

import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/store/app-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
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
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-500/20',
    progress: 'bg-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-500/10',
  },
  amber: {
    bg: 'bg-amber-500/5',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-500/20',
    progress: 'bg-amber-500',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-500/10',
  },
  violet: {
    bg: 'bg-violet-500/5',
    text: 'text-violet-700 dark:text-violet-300',
    border: 'border-violet-500/20',
    progress: 'bg-violet-500',
    badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    iconBg: 'bg-violet-500/10',
  },
  rose: {
    bg: 'bg-rose-500/5',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-500/20',
    progress: 'bg-rose-500',
    badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    iconBg: 'bg-rose-500/10',
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
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    )
  }

  if (!skillPath) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground">Không tìm thấy lộ trình học</p>
        <Button variant="link" onClick={() => setView('dashboard')}>
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
        className="gap-1.5 text-muted-foreground lg:hidden"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Dashboard</span>
      </Button>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className={cn('rounded-xl border p-5 sm:p-6', colors.bg, colors.border)}>
          <div className="flex items-start gap-4">
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl text-2xl shrink-0', colors.iconBg)}>
              {skillPath.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold sm:text-2xl">{skillPath.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">{skillPath.description}</p>
              <div className="flex items-center gap-3 mt-4">
                <Progress value={pathProgress} className={cn('h-2 flex-1', colors.progress)} />
                <span className={cn('text-sm font-medium', colors.text)}>{pathProgress}%</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
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
              <Card className="border-0 shadow-sm overflow-hidden">
                <AccordionItem value={mod.id} className="border-0">
                  <AccordionTrigger className="px-4 sm:px-5 py-4 hover:no-underline hover:bg-muted/50 transition-colors [&[data-state=open]]:border-b [&[data-state=open]]:bg-muted/30">
                    <div className="flex items-center gap-3 text-left flex-1 mr-4">
                      <div className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold shrink-0',
                        isModuleComplete ? 'bg-emerald-500 text-white' : colors.iconBg + ' ' + colors.text
                      )}>
                        {isModuleComplete ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          modIdx + 1
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">{mod.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{mod.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={cn('text-xs font-medium', colors.text)}>{moduleProgress}%</span>
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
                              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200 hover:bg-muted',
                              isCompleted && 'bg-muted/50'
                            )}
                          >
                            <div className={cn(
                              'flex h-7 w-7 items-center justify-center rounded-full shrink-0',
                              isCompleted ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                            )}>
                              {isCompleted ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              ) : (
                                <BookOpen className="h-3 w-3" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn('font-medium truncate', isCompleted && 'text-muted-foreground')}>
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
                                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">{score}đ</span>
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
