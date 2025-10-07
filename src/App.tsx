import { useAuth } from './state/AuthContext'
import { QuizHome } from './features/quiz/QuizHome'

export default function App() {
  const { user, signInWithEmail, signOut } = useAuth()

  return (
    <div className="p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-orbitron text-neon drop-shadow-[0_0_10px_rgba(0,229,255,0.7)]">
          Cosmic Quiz
        </h1>
        <div className="flex gap-3">
          {user ? (
            <button className="px-4 py-2 rounded bg-neon text-black shadow-glow" onClick={signOut}>
              Sign out
            </button>
          ) : (
            <button
              className="px-4 py-2 rounded bg-neonPink text-black shadow-glow"
              onClick={() => signInWithEmail('demo@example.com', 'demo-password')}
            >
              Demo Sign in
            </button>
          )}
        </div>
      </header>
      <main className="mt-8">
        <QuizHome />
      </main>
    </div>
  )
}
