import type { Handler } from '@netlify/functions'
import { prisma } from './_db'
import { getUserFromAuthHeader } from './_auth'

export const handler: Handler = async (event) => {
  try {
    await getUserFromAuthHeader(event.headers.authorization)

    const quizzes = await prisma.quiz.findMany({
      select: { id: true, title: true, description: true },
    })
    return { statusCode: 200, body: JSON.stringify(quizzes) }
  } catch (e: any) {
    return { statusCode: 500, body: e.message ?? 'Server error' }
  }
}


