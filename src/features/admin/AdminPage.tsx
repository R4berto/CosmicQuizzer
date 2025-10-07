import { FormEvent, useState } from 'react'
import { useAuth } from '../../state/AuthContext'

export function AdminPage() {
  const { token } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState([{ text: '', options: ['',''], answerIdx: 0 }])
  const [status, setStatus] = useState<string | null>(null)

  const addQuestion = () => setQuestions(qs => [...qs, { text: '', options: ['',''], answerIdx: 0 }])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('Submitting...')
    try {
      const res = await fetch('/.netlify/functions/admin-quiz-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ title, description, questions }),
      })
      if (!res.ok) throw new Error(await res.text())
      setStatus('Created!')
      setTitle(''); setDescription(''); setQuestions([{ text: '', options: ['',''], answerIdx: 0 }])
    } catch (err: any) {
      setStatus(err.message)
    }
  }

  return (
    <form className="max-w-3xl space-y-4" onSubmit={onSubmit}>
      <h2 className="text-2xl font-semibold text-neon">Create Quiz</h2>
      {status && <div className="text-white/70">{status}</div>}
      <label className="block">
        <span className="block mb-1">Title</span>
        <input className="w-full rounded p-2 text-black" value={title} onChange={e=>setTitle(e.target.value)} required />
      </label>
      <label className="block">
        <span className="block mb-1">Description</span>
        <textarea className="w-full rounded p-2 text-black" value={description} onChange={e=>setDescription(e.target.value)} />
      </label>
      <div className="space-y-6">
        {questions.map((q, qi) => (
          <div key={qi} className="rounded border border-white/10 p-3">
            <label className="block mb-2">
              <span className="block mb-1">Question {qi+1}</span>
              <input className="w-full rounded p-2 text-black" value={q.text} onChange={e=>{
                const v=e.target.value; setQuestions(arr=>arr.map((x,i)=>i===qi?{...x,text:v}:x))
              }} required/>
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <input type="radio" name={`answer-${qi}`} checked={q.answerIdx===oi} onChange={()=>{
                    setQuestions(arr=>arr.map((x,i)=>i===qi?{...x,answerIdx:oi}:x))
                  }} aria-label={`Mark option ${oi+1} correct`} />
                  <input className="flex-1 rounded p-2 text-black" value={opt} onChange={e=>{
                    const v=e.target.value; setQuestions(arr=>arr.map((x,i)=>i===qi?{...x,options:x.options.map((o,j)=>j===oi?v:o)}:x))
                  }} required/>
                </div>
              ))}
            </div>
            <button type="button" className="mt-3 px-3 py-2 rounded bg-neon text-black" onClick={()=>{
              setQuestions(arr=>arr.map((x,i)=>i===qi?{...x,options:[...x.options,'']}:x))
            }}>Add Option</button>
          </div>
        ))}
        <button type="button" className="px-3 py-2 rounded bg-neon/80 text-black" onClick={addQuestion}>Add Question</button>
      </div>
      <div>
        <button type="submit" className="px-4 py-2 rounded bg-neon text-black shadow-glow">Create</button>
      </div>
    </form>
  )
}


