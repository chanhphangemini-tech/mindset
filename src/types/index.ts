export interface SkillPath {
  id: string
  title: string
  slug: string
  description: string
  icon: string
  color: string
  order: number
  modules: Module[]
}

export interface Module {
  id: string
  title: string
  description: string
  order: number
  skillPathId: string
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  title: string
  content: string
  keyTakeaways: string
  order: number
  moduleId: string
  estimatedMinutes: number
  quizzes: Quiz[]
}

export interface Quiz {
  id: string
  type: 'mcq' | 'open_ended' | 'scenario'
  question: string
  options: string | null // JSON string
  correctAnswer: string | null
  explanation: string
  order: number
  lessonId: string
}

export interface UserStats {
  totalXP: number
  level: number
  currentStreak: number
  longestStreak: number
  lessonsCompleted: number
  quizzesTaken: number
  totalTimeMinutes: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string | null
}

export interface UserNote {
  id: string
  lessonId: string | null
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface DailyChallenge {
  id: string
  date: string
  skillPathId: string | null
  title: string
  description: string
  challengeType: 'scenario' | 'quiz' | 'reflection'
  content: string
  completed: boolean
  xpReward: number
}
