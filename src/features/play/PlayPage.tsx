import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../state/AuthContext'

type Question = { id: string; text: string; answerIdx: number; options: { id: string; text: string; idx: number }[] }

export function PlayPage() {
  const [params] = useSearchParams()
  const { token } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [quizId, setQuizId] = useState('')
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    const id = params.get('id') || ''
    setQuizId(id)
    if (!id) return
    ;(async () => {
      const res = await fetch(`/.netlify/functions/get-quiz?id=${encodeURIComponent(id)}`)
      if (!res.ok) { setStatus(await res.text()); return }
      const data = await res.json()
      setQuestions(data.questions)
    })()
  }, [params])

  const submit = async () => {
    setStatus('Submitting...')
    try {
      const payload = {
        quizId,
        answers: Object.entries(answers).map(([questionId, chosenIdx]) => ({ questionId, chosenIdx })),
      }
      const res = await fetch('/.netlify/functions/submit-quiz', {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...(token?{Authorization:`Bearer ${token}`}:{}) }, body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json(); setStatus(`Score: ${data.score}`)
    } catch (e: any) { setStatus(e.message) }
  }

  return (
    <div className="space-y-6">
      {status && <div className="text-white/80">{status}</div>}
      {questions.map((q, i) => (
        <div key={q.id} className="rounded border border-white/10 p-4">
          <div className="font-semibold text-neon">{i+1}. {q.text}</div>
          <div className="mt-2 grid sm:grid-cols-2 gap-2">
            {q.options.map(opt => (
              <label key={opt.id} className="flex items-center gap-2">
                <input type="radio" name={q.id} checked={answers[q.id]===opt.idx} onChange={()=>setAnswers(a=>({...a,[q.id]:opt.idx}))} />
                <span>{opt.text}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      {questions.length>0 && (
        <button className="px-4 py-2 rounded bg-neon text-black shadow-glow" onClick={submit}>Submit</button>
      )}
    </div>
  )
}


