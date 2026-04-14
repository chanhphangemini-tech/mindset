import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    let stats = await db.userStats.findFirst()
    if (!stats) {
      stats = await db.userStats.create({
        data: {
          totalXP: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
          lessonsCompleted: 0,
          quizzesTaken: 0,
          totalTimeMinutes: 0,
        },
      })
    }
    return NextResponse.json({
      totalXP: stats.totalXP,
      level: stats.level,
      currentStreak: stats.currentStreak,
      longestStreak: stats.longestStreak,
      lessonsCompleted: stats.lessonsCompleted,
      quizzesTaken: stats.quizzesTaken,
      totalTimeMinutes: stats.totalTimeMinutes,
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json({ error: 'Failed to fetch user stats' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    let stats = await db.userStats.findFirst()
    if (!stats) {
      stats = await db.userStats.create({
        data: {
          totalXP: body.totalXP ?? 0,
          level: body.level ?? 1,
          currentStreak: body.currentStreak ?? 0,
          longestStreak: body.longestStreak ?? 0,
          lessonsCompleted: body.lessonsCompleted ?? 0,
          quizzesTaken: body.quizzesTaken ?? 0,
          totalTimeMinutes: body.totalTimeMinutes ?? 0,
          lastStudyDate: body.lastStudyDate ? new Date(body.lastStudyDate) : new Date(),
        },
      })
    } else {
      stats = await db.userStats.update({
        where: { id: stats.id },
        data: {
          ...(body.totalXP !== undefined && { totalXP: body.totalXP }),
          ...(body.level !== undefined && { level: body.level }),
          ...(body.currentStreak !== undefined && { currentStreak: body.currentStreak }),
          ...(body.longestStreak !== undefined && { longestStreak: body.longestStreak }),
          ...(body.lessonsCompleted !== undefined && { lessonsCompleted: body.lessonsCompleted }),
          ...(body.quizzesTaken !== undefined && { quizzesTaken: body.quizzesTaken }),
          ...(body.totalTimeMinutes !== undefined && { totalTimeMinutes: body.totalTimeMinutes }),
          ...(body.lastStudyDate !== undefined && { lastStudyDate: new Date(body.lastStudyDate) }),
        },
      })
    }

    return NextResponse.json({
      totalXP: stats.totalXP,
      level: stats.level,
      currentStreak: stats.currentStreak,
      longestStreak: stats.longestStreak,
      lessonsCompleted: stats.lessonsCompleted,
      quizzesTaken: stats.quizzesTaken,
      totalTimeMinutes: stats.totalTimeMinutes,
    })
  } catch (error) {
    console.error('Error updating user stats:', error)
    return NextResponse.json({ error: 'Failed to update user stats' }, { status: 500 })
  }
}
