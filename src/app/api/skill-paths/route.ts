import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const skillPaths = await db.skillPath.findMany({
      orderBy: { order: 'asc' },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                quizzes: {
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
      },
    })
    return NextResponse.json(skillPaths)
  } catch (error) {
    console.error('Error fetching skill paths:', error)
    return NextResponse.json({ error: 'Failed to fetch skill paths' }, { status: 500 })
  }
}
