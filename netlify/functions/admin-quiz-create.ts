import type { Handler } from '@netlify/functions'
import { prisma } from './_db'
import { getUserFromAuthHeader } from './_auth'
import { z } from 'zod'

const bodySchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  questions: z.array(
    z.object({
      text: z.string().min(1),
      options: z.array(z.string().min(1)).min(2),
      answerIdx: z.number().int().nonnegative(),
    })
  ).min(1),
})

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' }

    const auth = event.headers.authorization
    const user = await getUserFromAuthHeader(auth)
    if (!user) return { statusCode: 401, body: 'Unauthorized' }

    const parsed = bodySchema.safeParse(JSON.parse(event.body ?? '{}'))
    if (!parsed.success) return { statusCode: 400, body: JSON.stringify(parsed.error.flatten()) }

    const { title, description, questions } = parsed.data

    const created = await prisma.quiz.create({
      data: {
        title,
        description,
        questions: {
          create: questions.map((q) => ({
            text: q.text,
            answerIdx: q.answerIdx,
            options: { create: q.options.map((text, idx) => ({ text, idx })) },
          })),
        },
      },
      select: { id: true },
    })

    return { statusCode: 200, body: JSON.stringify(created) }
  } catch (e: any) {
    return { statusCode: 500, body: e.message ?? 'Server error' }
  }
}


