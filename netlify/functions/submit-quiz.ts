import type { Handler } from '@netlify/functions'
import { prisma } from './_db'
import { getUserFromAuthHeader } from './_auth'
import { z } from 'zod'

const bodySchema = z.object({
  quizId: z.string(),
  answers: z.array(z.object({ questionId: z.string(), chosenIdx: z.number().int().nonnegative() })),
})

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' }

    const auth = event.headers.authorization
    const user = await getUserFromAuthHeader(auth)
    if (!user) return { statusCode: 401, body: 'Unauthorized' }

    const parsed = bodySchema.safeParse(JSON.parse(event.body ?? '{}'))
    if (!parsed.success) return { statusCode: 400, body: JSON.stringify(parsed.error.flatten()) }

    const { quizId, answers } = parsed.data

    const questions = await prisma.question.findMany({
      where: { quizId },
      select: { id: true, answerIdx: true },
    })

    const answerMap = new Map(questions.map((q) => [q.id, q.answerIdx]))
    let score = 0
    for (const a of answers) {
      if (answerMap.get(a.questionId) === a.chosenIdx) score++
    }

    const submission = await prisma.submission.create({
      data: {
        userId: user.id,
        quizId,
        score,
        answers: { create: answers.map((a) => ({ questionId: a.questionId, chosenIdx: a.chosenIdx })) },
      },
      select: { id: true, score: true },
    })

    return { statusCode: 200, body: JSON.stringify(submission) }
  } catch (e: any) {
    return { statusCode: 500, body: e.message ?? 'Server error' }
  }
}


