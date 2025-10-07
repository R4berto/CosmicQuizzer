import type { Handler } from '@netlify/functions'
import { prisma } from './_db'

export const handler: Handler = async (event) => {
  try {
    const id = event.queryStringParameters?.id
    if (!id) return { statusCode: 400, body: 'Missing id' }
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: { include: { options: true } } },
    })
    if (!quiz) return { statusCode: 404, body: 'Not found' }
    return { statusCode: 200, body: JSON.stringify(quiz) }
  } catch (e: any) {
    return { statusCode: 500, body: e.message ?? 'Server error' }
  }
}


