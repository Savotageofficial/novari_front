import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAdminAuth } from '../hooks/useAdminAuth'

export function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAdminAuth()
  const navigate = useNavigate()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(false)
    setIsSubmitting(true)

    const success = await login(email.trim(), password.trim())
    setIsSubmitting(false)

    if (success) {
      navigate('/admin', { replace: true })
    } else {
      setError(true)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-obsidian px-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-3"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          aria-label="Admin email"
          autoComplete="email"
          required
          className="h-12 w-full border border-cream/30 bg-obsidian px-4 py-3 font-mono text-sm text-cream placeholder:text-cream/30 transition-colors duration-300 focus:border-gold focus:outline-none"
        />
        <div className="flex gap-2">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            aria-label="Admin password"
            aria-invalid={error}
            aria-describedby={error ? 'admin-login-error' : undefined}
            autoComplete="current-password"
            required
            className="h-12 flex-1 border border-cream/30 bg-obsidian px-4 py-3 font-mono text-sm text-cream placeholder:text-cream/30 transition-colors duration-300 focus:border-gold focus:outline-none"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            aria-label="Enter admin panel"
            className="flex h-12 w-12 shrink-0 items-center justify-center border border-cream/30 bg-obsidian font-mono text-sm text-cream transition-colors duration-300 hover:border-gold hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? '…' : '→'}
          </button>
        </div>
        {error && (
          <p
            id="admin-login-error"
            className="font-mono text-xs text-gold"
            aria-live="polite"
          >
            Invalid email or password. Please try again.
          </p>
        )}
      </form>
    </main>
  )
}
