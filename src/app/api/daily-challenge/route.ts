import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]

    let challenge = await db.dailyChallenge.findUnique({
      where: { date: today },
    })

    // If no challenge for today, create one
    if (!challenge) {
      const challenges = [
        {
          title: 'Phân tích vòng lặp trong cuộc sống',
          description: 'Tìm và phân tích một vòng lặp phản hồi trong cuộc sống hàng ngày của bạn. Nó là vòng lặp tăng cường hay cân bằng?',
          challengeType: 'reflection',
          content: JSON.stringify({ instructions: 'Mô tả vòng lặp, xác định loại và gợi ý cách cải thiện.', minWords: 100 }),
          xpReward: 50,
        },
        {
          title: 'Thử thách phản biện',
          description: 'Hãy tìm một bài viết hoặc tuyên bố trên mạng và phân tích các logical fallacies có thể có.',
          challengeType: 'quiz',
          content: JSON.stringify({ instructions: 'Trích dẫn nội dung, chỉ ra fallacy và giải thích tại sao.', minWords: 100 }),
          xpReward: 75,
        },
        {
          title: 'Kịch bản AI',
          description: 'Viết prompt tối ưu cho một bài toán cụ thể và giải thích tại sao prompt đó hiệu quả.',
          challengeType: 'scenario',
          content: JSON.stringify({ instructions: 'Viết prompt, kết quả kỳ vọng và phân tích kỹ thuật sử dụng.', minWords: 150 }),
          xpReward: 60,
        },
      ]

      const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)]

      challenge = await db.dailyChallenge.create({
        data: {
          date: today,
          title: randomChallenge.title,
          description: randomChallenge.description,
          challengeType: randomChallenge.challengeType,
          content: randomChallenge.content,
          xpReward: randomChallenge.xpReward,
        },
      })
    }

    return NextResponse.json({
      id: challenge.id,
      date: challenge.date,
      skillPathId: challenge.skillPathId,
      title: challenge.title,
      description: challenge.description,
      challengeType: challenge.challengeType,
      content: challenge.content,
      completed: challenge.completed,
      xpReward: challenge.xpReward,
    })
  } catch (error) {
    console.error('Error fetching daily challenge:', error)
    return NextResponse.json({ error: 'Failed to fetch daily challenge' }, { status: 500 })
  }
}
