import { FormEvent, useState } from 'react'
import { useAuth } from '../../state/AuthContext'

export function SignIn() {
  const { signInWithEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('Signing in...')
    try {
      await signInWithEmail(email, password)
      setStatus('Signed in')
    } catch (e: any) {
      setStatus(e.message)
    }
  }

  return (
    <form className="max-w-md space-y-4" onSubmit={onSubmit}>
      {status && <div className="text-white/70">{status}</div>}
      <label className="block">
        <span className="block mb-1">Email</span>
        <input className="w-full rounded p-2 text-black" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      </label>
      <label className="block">
        <span className="block mb-1">Password</span>
        <input className="w-full rounded p-2 text-black" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
      </label>
      <button className="px-4 py-2 rounded bg-neon text-black shadow-glow" type="submit">Sign in</button>
    </form>
  )
}


