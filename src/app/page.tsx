'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/store/app-store'
import { MainLayout } from '@/components/layout/main-layout'
import { DashboardView } from '@/components/views/dashboard-view'
import { SkillPathView } from '@/components/views/skill-path-view'
import { LessonView } from '@/components/views/lesson-view'
import { AIPracticeView } from '@/components/views/ai-practice-view'
import { ProgressView } from '@/components/views/progress-view'
import { NotesView } from '@/components/views/notes-view'
import type { UserStats } from '@/types'

export default function Home() {
  const {
    currentView,
    userStats,
    setUserStats,
    loadProgress,
  } = useAppStore()

  // Fetch user stats
  const { data: statsData } = useQuery<UserStats>({
    queryKey: ['user-stats'],
    queryFn: () => fetch('/api/user-stats').then((r) => r.json()),
  })

  // Fetch progress
  const { data: progressData } = useQuery<{
    completedLessons: string[]
    scores: Record<string, number>
  }>({
    queryKey: ['progress'],
    queryFn: () => fetch('/api/progress').then((r) => r.json()),
  })

  // Load data into store
  useEffect(() => {
    if (statsData) {
      setUserStats(statsData)
    }
  }, [statsData, setUserStats])

  useEffect(() => {
    if (progressData) {
      loadProgress(progressData.completedLessons, progressData.scores)
    }
  }, [progressData, loadProgress])

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />
      case 'skill-path':
        return <SkillPathView />
      case 'lesson':
        return <LessonView />
      case 'ai-practice':
        return <AIPracticeView />
      case 'progress':
        return <ProgressView />
      case 'notes':
        return <NotesView />
      default:
        return <DashboardView />
    }
  }

  return (
    <MainLayout>
      {renderView()}
    </MainLayout>
  )
}
