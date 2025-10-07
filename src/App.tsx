import { useAuth } from './state/AuthContext'
import { QuizHome } from './features/quiz/QuizHome'
import { AdminPage } from './features/admin/AdminPage'
import { SignIn } from './features/auth/SignIn'
import { PlayPage } from './features/play/PlayPage'
import { Link, Route, Routes } from 'react-router-dom'

export default function App() {
  const { user, signInWithEmail, signOut } = useAuth()

  return (
    <div className="p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-orbitron text-neon drop-shadow-[0_0_10px_rgba(0,229,255,0.7)]">
          Cosmic Quiz
        </h1>
        <nav className="flex items-center gap-4 text-white/80">
          <Link to="/" className="hover:text-neon">Home</Link>
          <Link to="/admin" className="hover:text-neon">Admin</Link>
        </nav>
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
        <Routes>
          <Route path="/" element={<QuizHome />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  )
}
