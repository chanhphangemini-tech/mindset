import { create } from 'zustand'

interface AppState {
  // Navigation
  currentView: 'dashboard' | 'skill-path' | 'lesson' | 'ai-practice' | 'progress' | 'notes' | 'settings'
  currentSkillPathId: string | null
  currentModuleId: string | null
  currentLessonId: string | null

  // Sidebar
  sidebarOpen: boolean

  // User data
  userStats: {
    totalXP: number
    level: number
    currentStreak: number
    longestStreak: number
    lessonsCompleted: number
    quizzesTaken: number
    totalTimeMinutes: number
  } | null

  // Progress data
  completedLessons: string[]
  lessonScores: Record<string, number>

  // Actions
  setView: (view: AppState['currentView']) => void
  navigateToSkillPath: (skillPathId: string) => void
  navigateToModule: (skillPathId: string, moduleId: string) => void
  navigateToLesson: (skillPathId: string, moduleId: string, lessonId: string) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setUserStats: (stats: AppState['userStats']) => void
  markLessonComplete: (lessonId: string, score: number, xp: number) => void
  loadProgress: (completedLessons: string[], scores: Record<string, number>) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Navigation defaults
  currentView: 'dashboard',
  currentSkillPathId: null,
  currentModuleId: null,
  currentLessonId: null,

  // Sidebar
  sidebarOpen: false,

  // User data
  userStats: null,

  // Progress data
  completedLessons: [],
  lessonScores: {},

  // Actions
  setView: (view) => set({ currentView: view }),

  navigateToSkillPath: (skillPathId) =>
    set({
      currentView: 'skill-path',
      currentSkillPathId: skillPathId,
      currentModuleId: null,
      currentLessonId: null,
    }),

  navigateToModule: (skillPathId, moduleId) =>
    set({
      currentView: 'skill-path',
      currentSkillPathId: skillPathId,
      currentModuleId: moduleId,
      currentLessonId: null,
    }),

  navigateToLesson: (skillPathId, moduleId, lessonId) =>
    set({
      currentView: 'lesson',
      currentSkillPathId: skillPathId,
      currentModuleId: moduleId,
      currentLessonId: lessonId,
    }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  setUserStats: (stats) => set({ userStats: stats }),

  markLessonComplete: (lessonId, score, xp) =>
    set((state) => {
      const newCompleted = state.completedLessons.includes(lessonId)
        ? state.completedLessons
        : [...state.completedLessons, lessonId]
      return {
        completedLessons: newCompleted,
        lessonScores: { ...state.lessonScores, [lessonId]: Math.max(score, state.lessonScores[lessonId] || 0) },
        userStats: state.userStats
          ? {
              ...state.userStats,
              totalXP: state.userStats.totalXP + xp,
              lessonsCompleted: newCompleted.length,
            }
          : null,
      }
    }),

  loadProgress: (completedLessons, scores) =>
    set({
      completedLessons,
      lessonScores: scores,
    }),
}))
