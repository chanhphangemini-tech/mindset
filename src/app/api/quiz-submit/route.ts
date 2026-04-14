import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { lessonId, answers } = await request.json()

    if (!lessonId || !answers) {
      return NextResponse.json({ error: 'Lesson ID and answers are required' }, { status: 400 })
    }

    const quizzes = await db.quiz.findMany({
      where: { lessonId },
      orderBy: { order: 'asc' },
    })

    let correctCount = 0
    const totalQuestions = quizzes.length
    const results = []

    for (const quiz of quizzes) {
      const userAnswer = answers[quiz.id]
      let isCorrect = false

      if (quiz.type === 'mcq') {
        isCorrect = userAnswer === quiz.correctAnswer
      } else if (quiz.type === 'open_ended') {
        // For open-ended, we'll just give credit for attempting
        isCorrect = !!userAnswer && userAnswer.trim().length > 10
      } else if (quiz.type === 'scenario') {
        isCorrect = userAnswer === quiz.correctAnswer
      }

      if (isCorrect) correctCount++

      results.push({
        quizId: quiz.id,
        question: quiz.question,
        userAnswer,
        correctAnswer: quiz.correctAnswer,
        isCorrect,
        explanation: quiz.explanation,
      })
    }

    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
    const xpEarned = Math.round(score * 0.5) // 50 XP for perfect score

    return NextResponse.json({
      score,
      correctCount,
      totalQuestions,
      xpEarned,
      results,
    })
  } catch (error) {
    console.error('Error submitting quiz:', error)
    return NextResponse.json({ error: 'Failed to submit quiz' }, { status: 500 })
  }
}
