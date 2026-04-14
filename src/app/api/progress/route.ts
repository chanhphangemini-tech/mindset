import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const progress = await db.userProgress.findMany({
      where: { completed: true },
      select: {
        lessonId: true,
        score: true,
      },
    })

    const completedLessons = progress.map((p) => p.lessonId)
    const scores: Record<string, number> = {}
    for (const p of progress) {
      if (p.score !== null) {
        scores[p.lessonId] = p.score
      }
    }

    return NextResponse.json({ completedLessons, scores })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { lessonId, score, quizAnswers, xpEarned } = await request.json()

    const existing = await db.userProgress.findUnique({
      where: { lessonId },
    })

    if (existing) {
      await db.userProgress.update({
        where: { lessonId },
        data: {
          completed: true,
          score: score !== undefined ? score : existing.score,
          quizAnswers: quizAnswers ? JSON.stringify(quizAnswers) : existing.quizAnswers,
          xpEarned: xpEarned !== undefined ? xpEarned : existing.xpEarned,
          completedAt: new Date(),
        },
      })
    } else {
      await db.userProgress.create({
        data: {
          lessonId,
          completed: true,
          score: score ?? 0,
          quizAnswers: quizAnswers ? JSON.stringify(quizAnswers) : null,
          xpEarned: xpEarned ?? 0,
          completedAt: new Date(),
        },
      })
    }

    // Update user stats
    const allProgress = await db.userProgress.findMany({
      where: { completed: true },
    })
    const totalXP = allProgress.reduce((sum, p) => sum + p.xpEarned, 0)
    const lessonsCompleted = allProgress.length

    const stats = await db.userStats.findFirst()
    if (stats) {
      await db.userStats.update({
        where: { id: stats.id },
        data: {
          totalXP,
          level: Math.floor(totalXP / 250) + 1,
          lessonsCompleted,
          lastStudyDate: new Date(),
        },
      })
    }

    return NextResponse.json({ success: true, lessonId, score, xpEarned })
  } catch (error) {
    console.error('Error saving progress:', error)
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
  }
}
