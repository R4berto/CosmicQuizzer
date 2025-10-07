import { render, screen } from '@testing-library/react'
import App from './App'
import { AuthProvider } from './state/AuthContext'

test('renders title', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  )
  expect(screen.getByText(/Cosmic Quiz/i)).toBeInTheDocument()
})


