import { useEffect, useState } from 'react'
import { useAuth } from '../../state/AuthContext'

type Quiz = { id: string; title: string; description?: string }

export function QuizHome() {
  const { token } = useAuth()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/.netlify/functions/quizzes-list', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (!res.ok) throw new Error(await res.text())
        const data = (await res.json()) as Quiz[]
        setQuizzes(data)
      } catch (e: any) {
        setError(e.message)
      }
    })()
  }, [token])

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {error && <p className="text-red-400">{error}</p>}
      {quizzes.map((q) => (
        <div key={q.id} className="rounded-xl bg-black/30 border border-white/10 p-5 hover:shadow-glow transition">
          <h3 className="text-xl font-semibold text-neon">{q.title}</h3>
          <p className="text-white/70 mt-2">{q.description ?? 'No description'}</p>
          <button className="mt-4 px-3 py-2 rounded bg-neon/80 text-black hover:bg-neon">Start</button>
        </div>
      ))}
    </div>
  )
}


