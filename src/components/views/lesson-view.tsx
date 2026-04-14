'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '@/store/app-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Trophy,
  RotateCcw,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'
import type { SkillPath } from '@/types'

export function LessonView() {
  const { currentSkillPathId, currentModuleId, currentLessonId, completedLessons, markLessonComplete, setView } = useAppStore()
  const queryClient = useQueryClient()
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [quizResults, setQuizResults] = useState<{
    score: number
    correctCount: number
    totalQuestions: number
    xpEarned: number
    results: Array<{
      quizId: string
      question: string
      userAnswer: string
      correctAnswer: string | null
      isCorrect: boolean
      explanation: string
    }>
  } | null>(null)
  const [quizOpen, setQuizOpen] = useState(false)

  const { data: skillPaths, isLoading } = useQuery<SkillPath[]>({
    queryKey: ['skill-paths'],
    queryFn: () => fetch('/api/skill-paths').then((r) => r.json()),
  })

  const saveProgressMutation = useMutation({
    mutationFn: (data: { lessonId: string; score: number; xpEarned: number }) =>
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] })
      queryClient.invalidateQueries({ queryKey: ['user-stats'] })
    },
  })

  const submitQuizMutation = useMutation({
    mutationFn: (data: { lessonId: string; answers: Record<string, string> }) =>
      fetch('/api/quiz-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
  })

  const skillPath = skillPaths?.find((sp) => sp.id === currentSkillPathId)
  const module_ = skillPath?.modules.find((m) => m.id === currentModuleId)
  const lesson = module_?.lessons.find((l) => l.id === currentLessonId)
  const isCompleted = currentLessonId ? completedLessons.includes(currentLessonId) : false

  const handleSubmitQuiz = async () => {
    if (!currentLessonId) return
    const result = await submitQuizMutation.mutateAsync({
      lessonId: currentLessonId,
      answers: quizAnswers,
    })
    setQuizResults(result)
    setShowQuizResults(true)

    // Save progress
    await saveProgressMutation.mutateAsync({
      lessonId: currentLessonId,
      score: result.score,
      xpEarned: result.xpEarned,
    })

    markLessonComplete(currentLessonId, result.score, result.xpEarned)
  }

  const resetQuiz = () => {
    setQuizAnswers({})
    setShowQuizResults(false)
    setQuizResults(null)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  if (!skillPath || !module_ || !lesson) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground">Không tìm thấy bài học</p>
        <Button variant="link" onClick={() => setView('dashboard')}>Quay lại</Button>
      </div>
    )
  }

  const lessonIndex = module_.lessons.findIndex((l) => l.id === lesson.id)
  const nextLesson = lessonIndex < module_.lessons.length - 1 ? module_.lessons[lessonIndex + 1] : null

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <button onClick={() => setView('dashboard')} className="hover:text-foreground transition-colors">
          Dashboard
        </button>
        <ChevronRight className="h-3 w-3" />
        <button onClick={() => setView('skill-path')} className="hover:text-foreground transition-colors">
          {skillPath.title}
        </button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium truncate">{lesson.title}</span>
      </div>

      {/* Lesson header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">{lesson.title}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {lesson.estimatedMinutes} phút
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                {lesson.quizzes.length} câu hỏi
              </span>
              {isCompleted && (
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Đã hoàn thành
                </Badge>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lesson content */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="prose prose-sm dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
              prose-p:leading-relaxed prose-p:text-muted-foreground
              prose-li:text-muted-foreground
              prose-strong:text-foreground
              prose-code:text-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-muted prose-pre:rounded-lg
              prose-blockquote:border-l-amber-500 prose-blockquote:bg-amber-500/5 prose-blockquote:rounded-r-lg prose-blockquote:py-2
              prose-table:text-sm
            ">
              <LessonContentRenderer content={lesson.content} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Takeaways */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="border-0 shadow-sm bg-emerald-500/5 border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Điểm chính cần nhớ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <ul className="space-y-2">
              {JSON.parse(lesson.keyTakeaways).map((point: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-emerald-500 mt-0.5">✦</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quiz */}
      {lesson.quizzes.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Kiểm tra kiến thức
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {lesson.quizzes.length} câu hỏi
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
              {lesson.quizzes.map((quiz, idx) => (
                <div key={quiz.id} className="space-y-3">
                  <p className="text-sm font-medium">
                    <span className="text-muted-foreground mr-2">Câu {idx + 1}.</span>
                    {quiz.question}
                  </p>
                  <div className="space-y-2">
                    {(() => {
                      const options = quiz.options ? JSON.parse(quiz.options) : []
                      return options.map((opt: string, optIdx: number) => {
                        const isSelected = quizAnswers[quiz.id] === opt
                        let resultClass = ''
                        if (showQuizResults && quizResults) {
                          const result = quizResults.results.find((r) => r.quizId === quiz.id)
                          if (result) {
                            if (result.isCorrect && opt === result.correctAnswer) {
                              resultClass = 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                            } else if (!result.isCorrect && isSelected) {
                              resultClass = 'bg-destructive/10 border-destructive text-destructive'
                            } else if (opt === result.correctAnswer) {
                              resultClass = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400'
                            }
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => {
                              if (!showQuizResults) {
                                setQuizAnswers((prev) => ({ ...prev, [quiz.id]: opt }))
                              }
                            }}
                            className={cn(
                              'flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-sm text-left transition-all duration-200',
                              isSelected && !showQuizResults && 'border-primary bg-primary/5',
                              !isSelected && !showQuizResults && 'border-border hover:border-primary/30 hover:bg-muted/50',
                              resultClass
                            )}
                          >
                            <span className={cn(
                              'flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium shrink-0',
                              isSelected && !showQuizResults && 'border-primary bg-primary text-primary-foreground',
                              !isSelected && !showQuizResults && 'border-border text-muted-foreground'
                            )}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1">{opt}</span>
                          </button>
                        )
                      })
                    })()}
                  </div>

                  {showQuizResults && quizResults && (() => {
                    const result = quizResults.results.find((r) => r.quizId === quiz.id)
                    return result ? (
                      <div className={cn(
                        'rounded-lg p-3 text-sm',
                        result.isCorrect ? 'bg-emerald-500/5 text-emerald-700 dark:text-emerald-300' : 'bg-amber-500/5 text-amber-700 dark:text-amber-300'
                      )}>
                        <p className="font-medium mb-1">
                          {result.isCorrect ? '✅ Chính xác!' : '💡 Chưa chính xác'}
                        </p>
                        <p>{result.explanation}</p>
                      </div>
                    ) : null
                  })()}

                  {idx < lesson.quizzes.length - 1 && <Separator />}
                </div>
              ))}

              <div className="flex items-center gap-3 pt-2">
                {!showQuizResults ? (
                  <Button
                    onClick={handleSubmitQuiz}
                    disabled={submitQuizMutation.isPending || Object.keys(quizAnswers).length < lesson.quizzes.length}
                    className="gap-2"
                  >
                    <Trophy className="h-4 w-4" />
                    Nộp bài ({Object.keys(quizAnswers).length}/{lesson.quizzes.length})
                  </Button>
                ) : (
                  <>
                    {quizResults && (
                      <div className="flex items-center gap-3 mr-auto">
                        <Badge variant={quizResults.score >= 70 ? 'default' : 'secondary'} className={cn(
                          quizResults.score >= 70 ? 'bg-emerald-500' : ''
                        )}>
                          {quizResults.score} điểm
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {quizResults.correctCount}/{quizResults.totalQuestions} đúng • +{quizResults.xpEarned} XP
                        </span>
                      </div>
                    )}
                    <Button variant="outline" onClick={resetQuiz} className="gap-2">
                      <RotateCcw className="h-3.5 w-3.5" />
                      Làm lại
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Next lesson navigation */}
      {nextLesson && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
            onClick={() => {
              if (currentSkillPathId && currentModuleId && nextLesson) {
                useAppStore.getState().navigateToLesson(currentSkillPathId, currentModuleId, nextLesson.id)
              }
            }}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Bài tiếp theo</p>
                  <p className="text-sm font-semibold">{nextLesson.title}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

// Simple markdown-like renderer
function LessonContentRenderer({ content }: { content: string }) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let inCodeBlock = false
  let codeContent = ''
  let inList = false
  let inOrderedList = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${i}`} className="bg-muted rounded-lg p-4 overflow-x-auto text-xs">
            <code>{codeContent.trim()}</code>
          </pre>
        )
        codeContent = ''
        inCodeBlock = false
      } else {
        if (inList) { elements.push(<ul key={`ul-end-${i}`} />); inList = false }
        if (inOrderedList) { elements.push(<ol key={`ol-end-${i}`} />); inOrderedList = false }
        inCodeBlock = true
      }
      continue
    }

    if (inCodeBlock) {
      codeContent += line + '\n'
      continue
    }

    // Empty lines
    if (line.trim() === '') {
      if (inList) { elements.push(<ul key={`ul-end-${i}`} />); inList = false }
      if (inOrderedList) { elements.push(<ol key={`ol-end-${i}`} />); inOrderedList = false }
      continue
    }

    // Headers
    if (line.startsWith('# ')) {
      if (inList) { elements.push(<ul key={`ul-end-${i}`} />); inList = false }
      if (inOrderedList) { elements.push(<ol key={`ol-end-${i}`} />); inOrderedList = false }
      elements.push(<h1 key={i}>{line.slice(2)}</h1>)
      continue
    }
    if (line.startsWith('## ')) {
      if (inList) { elements.push(<ul key={`ul-end-${i}`} />); inList = false }
      if (inOrderedList) { elements.push(<ol key={`ol-end-${i}`} />); inOrderedList = false }
      elements.push(<h2 key={i}>{line.slice(3)}</h2>)
      continue
    }
    if (line.startsWith('### ')) {
      if (inList) { elements.push(<ul key={`ul-end-${i}`} />); inList = false }
      if (inOrderedList) { elements.push(<ol key={`ol-end-${i}`} />); inOrderedList = false }
      elements.push(<h3 key={i}>{line.slice(4)}</h3>)
      continue
    }

    // Blockquote
    if (line.startsWith('> ')) {
      if (inList) { elements.push(<ul key={`ul-end-${i}`} />); inList = false }
      if (inOrderedList) { elements.push(<ol key={`ol-end-${i}`} />); inOrderedList = false }
      elements.push(<blockquote key={i}>{line.slice(2)}</blockquote>)
      continue
    }

    // Unordered list
    if (line.startsWith('- ')) {
      if (!inList) {
        if (inOrderedList) { elements.push(<ol key={`ol-end-${i}`} />); inOrderedList = false }
        inList = true
      }
      elements.push(
        <ul key={`ul-${i}`}>
          <li dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(line.slice(2)) }} />
        </ul>
      )
      continue
    }

    // Ordered list
    const orderedMatch = line.match(/^(\d+)\.\s/)
    if (orderedMatch) {
      if (!inOrderedList) {
        if (inList) { elements.push(<ul key={`ul-end-${i}`} />); inList = false }
        inOrderedList = true
      }
      elements.push(
        <ol key={`ol-${i}`}>
          <li dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(line.slice(orderedMatch[0].length)) }} />
        </ol>
      )
      continue
    }

    // Table rows
    if (line.startsWith('|') && line.endsWith('|')) {
      if (line.match(/^\|[\s-|]+\|$/)) continue // separator row
      const cells = line.split('|').filter(c => c.trim()).map(c => c.trim())
      if (!inList && !inOrderedList) {
        elements.push(
          <div key={i} className="overflow-x-auto my-2">
            <table>
              <tbody>
                <tr>
                  {cells.map((cell, ci) => (
                    <td key={ci} className="border px-3 py-2 text-sm" dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(cell) }} />
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )
      }
      continue
    }

    // Paragraph
    if (inList) { elements.push(<ul key={`ul-end-${i}`} />); inList = false }
    if (inOrderedList) { elements.push(<ol key={`ol-end-${i}`} />); inOrderedList = false }
    elements.push(<p key={i} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(line) }} />)
  }

  if (inList) elements.push(<ul key="ul-end-final" />)
  if (inOrderedList) elements.push(<ol key="ol-end-final" />)

  return <>{elements}</>
}

function renderInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
}
